from app.models.notification import Notification

from app.repositories.notification_repository import (
    NotificationRepository
)


class NotificationService:

    @staticmethod
    def create_notification(
        db,
        user_id: int,
        message: str
    ):
        notification = Notification(
            user_id=user_id,
            message=message
        )

        return NotificationRepository.create(
            db,
            notification
        )

    @staticmethod
    def get_notifications(
        db,
        user_id: int
    ):
        return NotificationRepository.get_by_user(
            db,
            user_id
        )

    @staticmethod
    def mark_as_read(
        db,
        notification_id: int
    ):
        notification = NotificationRepository.get_by_id(
            db,
            notification_id
        )

        if not notification:
            raise ValueError(
                "Notification not found"
            )

        notification.is_read = True

        db.commit()
        db.refresh(notification)

        return notification