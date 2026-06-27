from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Any

from supabase import Client, create_client

logger = logging.getLogger(__name__)

LOW_CONFIDENCE_THRESHOLD = 0.35
NEGATIVE_FEEDBACK_MAX_RATING = 2
LONG_CONVERSATION_MIN_TURNS = 6


def _utc_now_iso() -> str:
    return datetime.now(UTC).isoformat()


@dataclass(frozen=True)
class AdminStats:
    total_conversations: int
    total_questions: int
    average_conversation_length: float
    average_response_time_ms: float
    total_feedback: int
    average_rating: float | None
    recent_conversations: tuple[dict[str, Any], ...]
    top_questions: tuple[dict[str, Any], ...]
    recent_feedback: tuple[dict[str, Any], ...]
    unknown_questions_count: int


class AnalyticsStore:
    """Supabase-backed analytics store for beta conversation data."""

    def __init__(self, *, supabase_url: str, supabase_key: str) -> None:
        if not supabase_url.strip() or not supabase_key.strip():
            raise RuntimeError(
                "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
            )

        self._client: Client = create_client(supabase_url.strip(), supabase_key.strip())

    def log_conversation_turn(
        self,
        *,
        session_id: str,
        user_message: str,
        ai_response: str,
        response_time_ms: float,
        conversation_number: int,
        intent: str | None = None,
        confidence: float | None = None,
        knowledge_docs_used: list[str] | None = None,
        build_instructions_ms: float | None = None,
        llm_ms: float | None = None,
        tokens_generated: int | None = None,
    ) -> None:
        payload = {
            "session_id": session_id,
            "timestamp": _utc_now_iso(),
            "user_message": user_message,
            "ai_response": ai_response,
            "response_time_ms": response_time_ms,
            "conversation_number": conversation_number,
            "intent": intent,
            "confidence": confidence,
            "knowledge_docs_used": knowledge_docs_used or [],
            "build_instructions_ms": build_instructions_ms,
            "llm_ms": llm_ms,
            "tokens_generated": tokens_generated,
        }
        self._insert("conversations", payload)

    def log_performance(
        self,
        *,
        session_id: str,
        response_time_ms: float,
        build_instructions_ms: float,
        llm_ms: float,
        tokens_generated: int,
        documents_retrieved: int,
        intent: str,
        confidence: float,
        conversation_number: int,
        knowledge_docs_used: list[str],
    ) -> None:
        """Backward-compatible hook — metadata is stored on the conversation row."""
        del documents_retrieved

    def log_unknown_question(
        self,
        *,
        session_id: str,
        question: str,
        response: str,
        confidence: float,
        knowledge_docs_used: list[str],
    ) -> None:
        self._insert(
            "unknown_questions",
            {
                "session_id": session_id,
                "timestamp": _utc_now_iso(),
                "question": question,
                "response": response,
                "confidence": confidence,
                "knowledge_docs_used": knowledge_docs_used,
            },
        )

    def save_feedback(
        self,
        *,
        session_id: str,
        rating: int,
        written_feedback: str | None,
    ) -> None:
        self._insert(
            "feedback",
            {
                "session_id": session_id,
                "rating": rating,
                "written_feedback": written_feedback,
                "timestamp": _utc_now_iso(),
            },
        )

    def get_admin_stats(self, *, recent_limit: int = 10) -> AdminStats:
        conversations = self._select_all(
            "conversations",
            "session_id,timestamp,user_message,ai_response,response_time_ms,conversation_number",
            order="timestamp.desc",
        )
        feedback_rows = self._select_all(
            "feedback",
            "session_id,rating,written_feedback,timestamp",
            order="timestamp.desc",
        )
        unknown_rows = self._select_all("unknown_questions", "id", order="timestamp.desc")

        total_conversations = len(conversations)
        total_questions = total_conversations
        total_feedback = len(feedback_rows)
        unknown_questions_count = len(unknown_rows)

        session_counts: dict[str, int] = {}
        response_times: list[float] = []
        for row in conversations:
            session_counts[row["session_id"]] = session_counts.get(row["session_id"], 0) + 1
            response_times.append(float(row["response_time_ms"]))

        average_conversation_length = (
            sum(session_counts.values()) / len(session_counts) if session_counts else 0.0
        )
        average_response_time_ms = (
            sum(response_times) / len(response_times) if response_times else 0.0
        )

        ratings = [int(row["rating"]) for row in feedback_rows if row.get("rating") is not None]
        average_rating = sum(ratings) / len(ratings) if ratings else None

        recent_conversations = tuple(
            {
                "session_id": row["session_id"],
                "timestamp": row["timestamp"],
                "user_message": row["user_message"],
                "ai_response": row["ai_response"],
                "response_time_ms": row["response_time_ms"],
                "conversation_number": row["conversation_number"],
            }
            for row in conversations[:recent_limit]
        )

        top_questions = tuple(self._aggregate_questions(conversations)[:20])

        recent_feedback = tuple(
            {
                "session_id": row["session_id"],
                "rating": row["rating"],
                "written_feedback": row.get("written_feedback"),
                "timestamp": row["timestamp"],
            }
            for row in feedback_rows[:recent_limit]
        )

        return AdminStats(
            total_conversations=total_conversations,
            total_questions=total_questions,
            average_conversation_length=round(average_conversation_length, 2),
            average_response_time_ms=round(average_response_time_ms, 2),
            total_feedback=total_feedback,
            average_rating=round(average_rating, 2) if average_rating is not None else None,
            recent_conversations=recent_conversations,
            top_questions=top_questions,
            recent_feedback=recent_feedback,
            unknown_questions_count=unknown_questions_count,
        )

    def export_table(self, table_name: str) -> list[dict[str, Any]]:
        if table_name == "conversations":
            return self._select_all("conversations", "*", order="timestamp.asc")
        if table_name == "feedback":
            return self._select_all("feedback", "*", order="timestamp.asc")
        if table_name == "unknown_questions":
            return self._select_all("unknown_questions", "*", order="timestamp.asc")
        if table_name == "questions":
            return [
                {
                    "timestamp": row["timestamp"],
                    "session_id": row["session_id"],
                    "question": row["user_message"],
                    "question_length": len(row["user_message"]),
                    "response_time_ms": row["response_time_ms"],
                }
                for row in self._select_all(
                    "conversations",
                    "timestamp,session_id,user_message,response_time_ms",
                    order="timestamp.asc",
                )
            ]
        if table_name == "performance_metrics":
            return [
                {
                    "session_id": row["session_id"],
                    "timestamp": row["timestamp"],
                    "response_time_ms": row["response_time_ms"],
                    "build_instructions_ms": row.get("build_instructions_ms"),
                    "llm_ms": row.get("llm_ms"),
                    "tokens_generated": row.get("tokens_generated"),
                    "documents_retrieved": len(row.get("knowledge_docs_used") or []),
                    "latency_ms": row["response_time_ms"],
                    "intent": row.get("intent"),
                    "confidence": row.get("confidence"),
                    "conversation_number": row.get("conversation_number"),
                    "knowledge_docs_used": row.get("knowledge_docs_used") or [],
                }
                for row in self._select_all("conversations", "*", order="timestamp.asc")
            ]

        raise ValueError(f"Unsupported export table: {table_name}")

    def top_questions(self, *, limit: int = 20) -> list[dict[str, Any]]:
        conversations = self._select_all("conversations", "user_message", order="timestamp.desc")
        return self._aggregate_questions(conversations)[:limit]

    def get_session_replays(
        self,
        *,
        low_confidence: bool = False,
        negative_feedback: bool = False,
        long_conversations: bool = False,
        unknown_questions: bool = False,
        limit: int = 50,
    ) -> list[dict[str, Any]]:
        conversations = self._select_all("conversations", "*", order="timestamp.asc")
        feedback_rows = self._select_all("feedback", "*", order="timestamp.asc")
        unknown_rows = self._select_all("unknown_questions", "*", order="timestamp.asc")

        conversations_by_session: dict[str, list[dict[str, Any]]] = {}
        for row in conversations:
            conversations_by_session.setdefault(row["session_id"], []).append(row)

        feedback_by_session: dict[str, list[dict[str, Any]]] = {}
        for row in feedback_rows:
            feedback_by_session.setdefault(row["session_id"], []).append(row)

        unknown_by_session: dict[str, list[dict[str, Any]]] = {}
        for row in unknown_rows:
            unknown_by_session.setdefault(row["session_id"], []).append(row)

        session_order = sorted(
            conversations_by_session.keys(),
            key=lambda session_id: conversations_by_session[session_id][-1]["timestamp"],
            reverse=True,
        )

        replays: list[dict[str, Any]] = []
        for session_id in session_order:
            replay = self._build_session_replay(
                session_id=session_id,
                turn_rows=conversations_by_session[session_id],
                feedback_rows=feedback_by_session.get(session_id, []),
                unknown_rows=unknown_by_session.get(session_id, []),
            )
            if not self._matches_replay_filters(
                replay,
                low_confidence=low_confidence,
                negative_feedback=negative_feedback,
                long_conversations=long_conversations,
                unknown_questions=unknown_questions,
            ):
                continue
            replays.append(replay)
            if len(replays) >= limit:
                break

        return replays

    def _build_session_replay(
        self,
        *,
        session_id: str,
        turn_rows: list[dict[str, Any]],
        feedback_rows: list[dict[str, Any]],
        unknown_rows: list[dict[str, Any]],
    ) -> dict[str, Any]:
        sorted_turns = sorted(
            turn_rows,
            key=lambda row: (int(row["conversation_number"]), row["timestamp"]),
        )
        unknown_by_question = {row["question"]: row for row in unknown_rows}

        turns: list[dict[str, Any]] = []
        for turn_row in sorted_turns:
            turn_number = int(turn_row["conversation_number"])
            knowledge_docs = self._parse_docs(turn_row.get("knowledge_docs_used"))
            intent = turn_row.get("intent") or "Unknown"
            confidence = float(turn_row.get("confidence") or 0.0)
            response_time_ms = float(turn_row["response_time_ms"])
            flagged_unknown = turn_row["user_message"] in unknown_by_question

            is_low_confidence = (
                confidence < LOW_CONFIDENCE_THRESHOLD
                or intent == "General"
                or len(knowledge_docs) <= 1
            )
            if flagged_unknown and confidence == 0.0:
                unknown_row = unknown_by_question[turn_row["user_message"]]
                confidence = float(unknown_row["confidence"])
                if not knowledge_docs:
                    knowledge_docs = self._parse_docs(unknown_row.get("knowledge_docs_used"))
                is_low_confidence = True

            turns.append(
                {
                    "conversation_number": turn_number,
                    "timestamp": turn_row["timestamp"],
                    "user_message": turn_row["user_message"],
                    "ai_response": turn_row["ai_response"],
                    "intent": intent,
                    "confidence": round(confidence, 3),
                    "response_time_ms": round(response_time_ms, 2),
                    "knowledge_docs_used": knowledge_docs,
                    "is_low_confidence": is_low_confidence,
                    "is_unknown_question": flagged_unknown,
                }
            )

        timestamps = [turn["timestamp"] for turn in sorted_turns]
        feedback = [
            {
                "rating": row["rating"],
                "written_feedback": row.get("written_feedback"),
                "timestamp": row["timestamp"],
            }
            for row in feedback_rows
        ]

        return {
            "session_id": session_id,
            "start_time": timestamps[0] if timestamps else None,
            "duration_ms": self._session_duration_ms(timestamps),
            "turn_count": len(turns),
            "has_low_confidence": any(turn["is_low_confidence"] for turn in turns),
            "has_unknown_questions": bool(unknown_rows),
            "has_negative_feedback": any(
                int(row["rating"]) <= NEGATIVE_FEEDBACK_MAX_RATING for row in feedback_rows
            ),
            "is_long_conversation": len(turns) >= LONG_CONVERSATION_MIN_TURNS,
            "feedback": feedback,
            "turns": turns,
        }

    def _insert(self, table_name: str, payload: dict[str, Any]) -> None:
        try:
            self._client.table(table_name).insert(payload).execute()
        except Exception:
            logger.exception("Failed to insert analytics row into %s", table_name)
            raise

    def _select_all(
        self,
        table_name: str,
        columns: str,
        *,
        order: str,
    ) -> list[dict[str, Any]]:
        column, direction = order.split(".")
        descending = direction.lower() == "desc"
        rows: list[dict[str, Any]] = []
        page_size = 1000
        offset = 0

        while True:
            response = (
                self._client.table(table_name)
                .select(columns)
                .order(column, desc=descending)
                .range(offset, offset + page_size - 1)
                .execute()
            )
            batch = response.data or []
            rows.extend(batch)
            if len(batch) < page_size:
                break
            offset += page_size

        return rows

    @staticmethod
    def _aggregate_questions(conversations: list[dict[str, Any]]) -> list[dict[str, Any]]:
        counts: dict[str, dict[str, Any]] = {}
        for row in conversations:
            question = str(row.get("user_message", "")).strip()
            if not question:
                continue
            key = question.lower()
            if key not in counts:
                counts[key] = {"question": question, "count": 0}
            counts[key]["count"] += 1

        return sorted(counts.values(), key=lambda item: (-item["count"], item["question"]))

    @staticmethod
    def _parse_docs(raw_value: Any) -> list[str]:
        if isinstance(raw_value, list):
            return [str(doc) for doc in raw_value]
        return []

    @staticmethod
    def _session_duration_ms(timestamps: list[str]) -> float:
        if len(timestamps) < 2:
            return 0.0

        try:
            start = datetime.fromisoformat(str(timestamps[0]).replace("Z", "+00:00"))
            end = datetime.fromisoformat(str(timestamps[-1]).replace("Z", "+00:00"))
            return max(0.0, (end - start).total_seconds() * 1000)
        except ValueError:
            return 0.0

    @staticmethod
    def _matches_replay_filters(
        replay: dict[str, Any],
        *,
        low_confidence: bool,
        negative_feedback: bool,
        long_conversations: bool,
        unknown_questions: bool,
    ) -> bool:
        active_filters = [
            low_confidence,
            negative_feedback,
            long_conversations,
            unknown_questions,
        ]
        if not any(active_filters):
            return True

        if low_confidence and not replay["has_low_confidence"]:
            return False
        if negative_feedback and not replay["has_negative_feedback"]:
            return False
        if long_conversations and not replay["is_long_conversation"]:
            return False
        if unknown_questions and not replay["has_unknown_questions"]:
            return False
        return True
