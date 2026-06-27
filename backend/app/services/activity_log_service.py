from app.models.activity_log import ActivityLog

from app.repositories.activity_log_repository import (
    ActivityLogRepository
)


class ActivityLogService:

    @staticmethod
    def log(
        db,
        user_id: int,
        project_id: int,
        action: str
    ):
        log = ActivityLog(
            user_id=user_id,
            project_id=project_id,
            action=action
        )

        return ActivityLogRepository.create(
            db,
            log
        )

    @staticmethod
    def get_logs(
        db,
        project_id: int
    ):
        return ActivityLogRepository.get_project_logs(
            db,
            project_id
        )