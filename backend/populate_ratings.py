"""
Populate ratings for existing products
"""
import random
from app.database.session import SessionLocal
from app.models.product import Product

def populate_ratings():
    db = SessionLocal()
    try:
        products = db.query(Product).all()

        for product in products:
            # Generate realistic ratings between 3.5 and 5.0
            rating = round(random.uniform(3.5, 5.0), 1)
            product.rating = rating

        db.commit()
        print(f"✓ Successfully populated ratings for {len(products)} products")

        # Display sample ratings
        sample_products = db.query(Product).limit(5).all()
        print("\nSample ratings:")
        for p in sample_products:
            print(f"  {p.name[:50]}: {p.rating} ⭐")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    populate_ratings()
