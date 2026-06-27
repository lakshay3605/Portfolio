from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import yaml

CONFIG_DIR = Path(__file__).resolve().parent.parent.parent / "config"
DEFAULT_KNOWLEDGE_LAYERS_PATH = CONFIG_DIR / "knowledge_layers.yaml"


@dataclass(frozen=True)
class PriorityKnowledgeLayer:
    category: str | None
    document_id: str | None
    wrapper: str
    max_examples: int


@dataclass(frozen=True)
class PromptKnowledgeTier:
    tier_type: str
    name: str | None = None
    document_id: str | None = None


@dataclass(frozen=True)
class KnowledgeLayersConfig:
    priority_layers: tuple[PriorityKnowledgeLayer, ...]
    general_wrapper: str
    category_wrappers: dict[str, str]
    prompt_knowledge_order: tuple[PromptKnowledgeTier, ...]
    training_source_categories: tuple[str, ...]
    ignore_filename_prefixes: tuple[str, ...]


def load_knowledge_layers_config(
    path: Path = DEFAULT_KNOWLEDGE_LAYERS_PATH,
) -> KnowledgeLayersConfig:
    if not path.is_file():
        raise FileNotFoundError(f"Knowledge layers config not found: {path}")

    with path.open(encoding="utf-8") as handle:
        data = yaml.safe_load(handle) or {}

    priority_layers = tuple(
        PriorityKnowledgeLayer(
            category=str(layer["category"]).strip() if layer.get("category") else None,
            document_id=str(layer["document_id"]).strip() if layer.get("document_id") else None,
            wrapper=str(layer.get("wrapper", "")).strip(),
            max_examples=int(layer.get("max_examples", 0)),
        )
        for layer in data.get("priority_layers", [])
        if layer.get("category") or layer.get("document_id")
    )

    prompt_knowledge_order = tuple(
        PromptKnowledgeTier(
            tier_type=str(tier.get("type", "remaining")).strip(),
            name=str(tier["name"]).strip() if tier.get("name") else None,
            document_id=str(tier["id"]).strip() if tier.get("id") else None,
        )
        for tier in data.get("prompt_knowledge_order", [])
    )

    training_source_categories = data.get("training_source_categories")
    if training_source_categories is None:
        training_source_categories = data.get("conversation_source_categories", ["training"])

    category_wrappers = {
        str(name).strip(): str(wrapper).strip()
        for name, wrapper in (data.get("category_wrappers") or {}).items()
        if str(name).strip() and str(wrapper).strip()
    }

    return KnowledgeLayersConfig(
        priority_layers=priority_layers,
        general_wrapper=str(data.get("general_wrapper", "facts_wrapper.md")).strip()
        or "facts_wrapper.md",
        category_wrappers=category_wrappers,
        prompt_knowledge_order=prompt_knowledge_order,
        training_source_categories=tuple(
            str(category).strip()
            for category in training_source_categories
            if str(category).strip()
        ),
        ignore_filename_prefixes=tuple(
            str(prefix).strip()
            for prefix in data.get("ignore_filename_prefixes", ["_"])
            if str(prefix).strip()
        ),
    )
