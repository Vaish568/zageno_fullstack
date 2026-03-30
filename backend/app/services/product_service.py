from fastapi import Depends
from sqlalchemy.orm import Session
from typing import Optional
from math import ceil

from app.database.dependencies import get_db
from app.dao.product_dao import ProductDAO
from app.schemas.product import PaginatedProductResponse, ProductResponse


class ProductService:
    """
    Business logic layer for Product operations.

    Uses FastAPI's dependency injection pattern.
    Delegates data access to ProductDAO.
    """

    def __init__(self, db: Session = Depends(get_db)):
        self.dao = ProductDAO(db)

    def get_products(
        self,
        page: int = 1,
        page_size: int = 10,
        search: Optional[str] = None,
        category: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
    ) -> PaginatedProductResponse:
        """
        Get paginated products with optional filtering.

        Business logic:
        - Validates pagination params
        - Delegates data fetching to DAO
        - Transforms to response schema
        """
        skip = (page - 1) * page_size

        products, total = self.dao.find_all(
            skip=skip,
            limit=page_size,
            search=search,
            category=category,
            min_price=min_price,
            max_price=max_price
        )

        total_pages = ceil(total / page_size) if total > 0 else 1

        return PaginatedProductResponse(
            items=[ProductResponse.model_validate(p) for p in products],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )

    def get_product_by_id(self, product_id: int):
        """Get a single product by ID."""
        return self.dao.find_by_id(product_id)

    def get_categories(self) -> list[str]:
        """Get list of all unique product categories."""
        return self.dao.find_categories()
