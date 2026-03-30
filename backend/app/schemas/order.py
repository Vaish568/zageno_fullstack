from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
from datetime import datetime


class OrderItemResponse(BaseModel):
    id: int
    product_id: Optional[int]
    product_name: str
    product_price: Decimal
    quantity: int
    subtotal: Decimal

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    user_id: int = Field(default=1)


class OrderResponse(BaseModel):
    id: int
    user_id: int
    order_number: str
    total_amount: Decimal
    status: str
    created_at: datetime
    items: list[OrderItemResponse] = []

    class Config:
        from_attributes = True


class PaginatedOrderResponse(BaseModel):
    items: list[OrderResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
