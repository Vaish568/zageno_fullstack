from sqlalchemy import Column, Integer, ForeignKey, DateTime, CheckConstraint
from sqlalchemy.sql import func
from app.database.connection import Base


class CartItem(Base):
    """
    Shopping cart items - temporary storage before checkout.

    Design decisions:
    - Tied to user_id (supports multiple users)
    - Foreign key to products (ensures valid products only)
    - ON DELETE CASCADE (if product deleted, remove from cart)
    - No price stored (always fetch current price from products)
    - Check constraint: quantity must be positive
    """
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Constraints
    __table_args__ = (
        CheckConstraint('quantity > 0', name='check_quantity_positive'),
    )
