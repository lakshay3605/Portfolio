from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Sequence

from app.schemas.chat import ChatHistoryMessage
from app.services.intent_router import IntentRouterProtocol, RoutingResult

REFUSAL_MESSAGE = (
    "I'm Lakshay's AI twin on this portfolio — I'm here to talk about my work, background, "
    "projects, and the kind of questions a recruiter might ask, plus light general knowledge. "
    "I can't help with unrelated tasks like homework, custom coding, essays, or general "
    "ChatGPT-style requests. Ask me anything about my journey, skills, or projects instead."
)

_GREETING = re.compile(
    r"^(hi|hello|hey|hii|hola|yo|sup|thanks|thank you|thankyou|bye|goodbye|good morning|"
    r"good afternoon|good evening|namaste)[\s!.?,]*$",
    re.IGNORECASE,
)
_FOLLOW_UP = re.compile(
    r"^(yes|no|yep|nope|ok|okay|sure|cool|nice|got it|tell me more|more|why|how so|and\?|"
    r"continue|go on|what about that|what else|anything else|sounds good)[\s!.?,]*$",
    re.IGNORECASE,
)
_META = re.compile(
    r"\b(are you (the )?real|are you ai|are you a bot|who (built|made|created) (this|you)|"
    r"what (are|is) you|how does this (chat|work)|is this chat stored|is this saved|"
    r"can (you|someone) read (this|our) chat|privacy|data stored)\b",
    re.IGNORECASE,
)
_IN_SCOPE = re.compile(
    r"\b("
    r"lakshay|mahajan|you|your|yourself|u\b|"
    r"portfolio|resume|cv|hire|hiring|interview|recruiter|job|role|internship|"
    r"project|experience|skill|background|journey|work(ed)?|built|building|"
    r"jagrukmahila|kvgai|kvg ai|ipec|think ai|hacksphere|hackwithindia|"
    r"gemini|fastapi|langgraph|next\.js|node\.js|rag|llm|ai engineer|"
    r"contact|email|linkedin|github|reach you|collaborate|"
    r"strength|weakness|tell me about yourself|why should we hire"
    r")\b",
    re.IGNORECASE,
)
_GK = re.compile(
    r"^(what|who|when|where|which|define|explain|meaning of|capital of|difference between)\b",
    re.IGNORECASE,
)
_BLOCKED = re.compile(
    r"("
    r"\bwrite (me )?(a )?(python|javascript|java|c\+\+|react|code|script|function|program|app|website|bot)\b|"
    r"\bwrite (me )?(an? )?(essay|article|email|letter|story|poem|assignment|report)\b|"
    r"\b(generate|create|build|make) (me )?(a )?(python|javascript|java|c\+\+|react|code|script|function|program|app|website|bot)\b|"
    r"\b(solve|do|complete|finish) (my |this |the )?(homework|assignment|exam|test|quiz|problem set)\b|"
    r"\bignore (all )?(previous|prior|above|system) (instructions|prompts|rules)\b|"
    r"\b(pretend|act) (you are|to be|as if)\b|"
    r"\b(jailbreak|dan mode|developer mode|bypass (the )?rules)\b|"
    r"\btranslate (this|the following|my)\b|"
    r"\bsummarize (this|the following|the article|the document|my)\b|"
    r"\bdebug (this|my) code\b|"
    r"\bfix (this|my) (code|bug|error)\b|"
    r"\bhelp me with (my )?(code|coding|programming|assignment|homework|project(?!s))\b|"
    r"\bcan you code (for me|this)\b|"
    r"\bwrite (a )?(python|javascript|java|c\+\+|sql) (script|program|function|code)\b"
    r")",
    re.IGNORECASE,
)


@dataclass(frozen=True)
class TopicGuardResult:
    allowed: bool
    reason: str = ""
    refusal_message: str = ""


class TopicGuard:
    """Block off-topic requests before they reach the LLM."""

    _ROUTING_CONFIDENCE_THRESHOLD = 0.35
    _MAX_GK_CHARS = 180
    _MAX_UNSCOPED_CHARS = 500

    def __init__(self, intent_router: IntentRouterProtocol) -> None:
        self._intent_router = intent_router

    def check(
        self,
        message: str,
        history: Sequence[ChatHistoryMessage] | None = None,
    ) -> TopicGuardResult:
        text = message.strip()
        normalized = text.lower()

        if not normalized:
            return TopicGuardResult(allowed=False, reason="empty", refusal_message=REFUSAL_MESSAGE)

        if _GREETING.match(normalized):
            return TopicGuardResult(allowed=True, reason="greeting")

        if _META.search(normalized):
            return TopicGuardResult(allowed=True, reason="meta")

        if _BLOCKED.search(normalized):
            return TopicGuardResult(allowed=False, reason="blocked_pattern", refusal_message=REFUSAL_MESSAGE)

        if _IN_SCOPE.search(normalized):
            return TopicGuardResult(allowed=True, reason="in_scope_keyword")

        routing = self._intent_router.route(text)
        if self._routing_is_in_scope(routing):
            return TopicGuardResult(allowed=True, reason="intent_match")

        if history and _FOLLOW_UP.match(normalized):
            return TopicGuardResult(allowed=True, reason="follow_up")

        if self._is_allowed_gk(text, normalized):
            return TopicGuardResult(allowed=True, reason="general_knowledge")

        if len(text) > self._MAX_UNSCOPED_CHARS:
            return TopicGuardResult(allowed=False, reason="long_off_topic", refusal_message=REFUSAL_MESSAGE)

        return TopicGuardResult(allowed=False, reason="off_topic", refusal_message=REFUSAL_MESSAGE)

    @classmethod
    def _routing_is_in_scope(cls, routing: RoutingResult) -> bool:
        if routing.intent == "General":
            return False
        return routing.confidence >= cls._ROUTING_CONFIDENCE_THRESHOLD

    @classmethod
    def _is_allowed_gk(cls, text: str, normalized: str) -> bool:
        if len(text) > cls._MAX_GK_CHARS:
            return False
        if _BLOCKED.search(normalized):
            return False
        return bool(_GK.match(normalized))
