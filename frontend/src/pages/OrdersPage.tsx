import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api';
import { useUser } from '../contexts';
import { Loading, ErrorMessage } from '../components/common';
import { formatPrice } from '../utils';

export const OrdersPage: React.FC = () => {
  const { userId } = useUser();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', userId, page],
    queryFn: () =>
      ordersApi.getOrders({
        user_id: userId,
        page,
        page_size: pageSize,
      }),
  });

  if (isLoading) return <Loading message="Loading orders..." />;
  if (error)
    return (
      <ErrorMessage
        message="Failed to load orders"
        onRetry={refetch}
      />
    );

  const orders = data?.items || [];
  const totalPages = data?.total_pages || 1;

  return (
    <Box>

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3,
        }}
      >
        <ReceiptLongIcon
          sx={{
            fontSize: 40,
            color: 'primary.main',
          }}
        />

        <Typography
          variant="h4"
          fontWeight={700}
        >
          My Orders
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <Typography
            variant="h6"
            color="text.secondary"
            gutterBottom
          >
            No orders yet
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Start shopping to see your orders here!
          </Typography>
        </Card>
      ) : (
        <>
          {/* Results Summary */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Total Orders: {data?.total || 0}
            </Typography>
          </Box>

          {/* Orders List */}
          {orders.map((order) => (
            <Accordion
              key={order.id}
              sx={{ mb: 2 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
              >
                <Grid
                  container
                  alignItems="center"
                  sx={{
                    width: '100%',
                    pr: 4,
                  }}
                >
                  {/* Order Number */}
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Order Number
                    </Typography>

                    <Typography
                      variant="body1"
                      fontWeight={600}
                    >
                      {order.order_number}
                    </Typography>
                  </Grid>

                  {/* Date */}
                  <Grid
                    item
                    xs={12}
                    sm={2}
                    md={2}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Date
                    </Typography>

                    <Typography variant="body2">
                      {new Date(
                        order.created_at
                      ).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }
                      )}
                    </Typography>
                  </Grid>

                  {/* Items */}
                  <Grid
                    item
                    xs={12}
                    sm={1}
                    md={1}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Items
                    </Typography>

                    <Typography variant="body2">
                      {order.items.length}
                    </Typography>
                  </Grid>

                  {/* Total */}
                  <Grid
                    item
                    xs={12}
                    sm={3}
                    md={3}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                    >
                      Total
                    </Typography>

                    <Typography
                      variant="h6"
                      color="primary.main"
                      fontWeight={700}
                    >
                      ₹
                      {formatPrice(
                        order.total_amount
                      )}
                    </Typography>
                  </Grid>

                  {/* Status */}
                  <Grid
                    item
                    xs={12}
                    sm={2}
                    md={2}
                  >
                    <Chip
                      label={order.status}
                      color={
                        order.status ===
                        'completed'
                          ? 'success'
                          : 'default'
                      }
                      size="small"
                    />
                  </Grid>
                </Grid>
              </AccordionSummary>

              <AccordionDetails>
                <Box sx={{ p: 2 }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                  >
                    Order Items
                  </Typography>

                  <TableContainer
                    component={Paper}
                    variant="outlined"
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <strong>
                              Product
                            </strong>
                          </TableCell>

                          <TableCell align="center">
                            <strong>
                              Quantity
                            </strong>
                          </TableCell>

                          <TableCell align="right">
                            <strong>
                              Price
                            </strong>
                          </TableCell>

                          <TableCell align="right">
                            <strong>
                              Subtotal
                            </strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {order.items.map(
                          (item) => (
                            <TableRow
                              key={item.id}
                            >
                              <TableCell>
                                {
                                  item.product_name
                                }
                              </TableCell>

                              <TableCell align="center">
                                {
                                  item.quantity
                                }
                              </TableCell>

                              <TableCell align="right">
                                ₹
                                {formatPrice(
                                  item.product_price
                                )}
                              </TableCell>

                              <TableCell align="right">
                                <strong>
                                  ₹
                                  {formatPrice(
                                    item.subtotal
                                  )}
                                </strong>
                              </TableCell>
                            </TableRow>
                          )
                        )}

                        {/* Total Row */}
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            align="right"
                          >
                            <Typography
                              variant="h6"
                              fontWeight={700}
                            >
                              Total:
                            </Typography>
                          </TableCell>

                          <TableCell align="right">
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              color="primary.main"
                            >
                              ₹
                              {formatPrice(
                                order.total_amount
                              )}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor:
                        'background.default',
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      <strong>
                        Order ID:
                      </strong>{' '}
                      {order.id} |{' '}
                      <strong>
                        Created:
                      </strong>{' '}
                      {new Date(
                        order.created_at
                      ).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent:
                  'center',
                mt: 4,
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) =>
                  setPage(value)
                }
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};