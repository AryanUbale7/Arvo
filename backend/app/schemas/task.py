from pydantic import BaseModel


class CreateTaskRequest(BaseModel):
    title: str
    description: str
    project_id: int
    assigned_to: int
class UpdateTaskStatusRequest(BaseModel):
    status: str