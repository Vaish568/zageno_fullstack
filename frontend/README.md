# E-Commerce Frontend

Modern React TypeScript frontend for an e-commerce platform with Material-UI and React Query.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **React Query** - Server state management
- **Context API** - Global state (cart, user)
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool

## Features

- Product browsing with search and category filters
- Product detail view
- Shopping cart with quantity management
- Order placement and history
- Responsive design (mobile, tablet, desktop)
- Loading states and error handling
- Toast notifications

## Project Structure

```
frontend/
├── src/
│   ├── api/              # API service layer
│   │   ├── client.ts     # Axios instance with interceptors
│   │   ├── products.ts   # Products API
│   │   ├── cart.ts       # Cart API
│   │   └── orders.ts     # Orders API
│   ├── components/
│   │   └── common/       # Reusable components
│   │       ├── Layout.tsx       # App layout with navbar
│   │       ├── Loading.tsx      # Loading indicator
│   │       └── ErrorMessage.tsx # Error display
│   ├── contexts/         # React Context providers
│   │   ├── CartContext.tsx      # Cart state
│   │   └── UserContext.tsx      # User state
│   ├── pages/            # Page components
│   │   ├── ProductsPage.tsx     # Product listing
│   │   ├── ProductDetailPage.tsx # Product details
│   │   ├── CartPage.tsx         # Shopping cart
│   │   └── OrdersPage.tsx       # Order history
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── App.tsx           # Root component
├── .env                  # Environment variables
└── package.json
```

## Quick Start

### Development

1. **Install dependencies:**
```bash
npm install
```

2. **Set environment variables:**
```bash
# .env
VITE_API_BASE_URL=http://localhost:8000
```

3. **Start development server:**
```bash
npm run dev
```

App available at: http://localhost:5173

### Production Build

```bash
npm run build
npm run preview
```

### Docker

```bash
# From project root
docker-compose up frontend
```

## API Integration

The frontend connects to the FastAPI backend at `VITE_API_BASE_URL`. All API calls use:

- **React Query** for data fetching, caching, and mutations
- **Axios interceptors** for request/response handling
- **TypeScript types** for type-safe API responses

### Example API Usage

```tsx
// Fetching data with React Query
const { data, isLoading, error } = useQuery({
  queryKey: ['products', page, search],
  queryFn: () => productsApi.getProducts({ page, search }),
});

// Mutations (POST/PUT/DELETE)
const mutation = useMutation({
  mutationFn: (productId) => cartApi.addToCart(userId, { product_id: productId }),
  onSuccess: () => queryClient.invalidateQueries(['cart']),
});
```

## State Management

### Context API

**CartContext:**
- Cart item count
- Cart refresh triggers

**UserContext:**
- Current user (default: Demo User ID 1)
- User ID for API calls

### React Query

- Server state caching (5-minute stale time)
- Automatic refetching on mutations
- Optimistic updates
- Error handling

## Key Components

### ProductsPage
- Grid layout with search and category filters
- Pagination
- Add to cart functionality
- Responsive card design

### ProductDetailPage
- Full product information
- Quantity selector
- Stock availability
- Breadcrumb navigation

### CartPage
- Item list with images
- Quantity controls
- Remove items
- Order summary
- Place order button

### OrdersPage
- Accordion-style order list
- Order details table
- Order status indicators
- Pagination

## Responsive Design

Breakpoints (Material-UI):
- **xs:** 0px (mobile)
- **sm:** 600px (tablet)
- **md:** 900px (small desktop)
- **lg:** 1200px (desktop)
- **xl:** 1536px (large desktop)

All pages are fully responsive with:
- Flexible grid layouts
- Mobile-optimized navigation
- Touch-friendly UI elements

## Error Handling

- API errors caught by axios interceptors
- React Query error boundaries
- User-friendly error messages
- Retry functionality on failures

## Development Notes

- Hot Module Replacement (HMR) enabled
- TypeScript strict mode
- ESLint configuration
- No authentication (demo user ID 1)
- All prices in USD
