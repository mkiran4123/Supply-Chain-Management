import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Mock data - in a real app, this would come from API calls
const mockOrdersData = [
  { 
    id: 1, 
    order_date: '2023-05-15T10:30:00Z', 
    status: 'pending', 
    total_amount: 12500, 
    supplier_name: 'ABC Electronics',
    items: [
      { id: 1, product_name: 'Microprocessor A1', quantity: 50, unit_price: 150, total: 7500 },
      { id: 2, product_name: 'RAM Module 8GB', quantity: 100, unit_price: 50, total: 5000 }
    ],
    shipping_address: '123 Tech Street, Silicon Valley, CA 94025',
    payment_terms: 'Net 30',
    notes: 'Priority order for Q3 production'
  }
];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logActivity, hasRole } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Log order detail view activity
    logActivity('view', { page: 'order-detail', id });
    
    // Simulate API call to fetch order data
    const fetchOrder = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await axios.get(`/api/orders/${id}`);
        // setOrder(response.data);
        
        // Using mock data for demonstration
        setTimeout(() => {
          const foundOrder = mockOrdersData.find(order => order.id === parseInt(id));
          if (foundOrder) {
            setOrder(foundOrder);
          } else {
            setError('Order not found');
          }
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, logActivity]);

  const handleBack = () => {
    navigate('/orders');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !order) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link 
          underline="hover" 
          color="inherit" 
          onClick={handleBack}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ShoppingCartIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Orders
        </Link>
        <Typography color="text.primary">Order #{order.id}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Order Details
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Order ID
                </Typography>
                <Typography variant="body1" gutterBottom>
                  #{order.id}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Order Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {new Date(order.order_date).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  color={getStatusColor(order.status)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="body1" gutterBottom>
                  ${order.total_amount.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">${item.unit_price.toFixed(2)}</TableCell>
                      <TableCell align="right">${item.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                      Total
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      ${order.total_amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Supplier Information
            </Typography>
            <Typography variant="body1">
              {order.supplier_name}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>
            <Typography variant="body1" paragraph>
              {order.shipping_address}
            </Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Payment Terms
            </Typography>
            <Typography variant="body1" paragraph>
              {order.payment_terms}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Notes
            </Typography>
            <Typography variant="body1">
              {order.notes}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderDetail;