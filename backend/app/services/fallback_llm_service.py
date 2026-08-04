from __future__ import annotations

from collections.abc import AsyncIterator, Sequence
import logging

from app.schemas.chat import ChatHistoryMessage
from app.services.llm_service import LLMService

logger = logging.getLogger(__name__)

_FALLBACK_TRIGGERS = (
    "quota",
    "429",
    "rate limit",
    "unavailable",
    "overloaded",
    "503",
    "resource_exhausted",
)


class FallbackLLMService:
    """Try a primary LLM provider, then fall back when quota or transient errors occur."""

    def __init__(self, primary: LLMService, fallback: LLMService, *, fallback_name: str) -> None:
        self._primary = primary
        self._fallback = fallback
        self._fallback_name = fallback_name

    async def create_response(
        self,
        *,
        instructions: str,
        user_input: str,
        history: Sequence[ChatHistoryMessage] | None = None,
    ) -> str:
        try:
            return await self._primary.create_response(
                instructions=instructions,
                user_input=user_input,
                history=history,
            )
        except RuntimeError as exc:
            if not self._should_fallback(exc):
                raise
            logger.warning("Primary LLM failed (%s). Falling back to %s.", exc, self._fallback_name)
            return await self._fallback.create_response(
                instructions=instructions,
                user_input=user_input,
                history=history,
            )

    async def stream_response(
        self,
        *,
        instructions: str,
        user_input: str,
        history: Sequence[ChatHistoryMessage] | None = None,
    ) -> AsyncIterator[str]:
        try:
            async for delta in self._primary.stream_response(
                instructions=instructions,
                user_input=user_input,
                history=history,
            ):
                yield delta
        except RuntimeError as exc:
            if not self._should_fallback(exc):
                raise
            logger.warning("Primary LLM stream failed (%s). Falling back to %s.", exc, self._fallback_name)
            async for delta in self._fallback.stream_response(
                instructions=instructions,
                user_input=user_input,
                history=history,
            ):
                yield delta

    @staticmethod
    def _should_fallback(exc: RuntimeError) -> bool:
        message = str(exc).lower()
        return any(trigger in message for trigger in _FALLBACK_TRIGGERS)
