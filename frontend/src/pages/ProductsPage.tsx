import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Alert,
  Snackbar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, cartApi } from '../api';
import { useUser } from '../contexts';
import { Loading, ErrorMessage } from '../components/common';
import { ProductCard } from '../components/products';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Sports & Outdoors'];

export const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { userId } = useUser();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [addingToCartId, setAddingToCartId] = useState<number | null>(null);

  const pageSize = 12;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['products', page, debouncedSearch, category],
    queryFn: () =>
      productsApi.getProducts({
        page,
        page_size: pageSize,
        search: debouncedSearch || undefined,
        category: category === 'All' ? undefined : category,
      }),
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId: number) =>
      cartApi.addToCart(userId, { product_id: productId, quantity: 1, user_id: userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
      setSnackbar({ open: true, message: 'Added to cart successfully!' });
      setAddingToCartId(null);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to add to cart' });
      setAddingToCartId(null);
    },
  });

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleAddToCart = (productId: number, productName: string) => {
    setAddingToCartId(productId);
    addToCartMutation.mutate(productId);
  };

  if (isLoading) return <Loading message="Loading products..." />;
  if (error) return <ErrorMessage message="Failed to load products" onRetry={refetch} />;

  const products = data?.items || [];
  const totalPages = data?.total_pages || 1;

  return (
    <Box sx={{ width: '100%', bgcolor: '#f8f9fa', minHeight: '100vh', pb: 4 }}>
      {/* Header Section */}
      <Box sx={{ bgcolor: 'white', py: 2.5, mb: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 2, color: '#333' }}>
            Products
          </Typography>

          {/* Filters Section */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              size="small"
              sx={{
                flexGrow: 1,
                minWidth: { xs: '100%', sm: 300 },
                bgcolor: 'white',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => handleCategoryChange(e.target.value)}
                sx={{ bgcolor: 'white', borderRadius: 1 }}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Results Summary */}
          {data && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
              Showing {products.length} of {data.total} products
            </Typography>
          )}
        </Box>
      </Box>

      {/* Products Grid */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(5, 1fr)',
              xl: 'repeat(6, 1fr)',
            },
            gap: 2,
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              isAddingToCart={addingToCartId === product.id}
            />
          ))}
        </Box>
      </Box>

      {/* Empty State */}
      {products.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
