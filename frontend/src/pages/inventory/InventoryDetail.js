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
import { inventoryAPI } from '../../services/api';



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
    
    // Fetch inventory item data from API
    const fetchInventoryItem = async () => {
      try {
        const item = await inventoryAPI.getById(parseInt(id));
        setInventoryItem(item);
        setFormData(item);
        setLoading(false);
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
      // Update inventory item via API
      const updatedItem = await inventoryAPI.update(parseInt(id), formData);
      
      // Update local state
      setInventoryItem(updatedItem);
      setFormData(updatedItem);
      setSuccess(true);
      logActivity('update', { entity: 'inventory', id });
    } catch (error) {
      console.error('Error updating inventory item:', error);
      setError('Failed to update inventory item: ' + (error.response?.data?.detail || error.message));
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