from __future__ import annotations

import asyncio
import json
import logging
import time
import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status
from fastapi.responses import StreamingResponse

from app.api.dependencies import get_analytics_store, get_chat_service
from app.schemas.chat import ChatRequest, ChatResponse, FeedbackRequest
from app.services.analytics_store import AnalyticsStore
from app.services.chat_metadata import ChatTurnMetadata
from app.services.chat_service import ChatService

logger = logging.getLogger(__name__)

router = APIRouter()


def _resolve_session_id(session_id: str | None) -> str:
    return (session_id or "").strip() or str(uuid.uuid4())


def _get_request_id(request: Request) -> str:
    return getattr(getattr(request, "state", None), "request_id", "sys")


def _persist_chat_turn(
    analytics_store: AnalyticsStore,
    *,
    session_id: str,
    message: str,
    response_text: str,
    conversation_number: int,
    metadata: ChatTurnMetadata,
    response_time_ms: float,
    llm_ms: float,
    tokens_generated: int,
    request_id: str = "sys",
) -> None:
    try:
        logger.info(
            "[Request ID: %s] persist_chat_turn starting session_id=%s conversation_number=%d response_chars=%d",
            request_id,
            session_id,
            conversation_number,
            len(response_text),
        )
        analytics_store.save_conversation(
            session_id=session_id,
            user_message=message,
            ai_response=response_text,
            response_time_ms=response_time_ms,
            conversation_number=conversation_number,
            intent=metadata.intent,
            confidence=metadata.confidence,
            knowledge_docs_used=list(metadata.knowledge_docs_used),
            build_instructions_ms=metadata.build_instructions_ms,
            llm_ms=llm_ms,
            tokens_generated=tokens_generated,
        )
        if metadata.is_low_confidence:
            analytics_store.log_unknown_question(
                session_id=session_id,
                question=message,
                response=response_text,
                confidence=metadata.confidence,
                knowledge_docs_used=list(metadata.knowledge_docs_used),
            )
        logger.info(
            "[Request ID: %s] persist_chat_turn completed session_id=%s conversation_number=%d",
            request_id,
            session_id,
            conversation_number,
        )
    except Exception:
        logger.exception(
            "[Request ID: %s] persist_chat_turn failed gracefully session_id=%s conversation_number=%d",
            request_id,
            session_id,
            conversation_number,
        )


@router.post("/chat", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    request: Request,
    background_tasks: BackgroundTasks,
    chat_service: ChatService = Depends(get_chat_service),
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> ChatResponse:
    request_id = _get_request_id(request)
    message = payload.message.strip()

    if not message:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Message cannot be empty.",
        )

    session_id = _resolve_session_id(payload.session_id)
    conversation_number = payload.conversation_number or 1
    started_at = time.perf_counter()

    try:
        logger.info("[Request ID: %s] Incoming request session_id=%s", request_id, session_id)
        instructions, normalized_history, metadata = chat_service.prepare_chat(
            message,
            payload.history,
        )
        logger.info("[Request ID: %s] LLM started intent=%s", request_id, metadata.intent)
        llm_started_at = time.perf_counter()

        response_text = await chat_service.complete_prepared(
            instructions=instructions,
            message=message,
            history=normalized_history,
        )
        llm_ms = (time.perf_counter() - llm_started_at) * 1000
        response_time_ms = (time.perf_counter() - started_at) * 1000
        tokens_generated = max(1, len(response_text) // 4)
        logger.info("[Request ID: %s] Completed in %.2fms", request_id, response_time_ms)

        background_tasks.add_task(
            _persist_chat_turn,
            analytics_store,
            session_id=session_id,
            message=message,
            response_text=response_text,
            conversation_number=conversation_number,
            metadata=metadata,
            response_time_ms=response_time_ms,
            llm_ms=llm_ms,
            tokens_generated=tokens_generated,
            request_id=request_id,
        )
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        logger.exception(
            "[Request ID: %s] chat completion failed session_id=%s conversation_number=%s",
            request_id,
            session_id,
            conversation_number,
        )
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to generate a response. Please try again.",
        ) from exc

    return ChatResponse(response=response_text)


