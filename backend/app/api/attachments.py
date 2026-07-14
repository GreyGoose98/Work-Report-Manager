import os

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.auth.deps import get_current_user
from app.database.session import get_db
from app.models.attachment import Attachment
from app.models.user import User
from app.models.work_report import WorkReport
from app.schemas.attachment import AttachmentResponse
from app.services.activity_logger import log_activity
from app.services.storage import save_upload_file

router = APIRouter(tags=["attachments"])


@router.post("/reports/{report_id}/attachments", response_model=AttachmentResponse, status_code=201)
def upload_attachment(
    report_id: int,
    file: UploadFile = File(...),
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

    try:
        saved_path, size = save_upload_file(file)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    attachment = Attachment(
        report_id=report_id,
        file_name=file.filename or "attachment",
        file_type=file.content_type or "application/octet-stream",
        file_path=saved_path,
        file_size=size,
    )
    db.add(attachment)
    db.flush()
    log_activity(
        db,
        user_id=current_user.id,
        action="UPLOAD",
        entity_type="attachment",
        entity_id=str(attachment.id),
        details=f"Attachment uploaded for report {report_id}",
    )
    db.commit()
    db.refresh(attachment)
    return attachment


@router.get("/reports/{report_id}/attachments", response_model=list[AttachmentResponse])
def list_attachments(
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

    return db.query(Attachment).filter(Attachment.report_id == report_id).all()


@router.delete("/attachments/{attachment_id}", status_code=204)
def delete_attachment(
    attachment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    attachment = (
        db.query(Attachment)
        .join(WorkReport, WorkReport.id == Attachment.report_id)
        .filter(Attachment.id == attachment_id, WorkReport.created_by == current_user.id)
        .first()
    )
    if not attachment:
        raise HTTPException(status_code=404, detail="Attachment not found")

    if os.path.exists(attachment.file_path):
        os.remove(attachment.file_path)

    db.delete(attachment)
    log_activity(
        db,
        user_id=current_user.id,
        action="DELETE",
        entity_type="attachment",
        entity_id=str(attachment_id),
        details="Attachment deleted",
    )
    db.commit()
    return None
