"""
Add rating column to products table
"""
from sqlalchemy import text
from app.database.session import engine

def add_rating_column():
    with engine.connect() as conn:
        # Add rating column
        conn.execute(text("""
            ALTER TABLE products
            ADD COLUMN IF NOT EXISTS rating NUMERIC(2, 1) DEFAULT 0.0;
        """))
        conn.commit()
        print("✓ Rating column added successfully")

if __name__ == "__main__":
    add_rating_column()
