import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Rating,
  Snackbar,
  Alert
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Import the real supplier API service
import { supplierAPI } from '../../services/api';

const SuppliersList = () => {
  const navigate = useNavigate();
  const { logActivity, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [suppliersData, setSuppliersData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    rating: 0,
    certification: '',
    performance_score: 0,
    payment_terms: 'Net 30'
  });

  // Define columns for the data grid
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Supplier Name', width: 200 },
    { field: 'contact_person', headerName: 'Contact Person', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { 
      field: 'rating', 
      headerName: 'Rating', 
      width: 150,
      renderCell: (params) => (
        <Rating value={params.value} readOnly precision={0.5} size="small" />
      ),
    },
    { 
      field: 'performance_score', 
      headerName: 'Performance', 
      type: 'number', 
      width: 120,
      valueFormatter: (params) => `${params.value}%`,
    },
    { field: 'certification', headerName: 'Certification', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton 
              color="primary" 
              onClick={() => handleEdit(params.row.id)}
              size="small"
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              color="error" 
              onClick={() => handleDelete(params.row.id)}
              size="small"
              disabled={!hasRole('manager')}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    // Log suppliers view activity
    logActivity('view', { page: 'suppliers-list' });
    
    // Fetch suppliers data from API
    const fetchSuppliersData = async () => {
      try {
        setLoading(true);
        const data = await supplierAPI.getAll();
        setSuppliersData(data);
        logActivity('Viewed suppliers list', { count: data.length });
      } catch (error) {
        console.error('Error fetching suppliers data:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load supplier data',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliersData();
  }, [logActivity]);

  // Filter suppliers data based on search term
  const filteredSuppliers = suppliersData.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.certification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id) => {
    logActivity('navigate', { to: `supplier-detail`, id });
    navigate(`/suppliers/${id}`);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const handleDelete = async (id) => {
    try {
      await supplierAPI.delete(id);
      setSuppliersData(suppliersData.filter(supplier => supplier.id !== id));
      setSnackbar({
        open: true,
        message: 'Supplier deleted successfully',
        severity: 'success'
      });
      logActivity('delete', { entity: 'supplier', id });
    } catch (error) {
      console.error('Error deleting supplier:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete supplier',
        severity: 'error'
      });
    }
  };

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setNewSupplier({
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      rating: 0,
      certification: '',
      performance_score: 0,
      payment_terms: 'Net 30'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier({
      ...newSupplier,
      [name]: name === 'performance_score' ? parseFloat(value) : value
    });
  };

  const handleRatingChange = (event, newValue) => {
    setNewSupplier({
      ...newSupplier,
      rating: newValue
    });
  };

  const handleAddSupplier = async () => {
    try {
      const addedSupplier = await supplierAPI.create(newSupplier);
      setSuppliersData([...suppliersData, addedSupplier]);
      setSnackbar({
        open: true,
        message: 'Supplier added successfully',
        severity: 'success'
      });
      
      logActivity('create', { entity: 'supplier', id: addedSupplier.id });
      handleAddDialogClose();
    } catch (error) {
      console.error('Error adding supplier:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add supplier',
        severity: 'error'
      });
    }
  };

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
        <Typography variant="h4" gutterBottom component="div">
          Suppliers Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddDialogOpen}
          disabled={!hasRole('manager')}
        >
          Add Supplier
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredSuppliers}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
          components={{ Toolbar: GridToolbar }}
          density="standard"
        />
      </Paper>

      {/* Add Supplier Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Supplier</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Supplier Name"
              name="name"
              value={newSupplier.name}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Contact Person"
              name="contact_name"
              value={newSupplier.contact_name}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={newSupplier.email}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone"
              name="phone"
              value={newSupplier.phone}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Address"
              name="address"
              multiline
              rows={2}
              value={newSupplier.address}
              onChange={handleInputChange}
            />
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                name="rating"
                value={newSupplier.rating}
                onChange={handleRatingChange}
                precision={0.5}
              />
            </Box>
            <TextField
              fullWidth
              margin="normal"
              label="Certification"
              name="certification"
              value={newSupplier.certification}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Performance Score (%)"
              name="performance_score"
              type="number"
              InputProps={{ inputProps: { min: 0, max: 100 } }}
              value={newSupplier.performance_score}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Payment Terms"
              name="payment_terms"
              value={newSupplier.payment_terms}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button 
            onClick={handleAddSupplier} 
            variant="contained" 
            startIcon={<BusinessIcon />}
            disabled={!newSupplier.name || !newSupplier.email}
          >
            Add Supplier
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default SuppliersList;