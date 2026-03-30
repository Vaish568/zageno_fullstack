from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional

from app.schemas.product import ProductResponse, PaginatedProductResponse
from app.services.product_service import ProductService

router = APIRouter()


@router.get("", response_model=PaginatedProductResponse)
def get_products(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search in name and description"),
    category: Optional[str] = Query(None, description="Filter by category"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price"),
    service: ProductService = Depends(ProductService)
):
    """
    Get paginated list of products with optional filters.

    Features:
    - Pagination
    - Search by name/description
    - Filter by category
    - Filter by price range
    """
    return service.get_products(
        page=page,
        page_size=page_size,
        search=search,
        category=category,
        min_price=min_price,
        max_price=max_price
    )


@router.get("/categories", response_model=list[str])
def get_categories(service: ProductService = Depends(ProductService)):
    """Get list of all unique product categories."""
    return service.get_categories()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    service: ProductService = Depends(ProductService)
):
    """Get a single product by ID."""
    product = service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
