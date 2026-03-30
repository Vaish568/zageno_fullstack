# E-Commerce Backend API

FastAPI backend with PostgreSQL database for an e-commerce platform.

## Tech Stack

- **FastAPI** - Modern async Python web framework
- **PostgreSQL** - Relational database
- **SQLAlchemy** - ORM with type hints
- **Alembic** - Database migrations
- **Pydantic** - Request/response validation

## Architecture

**3-Layer Design:**
```
Routes (API) → Services (Business Logic) → DAO (Data Access) → Database
```

**Database Tables:**
- `users` - Customer accounts
- `products` - Product catalog
- `cart_items` - Shopping cart (temporary)
- `orders` - Completed purchases
- `order_items` - Order line items with **snapshot pattern** (stores product name/price at purchase time)

## Quick Start

### Local Development

1. **Start PostgreSQL:**
```bash
cd zageno_fullstack
podman-compose up -d
```

2. **Install dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

3. **Set environment variables:**
```bash
# .env file
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce
```

4. **Run migrations:**
```bash
alembic upgrade head
```

5. **Seed sample data:**
```bash
python -m app.seed_data
```

6. **Start server:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API available at: http://localhost:8000
Docs available at: http://localhost:8000/docs

### Docker (Full Stack)

```bash
cd zageno_fullstack
docker-compose up --build
```

## API Endpoints

### Products
```
GET /api/products?search=laptop&category=Electronics&page=1&page_size=10
GET /api/products/{id}
```

### Cart
```
POST /api/cart?user_id=1              # { "product_id": 1, "quantity": 2 }
GET /api/cart?user_id=1
PATCH /api/cart/{cart_item_id}        # { "quantity": 3 }
DELETE /api/cart/{cart_item_id}?user_id=1
```

### Orders
```
POST /api/orders                       # { "user_id": 1 }
GET /api/orders?user_id=1&page=1&page_size=10
GET /api/orders/{order_id}?user_id=1
```

## Database Operations

**Create new migration:**
```bash
alembic revision --autogenerate -m "description"
```

**Apply migrations:**
```bash
alembic upgrade head
```

**Rollback migration:**
```bash
alembic downgrade -1
```

**Add new seed data:**
Edit `app/seed_data.py` and run:
```bash
python -m app.seed_data
```
*(Idempotent - safe to run multiple times)*

## Key Design Decisions

**1. Snapshot Pattern in order_items:**
- Stores `product_name` and `product_price` at purchase time
- Preserves historical accuracy even if product is updated/deleted
- Required for legal/accounting compliance

**2. Foreign Key Strategies:**
- `cart_items → products`: `ON DELETE CASCADE` (remove from cart if product deleted)
- `order_items → products`: `ON DELETE SET NULL` (keep order history, just unlink)

**3. DECIMAL for Money:**
- Uses `Numeric(10, 2)` instead of Float to avoid precision errors

**4. Dependency Injection:**
- Services use FastAPI's `Depends()` for clean DI pattern
- DAOs injected into Services, Services injected into Routes

## Project Structure

```
backend/
├── app/
│   ├── database/          # DB connection, session management
│   ├── models/            # SQLAlchemy models
│   ├── schemas/           # Pydantic validation schemas
│   ├── dao/               # Data access layer (DB queries)
│   ├── services/          # Business logic layer
│   ├── routes/            # API endpoints
│   ├── main.py            # FastAPI app initialization
│   └── seed_data.py       # Sample data seeder
├── alembic/               # Database migrations
├── requirements.txt
└── Dockerfile
```

## Sample Data

Running seed script creates:
- 1 test user (`user@example.com`)
- 18 products across 5 categories (Electronics, Clothing, Home & Kitchen, Books, Sports & Outdoors)

## Development Notes

- Default user_id is 1 (test user)
- Order numbers auto-generated as `ORD-YYYYMMDD-NNN`
- All timestamps use UTC with timezone awareness
- Cart quantities have CHECK constraint (must be > 0)
