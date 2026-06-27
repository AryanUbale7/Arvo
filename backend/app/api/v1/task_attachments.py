from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.core.dependencies import get_current_user

from app.schemas.task_attachment import (
    CreateAttachmentRequest
)

from app.services.task_attachment_service import (
    TaskAttachmentService
)

router = APIRouter(
    prefix="/tasks",
    tags=["Task Attachments"]
)


@router.post("/{task_id}/attachments")
def create_attachment(
    task_id: int,
    request: CreateAttachmentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    attachment = TaskAttachmentService.create_attachment(
        db=db,
        task_id=task_id,
        uploaded_by=current_user.id,
        file_name=request.file_name,
        file_path=request.file_path
    )

    return {
        "id": attachment.id,
        "task_id": attachment.task_id,
        "file_name": attachment.file_name,
        "file_path": attachment.file_path
    }


@router.get("/{task_id}/attachments")
def get_attachments(
    task_id: int,
    db: Session = Depends(get_db)
):
    return TaskAttachmentService.get_attachments(
        db,
        task_id
    )