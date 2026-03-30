# E-Commerce Full-Stack Application

A modern, production-ready e-commerce platform built with React, TypeScript, FastAPI, and PostgreSQL.

## Features

- **Product Catalog** - Browse, search, and filter products by category
- **Product Details** - View detailed product information
- **Shopping Cart** - Add items, update quantities, remove items
- **Order Management** - Place orders and view order history
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Real-time Updates** - React Query for efficient data fetching and caching

## Tech Stack

### Frontend
- React 18 + TypeScript
- Material-UI (MUI)
- React Query (TanStack Query)
- Context API for state management
- React Router for navigation
- Axios for HTTP requests
- Vite for build tooling

### Backend
- Python 3.12
- FastAPI (async web framework)
- PostgreSQL 15
- SQLAlchemy 2.0 (ORM)
- Alembic (migrations)
- Pydantic (validation)

### Infrastructure
- Docker + Docker Compose
- Podman support

## Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   React     │──────│   FastAPI   │──────│ PostgreSQL  │
│  Frontend   │ HTTP │   Backend   │ SQL  │  Database   │
│   :5173     │      │    :8000    │      │   :5432     │
└─────────────┘      └─────────────┘      └─────────────┘
```

**Backend Layers:**
- **Routes** - API endpoints
- **Services** - Business logic
- **DAO** - Data access (database queries)
- **Models** - SQLAlchemy ORM models

**Frontend Layers:**
- **Pages** - Route components
- **Components** - Reusable UI
- **API** - Service layer for backend calls
- **Contexts** - Global state (cart, user)

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.12+
- Docker/Podman
- PostgreSQL 15 (or use Docker)

### Option 1: Local Development

**1. Start PostgreSQL:**
```bash
podman-compose up -d
# or: docker-compose up -d db
```

**2. Backend Setup:**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Update DATABASE_URL if needed

# Run migrations
alembic upgrade head

# Seed data (18 products + 1 user)
python -m app.seed_data

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend API: http://localhost:8000
API Docs: http://localhost:8000/docs

**3. Frontend Setup:**
```bash
cd frontend
npm install
cp .env.example .env  # Update VITE_API_BASE_URL if needed

# Start dev server
npm run dev
```

Frontend: http://localhost:5173

### Option 2: Docker (Full Stack)

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Database: localhost:5432

## API Endpoints

### Products
- `GET /api/products` - List products (with pagination, search, filters)
- `GET /api/products/{id}` - Get product details

### Cart
- `GET /api/cart?user_id={id}` - Get user's cart
- `POST /api/cart?user_id={id}` - Add item to cart
- `PATCH /api/cart/{cart_item_id}` - Update quantity
- `DELETE /api/cart/{cart_item_id}?user_id={id}` - Remove item

### Orders
- `GET /api/orders?user_id={id}` - List user's orders
- `GET /api/orders/{order_id}?user_id={id}` - Get order details
- `POST /api/orders` - Place order

## Database Schema

**5 Tables:**

1. **users** - Customer accounts
2. **products** - Product catalog
3. **cart_items** - Temporary shopping cart
4. **orders** - Completed purchases
5. **order_items** - Line items with snapshot pattern (stores product name/price at purchase time)

**Key Design Decisions:**
- **Snapshot pattern** in `order_items` preserves historical product data
- **DECIMAL** type for prices (avoids float precision issues)
- **Cascade delete** for cart items when product deleted
- **SET NULL** for order items when product deleted (keeps order history)

## Project Structure

```
zageno_fullstack/
├── backend/
│   ├── app/
│   │   ├── dao/              # Data access layer
│   │   ├── services/         # Business logic
│   │   ├── routes/           # API endpoints
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── database/         # DB configuration
│   │   └── main.py           # FastAPI app
│   ├── alembic/              # Database migrations
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── api/              # Backend API clients
│   │   ├── components/       # React components
│   │   ├── contexts/         # Context providers
│   │   ├── pages/            # Route pages
│   │   ├── types/            # TypeScript types
│   │   └── App.tsx
│   ├── package.json
│   └── README.md
├── docker-compose.yml
└── README.md
```

## Development Workflow

**Adding New Features:**

1. **Backend:**
   - Update/create models in `app/models/`
   - Create migration: `alembic revision --autogenerate -m "description"`
   - Apply migration: `alembic upgrade head`
   - Add DAO methods in `app/dao/`
   - Add business logic in `app/services/`
   - Create routes in `app/routes/`

2. **Frontend:**
   - Add TypeScript types in `src/types/`
   - Create API client in `src/api/`
   - Build components in `src/components/`
   - Create pages in `src/pages/`
   - Add routes in `src/App.tsx`

**Running Tests:**
```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm run test
```

## Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce
```

**Frontend (.env):**
```
VITE_API_BASE_URL=http://localhost:8000
```

## Default Credentials

**Demo User:**
- ID: 1
- Email: user@example.com
- Name: Demo User

No authentication required (for demo purposes).

## Sample Data

Running `python -m app.seed_data` creates:
- 1 demo user
- 18 products across 5 categories:
  - Electronics (MacBook, iPhone, Headphones, etc.)
  - Clothing (T-shirts, Jeans, Sneakers)
  - Home & Kitchen (Coffee Maker, Blender, Cookware)
  - Books (Fiction, Tech, Non-fiction)
  - Sports & Outdoors (Yoga Mat, Dumbbells, Water Bottle)

## Key Features Implemented

✅ Product listing with search and category filters
✅ Pagination for products and orders
✅ Shopping cart with quantity management
✅ Order placement with cart clearing
✅ Order history with detailed view
✅ Responsive Material-UI design
✅ Loading states and error handling
✅ React Query for efficient data fetching
✅ Context API for global state
✅ 3-layer backend architecture
✅ Database migrations with Alembic
✅ Docker support for deployment
✅ TypeScript for type safety
✅ Snapshot pattern for order history

## Production Deployment

**Backend:**
- Use environment variables for sensitive data
- Enable CORS only for trusted origins
- Use production database (managed PostgreSQL)
- Set up proper logging and monitoring
- Use Gunicorn with Uvicorn workers

**Frontend:**
- Build for production: `npm run build`
- Serve static files via CDN
- Enable gzip compression
- Set proper cache headers

**Database:**
- Regular backups
- Connection pooling
- Proper indexes (already configured)
- Read replicas for scaling

## Troubleshooting

**Database connection error:**
```bash
# Make sure PostgreSQL is running
podman ps
# or
docker ps

# Check connection
psql -h localhost -U postgres -d ecommerce
```

**Port already in use:**
```bash
# Backend (8000)
lsof -ti:8000 | xargs kill -9

# Frontend (5173)
lsof -ti:5173 | xargs kill -9
```

**CORS errors:**
- Check `VITE_API_BASE_URL` in frontend/.env
- Verify backend CORS settings in `app/main.py`

## Documentation

- Backend API docs: http://localhost:8000/docs (Swagger UI)
- Backend README: [backend/README.md](backend/README.md)
- Frontend README: [frontend/README.md](frontend/README.md)
