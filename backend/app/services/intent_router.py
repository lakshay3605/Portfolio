from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Protocol

from app.services.intent_router_config import (
    DEFAULT_MAPPINGS_PATH,
    IntentRouterConfig,
    load_intent_router_config,
)

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class RoutingResult:
    intent: str
    confidence: float
    file_ids: tuple[str, ...]

    @property
    def filenames(self) -> tuple[str, ...]:
        return tuple(f"{file_id}.md" for file_id in self.file_ids)


class IntentRouterProtocol(Protocol):
    """Contract for intent routing — swap implementations without changing ChatService."""

    def route(self, message: str) -> RoutingResult: ...


class IntentRouter:
    """Rule-based intent router using configurable keyword mappings.

    Extension points:
    - Replace with embedding-based retrieval implementing IntentRouterProtocol
    - Replace with LangGraph classification node
    - Load alternate config paths per environment
    """

    _WORD_BOUNDARY = re.compile(r"\b[\w'-]+\b")

    def __init__(
        self,
        config: IntentRouterConfig | None = None,
        *,
        config_path: Path = DEFAULT_MAPPINGS_PATH,
    ) -> None:
        self._config = config or load_intent_router_config(config_path)

    def route(self, message: str) -> RoutingResult:
        normalized = message.lower().strip()

        if not normalized:
            return self._fallback_result(confidence=0.0)

        scored_intents = [
            (intent, self._score_intent(normalized, intent.keywords))
            for intent in self._config.intents
        ]
        max_score = max(score for _, score in scored_intents)

        if max_score < self._config.min_match_score:
            result = self._fallback_result(confidence=0.0)
            self._log_routing(normalized, result)
            return result

        matched_intents = [
            intent for intent, score in scored_intents if score == max_score
        ]
        file_ids = self._merge_files(intent.files for intent in matched_intents)
        intent_label = self._format_intent_label(matched_intents)
        confidence = min(1.0, max_score / max(len(matched_intents[0].keywords), 1))

        result = RoutingResult(
            intent=intent_label,
            confidence=confidence,
            file_ids=file_ids,
        )
        self._log_routing(normalized, result)
        return result

    def _score_intent(self, normalized_message: str, keywords: tuple[str, ...]) -> int:
        score = 0
        for keyword in keywords:
            keyword_normalized = keyword.lower().strip()
            if not keyword_normalized:
                continue

            if " " in keyword_normalized:
                if keyword_normalized in normalized_message:
                    score += 1
            elif keyword_normalized in self._tokenize(normalized_message):
                score += 1
            elif keyword_normalized in normalized_message:
                score += 1

        return score

    @classmethod
    def _tokenize(cls, text: str) -> set[str]:
        return set(cls._WORD_BOUNDARY.findall(text))

    @staticmethod
    def _merge_files(file_groups: tuple[tuple[str, ...], ...]) -> tuple[str, ...]:
        merged: list[str] = []
        seen: set[str] = set()
        for group in file_groups:
            for file_id in group:
                if file_id not in seen:
                    seen.add(file_id)
                    merged.append(file_id)
        return tuple(merged)

    @staticmethod
    def _format_intent_label(matched_intents: list) -> str:
        if len(matched_intents) == 1:
            return matched_intents[0].name
        return " + ".join(intent.name for intent in matched_intents)

    def _fallback_result(self, confidence: float) -> RoutingResult:
        return RoutingResult(
            intent=self._config.fallback.label,
            confidence=confidence,
            file_ids=self._config.fallback.files,
        )

    @staticmethod
    def _log_routing(message: str, result: RoutingResult) -> None:
        files_block = "\n".join(result.filenames)
        logger.info(
            "Intent routing\nQuestion: %s\nIntent: %s\nConfidence: %.2f\nFiles:\n%s",
            message,
            result.intent,
            result.confidence,
            files_block,
        )
