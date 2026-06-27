from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ChatTurnMetadata:
    intent: str
    confidence: float
    knowledge_docs_used: tuple[str, ...]
    build_instructions_ms: float
    is_low_confidence: bool

    def to_dict(self) -> dict[str, object]:
        return {
            "intent": self.intent,
            "confidence": self.confidence,
            "knowledge_docs_used": list(self.knowledge_docs_used),
            "build_instructions_ms": round(self.build_instructions_ms, 2),
            "is_low_confidence": self.is_low_confidence,
        }
