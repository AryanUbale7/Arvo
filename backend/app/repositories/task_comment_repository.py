from sqlalchemy.orm import Session

from app.models.task_comment import TaskComment


class TaskCommentRepository:

    @staticmethod
    def create(
        db: Session,
        comment: TaskComment
    ):
        db.add(comment)
        db.commit()
        db.refresh(comment)

        return comment

    @staticmethod
    def get_by_task(
        db: Session,
        task_id: int
    ):
        return (
            db.query(TaskComment)
            .filter(
                TaskComment.task_id == task_id
            )
            .all()
        )