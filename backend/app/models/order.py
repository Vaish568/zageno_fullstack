from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.connection import Base


class Order(Base):
    """
    Order entity representing a completed purchase transaction.

    Stores the aggregate information for each order including total amount
    and order status. Related order items are stored separately.

    Attributes:
        order_number: Human-readable unique identifier (e.g., ORD-20260326-001)
        total_amount: Total order value calculated at checkout time
        status: Order state (completed, pending, cancelled)
    """
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    order_number = Column(String(50), unique=True, nullable=False, index=True)
    total_amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String(50), nullable=False, default="completed")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    items = relationship("OrderItem", cascade="all, delete-orphan")


class OrderItem(Base):
    """
    Order line item with snapshot of product data at order time.

    SNAPSHOT PATTERN: Stores product name and price at the moment of purchase
    to maintain historical accuracy even if the product is later modified or deleted.

    Why snapshot instead of just product_id?
    - Product prices change over time
    - Products can be renamed or discontinued
    - Orders must show what customer actually paid
    - Legal/accounting requirement for accurate historical records

    The product_id is kept (nullable) for optional analytics but is not used
    for displaying order history.
    """
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="SET NULL"), nullable=True)
    product_name = Column(String(255), nullable=False)
    product_price = Column(Numeric(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)
