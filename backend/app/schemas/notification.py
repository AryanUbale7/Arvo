from pydantic import BaseModel


class NotificationResponse(BaseModel):
    id: int
    message: str
    is_read: bool