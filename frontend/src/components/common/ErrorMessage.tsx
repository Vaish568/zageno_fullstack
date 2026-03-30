import React from 'react';
import { Box, Alert, AlertTitle, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'Something went wrong. Please try again.',
  onRetry,
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
      px={2}
    >
      <Alert severity="error" sx={{ maxWidth: 600 }}>
        <AlertTitle>Error</AlertTitle>
        {message}
        {onRetry && (
          <Box mt={2}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
            >
              Try Again
            </Button>
          </Box>
        )}
      </Alert>
    </Box>
  );
};
