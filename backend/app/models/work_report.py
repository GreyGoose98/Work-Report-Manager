from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class WorkReport(Base):
    __tablename__ = "work_reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    report_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    work_category: Mapped[str] = mapped_column(String(60), nullable=False, index=True)
    customer_name: Mapped[str | None] = mapped_column(String(120))
    project_name: Mapped[str | None] = mapped_column(String(120))
    location: Mapped[str | None] = mapped_column(String(120))
    machine_model: Mapped[str | None] = mapped_column(String(120))
    activity_description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(60), nullable=False, index=True)
    priority: Mapped[str] = mapped_column(String(24), nullable=False, index=True)
    pending_actions: Mapped[str | None] = mapped_column(Text)
    next_follow_up_date: Mapped[date | None] = mapped_column(Date)
    remarks: Mapped[str | None] = mapped_column(Text)
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    creator = relationship("User", back_populates="reports")
    attachments = relationship("Attachment", back_populates="report", cascade="all,delete-orphan")
