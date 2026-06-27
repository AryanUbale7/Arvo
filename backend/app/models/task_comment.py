from datetime import datetime

from sqlalchemy import (
    Integer,
    Text,
    ForeignKey,
    DateTime
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column
)

from app.db.base import Base


class TaskComment(Base):

    __tablename__ = "task_comments"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    task_id: Mapped[int] = mapped_column(
        ForeignKey("tasks.id")
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )

    comment: Mapped[str] = mapped_column(
        Text
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )