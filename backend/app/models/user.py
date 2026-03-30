from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database.connection import Base


class User(Base):
    """
    User entity representing customers in the e-commerce platform.

    Implements a minimal user model suitable for the assignment scope.
    Production systems would extend this with authentication, roles, and profile data.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
