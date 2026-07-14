from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_, func, or_
from sqlalchemy.orm import Session

from app.auth.deps import get_current_user
from app.database.session import get_db
from app.models.attachment import Attachment
from app.models.user import User
from app.models.work_report import WorkReport
from app.schemas.report import WorkReportCreate, WorkReportListResponse, WorkReportResponse, WorkReportUpdate
from app.services.activity_logger import log_activity

router = APIRouter(prefix="/reports", tags=["reports"])


def to_response(report: WorkReport) -> WorkReportResponse:
    return WorkReportResponse(
        id=report.id,
        report_date=report.report_date,
        work_category=report.work_category,
        customer_name=report.customer_name,
        project_name=report.project_name,
        location=report.location,
        machine_model=report.machine_model,
        activity_description=report.activity_description,
        status=report.status,
        priority=report.priority,
        pending_actions=report.pending_actions,
        next_follow_up_date=report.next_follow_up_date,
        remarks=report.remarks,
        attachment_count=len(report.attachments),
        created_by=report.created_by,
        created_at=report.created_at,
        updated_at=report.updated_at,
    )


@router.get("", response_model=WorkReportListResponse)
def list_reports(
    search: str | None = None,
    status: str | None = None,
    work_category: str | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(WorkReport).filter(WorkReport.created_by == current_user.id)

    if search:
        like = f"%{search.strip()}%"
        query = query.filter(
            or_(
                WorkReport.customer_name.ilike(like),
                WorkReport.project_name.ilike(like),
                WorkReport.machine_model.ilike(like),
                WorkReport.activity_description.ilike(like),
            )
        )

    if status:
        query = query.filter(WorkReport.status == status)
    if work_category:
        query = query.filter(WorkReport.work_category == work_category)
    if start_date and end_date:
        query = query.filter(and_(WorkReport.report_date >= start_date, WorkReport.report_date <= end_date))
    elif start_date:
        query = query.filter(WorkReport.report_date >= start_date)
    elif end_date:
        query = query.filter(WorkReport.report_date <= end_date)

    total = query.count()
    items = query.order_by(WorkReport.report_date.desc(), WorkReport.created_at.desc()).all()
    return WorkReportListResponse(items=[to_response(r) for r in items], total=total)


@router.get("/{report_id}", response_model=WorkReportResponse)
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = (
        db.query(WorkReport)
        .filter(WorkReport.id == report_id, WorkReport.created_by == current_user.id)
        .first()
    )
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return to_response(report)


@router.post("", response_model=WorkReportResponse, status_code=201)
def create_report(
    payload: WorkReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = WorkReport(**payload.model_dump(), created_by=current_user.id)
    db.add(report)
    db.flush()
    log_activity(
        db,
        user_id=current_user.id,
        action="CREATE",
        entity_type="work_report",
        entity_id=str(report.id),
        details="Work report created",
    )
    db.commit()
    db.refresh(report)
    return to_response(report)


@router.put("/{report_id}", response_model=WorkReportResponse)
def update_report(
    report_id: int,
    payload: WorkReportUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = (
        db.query(WorkReport)
        .filter(WorkReport.id == report_id, WorkReport.created_by == current_user.id)
        .first()
    )
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    for key, value in payload.model_dump().items():
        setattr(report, key, value)

    log_activity(
        db,
        user_id=current_user.id,
        action="UPDATE",
        entity_type="work_report",
        entity_id=str(report_id),
        details="Work report updated",
    )
    db.commit()
    db.refresh(report)
    return to_response(report)


@router.delete("/{report_id}", status_code=204)
def delete_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    report = (
        db.query(WorkReport)
        .filter(WorkReport.id == report_id, WorkReport.created_by == current_user.id)
        .first()
    )
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    db.query(Attachment).filter(Attachment.report_id == report_id).delete()
    db.delete(report)
    log_activity(
        db,
        user_id=current_user.id,
        action="DELETE",
        entity_type="work_report",
        entity_id=str(report_id),
        details="Work report deleted",
    )
    db.commit()
    return None
