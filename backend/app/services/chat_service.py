from __future__ import annotations

from collections.abc import AsyncIterator
import time

from app.services.chat_metadata import ChatTurnMetadata
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

    def prepare_chat(self, message: str) -> tuple[str, ChatTurnMetadata]:
        return self._prepare_chat(message)

    async def chat(self, message: str) -> str:
        instructions, _metadata = self._prepare_chat(message)

        # Future: append conversation memory before user_input.
        return await self._llm_service.create_response(
            instructions=instructions,
            user_input=message,
        )

    async def chat_stream(self, message: str) -> AsyncIterator[str]:
        instructions, _metadata = self._prepare_chat(message)

        # Future: append conversation memory and emit avatar state events.
        async for delta in self._llm_service.stream_response(
            instructions=instructions,
            user_input=message,
        ):
            yield delta

    async def stream_prepared(
        self,
        *,
        instructions: str,
        message: str,
    ) -> AsyncIterator[str]:
        async for delta in self._llm_service.stream_response(
            instructions=instructions,
            user_input=message,
        ):
            yield delta

    async def complete_prepared(self, *, instructions: str, message: str) -> str:
        return await self._llm_service.create_response(
            instructions=instructions,
            user_input=message,
        )

    def _prepare_chat(self, message: str) -> tuple[str, ChatTurnMetadata]:
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
        return instructions, metadata

    def _build_instructions(self, message: str) -> str:
        instructions, _metadata = self._prepare_chat(message)
        return instructions
