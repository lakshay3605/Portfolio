from functools import lru_cache
from pathlib import Path
from typing import Self

from dotenv import dotenv_values
from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]

ENV_FILE_KEYS = (
    "OPENAI_API_KEY",
    "GEMINI_API_KEY",
    "LLM_PROVIDER",
    "GEMINI_MODEL",
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

    openai_api_key: str = Field(default="", alias="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-4o-mini", alias="OPENAI_MODEL")
    openai_base_url: str | None = Field(default=None, alias="OPENAI_BASE_URL")
    openai_timeout_seconds: float = Field(default=60.0, alias="OPENAI_TIMEOUT_SECONDS")

    cors_origins: str = Field(
        default="http://localhost:3000",
        alias="CORS_ORIGINS",
    )

    supabase_url: str = Field(default="", alias="SUPABASE_URL")
    supabase_service_role_key: str = Field(default="", alias="SUPABASE_SERVICE_ROLE_KEY")

    @property
    def resolved_gemini_api_key(self) -> str:
        return (self.gemini_api_key or self.openai_api_key).strip()

    @model_validator(mode="after")
    def normalize_settings(self) -> Self:
        self.llm_provider = self.llm_provider.strip().lower()
        self.gemini_model = self.gemini_model.strip()
        self.openai_model = self.openai_model.strip()

        if self.openai_base_url is not None:
            stripped = self.openai_base_url.strip()
            self.openai_base_url = stripped or None

        file_values = _read_env_file_values()

        file_gemini_key = file_values.get("GEMINI_API_KEY", "")
        file_openai_key = file_values.get("OPENAI_API_KEY", "")

        if not self.gemini_api_key.strip() and file_gemini_key:
            self.gemini_api_key = file_gemini_key

        current_openai_key = self.openai_api_key.strip()
        if file_openai_key and (len(current_openai_key) < 10 or current_openai_key == "test"):
            self.openai_api_key = file_openai_key

        if not self.gemini_api_key.strip() and self.openai_api_key.strip():
            self.gemini_api_key = self.openai_api_key.strip()

        if file_values.get("LLM_PROVIDER"):
            self.llm_provider = file_values["LLM_PROVIDER"].lower()

        if file_values.get("GEMINI_MODEL"):
            self.gemini_model = file_values["GEMINI_MODEL"]

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
