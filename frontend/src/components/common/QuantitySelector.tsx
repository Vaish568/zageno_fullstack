import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  maxQuantity: number;
  disabled?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  maxQuantity,
  disabled = false,
}) => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid #d5d9d9',
        borderRadius: 1,
        bgcolor: '#f0f2f2',
        width: 'fit-content',
      }}
    >
      <IconButton
        size="small"
        onClick={() => onQuantityChange(quantity - 1)}
        disabled={quantity <= 1 || disabled}
        sx={{
          borderRadius: 0,
          px: 1.5,
          '&:hover': { bgcolor: '#e3e6e6' },
        }}
      >
        <RemoveIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <Typography
        sx={{
          px: 2,
          py: 0.5,
          minWidth: 40,
          textAlign: 'center',
          fontWeight: 500,
          bgcolor: 'white',
        }}
      >
        {quantity}
      </Typography>
      <IconButton
        size="small"
        onClick={() => onQuantityChange(quantity + 1)}
        disabled={quantity >= maxQuantity || disabled}
        sx={{
          borderRadius: 0,
          px: 1.5,
          '&:hover': { bgcolor: '#e3e6e6' },
        }}
      >
        <AddIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
};
