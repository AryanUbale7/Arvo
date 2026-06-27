from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.permissions import require_admin

from app.models.user import User

from app.db.session import get_db

from app.services.project_service import ProjectService

from app.schemas.project import CreateProjectRequest


router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


@router.get("/")
def get_projects(
    db: Session = Depends(get_db)
):
    return ProjectService.get_projects(db)


@router.post("/")
def create_project(
    request: CreateProjectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    require_admin(current_user)

    project = ProjectService.create_project(
        db=db,
        name=request.name,
        description=request.description,
        owner_id=current_user.id
    )

    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "owner_id": project.owner_id
    }


@router.get("/my")
def get_my_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return ProjectService.get_my_projects(
        db,
        current_user.id
    )