import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LocalShipping as TruckIcon,
  Schedule as ScheduleIcon,
  Route as RouteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Mock data - in a real app, this would come from API calls
const mockLogisticsData = {
  activeDeliveries: 12,
  pendingShipments: 8,
  totalRoutes: 5,
  onTimeDeliveryRate: 94.5,
  recentDeliveries: [
    { id: 1, orderId: 'ORD-001', status: 'In Transit', destination: 'Warehouse A', eta: '2023-05-20T14:30:00Z' },
    { id: 2, orderId: 'ORD-002', status: 'Delivered', destination: 'Warehouse B', eta: '2023-05-19T16:45:00Z' },
    { id: 3, orderId: 'ORD-003', status: 'Pending', destination: 'Warehouse C', eta: '2023-05-21T09:15:00Z' },
  ]
};

const LogisticsDashboard = () => {
  const { logActivity } = useAuth();
  const [loading, setLoading] = useState(true);
  const [logisticsData, setLogisticsData] = useState(null);

  useEffect(() => {
    // Log dashboard view activity
    logActivity('view', { page: 'logistics-dashboard' });
    
    // Simulate API call to fetch logistics data
    const fetchLogisticsData = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await axios.get('/api/logistics/dashboard');
        // setLogisticsData(response.data);
        
        // Using mock data for demonstration
        setTimeout(() => {
          setLogisticsData(mockLogisticsData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching logistics data:', error);
        setLoading(false);
      }
    };

    fetchLogisticsData();
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Logistics Dashboard
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton onClick={() => setLoading(true)}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TruckIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6" component="div">
                  Active Deliveries
                </Typography>
              </Box>
              <Typography variant="h4">{logisticsData.activeDeliveries}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ScheduleIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6" component="div">
                  Pending Shipments
                </Typography>
              </Box>
              <Typography variant="h4">{logisticsData.pendingShipments}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <RouteIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6" component="div">
                  Active Routes
                </Typography>
              </Box>
              <Typography variant="h4">{logisticsData.totalRoutes}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TruckIcon sx={{ mr: 1 }} color="primary" />
                <Typography variant="h6" component="div">
                  On-Time Delivery Rate
                </Typography>
              </Box>
              <Typography variant="h4">{logisticsData.onTimeDeliveryRate}%</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Deliveries */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Deliveries
            </Typography>
            <Grid container spacing={2}>
              {logisticsData.recentDeliveries.map((delivery) => (
                <Grid item xs={12} md={4} key={delivery.id}>
                  <Card>
                    <CardHeader
                      title={`Order ${delivery.orderId}`}
                      subheader={`Status: ${delivery.status}`}
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Destination: {delivery.destination}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ETA: {new Date(delivery.eta).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LogisticsDashboard;