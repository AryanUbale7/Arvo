from pydantic import BaseModel


class AddMemberRequest(BaseModel):
    project_id: int
    user_id: int
    role: str