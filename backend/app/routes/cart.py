from fastapi import APIRouter, Depends, Query

from app.schemas.cart import CartResponse, CartItemResponse, CartItemCreate, CartItemUpdate
from app.services.cart_service import CartService

router = APIRouter()


@router.get("", response_model=CartResponse)
def get_cart(
    user_id: int = Query(1, description="User ID"),
    service: CartService = Depends(CartService)
):
    """
    Get user's shopping cart with all items and totals.

    Returns cart items with current product prices and calculated subtotals.
    """
    return service.get_cart(user_id=user_id)


@router.post("", response_model=CartItemResponse, status_code=201)
def add_to_cart(
    cart_item: CartItemCreate,
    service: CartService = Depends(CartService)
):
    """
    Add product to cart or update quantity if already exists.

    Validates:
    - Product exists
    - Sufficient stock available
    """
    return service.add_to_cart(
        product_id=cart_item.product_id,
        quantity=cart_item.quantity,
        user_id=cart_item.user_id
    )


@router.put("/{cart_item_id}", response_model=CartItemResponse)
def update_cart_item(
    cart_item_id: int,
    cart_item: CartItemUpdate,
    service: CartService = Depends(CartService)
):
    """
    Update cart item quantity.

    Validates sufficient stock for new quantity.
    """
    return service.update_cart_item(
        cart_item_id=cart_item_id,
        quantity=cart_item.quantity
    )


@router.delete("/{cart_item_id}")
def remove_from_cart(
    cart_item_id: int,
    service: CartService = Depends(CartService)
):
    """Remove item from cart."""
    return service.remove_from_cart(cart_item_id=cart_item_id)


@router.delete("")
def clear_cart(
    user_id: int = Query(1, description="User ID"),
    service: CartService = Depends(CartService)
):
    """Clear all items from user's cart."""
    return service.clear_cart(user_id=user_id)
