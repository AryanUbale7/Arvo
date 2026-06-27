from app.models.task_attachment import (
    TaskAttachment
)

from app.repositories.task_attachment_repository import (
    TaskAttachmentRepository
)


class TaskAttachmentService:

    @staticmethod
    def create_attachment(
        db,
        task_id: int,
        uploaded_by: int,
        file_name: str,
        file_path: str
    ):
        attachment = TaskAttachment(
            task_id=task_id,
            uploaded_by=uploaded_by,
            file_name=file_name,
            file_path=file_path
        )

        return TaskAttachmentRepository.create(
            db,
            attachment
        )

    @staticmethod
    def get_attachments(
        db,
        task_id: int
    ):
        return TaskAttachmentRepository.get_by_task(
            db,
            task_id
        )