from pydantic import BaseModel


class CreateAttachmentRequest(BaseModel):
    file_name: str
    file_path: str