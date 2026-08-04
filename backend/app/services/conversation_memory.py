from __future__ import annotations

from app.schemas.chat import ChatHistoryMessage

MAX_HISTORY_MESSAGES = 12
MAX_HISTORY_CHARS = 12_000
MAX_MESSAGE_CHARS = 4_000


def normalize_history(history: list[ChatHistoryMessage] | None) -> list[ChatHistoryMessage]:
    """Trim and sanitize client-provided session history."""
    if not history:
        return []

    normalized: list[ChatHistoryMessage] = []
    for item in history:
        content = item.content.strip()
        if item.role not in {"user", "assistant"} or not content:
            continue
        normalized.append(
            ChatHistoryMessage(
                role=item.role,
                content=content[:MAX_MESSAGE_CHARS],
            )
        )

    trimmed = normalized[-MAX_HISTORY_MESSAGES:]
    while trimmed and sum(len(message.content) for message in trimmed) > MAX_HISTORY_CHARS:
        trimmed.pop(0)

    return trimmed
