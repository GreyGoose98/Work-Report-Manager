from fastapi import APIRouter

from app.api import attachments, auth, dashboard, reports

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(reports.router)
api_router.include_router(attachments.router)
api_router.include_router(dashboard.router)
