from __future__ import annotations

from collections.abc import AsyncIterator, Sequence
import logging

from openai import APIConnectionError, AuthenticationError, OpenAIError, RateLimitError
from openai import AsyncOpenAI

from app.core.config import Settings
from app.schemas.chat import ChatHistoryMessage

logger = logging.getLogger(__name__)


class OpenRouterService:
    """OpenRouter integration via OpenAI-compatible chat completions."""

    def __init__(self, settings: Settings) -> None:
        api_key = settings.openrouter_api_key.strip()
        if not api_key:
            raise RuntimeError(
                "OpenRouter API key is missing. Set OPENROUTER_API_KEY environment variable."
            )

        self._model = settings.openrouter_model
        self._timeout = settings.openrouter_timeout_seconds
        self._client = AsyncOpenAI(
            api_key=api_key,
            base_url=settings.openrouter_base_url,
            timeout=self._timeout,
            default_headers={
                "HTTP-Referer": settings.openrouter_site_url,
                "X-Title": settings.openrouter_app_name,
            },
        )

    @staticmethod
    def _build_messages(
        instructions: str,
        user_input: str,
        history: Sequence[ChatHistoryMessage] | None = None,
    ) -> list[dict[str, str]]:
        messages: list[dict[str, str]] = [{"role": "system", "content": instructions}]

        for message in history or []:
            messages.append({"role": message.role, "content": message.content})

        messages.append({"role": "user", "content": user_input})
        return messages

    async def create_response(
        self,
        *,
        instructions: str,
        user_input: str,
        history: Sequence[ChatHistoryMessage] | None = None,
    ) -> str:
        try:
            response = await self._client.chat.completions.create(
                model=self._model,
                messages=self._build_messages(instructions, user_input, history),
            )
        except AuthenticationError as exc:
            logger.exception("OpenRouter authentication failed")
            raise RuntimeError("OpenRouter authentication failed. Check OPENROUTER_API_KEY.") from exc
        except RateLimitError as exc:
            logger.exception("OpenRouter rate limit exceeded")
            raise RuntimeError("OpenRouter rate limit exceeded. Please try again shortly.") from exc
        except APIConnectionError as exc:
            logger.exception("OpenRouter connection error")
            raise RuntimeError("Could not connect to OpenRouter.") from exc
        except OpenAIError as exc:
            logger.exception("OpenRouter request failed")
            raise RuntimeError("OpenRouter request failed.") from exc

        content = (response.choices[0].message.content or "").strip()
        if not content:
            raise RuntimeError("OpenRouter returned an empty response.")
        return content

    async def stream_response(
        self,
        *,
        instructions: str,
        user_input: str,
        history: Sequence[ChatHistoryMessage] | None = None,
    ) -> AsyncIterator[str]:
        try:
            stream = await self._client.chat.completions.create(
                model=self._model,
                messages=self._build_messages(instructions, user_input, history),
                stream=True,
            )

            async for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield delta
        except AuthenticationError as exc:
            logger.exception("OpenRouter authentication failed")
            raise RuntimeError("OpenRouter authentication failed. Check OPENROUTER_API_KEY.") from exc
        except RateLimitError as exc:
            logger.exception("OpenRouter rate limit exceeded")
            raise RuntimeError("OpenRouter rate limit exceeded. Please try again shortly.") from exc
        except APIConnectionError as exc:
            logger.exception("OpenRouter connection error")
            raise RuntimeError("Could not connect to OpenRouter.") from exc
        except OpenAIError as exc:
            logger.exception("OpenRouter request failed")
            raise RuntimeError("OpenRouter request failed.") from exc
