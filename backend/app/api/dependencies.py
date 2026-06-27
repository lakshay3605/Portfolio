from functools import lru_cache

from fastapi import Depends

from app.core.config import Settings, get_settings
from app.services.analytics_store import AnalyticsStore
from app.services.chat_service import ChatService
from app.services.intent_router import IntentRouter
from app.services.knowledge_loader import KnowledgeLoader
from app.services.llm_factory import create_llm_service
from app.services.llm_service import LLMService
from app.services.prompt_builder import PromptBuilder
from app.services.prompt_service import PromptService


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
    print(
        "Creating AnalyticsStore from SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY "
        f"configured={bool(settings.supabase_url.strip() and settings.supabase_service_role_key.strip())}"
    )
    return AnalyticsStore(
        supabase_url=settings.supabase_url,
        supabase_key=settings.supabase_service_role_key,
    )


def get_llm_service(settings: Settings = Depends(get_settings)) -> LLMService:
    return create_llm_service(settings)


def get_chat_service(
    llm_service: LLMService = Depends(get_llm_service),
    prompt_builder: PromptBuilder = Depends(get_prompt_builder),
    knowledge_loader: KnowledgeLoader = Depends(get_knowledge_loader),
    intent_router: IntentRouter = Depends(get_intent_router),
) -> ChatService:
    return ChatService(
        llm_service=llm_service,
        prompt_builder=prompt_builder,
        knowledge_loader=knowledge_loader,
        intent_router=intent_router,
    )


