from sqlalchemy.orm import Session
from app.models.project import Project
from app.models.task import Task


class DashboardRepository:

    @staticmethod
    def total_projects(db: Session):
        return db.query(Project).count()

    @staticmethod
    def total_tasks(db: Session):
        return db.query(Task).count()

    @staticmethod
    def completed_tasks(db: Session):
        return (
            db.query(Task)
            .filter(Task.status == "DONE")
            .count()
        )

    @staticmethod
    def in_progress_tasks(db: Session):
        return (
            db.query(Task)
            .filter(Task.status == "IN_PROGRESS")
            .count()
        )

    @staticmethod
    def todo_tasks(db: Session):
        return (
            db.query(Task)
            .filter(Task.status == "TODO")
            .count()
        )