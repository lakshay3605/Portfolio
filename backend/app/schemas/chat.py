from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    session_id: str | None = Field(default=None, max_length=64)
    conversation_number: int | None = Field(default=None, ge=1)


class ChatResponse(BaseModel):
    response: str


class FeedbackRequest(BaseModel):
    session_id: str = Field(..., min_length=1, max_length=64)
    rating: int = Field(..., ge=1, le=5)
    written_feedback: str | None = Field(default=None, max_length=2000)
