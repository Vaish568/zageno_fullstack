from fastapi import APIRouter, Depends, Query

from app.schemas.order import OrderResponse, OrderCreate, PaginatedOrderResponse
from app.services.order_service import OrderService

router = APIRouter()


@router.post("", response_model=OrderResponse, status_code=201)
def create_order(
    order_data: OrderCreate,
    service: OrderService = Depends(OrderService)
):
    """
    Place order from cart.

    Process:
    1. Validates cart is not empty
    2. Validates all products exist and have sufficient stock
    3. Creates order with snapshot of product data at purchase time
    4. Clears cart after successful order placement

    Returns created order with all items.
    """
    return service.create_order(user_id=order_data.user_id)


@router.get("", response_model=PaginatedOrderResponse)
def get_orders(
    user_id: int = Query(1, description="User ID"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    service: OrderService = Depends(OrderService)
):
    """
    Get user's order history with pagination.

    Orders are returned newest first (sorted by created_at desc).
    """
    return service.get_orders(
        user_id=user_id,
        page=page,
        page_size=page_size
    )


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    user_id: int = Query(1, description="User ID"),
    service: OrderService = Depends(OrderService)
):
    """
    Get single order details by ID.

    Validates that the order belongs to the requesting user.
    """
    return service.get_order_by_id(order_id=order_id, user_id=user_id)
