from sqlalchemy.orm import Session

from app.models.project_member import ProjectMember


class ProjectMemberRepository:

    @staticmethod
    def create(
        db: Session,
        member: ProjectMember
    ):
        db.add(member)
        db.commit()
        db.refresh(member)

        return member

    @staticmethod
    def get_by_project(
        db: Session,
        project_id: int
    ):
        return (
            db.query(ProjectMember)
            .filter(
                ProjectMember.project_id == project_id
            )
            .all()
        )

    @staticmethod
    def is_member(
        db: Session,
        project_id: int,
        user_id: int
    ):
        member = (
            db.query(ProjectMember)
            .filter(
                ProjectMember.project_id == project_id,
                ProjectMember.user_id == user_id
            )
            .first()
        )
        if member:
            return member
            
        from app.models.project import Project
        project = db.query(Project).filter(Project.id == project_id).first()
        if project and project.owner_id == user_id:
            return ProjectMember(project_id=project_id, user_id=user_id, role="OWNER")
            
        return None

    @staticmethod
    def get_member(
        db: Session,
        project_id: int,
        user_id: int
    ):
        member = (
            db.query(ProjectMember)
            .filter(
                ProjectMember.project_id == project_id,
                ProjectMember.user_id == user_id
            )
            .first()
        )
        if member:
            return member

        from app.models.project import Project
        project = db.query(Project).filter(Project.id == project_id).first()
        if project and project.owner_id == user_id:
            return ProjectMember(project_id=project_id, user_id=user_id, role="OWNER")

        return None

    @staticmethod
    def is_owner(
        db: Session,
        project_id: int,
        user_id: int
    ):
        member = (
            db.query(ProjectMember)
            .filter(
                ProjectMember.project_id == project_id,
                ProjectMember.user_id == user_id,
                ProjectMember.role == "OWNER"
            )
            .first()
        )
        if member:
            return member

        from app.models.project import Project
        project = db.query(Project).filter(Project.id == project_id).first()
        if project and project.owner_id == user_id:
            return ProjectMember(project_id=project_id, user_id=user_id, role="OWNER")

        return None