@router.post("/chat/stream")
async def chat_stream(
    payload: ChatRequest,
    request: Request,
    chat_service: ChatService = Depends(get_chat_service),
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> StreamingResponse:
    request_id = _get_request_id(request)
    message = payload.message.strip()

    if not message:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Message cannot be empty.",
        )

    session_id = _resolve_session_id(payload.session_id)
    conversation_number = payload.conversation_number or 1

    async def event_generator():
        started_at = time.perf_counter()
        chunks: list[str] = []
        metadata: ChatTurnMetadata | None = None

        try:
            logger.info("[Request ID: %s] Incoming request session_id=%s", request_id, session_id)
            instructions, normalized_history, metadata = chat_service.prepare_chat(
                message,
                payload.history,
            )
            logger.info("[Request ID: %s] LLM started intent=%s", request_id, metadata.intent)
            logger.info("[Request ID: %s] Streaming...", request_id)
            llm_started_at = time.perf_counter()

            async for delta in chat_service.stream_prepared(
                instructions=instructions,
                message=message,
                history=normalized_history,
            ):
                chunks.append(delta)
                yield f"data: {json.dumps({'delta': delta})}\n\n"

            response_text = "".join(chunks).strip()
            llm_ms = (time.perf_counter() - llm_started_at) * 1000
            response_time_ms = (time.perf_counter() - started_at) * 1000
            tokens_generated = max(1, len(response_text) // 4)
            logger.info("[Request ID: %s] Completed in %.2fms", request_id, response_time_ms)
        except RuntimeError as exc:
            yield f"data: {json.dumps({'error': str(exc)})}\n\n"
            return
        except Exception:
            logger.exception(
                "[Request ID: %s] chat/stream generation failed session_id=%s conversation_number=%s",
                request_id,
                session_id,
                conversation_number,
            )
            yield f"data: {json.dumps({'error': 'Failed to generate a response.'})}\n\n"
            return

        if metadata is not None:
            # Trigger background persistence without blocking SSE response completion
            asyncio.create_task(
                asyncio.to_thread(
                    _persist_chat_turn,
                    analytics_store,
                    session_id=session_id,
                    message=message,
                    response_text=response_text,
                    conversation_number=conversation_number,
                    metadata=metadata,
                    response_time_ms=response_time_ms,
                    llm_ms=llm_ms,
                    tokens_generated=tokens_generated,
                    request_id=request_id,
                )
            )

        meta_payload = {
            **(metadata.to_dict() if metadata else {}),
            "response_time_ms": round(response_time_ms, 2),
            "llm_ms": round(llm_ms, 2),
            "tokens_generated": tokens_generated,
            "documents_retrieved": len(metadata.knowledge_docs_used) if metadata else 0,
            "session_id": session_id,
            "conversation_number": conversation_number,
        }
        yield f"data: {json.dumps({'meta': meta_payload})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@router.post("/analytics/feedback", status_code=status.HTTP_201_CREATED)
async def submit_feedback(
    payload: FeedbackRequest,
    request: Request,
    background_tasks: BackgroundTasks,
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> dict[str, str]:
    request_id = _get_request_id(request)
    session_id = payload.session_id.strip()
    rating = payload.rating
    written_feedback = (payload.written_feedback or "").strip() or None

    def _save():
        try:
            analytics_store.save_feedback(
                session_id=session_id,
                rating=rating,
                written_feedback=written_feedback,
            )
            logger.info("[Request ID: %s] Feedback saved session_id=%s", request_id, session_id)
        except Exception:
            logger.exception("[Request ID: %s] Failed to save user feedback session_id=%s", request_id, session_id)

    background_tasks.add_task(_save)
    return {"status": "saved"}


