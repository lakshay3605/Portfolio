from functools import lru_cache
import logging

from app.core.config import Settings, get_settings
from app.services.analytics_store import AnalyticsStore
from app.services.chat_service import ChatService
from app.services.intent_router import IntentRouter
from app.services.knowledge_loader import KnowledgeLoader
from app.services.llm_factory import create_llm_service
from app.services.llm_service import LLMService
from app.services.prompt_builder import PromptBuilder
from app.services.prompt_service import PromptService

logger = logging.getLogger(__name__)


@lru_cache
def get_prompt_service() -> PromptService:
    settings = get_settings()
    return PromptService(reload_on_change=settings.is_development or settings.debug)


@lru_cache
def get_prompt_builder() -> PromptBuilder:
    return PromptBuilder(get_prompt_service())


@lru_cache
def get_knowledge_loader() -> KnowledgeLoader:
    settings = get_settings()
    return KnowledgeLoader(reload_on_change=settings.is_development or settings.debug)


@lru_cache
def get_intent_router() -> IntentRouter:
    return IntentRouter()


@lru_cache
def get_analytics_store() -> AnalyticsStore:
    settings = get_settings()
    has_supabase = bool(settings.supabase_url.strip() and settings.supabase_service_role_key.strip())
    logger.info(
        "Creating AnalyticsStore configured=%s",
        has_supabase,
    )
    if not has_supabase:
        from app.services.analytics_store import InMemoryAnalyticsStore
        return InMemoryAnalyticsStore()
    return AnalyticsStore(
        supabase_url=settings.supabase_url,
        supabase_key=settings.supabase_service_role_key,
    )


@lru_cache
def get_llm_service() -> LLMService:
    settings = get_settings()
    return create_llm_service(settings)


def get_chat_service() -> ChatService:
    return ChatService(
        llm_service=get_llm_service(),
        prompt_builder=get_prompt_builder(),
        knowledge_loader=get_knowledge_loader(),
        intent_router=get_intent_router(),
    )



