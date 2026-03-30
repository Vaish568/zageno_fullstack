from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from decimal import Decimal

from app.database.dependencies import get_db
from app.dao.cart_dao import CartDAO
from app.dao.product_dao import ProductDAO
from app.models.cart import CartItem
from app.schemas.cart import CartResponse, CartItemResponse


class CartService:
    """
    Business logic layer for Cart operations.

    Handles cart operations with proper validation and business rules.
    Delegates data access to CartDAO and ProductDAO.
    """

    def __init__(self, db: Session = Depends(get_db)):
        self.cart_dao = CartDAO(db)
        self.product_dao = ProductDAO(db)

    def get_cart(self, user_id: int = 1) -> CartResponse:
        """
        Get user's cart with all items and calculated totals.

        Business logic:
        - Fetches cart items
        - Retrieves current product prices (live data)
        - Calculates subtotals and total
        - Skips items with deleted products
        """
        cart_items = self.cart_dao.find_by_user_id(user_id)

        items_with_details = []
        total = Decimal("0.00")

        for cart_item in cart_items:
            product = self.product_dao.find_by_id(cart_item.product_id)

            if not product:
                # Product was deleted, skip this cart item
                continue

            subtotal = product.price * cart_item.quantity
            total += subtotal

            item_response = CartItemResponse(
                id=cart_item.id,
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                created_at=cart_item.created_at,
                updated_at=cart_item.updated_at,
                product=product,
                subtotal=subtotal
            )
            items_with_details.append(item_response)

        return CartResponse(
            items=items_with_details,
            total=total,
            item_count=len(items_with_details)
        )

    def add_to_cart(self, product_id: int, quantity: int, user_id: int = 1) -> CartItemResponse:
        """
        Add product to cart or update quantity if already exists.

        Business logic:
        - Validates product exists
        - Checks stock availability
        - Merges with existing cart item if present
        - Creates new cart item otherwise
        """
        product = self.product_dao.find_by_id(product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        if product.stock < quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock. Available: {product.stock}"
            )

        existing_cart_item = self.cart_dao.find_by_user_and_product(user_id, product_id)

        if existing_cart_item:
            new_quantity = existing_cart_item.quantity + quantity
            if product.stock < new_quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock. Available: {product.stock}, In cart: {existing_cart_item.quantity}"
                )
            existing_cart_item.quantity = new_quantity
            cart_item = self.cart_dao.update(existing_cart_item)
        else:
            cart_item = CartItem(
                user_id=user_id,
                product_id=product_id,
                quantity=quantity
            )
            cart_item = self.cart_dao.create(cart_item)

        subtotal = product.price * cart_item.quantity
        return CartItemResponse(
            id=cart_item.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            created_at=cart_item.created_at,
            updated_at=cart_item.updated_at,
            product=product,
            subtotal=subtotal
        )

    def update_cart_item(self, cart_item_id: int, quantity: int) -> CartItemResponse:
        """
        Update cart item quantity.

        Business logic:
        - Validates cart item exists
        - Validates product still exists
        - Checks stock availability
        """
        cart_item = self.cart_dao.find_by_id(cart_item_id)
        if not cart_item:
            raise HTTPException(status_code=404, detail="Cart item not found")

        product = self.product_dao.find_by_id(cart_item.product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        if product.stock < quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock. Available: {product.stock}"
            )

        cart_item.quantity = quantity
        cart_item = self.cart_dao.update(cart_item)

        subtotal = product.price * cart_item.quantity
        return CartItemResponse(
            id=cart_item.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            created_at=cart_item.created_at,
            updated_at=cart_item.updated_at,
            product=product,
            subtotal=subtotal
        )

    def remove_from_cart(self, cart_item_id: int) -> dict:
        """Remove item from cart."""
        cart_item = self.cart_dao.find_by_id(cart_item_id)
        if not cart_item:
            raise HTTPException(status_code=404, detail="Cart item not found")

        self.cart_dao.delete(cart_item)
        return {"message": "Item removed from cart successfully"}

    def clear_cart(self, user_id: int = 1) -> dict:
        """Clear all items from user's cart."""
        count = self.cart_dao.delete_by_user_id(user_id)
        return {"message": f"Cart cleared successfully. {count} items removed."}
