import os
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.config import get_settings

settings = get_settings()
ALLOWED_TYPES = {
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
}


def ensure_upload_dir() -> None:
    Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)


def save_upload_file(file: UploadFile) -> tuple[str, int]:
    if file.content_type not in ALLOWED_TYPES:
        raise ValueError("Unsupported file type")

    ensure_upload_dir()
    ext = Path(file.filename or "").suffix
    generated_name = f"{uuid4()}{ext}"
    path = os.path.join(settings.upload_dir, generated_name)

    size = 0
    with open(path, "wb") as output:
        while chunk := file.file.read(1024 * 1024):
            size += len(chunk)
            output.write(chunk)

    return path, size
