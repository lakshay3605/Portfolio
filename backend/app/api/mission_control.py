from __future__ import annotations

import logging
import traceback

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.api.dependencies import get_analytics_store
from app.services.analytics_store import AnalyticsStore

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/mission-control", tags=["mission-control"])


def _log_endpoint_error(endpoint: str, exc: Exception) -> None:
    print(f"mission-control endpoint failed: {endpoint}")
    print(traceback.format_exc())
    logger.exception("mission-control endpoint failed: %s", endpoint, exc_info=exc)


def _empty_stats_payload() -> dict[str, object]:
    return {
        "total_conversations": 0,
        "total_questions": 0,
        "average_conversation_length": 0.0,
        "average_response_time_ms": 0.0,
        "total_feedback": 0,
        "average_rating": None,
        "unknown_questions_count": 0,
        "recent_conversations": [],
        "top_questions": [],
        "recent_feedback": [],
    }


@router.get("/stats")
async def mission_control_stats(
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> dict[str, object]:
    try:
        stats = analytics_store.get_admin_stats()
        return {
            "total_conversations": stats.total_conversations,
            "total_questions": stats.total_questions,
            "average_conversation_length": stats.average_conversation_length,
            "average_response_time_ms": stats.average_response_time_ms,
            "total_feedback": stats.total_feedback,
            "average_rating": stats.average_rating,
            "unknown_questions_count": stats.unknown_questions_count,
            "recent_conversations": list(stats.recent_conversations),
            "top_questions": list(stats.top_questions),
            "recent_feedback": list(stats.recent_feedback),
        }
    except Exception as exc:
        _log_endpoint_error("/mission-control/stats", exc)
        return _empty_stats_payload()


@router.get("/top-questions")
async def top_questions(
    limit: int = 20,
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> dict[str, object]:
    try:
        return {"top_questions": analytics_store.top_questions(limit=min(limit, 100))}
    except Exception as exc:
        _log_endpoint_error("/mission-control/top-questions", exc)
        return {"top_questions": []}


@router.get("/export/conversations")
async def export_conversations(
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> JSONResponse:
    try:
        return JSONResponse(content=analytics_store.export_table("conversations"))
    except Exception as exc:
        _log_endpoint_error("/mission-control/export/conversations", exc)
        return JSONResponse(content=[])


@router.get("/export/questions")
async def export_questions(
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> JSONResponse:
    try:
        return JSONResponse(content=analytics_store.export_table("questions"))
    except Exception as exc:
        _log_endpoint_error("/mission-control/export/questions", exc)
        return JSONResponse(content=[])


@router.get("/export/feedback")
async def export_feedback(
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> JSONResponse:
    try:
        return JSONResponse(content=analytics_store.export_table("feedback"))
    except Exception as exc:
        _log_endpoint_error("/mission-control/export/feedback", exc)
        return JSONResponse(content=[])


@router.get("/export/unknown-questions")
async def export_unknown_questions(
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> JSONResponse:
    try:
        return JSONResponse(content=analytics_store.export_table("unknown_questions"))
    except Exception as exc:
        _log_endpoint_error("/mission-control/export/unknown-questions", exc)
        return JSONResponse(content=[])


@router.get("/export/performance")
async def export_performance(
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> JSONResponse:
    try:
        return JSONResponse(content=analytics_store.export_table("performance_metrics"))
    except Exception as exc:
        _log_endpoint_error("/mission-control/export/performance", exc)
        return JSONResponse(content=[])


@router.get("/replay")
async def conversation_replay(
    low_confidence: bool = False,
    negative_feedback: bool = False,
    long_conversations: bool = False,
    unknown_questions: bool = False,
    limit: int = 50,
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> dict[str, object]:
    try:
        sessions = analytics_store.get_session_replays(
            low_confidence=low_confidence,
            negative_feedback=negative_feedback,
            long_conversations=long_conversations,
            unknown_questions=unknown_questions,
            limit=min(limit, 200),
        )
        return {
            "sessions": sessions,
            "filters": {
                "low_confidence": low_confidence,
                "negative_feedback": negative_feedback,
                "long_conversations": long_conversations,
                "unknown_questions": unknown_questions,
            },
            "count": len(sessions),
        }
    except Exception as exc:
        _log_endpoint_error("/mission-control/replay", exc)
        return {
            "sessions": [],
            "filters": {
                "low_confidence": low_confidence,
                "negative_feedback": negative_feedback,
                "long_conversations": long_conversations,
                "unknown_questions": unknown_questions,
            },
            "count": 0,
        }
