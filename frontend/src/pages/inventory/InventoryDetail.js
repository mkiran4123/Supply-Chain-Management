import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  InputAdornment,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link
} from '@mui/material';
import { 
  Save as SaveIcon, 
  ArrowBack as ArrowBackIcon,
  Inventory as InventoryIcon 
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Mock data - in a real app, this would come from API calls
const mockInventoryData = [
  { id: 1, product_name: 'Microprocessor A1', description: 'High-performance CPU', quantity: 150, unit_price: 89.99, category: 'Electronics', location: 'Warehouse A', last_updated: '2023-05-10T14:30:00Z' },
  { id: 2, product_name: 'RAM Module 8GB', description: 'DDR4 Memory', quantity: 200, unit_price: 45.50, category: 'Electronics', location: 'Warehouse A', last_updated: '2023-05-09T11:20:00Z' },
  { id: 3, product_name: 'SSD 500GB', description: 'Solid State Drive', quantity: 75, unit_price: 120.00, category: 'Storage', location: 'Warehouse B', last_updated: '2023-05-08T09:15:00Z' },
];

const InventoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logActivity, hasRole } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [inventoryItem, setInventoryItem] = useState(null);
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    quantity: 0,
    unit_price: 0,
    category: '',
    location: ''
  });

  useEffect(() => {
    // Log inventory detail view activity
    logActivity('view', { page: 'inventory-detail', id });
    
    // Simulate API call to fetch inventory item data
    const fetchInventoryItem = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await axios.get(`/api/inventory/${id}`);
        // setInventoryItem(response.data);
        // setFormData(response.data);
        
        // Using mock data for demonstration
        setTimeout(() => {
          const item = mockInventoryData.find(item => item.id === parseInt(id));
          if (item) {
            setInventoryItem(item);
            setFormData(item);
          } else {
            setError('Inventory item not found');
          }
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching inventory item:', error);
        setError('Failed to load inventory item');
        setLoading(false);
      }
    };

    fetchInventoryItem();
  }, [id, logActivity]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' || name === 'unit_price' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      // In a real app, this would be an API call
      // await axios.put(`/api/inventory/${id}`, formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setInventoryItem(formData);
      setSuccess(true);
      logActivity('update', { entity: 'inventory', id });
    } catch (error) {
      console.error('Error updating inventory item:', error);
      setError('Failed to update inventory item');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/inventory');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !inventoryItem) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Inventory
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
          <InventoryIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Inventory
        </Link>
        <Typography color="text.primary">{formData.product_name}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Inventory Item Details
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Inventory item updated successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="product_name"
                label="Product Name"
                fullWidth
                value={formData.product_name}
                onChange={handleInputChange}
                required
                disabled={saving || !hasRole('manager')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="category"
                label="Category"
                fullWidth
                value={formData.category}
                onChange={handleInputChange}
                disabled={saving || !hasRole('manager')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                disabled={saving || !hasRole('manager')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                fullWidth
                value={formData.quantity}
                onChange={handleInputChange}
                required
                InputProps={{ inputProps: { min: 0 } }}
                disabled={saving || !hasRole('user')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="unit_price"
                label="Unit Price"
                type="number"
                fullWidth
                value={formData.unit_price}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0, step: 0.01 }
                }}
                disabled={saving || !hasRole('manager')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="location"
                label="Location"
                fullWidth
                value={formData.location}
                onChange={handleInputChange}
                disabled={saving || !hasRole('user')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Updated"
                fullWidth
                value={new Date(inventoryItem.last_updated).toLocaleString()}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  startIcon={<SaveIcon />}
                  disabled={saving || !hasRole('user')}
                  sx={{ ml: 2 }}
                >
                  {saving ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default InventoryDetail;