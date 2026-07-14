from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field

WORK_CATEGORIES = [
    "Daily Work",
    "Customer Visit",
    "Trial",
    "Time Estimation",
    "Technical Support",
    "Service Support",
    "Internal Meeting",
    "Documentation",
    "Follow-up",
    "Other",
]

STATUSES = [
    "Draft",
    "In Progress",
    "Completed",
    "Pending",
    "Waiting for Customer",
    "Waiting for Internal Support",
]

PRIORITIES = ["Low", "Medium", "High", "Critical"]

StatusType = Literal[
    "Draft",
    "In Progress",
    "Completed",
    "Pending",
    "Waiting for Customer",
    "Waiting for Internal Support",
]
PriorityType = Literal["Low", "Medium", "High", "Critical"]


class WorkReportBase(BaseModel):
    report_date: date
    work_category: str = Field(pattern="^(" + "|".join(WORK_CATEGORIES) + ")$")
    customer_name: str | None = Field(default=None, max_length=120)
    project_name: str | None = Field(default=None, max_length=120)
    location: str | None = Field(default=None, max_length=120)
    machine_model: str | None = Field(default=None, max_length=120)
    activity_description: str = Field(min_length=3)
    status: StatusType
    priority: PriorityType
    pending_actions: str | None = None
    next_follow_up_date: date | None = None
    remarks: str | None = None


class WorkReportCreate(WorkReportBase):
    pass


class WorkReportUpdate(WorkReportBase):
    pass


class WorkReportResponse(WorkReportBase):
    id: int
    attachment_count: int
    created_by: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class WorkReportListResponse(BaseModel):
    items: list[WorkReportResponse]
    total: int
