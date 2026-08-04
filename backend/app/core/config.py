from functools import lru_cache
from pathlib import Path
from typing import Self

from pydantic import AliasChoices, Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=str(BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = Field(default="Lakshay.ai API", alias="APP_NAME")
    app_env: str = Field(default="development", alias="APP_ENV")
    app_version: str = Field(default="1.0.0", alias="APP_VERSION")
    commit_sha: str = Field(
        default="development",
        validation_alias=AliasChoices("COMMIT_SHA", "GIT_COMMIT", "RAILWAY_GIT_COMMIT_SHA", "NORTHFLANK_COMMIT_SHA"),
    )
    debug: bool = Field(default=False, alias="DEBUG")

    llm_provider: str = Field(default="gemini", alias="LLM_PROVIDER")
    gemini_api_key: str = Field(default="", alias="GEMINI_API_KEY")
    gemini_model: str = Field(default="gemini-2.5-flash", alias="GEMINI_MODEL")
    gemini_timeout_seconds: float = Field(default=60.0, alias="GEMINI_TIMEOUT_SECONDS")

    openai_api_key: str = Field(default="", alias="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-4o-mini", alias="OPENAI_MODEL")
    openai_base_url: str | None = Field(default=None, alias="OPENAI_BASE_URL")
    openai_timeout_seconds: float = Field(default=60.0, alias="OPENAI_TIMEOUT_SECONDS")

    openrouter_api_key: str = Field(default="", alias="OPENROUTER_API_KEY")
    openrouter_model: str = Field(default="google/gemini-2.5-flash", alias="OPENROUTER_MODEL")
    openrouter_base_url: str = Field(default="https://openrouter.ai/api/v1", alias="OPENROUTER_BASE_URL")
    openrouter_site_url: str = Field(default="https://www.lakshay.website", alias="OPENROUTER_SITE_URL")
    openrouter_app_name: str = Field(default="Lakshay.ai", alias="OPENROUTER_APP_NAME")
    openrouter_timeout_seconds: float = Field(default=60.0, alias="OPENROUTER_TIMEOUT_SECONDS")
    llm_fallback_provider: str = Field(default="openrouter", alias="LLM_FALLBACK_PROVIDER")

    cors_origins: str = Field(
        default="http://localhost:3000",
        validation_alias=AliasChoices("CORS_ORIGINS", "CORS_ORIGIN"),
    )

    supabase_url: str = Field(default="", alias="SUPABASE_URL")
    supabase_service_role_key: str = Field(default="", alias="SUPABASE_SERVICE_ROLE_KEY")

    @property
    def resolved_gemini_api_key(self) -> str:
        return self.gemini_api_key.strip()

    @model_validator(mode="after")
    def normalize_settings(self) -> Self:
        self.llm_provider = self.llm_provider.strip().lower()
        self.gemini_model = self.gemini_model.strip()
        self.openai_model = self.openai_model.strip()
        self.openrouter_model = self.openrouter_model.strip()
        self.openrouter_base_url = self.openrouter_base_url.strip().rstrip("/")
        self.openrouter_site_url = self.openrouter_site_url.strip().rstrip("/")
        self.openrouter_app_name = self.openrouter_app_name.strip()
        self.llm_fallback_provider = self.llm_fallback_provider.strip().lower()
        self.gemini_api_key = self.gemini_api_key.strip()
        self.openai_api_key = self.openai_api_key.strip()
        self.openrouter_api_key = self.openrouter_api_key.strip()
        self.supabase_url = self.supabase_url.strip()
        self.supabase_service_role_key = self.supabase_service_role_key.strip()

        if self.openai_base_url is not None:
            stripped = self.openai_base_url.strip()
            self.openai_base_url = stripped or None

        return self

    @property
    def cors_origin_list(self) -> list[str]:
        origins: list[str] = []
        for raw in self.cors_origins.split(","):
            cleaned = raw.strip().strip("'\"").rstrip("/")
            if cleaned and cleaned not in origins:
                origins.append(cleaned)
        return origins

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() in {"production", "prod"}

    @property
    def is_development(self) -> bool:
        return self.app_env.lower() in {"development", "dev", "local"}

    @property
    def has_openrouter_fallback(self) -> bool:
        return (
            self.llm_provider == "gemini"
            and self.llm_fallback_provider == "openrouter"
            and bool(self.openrouter_api_key)
        )

    def llm_is_configured(self) -> bool:
        provider = self.llm_provider
        if provider == "gemini":
            return bool(self.resolved_gemini_api_key) or bool(self.openrouter_api_key)
        if provider == "openrouter":
            return bool(self.openrouter_api_key)
        return bool(self.openai_api_key)


@lru_cache
def get_settings() -> Settings:
    return Settings()

