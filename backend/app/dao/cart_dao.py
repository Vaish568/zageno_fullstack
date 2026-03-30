from sqlalchemy.orm import Session
from typing import Optional, List

from app.models.cart import CartItem


class CartDAO:
    """
    Data Access Object for CartItem model.

    Handles all database operations for shopping cart.
    """

    def __init__(self, db: Session):
        self.db = db

    def find_by_user_id(self, user_id: int) -> List[CartItem]:
        """Find all cart items for a user."""
        return self.db.query(CartItem).filter(CartItem.user_id == user_id).all()

    def find_by_id(self, cart_item_id: int) -> Optional[CartItem]:
        """Find cart item by ID."""
        return self.db.query(CartItem).filter(CartItem.id == cart_item_id).first()

    def find_by_user_and_product(self, user_id: int, product_id: int) -> Optional[CartItem]:
        """Find cart item by user and product combination."""
        return (
            self.db.query(CartItem)
            .filter(CartItem.user_id == user_id, CartItem.product_id == product_id)
            .first()
        )

    def create(self, cart_item: CartItem) -> CartItem:
        """Create new cart item."""
        self.db.add(cart_item)
        self.db.commit()
        self.db.refresh(cart_item)
        return cart_item

    def update(self, cart_item: CartItem) -> CartItem:
        """Update existing cart item (commit changes)."""
        self.db.commit()
        self.db.refresh(cart_item)
        return cart_item

    def delete(self, cart_item: CartItem) -> None:
        """Delete cart item."""
        self.db.delete(cart_item)
        self.db.commit()

    def delete_by_user_id(self, user_id: int) -> int:
        """
        Delete all cart items for a user.

        Returns:
            Number of items deleted
        """
        count = self.db.query(CartItem).filter(CartItem.user_id == user_id).delete()
        self.db.commit()
        return count
