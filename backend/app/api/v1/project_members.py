from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.project_member import AddMemberRequest
from app.services.project_member_service import (
    ProjectMemberService
)

from app.core.dependencies import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/project-members",
    tags=["Project Members"]
)


@router.post("/")
def add_member(
    request: AddMemberRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:

        member = ProjectMemberService.add_member(
            db,
            request.project_id,
            request.user_id,
            request.role,
            current_user
        )

        return {
            "id": member.id,
            "project_id": member.project_id,
            "user_id": member.user_id,
            "role": member.role
        }

    except ValueError as e:

        raise HTTPException(
            status_code=403,
            detail=str(e)
        )