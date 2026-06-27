from sqlalchemy.orm import Session

from app.models.task import Task
from app.repositories.task_repository import TaskRepository

from app.repositories.project_member_repository import (
    ProjectMemberRepository
)

from app.services.activity_log_service import (
    ActivityLogService
)

from app.services.notification_service import (
    NotificationService
)


class TaskService:

    @staticmethod
    def create_task(
        db: Session,
        title: str,
        description: str,
        project_id: int,
        assigned_to: int
    ):

        member = ProjectMemberRepository.is_member(
            db,
            project_id,
            assigned_to
        )

        if not member:
            raise ValueError(
                "User is not a member of this project"
            )

        task = Task(
            title=title,
            description=description,
            project_id=project_id,
            assigned_to=assigned_to
        )

        created_task = TaskRepository.create(
            db,
            task
        )

        ActivityLogService.log(
            db=db,
            user_id=assigned_to,
            project_id=project_id,
            action=f"Created task {created_task.title}"
        )

        NotificationService.create_notification(
            db=db,
            user_id=assigned_to,
            message=f"You were assigned task: {created_task.title}"
        )

        return created_task

    @staticmethod
    def get_project_tasks(
        db: Session,
        project_id: int
    ):
        return TaskRepository.get_by_project(
            db,
            project_id
        )

    @staticmethod
    def update_status(
        db: Session,
        task_id: int,
        status: str
    ):
        task = TaskRepository.get_by_id(
            db,
            task_id
        )

        if not task:
            raise ValueError(
                "Task not found"
            )

        old_status = task.status

        task.status = status

        db.commit()
        db.refresh(task)

        ActivityLogService.log(
            db=db,
            user_id=task.assigned_to,
            project_id=task.project_id,
            action=f"Changed task {task.title} from {old_status} to {status}"
        )

        NotificationService.create_notification(
            db=db,
            user_id=task.assigned_to,
            message=f"Task '{task.title}' status changed to {status}"
        )

        return task