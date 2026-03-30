import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { cartApi, ordersApi } from '../api';
import { useUser } from '../contexts';
import { Loading, ErrorMessage, QuantitySelector, OrderSuccessAnimation } from '../components/common';
import { formatPrice } from '../utils';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useUser();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const { data: cartItems, isLoading, error, refetch } = useQuery({
    queryKey: ['cart', userId],
    queryFn: () => cartApi.getCart(userId),
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      cartApi.updateCartItem(cartItemId, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to update quantity', severity: 'error' });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (cartItemId: number) => cartApi.removeFromCart(cartItemId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      setSnackbar({ open: true, message: 'Item removed from cart', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to remove item', severity: 'error' });
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: () => ordersApi.createOrder({ user_id: userId }),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      queryClient.invalidateQueries({ queryKey: ['orders', userId] });
      setShowSuccessAnimation(true);
      setTimeout(() => navigate('/orders'), 5000);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to place order', severity: 'error' });
    },
  });

  const handleQuantityChange = (cartItemId: number, newQuantity: number, maxStock: number) => {
    if (newQuantity > 0 && newQuantity <= maxStock) {
      updateQuantityMutation.mutate({ cartItemId, quantity: newQuantity });
    }
  };

  const handleRemoveItem = (cartItemId: number) => {
    removeItemMutation.mutate(cartItemId);
  };

  const handlePlaceOrder = () => {
    if (cartItems && cartItems.length > 0) {
      placeOrderMutation.mutate();
    }
  };

  if (isLoading) return <Loading message="Loading cart..." />;
  if (error) return <ErrorMessage message="Failed to load cart" onRetry={refetch} />;

  const items = cartItems || [];
  const totalAmount = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

  if (showSuccessAnimation) {
    return <OrderSuccessAnimation />;
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
      <Box sx={{ maxWidth: 1800, mx: 'auto', px: 2 }}>
        {items.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 8, bgcolor: 'white' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Add some products to get started!
            </Typography>
            <Button variant="contained" onClick={() => navigate('/')}>
              Browse Products
            </Button>
          </Card>
        ) : (
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Cart Items Section */}
            <Box sx={{ flex: 1 }}>
              <Card sx={{ p: 2.5, mb: 2, bgcolor: 'white' }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Shopping Cart
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </Typography>
              </Card>

              {items.map((item, index) => (
                <Card
                  key={item.id}
                  sx={{
                    p: { xs: 1.5, sm: 2.5 },
                    mb: index === items.length - 1 ? 0 : 2,
                    bgcolor: 'white',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2.5 }, flexDirection: { xs: 'column', sm: 'row' } }}>
                    {/* Product Image */}
                    <Box
                      sx={{
                        width: { xs: '100%', sm: 180 },
                        height: { xs: 200, sm: 180 },
                        flexShrink: 0,
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/products/${item.product.id}`)}
                    >
                      <Box
                        component="img"
                        src={item.product.image_url}
                        alt={item.product.name}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                      />
                    </Box>

                    {/* Product Details */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 , alignItems: 'flex-start', justifyContent:'flex-start', minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        fontWeight={500}
                        sx={{
                          cursor: 'pointer',
                          lineHeight: 1.3,
                          '&:hover': { color: 'primary.main' },
                          fontSize: 16
                        }}
                        onClick={() => navigate(`/products/${item.product.id}`)}
                      >
                        {item.product.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          opacity: 0.6,
                          fontSize: 14,
                          width: '100%',
                          mt: 0.5,
                          lineHeight: 1.4,
                          textAlign:'-webkit-left'
                        }}
                      >
                      {item.product?.description}
                    </Typography>

                      <Typography variant="h6" fontWeight={600} color="primary.main" fontSize={18}>
                        ₹{formatPrice(item.product.price)}
                      </Typography>

                      {/* Quantity Controls */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        <QuantitySelector
                          quantity={item.quantity}
                          onQuantityChange={(newQuantity) => handleQuantityChange(item.id, newQuantity, item.product.stock)}
                          maxQuantity={item.product.stock}
                          disabled={updateQuantityMutation.isPending}
                        />

                        <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', sm: 'block' } }} />

                        <Button
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removeItemMutation.isPending}
                          sx={{
                            color: 'primary.main',
                            textTransform: 'none',
                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                          }}
                        >
                        </Button>
                      </Box>
                    </Box>

                    {/* Price */}
                    {/* <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" fontWeight={700} color="primary.main">
                        ₹{formatPrice(item.product.price)}
                      </Typography>
                    </Box> */}
                  </Box>
                </Card>
              ))}
            </Box>

            {/* Order Summary Sidebar */}
            <Box sx={{ width: { xs: '100%', md: 320 }, flexShrink: 0 }}>
              <Card
                sx={{
                  p: 2.5,
                  bgcolor: 'white',
                  border: '1px solid #e0e0e0',
                  position: { xs: 'relative', md: 'sticky' },
                  top: { xs: 0, md: 80 },
                }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handlePlaceOrder}
                  disabled={placeOrderMutation.isPending}
                  sx={{
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    borderRadius: 2,
                  }}
                >
                  {placeOrderMutation.isPending ? 'Placing Order...' : 'Proceed to Buy'}
                </Button>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2">Subtotal ({items.length} items):</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ₹{formatPrice(totalAmount)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2">Shipping:</Typography>
                    <Typography variant="body2" fontWeight={600} color="success.main">
                      FREE
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" fontWeight={700}>
                      Order Total:
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="primary.main">
                      ₹{formatPrice(totalAmount)}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Box>
          </Box>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
