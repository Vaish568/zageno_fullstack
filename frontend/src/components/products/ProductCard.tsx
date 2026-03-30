import React from 'react';
import { Card, Box, Typography, Button, Chip } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import { formatPrice } from '../../utils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number, productName: string) => void;
  isAddingToCart: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isAddingToCart,
}) => {
  const navigate = useNavigate();

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return '#2e7d32'; // Green
    if (rating >= 3) return '#FFA500'; // Yellow/Orange
    return '#d32f2f'; // Red
  };

  const ratingValue = product.rating ? Number(product.rating) : 0;

  return (
    <Card
      sx={{
        width: '100%',
        minWidth: 0,
        height: 320,
        cursor: 'pointer',
        borderRadius: 2,
        border: '1px solid #eaeaea',
        boxShadow: 'none',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
        },
      }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 160,
          bgcolor: '#fafafa',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Category Badge */}
        <Chip
          label={product.category}
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            fontSize: '0.65rem',
            height: 20,
            bgcolor: 'white',
            fontWeight: 500,
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
          }}
        />
      </Box>

      {/* Content */}
      <Box
        sx={{
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          minWidth: 0,
          alignItems: 'flex-start'
        }}
      >
        {/* Product Name */}
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: '0.85rem',
            lineHeight: 1.3,
            mb: 0.5,
            height: 36,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            width: '100%',
            maxWidth: '100%',
            wordBreak: 'break-word',
            color: '#333',
            textAlign:'-webkit-left'
          }}
        >
          {product.name}
        </Typography>

        {/* Price */}
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '1rem',
            mb: 0.3,
            color: '#000',
          }}
        >
          ₹{formatPrice(product.price)}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <StarIcon sx={{ fontSize: 14, color: getRatingColor(ratingValue) }} />
          <Typography
            sx={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: getRatingColor(ratingValue),
            }}
          >
            {ratingValue.toFixed(1)}
          </Typography>
        </Box>
        {/* Button */}
        <Box sx={{ mt: 'auto' }}>
          <Button
            variant="contained"
            fullWidth
            size="small"
            startIcon={<AddShoppingCartIcon sx={{ fontSize: 14 }} />}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product.id, product.name);
            }}
            disabled={product.stock === 0 || isAddingToCart}
            sx={{
              height: 32,
              borderRadius: 1.5,
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 2px 8px rgba(25,118,210,0.3)',
              },
            }}
          >
            Add to Cart
          </Button>
        </Box>
      </Box>
    </Card>
  );
};