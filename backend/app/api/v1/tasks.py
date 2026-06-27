from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session
from app.schemas.task import UpdateTaskStatusRequest
from fastapi import HTTPException
from app.db.session import get_db
from app.schemas.task import CreateTaskRequest
from app.services.task_service import TaskService

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


@router.post("/")
def create_task(
    request: CreateTaskRequest,
    db: Session = Depends(get_db)
):
    task = TaskService.create_task(
        db=db,
        title=request.title,
        description=request.description,
        project_id=request.project_id,
        assigned_to=request.assigned_to
    )

    return {
        "id": task.id,
        "title": task.title,
        "status": task.status
    }


@router.get("/project/{project_id}")
def get_project_tasks(
    project_id: int,
    db: Session = Depends(get_db)
):
    return TaskService.get_project_tasks(
        db,
        project_id
    )
@router.patch("/{task_id}/status")
def update_task_status(
    task_id: int,
    request: UpdateTaskStatusRequest,
    db: Session = Depends(get_db)
):
    try:

        task = TaskService.update_status(
            db,
            task_id,
            request.status
        )

        return {
            "id": task.id,
            "title": task.title,
            "status": task.status
        }

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )