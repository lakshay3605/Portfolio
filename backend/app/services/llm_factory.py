from app.core.config import Settings
from app.services.fallback_llm_service import FallbackLLMService
from app.services.gemini_service import GeminiService
from app.services.llm_service import LLMService
from app.services.openai_service import OpenAIService
from app.services.openrouter_service import OpenRouterService


def create_llm_service(settings: Settings) -> LLMService:
    provider = settings.llm_provider.lower().strip()

    if provider == "openrouter":
        return OpenRouterService(settings)

    if provider == "openai":
        return OpenAIService(settings)

    primary = GeminiService(settings)
    if settings.has_openrouter_fallback:
        return FallbackLLMService(
            primary,
            OpenRouterService(settings),
            fallback_name="OpenRouter",
        )

    return primary


def resolve_llm_model(settings: Settings) -> str:
    provider = settings.llm_provider.lower().strip()

    if provider == "openrouter":
        return settings.openrouter_model

    if provider == "openai":
        return settings.openai_model

    if settings.has_openrouter_fallback:
        return f"{settings.gemini_model} (fallback: {settings.openrouter_model})"

    return settings.gemini_model
