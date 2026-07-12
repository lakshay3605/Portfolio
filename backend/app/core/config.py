from functools import lru_cache
from pathlib import Path
from typing import Self

from dotenv import dotenv_values
from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]

ENV_FILE_KEYS = (
    "GROQ_API_KEY",
    "GEMINI_API_KEY",
    "OPENROUTER_API_KEY",
    "LLM_PROVIDER",
    "GEMINI_MODEL",
    "OPENROUTER_MODEL",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
)


def _read_env_file_values() -> dict[str, str]:
    merged: dict[str, str] = {}

    path = (BACKEND_DIR / ".env").resolve()
    if not path.is_file():
        return merged

    for key, value in dotenv_values(path).items():
        if value is not None and str(value).strip():
            merged[key] = str(value).strip()

    return merged


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = Field(default="Lakshay.ai API", alias="APP_NAME")
    app_env: str = Field(default="development", alias="APP_ENV")
    debug: bool = Field(default=False, alias="DEBUG")

    llm_provider: str = Field(default="gemini", alias="LLM_PROVIDER")
    gemini_api_key: str = Field(default="", alias="GEMINI_API_KEY")
    gemini_model: str = Field(default="gemini-2.5-flash", alias="GEMINI_MODEL")

    groq_api_key: str = Field(default="", alias="GROQ_API_KEY")
    groq_model: str = Field(default="llama-3.3-70b-versatile", alias="GROQ_MODEL")
    groq_base_url: str | None = Field(default="https://api.groq.com/openai/v1", alias="GROQ_BASE_URL")
    groq_timeout_seconds: float = Field(default=60.0, alias="GROQ_TIMEOUT_SECONDS")

    openrouter_api_key: str = Field(default="", alias="OPENROUTER_API_KEY")
    openrouter_model: str = Field(default="meta-llama/llama-3.3-70b-instruct", alias="OPENROUTER_MODEL")
    openrouter_base_url: str | None = Field(default="https://openrouter.ai/api/v1", alias="OPENROUTER_BASE_URL")
    openrouter_timeout_seconds: float = Field(default=60.0, alias="OPENROUTER_TIMEOUT_SECONDS")

    cors_origins: str = Field(
        default="http://localhost:3000",
        alias="CORS_ORIGINS",
    )

    supabase_url: str = Field(default="", alias="SUPABASE_URL")
    supabase_service_role_key: str = Field(default="", alias="SUPABASE_SERVICE_ROLE_KEY")

    @property
    def resolved_gemini_api_key(self) -> str:
        return (self.gemini_api_key or self.groq_api_key).strip()

    @model_validator(mode="after")
    def normalize_settings(self) -> Self:
        self.llm_provider = self.llm_provider.strip().lower()
        self.gemini_model = self.gemini_model.strip()
        self.groq_model = self.groq_model.strip()
        self.openrouter_model = self.openrouter_model.strip()

        if self.groq_base_url is not None:
            stripped = self.groq_base_url.strip()
            self.groq_base_url = stripped or None

        if self.openrouter_base_url is not None:
            stripped = self.openrouter_base_url.strip()
            self.openrouter_base_url = stripped or None

        file_values = _read_env_file_values()

        file_gemini_key = file_values.get("GEMINI_API_KEY", "")
        file_groq_key = file_values.get("GROQ_API_KEY", "")
        file_openrouter_key = file_values.get("OPENROUTER_API_KEY", "")

        if not self.gemini_api_key.strip() and file_gemini_key:
            self.gemini_api_key = file_gemini_key

        current_groq_key = self.groq_api_key.strip()
        if file_groq_key and (len(current_groq_key) < 10 or current_groq_key == "test"):
            self.groq_api_key = file_groq_key

        current_openrouter_key = self.openrouter_api_key.strip()
        if file_openrouter_key and (len(current_openrouter_key) < 10 or current_openrouter_key == "test"):
            self.openrouter_api_key = file_openrouter_key

        if not self.gemini_api_key.strip() and self.groq_api_key.strip():
            self.gemini_api_key = self.groq_api_key.strip()

        if file_values.get("LLM_PROVIDER"):
            self.llm_provider = file_values["LLM_PROVIDER"].lower()

        if file_values.get("GEMINI_MODEL"):
            self.gemini_model = file_values["GEMINI_MODEL"]

        if file_values.get("OPENROUTER_MODEL"):
            self.openrouter_model = file_values["OPENROUTER_MODEL"]

        return self

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() in {"production", "prod"}

    @property
    def is_development(self) -> bool:
        return self.app_env.lower() in {"development", "dev", "local"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
