from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Protocol

import yaml

CONFIG_DIR = Path(__file__).resolve().parent.parent.parent / "config"
DEFAULT_MAPPINGS_PATH = CONFIG_DIR / "intent_mappings.yaml"


@dataclass(frozen=True)
class IntentDefinition:
    name: str
    files: tuple[str, ...]
    keywords: tuple[str, ...]


@dataclass(frozen=True)
class FallbackConfig:
    label: str
    files: tuple[str, ...]


@dataclass(frozen=True)
class IntentRouterConfig:
    min_match_score: int
    fallback: FallbackConfig
    intents: tuple[IntentDefinition, ...]


def load_intent_router_config(path: Path = DEFAULT_MAPPINGS_PATH) -> IntentRouterConfig:
    if not path.is_file():
        raise FileNotFoundError(f"Intent mappings not found: {path}")

    with path.open(encoding="utf-8") as handle:
        data = yaml.safe_load(handle)

    routing = data.get("routing", {})
    fallback_data = data["fallback"]
    intents_data = data.get("intents", [])

    intents = tuple(
        IntentDefinition(
            name=item["name"],
            files=tuple(item["files"]),
            keywords=tuple(item["keywords"]),
        )
        for item in intents_data
    )

    return IntentRouterConfig(
        min_match_score=int(routing.get("min_match_score", 1)),
        fallback=FallbackConfig(
            label=fallback_data["label"],
            files=tuple(fallback_data["files"]),
        ),
        intents=intents,
    )
