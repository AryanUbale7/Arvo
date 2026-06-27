from app.models.project_member import ProjectMember
from app.repositories.project_member_repository import (
    ProjectMemberRepository
)


class ProjectMemberService:

    @staticmethod
    def add_member(
        db,
        project_id: int,
        user_id: int,
        role: str,
        current_user
    ):

        owner = ProjectMemberRepository.is_owner(
            db,
            project_id,
            current_user.id
        )

        if not owner:
            raise ValueError(
                "Only project owner can add members"
            )

        existing_member = ProjectMemberRepository.get_member(
            db,
            project_id,
            user_id
        )

        if existing_member:
            raise ValueError(
                "User is already a member"
            )

        member = ProjectMember(
            project_id=project_id,
            user_id=user_id,
            role=role
        )

        return ProjectMemberRepository.create(
            db,
            member
        )