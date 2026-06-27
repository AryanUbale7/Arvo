from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.models.user import User
from app.core.dependencies import get_current_user

from app.services.notification_service import (
    NotificationService
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


@router.get("/")
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return NotificationService.get_notifications(
        db,
        current_user.id
    )


@router.patch("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db)
):
    try:

        notification = NotificationService.mark_as_read(
            db,
            notification_id
        )

        return {
            "id": notification.id,
            "is_read": notification.is_read
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )