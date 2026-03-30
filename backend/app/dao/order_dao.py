from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.order import Order, OrderItem


class OrderDAO:
    """
    Data Access Object for Order and OrderItem models.

    Handles all database operations for orders.
    """

    def __init__(self, db: Session):
        self.db = db

    def find_by_user_id(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 10
    ) -> tuple[List[Order], int]:
        """
        Find orders for a user with pagination.

        Returns:
            Tuple of (orders list, total count)
        """
        query = self.db.query(Order).filter(Order.user_id == user_id)
        total = query.count()
        orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
        return orders, total

    def find_by_id(self, order_id: int) -> Optional[Order]:
        """Find order by ID."""
        return self.db.query(Order).filter(Order.id == order_id).first()

    def find_by_order_number(self, order_number: str) -> Optional[Order]:
        """Find order by order number."""
        return self.db.query(Order).filter(Order.order_number == order_number).first()

    def create_order(self, order: Order) -> Order:
        """Create new order."""
        self.db.add(order)
        self.db.commit()
        self.db.refresh(order)
        return order

    def create_order_item(self, order_item: OrderItem) -> OrderItem:
        """Create new order item."""
        self.db.add(order_item)
        self.db.commit()
        self.db.refresh(order_item)
        return order_item

    def create_order_items_bulk(self, order_items: List[OrderItem]) -> None:
        """Create multiple order items at once."""
        self.db.add_all(order_items)
        self.db.commit()
