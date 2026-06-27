from sqlalchemy.orm import Session

from app.repositories.dashboard_repository import DashboardRepository


class DashboardService:

    @staticmethod
    def get_stats(db: Session):

        return {
            "total_projects":
                DashboardRepository.total_projects(db),

            "total_tasks":
                DashboardRepository.total_tasks(db),

            "completed_tasks":
                DashboardRepository.completed_tasks(db),

            "in_progress_tasks":
                DashboardRepository.in_progress_tasks(db),

            "todo_tasks":
                DashboardRepository.todo_tasks(db)
        }