from collections.abc import AsyncIterator
import logging

from openai import APIConnectionError, AuthenticationError, OpenAIError, RateLimitError
from openai import AsyncOpenAI

from app.core.config import Settings

logger = logging.getLogger(__name__)


class OpenRouterService:
    """OpenRouter completions API integration using the OpenAI compatible AsyncOpenAI client."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._client = AsyncOpenAI(
            api_key=settings.openrouter_api_key,
            base_url=settings.openrouter_base_url or "https://openrouter.ai/api/v1",
            timeout=settings.openrouter_timeout_seconds,
        )

    async def create_response(self, *, instructions: str, user_input: str) -> str:
        try:
            response = await self._client.chat.completions.create(
                model=self._settings.openrouter_model,
                messages=[
                    {"role": "system", "content": instructions},
                    {"role": "user", "content": user_input},
                ],
                extra_headers={
                    "HTTP-Referer": "https://lakshay.ai",
                    "X-Title": "Lakshay.ai",
                }
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

        output_text = (response.choices[0].message.content or "").strip()

        if not output_text:
            raise RuntimeError("OpenRouter returned an empty response.")

        return output_text

    async def stream_response(
        self, *, instructions: str, user_input: str
    ) -> AsyncIterator[str]:
        try:
            stream = await self._client.chat.completions.create(
                model=self._settings.openrouter_model,
                messages=[
                    {"role": "system", "content": instructions},
                    {"role": "user", "content": user_input},
                ],
                stream=True,
                extra_headers={
                    "HTTP-Referer": "https://lakshay.ai",
                    "X-Title": "Lakshay.ai",
                }
            )
            async for chunk in stream:
                if chunk.choices and chunk.choices[0].delta:
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
