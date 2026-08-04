from typing import Literal

from pydantic import BaseModel, Field


class ChatHistoryMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., min_length=1, max_length=4000)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    session_id: str | None = Field(default=None, max_length=64)
    conversation_number: int | None = Field(default=None, ge=1)
    history: list[ChatHistoryMessage] = Field(default_factory=list, max_length=24)


class ChatResponse(BaseModel):
    response: str


class FeedbackRequest(BaseModel):
    session_id: str = Field(..., min_length=1, max_length=64)
    rating: int = Field(..., ge=1, le=5)
    written_feedback: str | None = Field(default=None, max_length=2000)
