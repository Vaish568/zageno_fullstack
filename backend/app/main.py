from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import products, cart, orders

# Import models to register them with SQLAlchemy
from app.models import user, product, cart as cart_model, order

app = FastAPI(
    title="E-Commerce API",
    description="Backend API for e-commerce application",
    version="1.0.0"
)

# CORS middleware - must be before routes (allow all origins for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Must be False when allow_origins is ["*"]
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(cart.router, prefix="/api/cart", tags=["Cart"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])


@app.get("/")
def root():
    return {"message": "E-Commerce API is running", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
