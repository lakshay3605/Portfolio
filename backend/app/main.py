from contextlib import asynccontextmanager
import logging
import uuid

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware

from app.api.dependencies import get_analytics_store, get_knowledge_loader, get_prompt_service
from app.api.router import api_router
from app.core.config import get_settings
from app.services.llm_factory import create_llm_service, resolve_llm_model

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    get_settings.cache_clear()
    settings = get_settings()
    llm = create_llm_service(settings)
    model = resolve_llm_model(settings)

    prompt_service = get_prompt_service()
    knowledge_loader = get_knowledge_loader()
    prompt_service.preload_instruction_layers()
    docs = knowledge_loader.load_all()

    if settings.is_production:
        missing = [
            name
            for name, value in (
                ("SUPABASE_URL", settings.supabase_url),
                ("SUPABASE_SERVICE_ROLE_KEY", settings.supabase_service_role_key),
            )
            if not str(value).strip()
        ]

        if settings.llm_provider == "gemini" and not settings.resolved_gemini_api_key:
            missing.append("GEMINI_API_KEY")
        elif settings.llm_provider == "openrouter" and not settings.openrouter_api_key:
            missing.append("OPENROUTER_API_KEY")
        elif settings.llm_provider == "openai" and not settings.openai_api_key:
            missing.append("OPENAI_API_KEY")

        if settings.llm_fallback_provider == "openrouter" and not settings.openrouter_api_key:
            logger.warning(
                "LLM fallback is enabled but OPENROUTER_API_KEY is missing. "
                "Gemini quota errors will not fail over to OpenRouter."
            )

        if missing:
            raise RuntimeError(
                f"Missing required production environment variables: {', '.join(missing)}"
            )
        get_analytics_store.cache_clear()
        get_analytics_store()

    has_supabase = bool(settings.supabase_url.strip() and settings.supabase_service_role_key.strip())
    supabase_status = "Connected" if has_supabase else "In-Memory Fallback"
    origins_formatted = "\n".join(f" - {origin}" for origin in settings.cors_origin_list)

    logger.info(
        "\n================ Startup Diagnostics ================\n"
        "Environment: %s\n"
        "LLM Provider: %s\n"
        "Gemini Model: %s\n"
        "OpenRouter Fallback: %s\n"
        "Knowledge files loaded: %d\n"
        "Supabase: %s\n"
        "CORS Origins:\n%s\n"
        "======================================================",
        settings.app_env,
        settings.llm_provider.title(),
        model,
        "Enabled" if settings.has_openrouter_fallback else "Disabled",
        len(docs),
        supabase_status,
        origins_formatted,
    )

    app.state.settings = settings
    yield
    logger.info("Application shutdown complete.")


def create_app() -> FastAPI:
    get_settings.cache_clear()
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def request_id_middleware(request: Request, call_next):
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())[:8]
        request.state.request_id = request_id
        logger.info("[Request ID: %s] Incoming request %s %s", request_id, request.method, request.url.path)
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        logger.info("[Request ID: %s] Completed %s %s status=%d", request_id, request.method, request.url.path, response.status_code)
        return response

    @app.get("/health")
    async def health() -> dict[str, str]:
        active = get_settings()
        has_supabase = bool(active.supabase_url.strip() and active.supabase_service_role_key.strip())
        return {
            "status": "healthy",
            "llm": active.llm_provider,
            "llm_fallback": "openrouter" if active.has_openrouter_fallback else "none",
            "analytics": "connected" if has_supabase else "in_memory",
            "version": active.app_version,
        }

    @app.get("/ready")
    async def ready() -> dict[str, object]:
        active = get_settings()
        knowledge_loader = get_knowledge_loader()

        llm_ready = active.llm_is_configured()
        supabase_ready = bool(active.supabase_url.strip() and active.supabase_service_role_key.strip()) if active.is_production else True
        knowledge_ready = len(knowledge_loader.load_all()) > 0

        is_ready = llm_ready and supabase_ready and knowledge_ready
        checks = {
            "llm": llm_ready,
            "supabase": supabase_ready,
            "knowledge_base": knowledge_ready,
        }

        if not is_ready:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail={"status": "not_ready", "checks": checks},
            )

        return {"status": "ready", "checks": checks}

    @app.get("/version")
    async def version() -> dict[str, str]:
        active = get_settings()
        return {
            "version": active.app_version,
            "commit": active.commit_sha,
            "environment": active.app_env,
        }

    app.include_router(api_router)

    return app


app = create_app()


