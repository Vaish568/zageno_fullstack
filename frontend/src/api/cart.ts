import { apiClient } from './client';
import type { CartItem, CartResponse, AddToCartRequest, UpdateCartRequest } from '../types';

export const cartApi = {
  getCart: async (userId: number): Promise<CartItem[]> => {
    const response = await apiClient.get<CartResponse>('/api/cart', {
      params: { user_id: userId },
    });
    return response.data.items;
  },

  addToCart: async (userId: number, data: AddToCartRequest): Promise<CartItem> => {
    const response = await apiClient.post<CartItem>(
      '/api/cart',
      { ...data, user_id: userId }
    );
    return response.data;
  },

  updateCartItem: async (cartItemId: number, data: UpdateCartRequest): Promise<CartItem> => {
    const response = await apiClient.put<CartItem>(`/api/cart/${cartItemId}`, data);
    return response.data;
  },

  removeFromCart: async (cartItemId: number, userId: number): Promise<void> => {
    await apiClient.delete(`/api/cart/${cartItemId}`, {
      params: { user_id: userId },
    });
  },
};
