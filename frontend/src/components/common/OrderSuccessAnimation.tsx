import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { keyframes } from '@mui/system';

const scaleIn = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const OrderSuccessAnimation: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(255, 255, 255, 0.98)',
        zIndex: 9999,
      }}
    >
      <CheckCircleIcon
        sx={{
          fontSize: 120,
          color: 'success.main',
          animation: `${scaleIn} 0.6s ease-out`,
        }}
      />
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          mt: 3,
          color: 'success.main',
          animation: `${fadeIn} 0.8s ease-out 0.3s both`,
        }}
      >
        Order Placed Successfully!
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          mt: 1,
          animation: `${fadeIn} 0.8s ease-out 0.5s both`,
        }}
      >
        Redirecting to your orders...
      </Typography>
    </Box>
  );
};
