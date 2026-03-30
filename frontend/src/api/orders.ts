import { apiClient } from './client';
import type { Order, PaginatedOrderResponse, CreateOrderRequest } from '../types';

export interface GetOrdersParams {
  user_id: number;
  page?: number;
  page_size?: number;
}

export const ordersApi = {
  getOrders: async (params: GetOrdersParams): Promise<PaginatedOrderResponse> => {
    const response = await apiClient.get<PaginatedOrderResponse>('/api/orders', { params });
    return response.data;
  },

  getOrderById: async (orderId: number, userId: number): Promise<Order> => {
    const response = await apiClient.get<Order>(`/api/orders/${orderId}`, {
      params: { user_id: userId },
    });
    return response.data;
  },

  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/api/orders', data);
    return response.data;
  },
};
