import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          <StorefrontIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 600 }}
            onClick={() => navigate('/')}
          >
            E-Commerce Store
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/')}
              sx={{
                fontWeight: isActive('/') ? 700 : 400,
                borderBottom: isActive('/') ? '2px solid white' : 'none',
              }}
            >
              Products
            </Button>

            <IconButton
              color="inherit"
              onClick={() => navigate('/cart')}
              sx={{
                borderBottom: isActive('/cart') ? '2px solid white' : 'none',
              }}
            >
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <Button
              color="inherit"
              startIcon={<ReceiptIcon />}
              onClick={() => navigate('/orders')}
              sx={{
                fontWeight: isActive('/orders') ? 700 : 400,
                borderBottom: isActive('/orders') ? '2px solid white' : 'none',
              }}
            >
              Orders
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', py: 3 }}>
        <Container maxWidth="xl">{children}</Container>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            E-Commerce Platform © {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};
