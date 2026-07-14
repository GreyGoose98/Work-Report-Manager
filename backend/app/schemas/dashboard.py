from pydantic import BaseModel

from app.schemas.report import WorkReportResponse


class DashboardSummary(BaseModel):
    total_reports: int
    reports_today: int
    reports_this_week: int
    pending_reports: int
    recent_reports: list[WorkReportResponse]
