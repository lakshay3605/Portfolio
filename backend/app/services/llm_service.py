from collections.abc import AsyncIterator, Sequence
from typing import Protocol

from app.schemas.chat import ChatHistoryMessage


class LLMService(Protocol):
    """LLM provider contract — swap OpenAI, Gemini, or others without changing ChatService."""

    async def create_response(
        self,
        *,
        instructions: str,
        user_input: str,
        history: Sequence[ChatHistoryMessage] | None = None,
    ) -> str: ...

    async def stream_response(
        self,
        *,
        instructions: str,
        user_input: str,
        history: Sequence[ChatHistoryMessage] | None = None,
    ) -> AsyncIterator[str]: ...
