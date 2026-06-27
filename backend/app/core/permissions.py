from fastapi import HTTPException


def require_admin(user):

    if user.role != "ADMIN":

        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )