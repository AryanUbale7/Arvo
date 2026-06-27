from fastapi import FastAPI
from app.api.v1.tasks import router as task_router
from app.api.v1.auth import router as auth_router
from app.api.v1.projects import router as project_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.activity_logs import (
    router as activity_log_router
)
from app.api.v1.project_members import (
    router as project_member_router
)
from app.api.v1.task_comments import (
    router as task_comment_router
)
from app.api.v1.task_attachments import (
    router as task_attachment_router
)
from app.api.v1.notifications import (
    router as notification_router
)
app = FastAPI(
    title="ARVO API",
    version="1.0.0"
)


app.include_router(auth_router)
app.include_router(project_router)
app.include_router(task_router)
app.include_router(dashboard_router)
app.include_router(project_member_router)
app.include_router(task_comment_router)
app.include_router(activity_log_router)
app.include_router(task_attachment_router)
app.include_router(notification_router)
@app.get("/")
def root():
    return {
        "status": "healthy"
    }