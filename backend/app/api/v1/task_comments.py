from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.core.dependencies import get_current_user

from app.schemas.task_comment import (
    CreateCommentRequest
)

from app.services.task_comment_service import (
    TaskCommentService
)

router = APIRouter(
    prefix="/tasks",
    tags=["Task Comments"]
)


@router.post("/{task_id}/comments")
def create_comment(
    task_id: int,
    request: CreateCommentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    comment = TaskCommentService.create_comment(
        db,
        task_id,
        current_user.id,
        request.comment
    )

    return {
        "id": comment.id,
        "task_id": comment.task_id,
        "user_id": comment.user_id,
        "comment": comment.comment
    }


@router.get("/{task_id}/comments")
def get_comments(
    task_id: int,
    db: Session = Depends(get_db)
):
    return TaskCommentService.get_comments(
        db,
        task_id
    )