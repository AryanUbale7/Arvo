from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from app.core.dependencies import get_current_user
from app.models.user import User
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.auth import RegisterRequest

from app.services.auth_service import AuthService
from app.schemas.auth import LoginRequest

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)
@router.post("/login")
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db)
):
    return AuthService.login(
        db,
        payload.email,
        payload.password
    )

@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):

    try:

        user = AuthService.register(
            db,
            request.name,
            request.email,
            request.password
        )

        return {
            "message": "User registered",
            "user_id": user.id
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
@router.get("/me")
def me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email
    }