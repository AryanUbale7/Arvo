from app.models.task_comment import TaskComment
from app.repositories.task_comment_repository import (
    TaskCommentRepository
)


class TaskCommentService:

    @staticmethod
    def create_comment(
        db,
        task_id: int,
        user_id: int,
        comment: str
    ):
        task_comment = TaskComment(
            task_id=task_id,
            user_id=user_id,
            comment=comment
        )

        return TaskCommentRepository.create(
            db,
            task_comment
        )

    @staticmethod
    def get_comments(
        db,
        task_id: int
    ):
        return TaskCommentRepository.get_by_task(
            db,
            task_id
        )