from typing import Generator
from sqlalchemy.orm import Session
from app.database.session import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """
    Dependency function for FastAPI routes to get database session.

    Usage in routes:
        @router.get("/products")
        def get_products(db: Session = Depends(get_db)):
            ...

    Automatically closes the session after request completes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
