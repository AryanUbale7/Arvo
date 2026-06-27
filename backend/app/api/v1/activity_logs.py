from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.activity_log_service import (
    ActivityLogService
)

router = APIRouter(
    prefix="/projects",
    tags=["Activity Logs"]
)


@router.get("/{project_id}/activity")
def get_project_activity(
    project_id: int,
    db: Session = Depends(get_db)
):
    return ActivityLogService.get_logs(
        db,
        project_id
    )