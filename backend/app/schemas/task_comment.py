from pydantic import BaseModel


class CreateCommentRequest(BaseModel):
    comment: str