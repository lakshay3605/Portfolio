from collections.abc import AsyncIterator
from typing import Protocol


class LLMService(Protocol):
    """LLM provider contract — swap OpenAI, Gemini, or others without changing ChatService."""

    async def create_response(self, *, instructions: str, user_input: str) -> str: ...

    async def stream_response(
        self, *, instructions: str, user_input: str
    ) -> AsyncIterator[str]: ...
