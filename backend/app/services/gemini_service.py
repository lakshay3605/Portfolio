from collections.abc import AsyncIterator
import asyncio
import logging

from google import genai
from google.genai import errors as genai_errors
from google.genai import types

from app.core.config import Settings

logger = logging.getLogger(__name__)


class GeminiService:
    """Google Gemini integration via the official GenAI SDK."""

    def __init__(self, settings: Settings) -> None:
        api_key = settings.resolved_gemini_api_key
        if not api_key:
            raise RuntimeError("Gemini API key is missing. Set GEMINI_API_KEY environment variable.")

        self._model = settings.gemini_model
        self._timeout = settings.gemini_timeout_seconds
        self._client = genai.Client(api_key=api_key)

    def _build_config(self, instructions: str) -> types.GenerateContentConfig:
        return types.GenerateContentConfig(system_instruction=instructions)

    async def create_response(self, *, instructions: str, user_input: str) -> str:
        max_retries = 2
        for attempt in range(max_retries + 1):
            try:
                response = await asyncio.wait_for(
                    self._client.aio.models.generate_content(
                        model=self._model,
                        contents=user_input,
                        config=self._build_config(instructions),
                    ),
                    timeout=self._timeout,
                )
                text = (response.text or "").strip()
                if not text:
                    raise RuntimeError("Gemini returned an empty response.")
                return text

            except asyncio.TimeoutError as exc:
                if attempt < max_retries:
                    logger.warning("Gemini request timed out (attempt %d/%d), retrying...", attempt + 1, max_retries)
                    await asyncio.sleep(1.0 * (attempt + 1))
                    continue
                logger.exception("Gemini request timed out after retries")
                raise RuntimeError("Gemini request timed out. Please try again.") from exc

            except genai_errors.ClientError as exc:
                message = str(exc).lower()
                # Retry transient 503 / 429 errors
                if ("503" in message or "unavailable" in message or "overloaded" in message) and attempt < max_retries:
                    logger.warning("Gemini service unavailable (attempt %d/%d), retrying...", attempt + 1, max_retries)
                    await asyncio.sleep(1.0 * (attempt + 1))
                    continue
                logger.exception("Gemini request client error")
                raise RuntimeError(self._format_client_error(exc)) from exc

            except Exception as exc:
                if attempt < max_retries:
                    logger.warning("Gemini request failed (attempt %d/%d), retrying...", attempt + 1, max_retries)
                    await asyncio.sleep(1.0 * (attempt + 1))
                    continue
                logger.exception("Gemini request failed")
                raise RuntimeError("Gemini request failed.") from exc

        raise RuntimeError("Gemini request failed after maximum retries.")

    async def stream_response(
        self, *, instructions: str, user_input: str
    ) -> AsyncIterator[str]:
        try:
            stream = await asyncio.wait_for(
                self._client.aio.models.generate_content_stream(
                    model=self._model,
                    contents=user_input,
                    config=self._build_config(instructions),
                ),
                timeout=self._timeout,
            )

            async for chunk in stream:
                if chunk.text:
                    yield chunk.text
        except asyncio.TimeoutError as exc:
            logger.exception("Gemini streaming timed out")
            raise RuntimeError("Gemini streaming timed out. Please try again.") from exc
        except genai_errors.ClientError as exc:
            logger.exception("Gemini streaming failed")
            raise RuntimeError(self._format_client_error(exc)) from exc
        except Exception as exc:
            logger.exception("Gemini streaming failed")
            raise RuntimeError("Gemini request failed.") from exc

    @staticmethod
    def _format_client_error(exc: genai_errors.ClientError) -> str:
        message = str(exc).lower()

        if "api key" in message or "auth" in message or "401" in message:
            return "Gemini authentication failed. Check GEMINI_API_KEY environment variable."

        if "quota" in message or "429" in message or "resource_exhausted" in message:
            return "Gemini quota exceeded. Check billing at aistudio.google.com."

        return "Gemini request failed."

