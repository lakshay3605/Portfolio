from collections.abc import AsyncIterator

import logging

from openai import APIConnectionError, AuthenticationError, OpenAIError, RateLimitError
from openai import AsyncOpenAI

from app.core.config import Settings

logger = logging.getLogger(__name__)


class OpenAIService:
    """OpenAI Responses API integration.

    Extension points:
    - Streaming via client.responses.stream(...)
    - Conversation state / previous_response_id
    - Tool calling and LangGraph handoff
    - Structured outputs
    """

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._client = AsyncOpenAI(
            api_key=settings.openai_api_key,
            base_url=settings.openai_base_url,
            timeout=settings.openai_timeout_seconds,
        )

    async def create_response(self, *, instructions: str, user_input: str) -> str:
        try:
            response = await self._client.responses.create(
                model=self._settings.openai_model,
                instructions=instructions,
                input=user_input,
            )
        except AuthenticationError as exc:
            logger.exception("OpenAI authentication failed")
            raise RuntimeError("OpenAI authentication failed. Check OPENAI_API_KEY.") from exc
        except RateLimitError as exc:
            logger.exception("OpenAI rate limit or quota exceeded")
            message = str(exc).lower()
            if "insufficient_quota" in message or "quota" in message:
                raise RuntimeError(
                    "OpenAI quota exceeded. Add billing or credits at platform.openai.com."
                ) from exc
            raise RuntimeError("OpenAI rate limit exceeded. Please try again shortly.") from exc
        except APIConnectionError as exc:
            logger.exception("OpenAI connection error")
            raise RuntimeError("Could not connect to OpenAI.") from exc
        except OpenAIError as exc:
            logger.exception("OpenAI request failed")
            raise RuntimeError("OpenAI request failed.") from exc

        output_text = (response.output_text or "").strip()

        if not output_text:
            raise RuntimeError("OpenAI returned an empty response.")

        return output_text

    async def stream_response(
        self, *, instructions: str, user_input: str
    ) -> AsyncIterator[str]:
        try:
            async with self._client.responses.stream(
                model=self._settings.openai_model,
                instructions=instructions,
                input=user_input,
            ) as stream:
                async for event in stream:
                    if event.type == "response.output_text.delta":
                        delta = event.delta
                        if delta:
                            yield delta
        except AuthenticationError as exc:
            logger.exception("OpenAI authentication failed")
            raise RuntimeError("OpenAI authentication failed. Check OPENAI_API_KEY.") from exc
        except RateLimitError as exc:
            logger.exception("OpenAI rate limit or quota exceeded")
            message = str(exc).lower()
            if "insufficient_quota" in message or "quota" in message:
                raise RuntimeError(
                    "OpenAI quota exceeded. Add billing or credits at platform.openai.com."
                ) from exc
            raise RuntimeError("OpenAI rate limit exceeded. Please try again shortly.") from exc
        except APIConnectionError as exc:
            logger.exception("OpenAI connection error")
            raise RuntimeError("Could not connect to OpenAI.") from exc
        except OpenAIError as exc:
            logger.exception("OpenAI request failed")
            raise RuntimeError("OpenAI request failed.") from exc
