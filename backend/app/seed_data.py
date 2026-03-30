"""
Seed data script for populating the database with sample data.

Uses smart idempotent approach:
- Checks each product by name before adding
- Only adds products that don't exist
- Safe to run multiple times
- Safe for production (won't delete existing data)

Run: python -m app.seed_data
"""

from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.user import User
from app.models.product import Product


def seed_users(db: Session):
    """
    Create default user if not exists.

    Checks by email to avoid duplicates.
    """
    email = "user@example.com"
    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        print(f"✓ User '{email}' already exists, skipping")
        return existing_user

    user = User(
        email=email,
        name="John Doe"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    print(f"✓ Created user: {user.email}")
    return user


def seed_products(db: Session):
    """
    Create sample products if they don't exist.

    Checks each product by name to avoid duplicates.
    New products can be added to the list anytime.
    """
    products_data = [
        # Electronics
        {
            "name": "MacBook Pro 14\" M3",
            "description": "Apple M3 chip, 16GB RAM, 512GB SSD. Perfect for developers and creative professionals.",
            "price": 1999.00,
            "category": "Electronics",
            "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
            "stock": 25
        },
        {
            "name": "iPhone 15 Pro",
            "description": "A17 Pro chip, titanium design, 256GB storage. Advanced camera system.",
            "price": 1199.00,
            "category": "Electronics",
            "image_url": "https://images.unsplash.com/photo-1592286927505-b70f1b607026?w=500",
            "stock": 50
        },
        {
            "name": "Sony WH-1000XM5 Headphones",
            "description": "Industry-leading noise cancellation. 30-hour battery life. Premium sound quality.",
            "price": 399.00,
            "category": "Electronics",
            "image_url": "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500",
            "stock": 40
        },
        {
            "name": "iPad Air 11\"",
            "description": "M2 chip, 128GB. Perfect for creativity and productivity on the go.",
            "price": 799.00,
            "category": "Electronics",
            "image_url": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
            "stock": 30
        },
        {
            "name": "Samsung 55\" QLED 4K TV",
            "description": "Quantum HDR, smart TV features, stunning picture quality.",
            "price": 1299.00,
            "category": "Electronics",
            "image_url": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500",
            "stock": 15
        },

        # Clothing
        {
            "name": "Nike Air Max Sneakers",
            "description": "Comfortable cushioning, breathable mesh upper. Classic style.",
            "price": 129.99,
            "category": "Clothing",
            "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
            "stock": 75
        },
        {
            "name": "Levi's 501 Original Jeans",
            "description": "Classic straight fit, durable denim. Timeless American style.",
            "price": 89.99,
            "category": "Clothing",
            "image_url": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
            "stock": 60
        },
        {
            "name": "Patagonia Fleece Jacket",
            "description": "Recycled polyester, warm and sustainable. Perfect for outdoor adventures.",
            "price": 149.00,
            "category": "Clothing",
            "image_url": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
            "stock": 45
        },
        {
            "name": "Adidas Ultraboost Running Shoes",
            "description": "Responsive cushioning, energy return. Perfect for runners.",
            "price": 179.99,
            "category": "Clothing",
            "image_url": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
            "stock": 55
        },

        # Home & Kitchen
        {
            "name": "Dyson V15 Vacuum Cleaner",
            "description": "Laser dust detection, powerful suction. Cordless convenience.",
            "price": 649.00,
            "category": "Home & Kitchen",
            "image_url": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500",
            "stock": 20
        },
        {
            "name": "Nespresso Coffee Machine",
            "description": "Barista-quality coffee at home. 19 bar pressure system.",
            "price": 199.00,
            "category": "Home & Kitchen",
            "image_url": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500",
            "stock": 35
        },
        {
            "name": "KitchenAid Stand Mixer",
            "description": "5-quart capacity, 10-speed mixing. Essential for baking.",
            "price": 449.00,
            "category": "Home & Kitchen",
            "image_url": "https://images.unsplash.com/photo-1578022761797-b8636ac1773c?w=500",
            "stock": 28
        },

        # Books
        {
            "name": "The Pragmatic Programmer",
            "description": "Essential reading for software developers. Timeless programming wisdom.",
            "price": 49.99,
            "category": "Books",
            "image_url": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
            "stock": 100
        },
        {
            "name": "Clean Code by Robert Martin",
            "description": "Learn to write clean, maintainable code. A must-read for developers.",
            "price": 44.99,
            "category": "Books",
            "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500",
            "stock": 100
        },
        {
            "name": "Designing Data-Intensive Applications",
            "description": "Deep dive into distributed systems and data architecture.",
            "price": 59.99,
            "category": "Books",
            "image_url": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500",
            "stock": 80
        },

        # Sports & Outdoors
        {
            "name": "Yoga Mat Premium",
            "description": "Non-slip surface, extra cushioning. Perfect for yoga and fitness.",
            "price": 39.99,
            "category": "Sports & Outdoors",
            "image_url": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
            "stock": 90
        },
        {
            "name": "Camping Tent 4-Person",
            "description": "Waterproof, easy setup. Great for family camping trips.",
            "price": 199.00,
            "category": "Sports & Outdoors",
            "image_url": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500",
            "stock": 25
        },
        {
            "name": "Adjustable Dumbbells Set",
            "description": "5-52.5 lbs per dumbbell. Space-saving home gym equipment.",
            "price": 349.00,
            "category": "Sports & Outdoors",
            "image_url": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500",
            "stock": 30
        },
    ]

    added_count = 0
    skipped_count = 0

    for product_data in products_data:
        existing = db.query(Product).filter(
            Product.name == product_data["name"]
        ).first()

        if existing:
            print(f"  ✓ '{product_data['name']}' already exists, skipping")
            skipped_count += 1
        else:
            product = Product(**product_data)
            db.add(product)
            print(f"  ✓ Added: {product_data['name']}")
            added_count += 1

    if added_count > 0:
        db.commit()

    print(f"\n📊 Summary: {added_count} products added, {skipped_count} skipped")


def seed_all():
    """
    Run all seed functions.

    Safe to run multiple times - only adds missing data.
    """
    print("\n🌱 Starting database seeding...\n")

    db = SessionLocal()
    try:
        print("👤 Seeding users...")
        seed_users(db)

        print("\n📦 Seeding products...")
        seed_products(db)

        print("\n✅ Database seeding completed successfully!\n")
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}\n")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_all()
