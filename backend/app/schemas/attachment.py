from datetime import datetime

from pydantic import BaseModel


class AttachmentResponse(BaseModel):
    id: int
    report_id: int
    file_name: str
    file_type: str
    file_path: str
    file_size: int
    uploaded_at: datetime

    class Config:
        from_attributes = True
