from sqlalchemy.orm import Session

from app.models.task_attachment import TaskAttachment


class TaskAttachmentRepository:

    @staticmethod
    def create(
        db: Session,
        attachment: TaskAttachment
    ):
        db.add(attachment)
        db.commit()
        db.refresh(attachment)

        return attachment

    @staticmethod
    def get_by_task(
        db: Session,
        task_id: int
    ):
        return (
            db.query(TaskAttachment)
            .filter(
                TaskAttachment.task_id == task_id
            )
            .all()
        )