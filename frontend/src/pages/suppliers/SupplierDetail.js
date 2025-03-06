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
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Rating
} from '@mui/material';
import { 
  Save as SaveIcon, 
  ArrowBack as ArrowBackIcon,
  Business as BusinessIcon 
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

// Mock data - in a real app, this would come from API calls
const mockSupplierData = [
  { 
    id: 1, 
    name: 'Tech Components Inc', 
    contact_person: 'John Smith',
    email: 'john.smith@techcomp.com',
    phone: '+1-555-0123',
    address: '123 Tech Park, Silicon Valley, CA',
    rating: 4.5,
    certification: 'ISO 9001:2015',
    performance_score: 92,
    last_delivery_date: '2023-05-10T14:30:00Z',
    payment_terms: 'Net 30'
  },
  { 
    id: 2, 
    name: 'Global Electronics Ltd', 
    contact_person: 'Sarah Johnson',
    email: 'sarah.j@globalelec.com',
    phone: '+1-555-0124',
    address: '456 Industrial Ave, Boston, MA',
    rating: 4.0,
    certification: 'ISO 14001:2015',
    performance_score: 88,
    last_delivery_date: '2023-05-09T11:20:00Z',
    payment_terms: 'Net 45'
  }
];

const SupplierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logActivity, hasRole } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [supplier, setSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    rating: 0,
    certification: '',
    performance_score: 0,
    payment_terms: ''
  });

  useEffect(() => {
    // Log supplier detail view activity
    logActivity('view', { page: 'supplier-detail', id });
    
    // Simulate API call to fetch supplier data
    const fetchSupplier = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await axios.get(`/api/suppliers/${id}`);
        // setSupplier(response.data);
        // setFormData(response.data);
        
        // Using mock data for demonstration
        setTimeout(() => {
          const item = mockSupplierData.find(item => item.id === parseInt(id));
          if (item) {
            setSupplier(item);
            setFormData(item);
          } else {
            setError('Supplier not found');
          }
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching supplier:', error);
        setError('Failed to load supplier');
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id, logActivity]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'performance_score' ? parseFloat(value) : value
    });
  };

  const handleRatingChange = (event, newValue) => {
    setFormData({
      ...formData,
      rating: newValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      // In a real app, this would be an API call
      // await axios.put(`/api/suppliers/${id}`, formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setSupplier(formData);
      setSuccess(true);
      logActivity('update', { entity: 'supplier', id });
    } catch (error) {
      console.error('Error updating supplier:', error);
      setError('Failed to update supplier');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/suppliers');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !supplier) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Back to Suppliers
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
          <BusinessIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Suppliers
        </Link>
        <Typography color="text.primary">{formData.name}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Supplier Details
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
          Supplier updated successfully!
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
                name="name"
                label="Supplier Name"
                fullWidth
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={saving || !hasRole('manager')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="contact_person"
                label="Contact Person"
                fullWidth
                value={formData.contact_person}
                onChange={handleInputChange}
                required
                disabled={saving || !hasRole('manager')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={saving || !hasRole('manager')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={handleInputChange}
                required
                disabled={saving || !hasRole('manager')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                multiline
                rows={2}
                value={formData.address}
                onChange={handleInputChange}
                required
                disabled={saving || !hasRole('manager')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography component="legend">Supplier Rating</Typography>
                <Rating
                  name="rating"
                  value={formData.rating}
                  precision={0.5}
                  onChange={handleRatingChange}
                  disabled={saving || !hasRole('manager')}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="certification"
                label="Certifications"
                fullWidth
                value={formData.certification}
                onChange={handleInputChange}
                disabled={saving || !hasRole('manager')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="performance_score"
                label="Performance Score"
                type="number"
                fullWidth
                value={formData.performance_score}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                disabled={saving || !hasRole('manager')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="payment_terms"
                label="Payment Terms"
                fullWidth
                value={formData.payment_terms}
                onChange={handleInputChange}
                disabled={saving || !hasRole('manager')}
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
                  disabled={saving || !hasRole('manager')}
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

export default SupplierDetail;