from __future__ import annotations

import json
import logging
import time
import traceback
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
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
) -> None:
    print(
        "persist_chat_turn starting "
        f"session_id={session_id} conversation_number={conversation_number} "
        f"response_chars={len(response_text)}"
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
    print(
        "persist_chat_turn completed "
        f"session_id={session_id} conversation_number={conversation_number}"
    )


@router.post("/chat", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    chat_service: ChatService = Depends(get_chat_service),
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> ChatResponse:
    message = payload.message.strip()

    if not message:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Message cannot be empty.",
        )

    session_id = _resolve_session_id(payload.session_id)
    conversation_number = payload.conversation_number or 1
    started_at = time.perf_counter()
    response_text = ""

    try:
        instructions, metadata = chat_service.prepare_chat(message)
        llm_started_at = time.perf_counter()
        response_text = await chat_service.complete_prepared(
            instructions=instructions,
            message=message,
        )
        llm_ms = (time.perf_counter() - llm_started_at) * 1000
        response_time_ms = (time.perf_counter() - started_at) * 1000
        tokens_generated = max(1, len(response_text) // 4)

        _persist_chat_turn(
            analytics_store,
            session_id=session_id,
            message=message,
            response_text=response_text,
            conversation_number=conversation_number,
            metadata=metadata,
            response_time_ms=response_time_ms,
            llm_ms=llm_ms,
            tokens_generated=tokens_generated,
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
        print(
            "chat persistence failed "
            f"session_id={session_id} conversation_number={conversation_number}"
        )
        print(traceback.format_exc())
        logger.exception(
            "chat persistence failed session_id=%s conversation_number=%s",
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
    chat_service: ChatService = Depends(get_chat_service),
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> StreamingResponse:
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
        response_text = ""
        llm_ms = 0.0
        response_time_ms = 0.0
        tokens_generated = 0

        try:
            instructions, metadata = chat_service.prepare_chat(message)
            llm_started_at = time.perf_counter()

            async for delta in chat_service.stream_prepared(
                instructions=instructions,
                message=message,
            ):
                chunks.append(delta)
                yield f"data: {json.dumps({'delta': delta})}\n\n"

            response_text = "".join(chunks).strip()
            llm_ms = (time.perf_counter() - llm_started_at) * 1000
            response_time_ms = (time.perf_counter() - started_at) * 1000
            tokens_generated = max(1, len(response_text) // 4)
        except RuntimeError as exc:
            yield f"data: {json.dumps({'error': str(exc)})}\n\n"
            return
        except Exception:
            print(
                "chat/stream generation failed "
                f"session_id={session_id} conversation_number={conversation_number}"
            )
            print(traceback.format_exc())
            logger.exception(
                "chat/stream generation failed session_id=%s conversation_number=%s",
                session_id,
                conversation_number,
            )
            yield f"data: {json.dumps({'error': 'Failed to generate a response.'})}\n\n"
            return

        if metadata is None:
            print(
                "chat/stream persistence skipped because metadata is missing "
                f"session_id={session_id} conversation_number={conversation_number}"
            )
            yield f"data: {json.dumps({'error': 'Failed to save conversation analytics.'})}\n\n"
            return

        try:
            _persist_chat_turn(
                analytics_store,
                session_id=session_id,
                message=message,
                response_text=response_text,
                conversation_number=conversation_number,
                metadata=metadata,
                response_time_ms=response_time_ms,
                llm_ms=llm_ms,
                tokens_generated=tokens_generated,
            )
        except Exception:
            print(
                "chat/stream persistence failed "
                f"session_id={session_id} conversation_number={conversation_number}"
            )
            print(traceback.format_exc())
            logger.exception(
                "chat/stream persistence failed session_id=%s conversation_number=%s",
                session_id,
                conversation_number,
            )
            yield f"data: {json.dumps({'error': 'Failed to save conversation analytics.'})}\n\n"
            return

        meta_payload = {
            **metadata.to_dict(),
            "response_time_ms": round(response_time_ms, 2),
            "llm_ms": round(llm_ms, 2),
            "tokens_generated": tokens_generated,
            "documents_retrieved": len(metadata.knowledge_docs_used),
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
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> dict[str, str]:
    analytics_store.save_feedback(
        session_id=payload.session_id.strip(),
        rating=payload.rating,
        written_feedback=(payload.written_feedback or "").strip() or None,
    )
    return {"status": "saved"}
