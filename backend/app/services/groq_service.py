from collections.abc import AsyncIterator
import logging

from openai import APIConnectionError, AuthenticationError, OpenAIError, RateLimitError
from openai import AsyncOpenAI

from app.core.config import Settings

logger = logging.getLogger(__name__)


class GroqService:
    """Groq Llama completions API integration using the OpenAI compatible AsyncOpenAI client."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._client = AsyncOpenAI(
            api_key=settings.groq_api_key,
            base_url=settings.groq_base_url or "https://api.groq.com/openai/v1",
            timeout=settings.groq_timeout_seconds,
        )

    async def create_response(self, *, instructions: str, user_input: str) -> str:
        try:
            response = await self._client.chat.completions.create(
                model=self._settings.groq_model,
                messages=[
                    {"role": "system", "content": instructions},
                    {"role": "user", "content": user_input},
                ],
            )
        except AuthenticationError as exc:
            logger.exception("Groq authentication failed")
            raise RuntimeError("Groq authentication failed. Check GROQ_API_KEY.") from exc
        except RateLimitError as exc:
            logger.exception("Groq rate limit exceeded")
            raise RuntimeError("Groq rate limit exceeded. Please try again shortly.") from exc
        except APIConnectionError as exc:
            logger.exception("Groq connection error")
            raise RuntimeError("Could not connect to Groq.") from exc
        except OpenAIError as exc:
            logger.exception("Groq request failed")
            raise RuntimeError("Groq request failed.") from exc

        output_text = (response.choices[0].message.content or "").strip()

        if not output_text:
            raise RuntimeError("Groq returned an empty response.")

        return output_text

    async def stream_response(
        self, *, instructions: str, user_input: str
    ) -> AsyncIterator[str]:
        try:
            stream = await self._client.chat.completions.create(
                model=self._settings.groq_model,
                messages=[
                    {"role": "system", "content": instructions},
                    {"role": "user", "content": user_input},
                ],
                stream=True,
            )
            async for chunk in stream:
                if chunk.choices and chunk.choices[0].delta:
                    delta = chunk.choices[0].delta.content
                    if delta:
                        yield delta
        except AuthenticationError as exc:
            logger.exception("Groq authentication failed")
            raise RuntimeError("Groq authentication failed. Check GROQ_API_KEY.") from exc
        except RateLimitError as exc:
            logger.exception("Groq rate limit exceeded")
            raise RuntimeError("Groq rate limit exceeded. Please try again shortly.") from exc
        except APIConnectionError as exc:
            logger.exception("Groq connection error")
            raise RuntimeError("Could not connect to Groq.") from exc
        except OpenAIError as exc:
            logger.exception("Groq request failed")
            raise RuntimeError("Groq request failed.") from exc
