import { apiClient } from './client';
import type { Product, PaginatedProductResponse } from '../types';

export interface GetProductsParams {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
}

export const productsApi = {
  getProducts: async (params: GetProductsParams = {}): Promise<PaginatedProductResponse> => {
    const response = await apiClient.get<PaginatedProductResponse>('/api/products', { params });
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/api/products/${id}`);
    return response.data;
  },
};
