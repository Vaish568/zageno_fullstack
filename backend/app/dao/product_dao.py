from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List

from app.models.product import Product


class ProductDAO:
    """
    Data Access Object for Product model.

    Responsible for all database operations related to products.
    Keeps SQL queries separate from business logic.
    """

    def __init__(self, db: Session):
        self.db = db

    def find_all(
        self,
        skip: int = 0,
        limit: int = 10,
        search: Optional[str] = None,
        category: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
    ) -> tuple[List[Product], int]:
        """
        Find products with filters and pagination.

        Returns:
            Tuple of (products list, total count)
        """
        query = self.db.query(Product)

        if search:
            search_filter = or_(
                Product.name.ilike(f"%{search}%"),
                Product.description.ilike(f"%{search}%")
            )
            query = query.filter(search_filter)

        if category:
            query = query.filter(Product.category == category)

        if min_price is not None:
            query = query.filter(Product.price >= min_price)

        if max_price is not None:
            query = query.filter(Product.price <= max_price)

        total = query.count()
        products = query.offset(skip).limit(limit).all()

        return products, total

    def find_by_id(self, product_id: int) -> Optional[Product]:
        """Find product by ID."""
        return self.db.query(Product).filter(Product.id == product_id).first()

    def find_categories(self) -> List[str]:
        """Find all unique categories."""
        categories = self.db.query(Product.category).distinct().all()
        return [cat[0] for cat in categories]
