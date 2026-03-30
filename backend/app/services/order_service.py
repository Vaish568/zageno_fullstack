from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from decimal import Decimal
from math import ceil

from app.database.dependencies import get_db
from app.dao.order_dao import OrderDAO
from app.dao.cart_dao import CartDAO
from app.dao.product_dao import ProductDAO
from app.models.order import Order, OrderItem
from app.schemas.order import OrderResponse, PaginatedOrderResponse


class OrderService:
    """
    Business logic layer for Order operations.

    Demonstrates service composition with dependency injection.
    Dependencies are automatically resolved by FastAPI.
    """

    def __init__(
        self,
        db: Session = Depends(get_db)
    ):
        self.db = db
        self.order_dao = OrderDAO(db)
        self.cart_dao = CartDAO(db)
        self.product_dao = ProductDAO(db)

    def create_order(self, user_id: int = 1) -> OrderResponse:
        """
        Create order from user's cart.

        Implements the complete order placement flow:
        1. Validate cart not empty
        2. Validate products exist and have stock
        3. Calculate total
        4. Create order with snapshot of product data
        5. Clear cart

        Raises:
            HTTPException: If cart empty or validation fails
        """
        cart_items = self.cart_dao.find_by_user_id(user_id)
        if not cart_items:
            raise HTTPException(status_code=400, detail="Cart is empty")

        total_amount = Decimal("0.00")
        order_items_data = []

        for cart_item in cart_items:
            product = self.product_dao.find_by_id(cart_item.product_id)

            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=f"Product with ID {cart_item.product_id} not found"
                )

            if product.stock < cart_item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for {product.name}. Available: {product.stock}"
                )

            subtotal = product.price * cart_item.quantity
            total_amount += subtotal

            order_items_data.append({
                "product_id": product.id,
                "product_name": product.name,
                "product_price": product.price,
                "quantity": cart_item.quantity,
                "subtotal": subtotal
            })

        order_number = self._generate_order_number()

        order = Order(
            user_id=user_id,
            order_number=order_number,
            total_amount=total_amount,
            status="completed"
        )
        order = self.order_dao.create_order(order)

        order_items = [
            OrderItem(order_id=order.id, **item_data)
            for item_data in order_items_data
        ]
        self.order_dao.create_order_items_bulk(order_items)

        self.cart_dao.delete_by_user_id(user_id)

        self.db.refresh(order)
        return OrderResponse.model_validate(order)

    def get_orders(
        self,
        user_id: int = 1,
        page: int = 1,
        page_size: int = 10
    ) -> PaginatedOrderResponse:
        """Get paginated order history (newest first)."""
        skip = (page - 1) * page_size
        orders, total = self.order_dao.find_by_user_id(user_id, skip, page_size)
        total_pages = ceil(total / page_size) if total > 0 else 1

        return PaginatedOrderResponse(
            items=[OrderResponse.model_validate(order) for order in orders],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )

    def get_order_by_id(self, order_id: int, user_id: int = 1) -> OrderResponse:
        """Get single order with authorization check."""
        order = self.order_dao.find_by_id(order_id)

        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        if order.user_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to view this order")

        return OrderResponse.model_validate(order)

    def _generate_order_number(self) -> str:
        """
        Generate unique order number.
        Format: ORD-YYYYMMDD-NNN (e.g., ORD-20260326-001)
        """
        today = datetime.now().strftime("%Y%m%d")
        prefix = f"ORD-{today}-"

        count = 1
        while True:
            order_number = f"{prefix}{count:03d}"
            if not self.order_dao.find_by_order_number(order_number):
                return order_number
            count += 1
