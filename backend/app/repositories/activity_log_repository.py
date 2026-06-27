from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog


class ActivityLogRepository:

    @staticmethod
    def create(
        db: Session,
        log: ActivityLog
    ):
        db.add(log)
        db.commit()
        db.refresh(log)

        return log

    @staticmethod
    def get_project_logs(
        db: Session,
        project_id: int
    ):
        return (
            db.query(ActivityLog)
            .filter(
                ActivityLog.project_id == project_id
            )
            .order_by(
                ActivityLog.created_at.desc()
            )
            .all()
        )