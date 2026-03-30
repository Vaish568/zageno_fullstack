import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cartApi } from '../api';

interface CartContextType {
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Use React Query to fetch and cache cart data
  const { data: cartItems } = useQuery({
    queryKey: ['cart', 1], // user_id = 1
    queryFn: () => cartApi.getCart(1),
    staleTime: 1000, // Consider data stale after 1 second
  });

  const cartCount = cartItems?.length || 0;

  const value = {
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
