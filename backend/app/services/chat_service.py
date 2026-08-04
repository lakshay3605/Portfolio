from __future__ import annotations

from collections.abc import AsyncIterator, Sequence
import time

from app.schemas.chat import ChatHistoryMessage
from app.services.chat_metadata import ChatTurnMetadata
from app.services.conversation_memory import normalize_history
from app.services.intent_router import IntentRouterProtocol
from app.services.knowledge_loader import KnowledgeLoader
from app.services.llm_service import LLMService
from app.services.prompt_builder import PromptBuilder

LOW_CONFIDENCE_THRESHOLD = 0.35


class ChatService:
    """Orchestrates chat requests.

    Prompt assembly is delegated to PromptBuilder — add layers via YAML config,
    not by editing this class.
    """

    def __init__(
        self,
        llm_service: LLMService,
        prompt_builder: PromptBuilder,
        knowledge_loader: KnowledgeLoader,
        intent_router: IntentRouterProtocol,
    ) -> None:
        self._llm_service = llm_service
        self._prompt_builder = prompt_builder
        self._knowledge_loader = knowledge_loader
        self._intent_router = intent_router

    def prepare_chat(
        self,
        message: str,
        history: Sequence[ChatHistoryMessage] | None = None,
    ) -> tuple[str, ChatTurnMetadata]:
        return self._prepare_chat(message, history)

    async def chat(
        self,
        message: str,
        history: Sequence[ChatHistoryMessage] | None = None,
    ) -> str:
        instructions, normalized_history, _metadata = self._prepare_chat(message, history)

        return await self._llm_service.create_response(
            instructions=instructions,
            user_input=message,
            history=normalized_history,
        )

    async def chat_stream(
        self,
        message: str,
        history: Sequence[ChatHistoryMessage] | None = None,
    ) -> AsyncIterator[str]:
        instructions, normalized_history, _metadata = self._prepare_chat(message, history)

        async for delta in self._llm_service.stream_response(
            instructions=instructions,
            user_input=message,
            history=normalized_history,
        ):
            yield delta

    async def stream_prepared(
        self,
        *,
        instructions: str,
        message: str,
        history: Sequence[ChatHistoryMessage] | None = None,
    ) -> AsyncIterator[str]:
        normalized_history = normalize_history(list(history or []))
        async for delta in self._llm_service.stream_response(
            instructions=instructions,
            user_input=message,
            history=normalized_history,
        ):
            yield delta

    async def complete_prepared(
        self,
        *,
        instructions: str,
        message: str,
        history: Sequence[ChatHistoryMessage] | None = None,
    ) -> str:
        normalized_history = normalize_history(list(history or []))
        return await self._llm_service.create_response(
            instructions=instructions,
            user_input=message,
            history=normalized_history,
        )

    def _prepare_chat(
        self,
        message: str,
        history: Sequence[ChatHistoryMessage] | None = None,
    ) -> tuple[str, list[ChatHistoryMessage], ChatTurnMetadata]:
        normalized_history = normalize_history(list(history or []))
        build_started_at = time.perf_counter()
        routing = self._intent_router.route(message)
        knowledge_context = self._knowledge_loader.build_prompt_context(
            routing.file_ids,
            user_message=message,
        )
        instructions = self._prompt_builder.assemble_chat_instructions(knowledge_context)
        build_instructions_ms = (time.perf_counter() - build_started_at) * 1000

        is_low_confidence = (
            routing.confidence < LOW_CONFIDENCE_THRESHOLD
            or routing.intent == "General"
            or len(routing.file_ids) <= 1
        )

        metadata = ChatTurnMetadata(
            intent=routing.intent,
            confidence=routing.confidence,
            knowledge_docs_used=routing.file_ids,
            build_instructions_ms=build_instructions_ms,
            is_low_confidence=is_low_confidence,
        )
        return instructions, normalized_history, metadata

    def _build_instructions(self, message: str) -> str:
        instructions, _history, _metadata = self._prepare_chat(message)
        return instructions
