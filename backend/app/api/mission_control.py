from __future__ import annotations

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.api.dependencies import get_analytics_store
from app.services.analytics_store import AnalyticsStore

router = APIRouter(prefix="/mission-control", tags=["mission-control"])


@router.get("/stats")
async def mission_control_stats(
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> dict[str, object]:
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


@router.get("/top-questions")
async def top_questions(
    limit: int = 20,
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> dict[str, object]:
    return {"top_questions": analytics_store.top_questions(limit=min(limit, 100))}


@router.get("/export/conversations")
async def export_conversations(
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> JSONResponse:
    return JSONResponse(content=analytics_store.export_table("conversations"))


@router.get("/export/questions")
async def export_questions(
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> JSONResponse:
    return JSONResponse(content=analytics_store.export_table("questions"))


@router.get("/export/feedback")
async def export_feedback(
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> JSONResponse:
    return JSONResponse(content=analytics_store.export_table("feedback"))


@router.get("/export/unknown-questions")
async def export_unknown_questions(
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> JSONResponse:
    return JSONResponse(content=analytics_store.export_table("unknown_questions"))


@router.get("/export/performance")
async def export_performance(
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> JSONResponse:
    return JSONResponse(content=analytics_store.export_table("performance_metrics"))


@router.get("/replay")
async def conversation_replay(
    low_confidence: bool = False,
    negative_feedback: bool = False,
    long_conversations: bool = False,
    unknown_questions: bool = False,
    limit: int = 50,
    analytics_store: AnalyticsStore = Depends(get_analytics_store),
) -> dict[str, object]:
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
