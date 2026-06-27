from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.core.security import hash_password
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)


class AuthService:

    @staticmethod
    def register(
        db: Session,
        name: str,
        email: str,
        password: str
    ):

        existing_user = (
            UserRepository.get_by_email(
                db,
                email
            )
        )

        if existing_user:
            raise ValueError(
                "Email already registered"
            )

        user = User(
            name=name,
            email=email,
            password_hash=hash_password(password),
            auth_provider="EMAIL"
        )

        return UserRepository.create(
            db,
            user
        )

    @staticmethod
    def login(
        db: Session,
        email: str,
        password: str
    ):

        user = UserRepository.get_by_email(
            db,
            email
        )

        if not user:
            raise ValueError(
                "Invalid credentials"
            )

        if not verify_password(
            password,
            user.password_hash
        ):
            raise ValueError(
                "Invalid credentials"
            )

        token = create_access_token(
            {
                "sub": str(user.id),
                "email": user.email
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer",
            "user_id": user.id,
            "email": user.email,
            "name": user.name
        }