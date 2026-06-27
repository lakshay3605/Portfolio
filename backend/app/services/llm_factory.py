from app.core.config import Settings
from app.services.gemini_service import GeminiService
from app.services.llm_service import LLMService
from app.services.openai_service import OpenAIService


def create_llm_service(settings: Settings) -> LLMService:
    provider = settings.llm_provider.lower().strip()

    if provider == "gemini":
        return GeminiService(settings)

    return OpenAIService(settings)
