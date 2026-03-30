// Product Types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  rating: number;
  created_at: string;
}

export interface PaginatedProductResponse {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Cart Types
export interface CartItem {
  id: number;
  user_id?: number;
  product_id: number;
  quantity: number;
  created_at: string;
  product: Product;
  subtotal?: number | string;
}

export interface CartResponse {
  items: CartItem[];
  total: number | string;
  item_count: number;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
  user_id: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

// Order Types
export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number | null;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface PaginatedOrderResponse {
  items: Order[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CreateOrderRequest {
  user_id: number;
}

// User Types
export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

// API Error Types
export interface APIError {
  detail: string;
}
