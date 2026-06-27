from sqlalchemy.orm import Session

from app.models.project import Project

from app.repositories.project_repository import (
    ProjectRepository
)

from app.services.activity_log_service import (
    ActivityLogService
)


class ProjectService:

    @staticmethod
    def create_project(
        db: Session,
        name: str,
        description: str,
        owner_id: int
    ):

        project = Project(
            name=name,
            description=description,
            owner_id=owner_id
        )

        created_project = ProjectRepository.create(
            db,
            project
        )

        ActivityLogService.log(
            db=db,
            user_id=owner_id,
            project_id=created_project.id,
            action=f"Created project {created_project.name}"
        )

        return created_project

    @staticmethod
    def get_projects(
        db: Session
    ):
        return ProjectRepository.get_all(db)

    @staticmethod
    def get_my_projects(
        db: Session,
        owner_id: int
    ):
        return ProjectRepository.get_by_owner(
            db,
            owner_id
        )