from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import and_, func
from sqlalchemy.orm import Session

from app.auth.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.models.work_report import WorkReport
from app.schemas.dashboard import DashboardSummary
from app.schemas.report import WorkReportResponse

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today = date.today()
    week_start = today - timedelta(days=today.weekday())

    base_query = db.query(WorkReport).filter(WorkReport.created_by == current_user.id)

    total = base_query.count()
    reports_today = base_query.filter(WorkReport.report_date == today).count()
    reports_this_week = base_query.filter(
        and_(WorkReport.report_date >= week_start, WorkReport.report_date <= today)
    ).count()
    pending_reports = base_query.filter(
        WorkReport.status.in_(["Draft", "Pending", "In Progress"])
    ).count()

    recent = (
        base_query.order_by(WorkReport.report_date.desc(), WorkReport.created_at.desc())
        .limit(5)
        .all()
    )

    return DashboardSummary(
        total_reports=total,
        reports_today=reports_today,
        reports_this_week=reports_this_week,
        pending_reports=pending_reports,
        recent_reports=[
            WorkReportResponse(
                id=r.id,
                report_date=r.report_date,
                work_category=r.work_category,
                customer_name=r.customer_name,
                project_name=r.project_name,
                location=r.location,
                machine_model=r.machine_model,
                activity_description=r.activity_description,
                status=r.status,
                priority=r.priority,
                pending_actions=r.pending_actions,
                next_follow_up_date=r.next_follow_up_date,
                remarks=r.remarks,
                attachment_count=len(r.attachments),
                created_by=r.created_by,
                created_at=r.created_at,
                updated_at=r.updated_at,
            )
            for r in recent
        ],
    )
