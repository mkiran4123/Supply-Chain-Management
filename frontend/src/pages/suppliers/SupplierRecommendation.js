import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Slider,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Chip,
  LinearProgress,
  Avatar
} from '@mui/material';
import {
  Recommend as RecommendIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  VerifiedUser as QualityIcon,
  LocalShipping as DeliveryIcon,
  Security as ReliabilityIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { aiServices } from '../../services/aiServices';
import { useNavigate } from 'react-router-dom';

// Chart components
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const SupplierRecommendation = () => {
  const { logActivity } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [productCategory, setProductCategory] = useState('all');
  const [criteria, setCriteria] = useState({
    price: 0.25,
    quality: 0.25,
    delivery: 0.25,
    reliability: 0.25
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Colors for charts and UI elements
  const COLORS = {
    price: '#00C49F',
    quality: '#0088FE',
    delivery: '#FFBB28',
    reliability: '#FF8042',
    overall: '#8884d8'
  };

  useEffect(() => {
    // Log activity
    logActivity('view', { page: 'supplier-recommendation' });
    
    // Fetch recommendations
    fetchRecommendations();
  }, [logActivity, fetchRecommendations]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      
      // Get AI supplier recommendations
      const supplierRecommendations = await aiServices.getSupplierRecommendations({
        productCategory: productCategory !== 'all' ? productCategory : undefined,
        criteria
      });
      
      setRecommendations(supplierRecommendations);
      
      logActivity('ai_supplier_recommendation', { 
        category: productCategory,
        criteria: JSON.stringify(criteria)
      });
    } catch (error) {
      console.error('Error fetching supplier recommendations:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load supplier recommendations',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRecommendations = async () => {
    try {
      setLoading(true);
      
      // Get updated AI supplier recommendations
      const supplierRecommendations = await aiServices.getSupplierRecommendations({
        productCategory: productCategory !== 'all' ? productCategory : undefined,
        criteria
      });
      
      setRecommendations(supplierRecommendations);
      
      setSnackbar({
        open: true,
        message: 'Supplier recommendations updated successfully',
        severity: 'success'
      });
      
      logActivity('ai_supplier_recommendation_update', { 
        category: productCategory,
        criteria: JSON.stringify(criteria)
      });
    } catch (error) {
      console.error('Error updating supplier recommendations:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update supplier recommendations',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCriteriaChange = (criterion, value) => {
    setCriteria({
      ...criteria,
      [criterion]: value
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const handleViewSupplier = (supplierId) => {
    logActivity('navigate', { to: 'supplier-detail', id: supplierId });
    navigate(`/suppliers/${supplierId}`);
  };

  // Prepare data for radar chart
  const prepareRadarData = (supplier) => {
    return [
      { subject: 'Price', A: supplier.scores.price, fullMark: 100 },
      { subject: 'Quality', A: supplier.scores.quality, fullMark: 100 },
      { subject: 'Delivery', A: supplier.scores.delivery, fullMark: 100 },
      { subject: 'Reliability', A: supplier.scores.reliability, fullMark: 100 }
    ];
  };

  // Prepare data for comparison chart
  const prepareComparisonData = () => {
    // Take top 5 suppliers for comparison
    const topSuppliers = recommendations.slice(0, 5);
    
    return [
      {
        name: 'Price',
        ...topSuppliers.reduce((acc, supplier, index) => {
          acc[`supplier${index + 1}`] = supplier.scores.price;
          return acc;
        }, {})
      },
      {
        name: 'Quality',
        ...topSuppliers.reduce((acc, supplier, index) => {
          acc[`supplier${index + 1}`] = supplier.scores.quality;
          return acc;
        }, {})
      },
      {
        name: 'Delivery',
        ...topSuppliers.reduce((acc, supplier, index) => {
          acc[`supplier${index + 1}`] = supplier.scores.delivery;
          return acc;
        }, {})
      },
      {
        name: 'Reliability',
        ...topSuppliers.reduce((acc, supplier, index) => {
          acc[`supplier${index + 1}`] = supplier.scores.reliability;
          return acc;
        }, {})
      }
    ];
  };

  if (loading && recommendations.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom component="div" sx={{ display: 'flex', alignItems: 'center' }}>
        <RecommendIcon sx={{ mr: 1 }} /> AI-Powered Supplier Recommendations
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Recommendation Criteria</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Typography gutterBottom>Price Importance</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MoneyIcon sx={{ color: COLORS.price, mr: 1 }} />
              <Slider
                value={criteria.price}
                min={0}
                max={1}
                step={0.05}
                onChange={(e, value) => handleCriteriaChange('price', value)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                sx={{ color: COLORS.price }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography gutterBottom>Quality Importance</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <QualityIcon sx={{ color: COLORS.quality, mr: 1 }} />
              <Slider
                value={criteria.quality}
                min={0}
                max={1}
                step={0.05}
                onChange={(e, value) => handleCriteriaChange('quality', value)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                sx={{ color: COLORS.quality }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography gutterBottom>Delivery Importance</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DeliveryIcon sx={{ color: COLORS.delivery, mr: 1 }} />
              <Slider
                value={criteria.delivery}
                min={0}
                max={1}
                step={0.05}
                onChange={(e, value) => handleCriteriaChange('delivery', value)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                sx={{ color: COLORS.delivery }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography gutterBottom>Reliability Importance</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ReliabilityIcon sx={{ color: COLORS.reliability, mr: 1 }} />
              <Slider
                value={criteria.reliability}
                min={0}
                max={1}
                step={0.05}
                onChange={(e, value) => handleCriteriaChange('reliability', value)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                sx={{ color: COLORS.reliability }}
              />
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            onClick={handleUpdateRecommendations}
            startIcon={<RecommendIcon />}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Recommendations'}
          </Button>
        </Box>
      </Paper>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {/* Top Suppliers */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Top Recommended Suppliers
      </Typography>
      
      <Grid container spacing={3}>
        {recommendations.slice(0, 3).map((supplier, index) => (
          <Grid item xs={12} md={4} key={supplier.supplierId}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: COLORS.overall, mr: 2 }}>
                    <BusinessIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{supplier.supplierName}</Typography>
                    <Chip 
                      label={supplier.recommendation} 
                      color={supplier.scores.overall > 80 ? 'success' : supplier.scores.overall > 60 ? 'primary' : 'warning'}
                      size="small"
                    />
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body2" gutterBottom>
                  <strong>Contact:</strong> {supplier.contactPerson}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Email:</strong> {supplier.email}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Phone:</strong> {supplier.phone}
                </Typography>
                
                <Box sx={{ mt: 2, height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={prepareRadarData(supplier)}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name={supplier.supplierName}
                        dataKey="A"
                        stroke={COLORS.overall}
                        fill={COLORS.overall}
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" align="center">
                    Overall Score: {supplier.scores.overall}/100
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={supplier.scores.overall} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: supplier.scores.overall > 80 ? 'success.main' : 
                                supplier.scores.overall > 60 ? 'primary.main' : 'warning.main',
                      }
                    }}
                  />
                </Box>
                
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ mt: 2 }}
                  onClick={() => handleViewSupplier(supplier.supplierId)}
                >
                  View Supplier Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Comparison Chart */}
      {recommendations.length > 1 && (
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>Top Suppliers Comparison</Typography>
          <Box sx={{ height: 400, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={prepareComparisonData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {recommendations.slice(0, 5).map((supplier, index) => (
                  <Bar 
                    key={supplier.supplierId}
                    dataKey={`supplier${index + 1}`} 
                    name={supplier.supplierName}
                    fill={index === 0 ? COLORS.price : 
                          index === 1 ? COLORS.quality : 
                          index === 2 ? COLORS.delivery : 
                          index === 3 ? COLORS.reliability : COLORS.overall}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      )}
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SupplierRecommendation;