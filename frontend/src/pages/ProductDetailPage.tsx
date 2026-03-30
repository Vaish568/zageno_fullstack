import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Alert,
  Snackbar,
  Breadcrumbs,
  Link,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi, cartApi } from '../api';
import { useUser } from '../contexts';
import { Loading, ErrorMessage, QuantitySelector } from '../components/common';
import { formatPrice } from '../utils';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId } = useUser();

  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return '#2e7d32'; // Green
    if (rating >= 3) return '#FFA500'; // Yellow/Orange
    return '#d32f2f'; // Red
  };

  const { data: product, isLoading, error, refetch } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProductById(Number(id)),
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: (qty: number) =>
      cartApi.addToCart(userId, { product_id: Number(id), quantity: qty, user_id: userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      setSnackbar({ open: true, message: `Added ${quantity} item(s) to cart!`, severity: 'success' });
      setQuantity(1);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to add to cart', severity: 'error' });
    },
  });

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && product && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product && quantity > 0 && quantity <= product.stock) {
      addToCartMutation.mutate(quantity);
    }
  };

  if (isLoading) return <Loading message="Loading product details..." />;
  if (error || !product) return <ErrorMessage message="Product not found" onRetry={refetch} />;

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 3 }}>
      <Box sx={{ maxWidth: 1800, mx: 'auto', px: 2 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            underline="hover"
            color="inherit"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Products
          </Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        {/* Back Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
          >
            Back to Products
          </Button>
        </Box>

        {/* Product Details Card */}
        <Card sx={{ p: 3, bgcolor: 'white' }}>
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Product Image - Left Side */}
            <Box
              sx={{
                width: { xs: '100%', md: 300 },
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={product.image_url}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: 300,
                  objectFit: 'cover',
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                }}
              />
            </Box>

            {/* Product Details - Right Side */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' , gap: 1}}>
              <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 0 }} fontSize={16}>
                {product.name}
              </Typography>

              <Typography variant="body2" color="text.secondary" paragraph 
                sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            opacity: 0.6,
                            fontSize: 14,
                            width: '100%',
                            lineHeight: 1.4,
                            textAlign:'-webkit-left'
                          }}
              >
                {product.description}
              </Typography>

              {/* Stock Information */}
              <Box sx={{ mb: 1 }}>
                {product.stock > 0 ? (
                  <Typography variant="body1" color="success.main" fontWeight={400} fontSize={14}>
                    In Stock ({product.stock} available)
                  </Typography>
                ) : (
                  <Typography variant="body1" color="error.main" fontWeight={600}>
                    Out of Stock
                  </Typography>
                )}
              </Box>

              <Typography variant="h4" color="primary.main" fontWeight={600} sx={{ mb: 0, fontSize: 18 }}>
                ₹{formatPrice(product.price)}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0 }}>
                <StarIcon sx={{ fontSize: 20, color: getRatingColor(product.rating ? Number(product.rating) : 0) }} />
                <Typography variant="h6" fontWeight={400} sx={{ color: getRatingColor(product.rating ? Number(product.rating) : 0) }} fontSize={14}>
                  {product.rating ? Number(product.rating).toFixed(1) : '0.0'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  out of 5
                </Typography>
              </Box>


              {/* Add to Cart Button */}
              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addToCartMutation.isPending}
                sx={{
                  py: 1.2,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  maxWidth: 300,
                }}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </Box>
          </Box>
        </Card>
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
