from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.dependencies import get_analytics_store, get_knowledge_loader, get_prompt_service
from app.api.router import api_router
from app.core.config import get_settings
from app.services.llm_factory import create_llm_service

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    get_settings.cache_clear()
    settings = get_settings()
    llm = create_llm_service(settings)
    if settings.llm_provider == "gemini":
        model = settings.gemini_model
    elif settings.llm_provider == "openrouter":
        model = settings.openrouter_model
    else:
        model = settings.groq_model

    logger.info(
        "LLM ready — provider=%s model=%s service=%s",
        settings.llm_provider,
        model,
        type(llm).__name__,
    )

    prompt_service = get_prompt_service()
    knowledge_loader = get_knowledge_loader()
    prompt_service.preload_instruction_layers()
    knowledge_loader.load_all()

    if settings.is_production:
        active_key_name = ""
        active_key_value = ""
        if settings.llm_provider == "gemini":
            active_key_name = "GEMINI_API_KEY"
            active_key_value = settings.gemini_api_key
        elif settings.llm_provider == "groq":
            active_key_name = "GROQ_API_KEY"
            active_key_value = settings.groq_api_key
        elif settings.llm_provider == "openrouter":
            active_key_name = "OPENROUTER_API_KEY"
            active_key_value = settings.openrouter_api_key

        required_vars = [
            ("SUPABASE_URL", settings.supabase_url),
            ("SUPABASE_SERVICE_ROLE_KEY", settings.supabase_service_role_key),
        ]
        if active_key_name:
            required_vars.append((active_key_name, active_key_value))

        missing = [
            name
            for name, value in required_vars
            if not str(value).strip()
        ]
        if missing:
            raise RuntimeError(
                f"Missing required production environment variables: {', '.join(missing)}"
            )
        get_analytics_store.cache_clear()
        get_analytics_store()

    print("CORS allow_origins =", settings.cors_origin_list)
    print("Provider:", settings.llm_provider)
    print("Model:", settings.openrouter_model)
    print("OpenRouter Key Length:", len(settings.openrouter_api_key))
    app.state.settings = settings
    yield


def create_app() -> FastAPI:
    get_settings.cache_clear()
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    async def health() -> dict[str, str]:
        active = get_settings()
        return {
            "status": "ok",
            "llm_provider": active.llm_provider,
            "llm_model": (
                active.gemini_model
                if active.llm_provider == "gemini"
                else (active.openrouter_model if active.llm_provider == "openrouter" else active.groq_model)
            ),
            "llm_service": type(create_llm_service(active)).__name__,
        }

    app.include_router(api_router)

    return app


app = create_app()
