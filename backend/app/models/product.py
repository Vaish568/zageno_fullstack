from sqlalchemy import Column, Integer, String, Numeric, Text, DateTime
from sqlalchemy.sql import func
from app.database.connection import Base


class Product(Base):
    """
    Product model - the source of truth for product catalog.

    Design decisions:
    - DECIMAL/Numeric for price (avoids floating point errors)
    - Indexed name and category for fast search/filtering
    - Stock tracking for inventory management
    """
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)  # Indexed for search
    description = Column(Text, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)  # DECIMAL(10,2) - precise for money
    image_url = Column(String(512), nullable=False)
    category = Column(String(100), nullable=False, index=True)  # Indexed for filtering
    stock = Column(Integer, nullable=False, default=100)
    rating = Column(Numeric(2, 1), nullable=True, default=0.0)  # Rating out of 5.0
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
