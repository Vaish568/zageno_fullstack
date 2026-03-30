# Backward compatibility - import from new structure
from app.database.session import engine, SessionLocal
from app.database.base_class import Base
from app.database.dependencies import get_db

__all__ = ["engine", "SessionLocal", "Base", "get_db"]
