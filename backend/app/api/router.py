from fastapi import APIRouter

from app.api import chat, mission_control

api_router = APIRouter()
api_router.include_router(chat.router, tags=["chat"])
api_router.include_router(mission_control.router)
