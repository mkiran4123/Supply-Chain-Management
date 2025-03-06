import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';
import { 
  Inventory as InventoryIcon, 
  ShoppingCart as OrderIcon, 
  People as SupplierIcon, 
  Warning as AlertIcon 
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Mock data - in a real app, this would come from API calls
const mockData = {
  inventorySummary: {
    totalItems: 156,
    lowStock: 12,
    outOfStock: 3,
    totalValue: 287500
  },
  ordersSummary: {
    pending: 8,
    processing: 5,
    completed: 42,
    cancelled: 2
  },
  suppliersSummary: {
    total: 24,
    active: 18
  },
  recentOrders: [
    { id: 1, date: '2023-05-15', supplier: 'ABC Electronics', status: 'Pending', amount: 12500 },
    { id: 2, date: '2023-05-14', supplier: 'XYZ Manufacturing', status: 'Processing', amount: 8750 },
    { id: 3, date: '2023-05-12', supplier: 'Global Supplies Inc.', status: 'Completed', amount: 15200 },
    { id: 4, date: '2023-05-10', supplier: 'Tech Components Ltd.', status: 'Completed', amount: 6300 },
  ],
  alerts: [
    { id: 1, message: 'Low stock alert: Microprocessor A1', severity: 'warning' },
    { id: 2, message: 'Order #1042 is delayed', severity: 'error' },
    { id: 3, message: 'New supplier approval pending', severity: 'info' },
  ]
};

const Dashboard = () => {
  const { currentUser, logActivity } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Log dashboard view activity
    logActivity('view', { page: 'dashboard' });
    
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await axios.get('/api/dashboard');
        // setDashboardData(response.data);
        
        // Using mock data for demonstration
        setTimeout(() => {
          setDashboardData(mockData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [logActivity]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Welcome back, {currentUser?.name || 'User'}!
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InventoryIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Inventory
              </Typography>
            </Box>
            <Typography variant="h4" component="div">
              {dashboardData.inventorySummary.totalItems}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dashboardData.inventorySummary.lowStock} items low in stock
            </Typography>
            <Typography variant="body2" color="error">
              {dashboardData.inventorySummary.outOfStock} items out of stock
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <OrderIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Orders
              </Typography>
            </Box>
            <Typography variant="h4" component="div">
              {dashboardData.ordersSummary.pending + dashboardData.ordersSummary.processing}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dashboardData.ordersSummary.pending} pending
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dashboardData.ordersSummary.processing} processing
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SupplierIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Suppliers
              </Typography>
            </Box>
            <Typography variant="h4" component="div">
              {dashboardData.suppliersSummary.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dashboardData.suppliersSummary.active} active suppliers
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AlertIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Alerts
              </Typography>
            </Box>
            <Typography variant="h4" component="div">
              {dashboardData.alerts.length}
            </Typography>
            <Typography variant="body2" color="error">
              {dashboardData.alerts.filter(a => a.severity === 'error').length} critical alerts
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Orders and Alerts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Recent Orders" />
            <Divider />
            <CardContent>
              <List>
                {dashboardData.recentOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <ListItem>
                      <ListItemText
                        primary={`Order #${order.id} - ${order.supplier}`}
                        secondary={
                          <React.Fragment>
                            <Typography component="span" variant="body2" color="text.primary">
                              ${order.amount.toLocaleString()}
                            </Typography>
                            {` — ${order.date} (${order.status})`}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Alerts" />
            <Divider />
            <CardContent>
              <List>
                {dashboardData.alerts.map((alert) => (
                  <React.Fragment key={alert.id}>
                    <ListItem>
                      <ListItemText
                        primary={alert.message}
                        secondary={alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                        primaryTypographyProps={{
                          color: alert.severity === 'error' ? 'error' : 'inherit'
                        }}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;