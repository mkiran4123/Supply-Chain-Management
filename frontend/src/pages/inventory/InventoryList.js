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
  Snackbar,
  Alert
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { inventoryAPI } from '../../services/api';

// Note: We're now using the real API service imported from services/api.js
// instead of the mock data and mock API service

const InventoryList = () => {
  const navigate = useNavigate();
  const { logActivity, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [inventoryData, setInventoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [newItem, setNewItem] = useState({
    product_name: '',
    description: '',
    quantity: 0,
    unit_price: 0,
    category: '',
    location: ''
  });

  useEffect(() => {
    fetchInventoryData();
  }, [logActivity]);
  
  // Function to fetch inventory data
  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      // Using the real API service to fetch data from the database
      const data = await inventoryAPI.getAll();
      setInventoryData(data);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load inventory data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter inventory data based on search term
  const filteredInventory = inventoryData.filter(item => 
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id) => {
    logActivity('navigate', { to: `inventory-detail`, id });
    navigate(`/inventory/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await inventoryAPI.delete(id);
      // Refresh the inventory data after deletion
      fetchInventoryData();
      
      setSnackbar({
        open: true,
        message: 'Inventory item deleted successfully',
        severity: 'success'
      });
      
      logActivity('delete', { entity: 'inventory', id });
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete inventory item',
        severity: 'error'
      });
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setNewItem({
      product_name: '',
      description: '',
      quantity: 0,
      unit_price: 0,
      category: '',
      location: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: name === 'quantity' || name === 'unit_price' ? parseFloat(value) : value
    });
  };

  const handleAddItem = async () => {
    try {
      await inventoryAPI.create(newItem);
      // Refresh the inventory data after adding a new item
      fetchInventoryData();
      
      setSnackbar({
        open: true,
        message: 'Inventory item added successfully',
        severity: 'success'
      });
      
      logActivity('create', { entity: 'inventory' });
      handleAddDialogClose();
    } catch (error) {
      console.error('Error adding inventory item:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add inventory item',
        severity: 'error'
      });
    }
  };

  // Define columns for the data grid
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'product_name', headerName: 'Product Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'quantity', headerName: 'Quantity', type: 'number', width: 100 },
    { 
      field: 'unit_price', 
      headerName: 'Unit Price', 
      type: 'number', 
      width: 120,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
    },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'location', headerName: 'Location', width: 150 },
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
          Inventory Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddDialogOpen}
        >
          Add Item
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredInventory}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            checkboxSelection
            disableSelectionOnClick
            components={{
              Toolbar: GridToolbar,
            }}
            initialState={{
              sorting: {
                sortModel: [{ field: 'id', sort: 'asc' }],
              },
            }}
          />
        </div>
      </Paper>

      {/* Add Item Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Inventory Item</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              name="product_name"
              label="Product Name"
              fullWidth
              value={newItem.product_name}
              onChange={handleInputChange}
              required
            />
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={newItem.description}
              onChange={handleInputChange}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                fullWidth
                value={newItem.quantity}
                onChange={handleInputChange}
                required
                InputProps={{ inputProps: { min: 0 } }}
              />
              <TextField
                name="unit_price"
                label="Unit Price"
                type="number"
                fullWidth
                value={newItem.unit_price}
                onChange={handleInputChange}
                required
                InputProps={{ 
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                name="category"
                label="Category"
                fullWidth
                value={newItem.category}
                onChange={handleInputChange}
              />
              <TextField
                name="location"
                label="Location"
                fullWidth
                value={newItem.location}
                onChange={handleInputChange}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button 
            onClick={handleAddItem} 
            variant="contained" 
            disabled={!newItem.product_name || newItem.quantity < 0 || newItem.unit_price < 0}
          >
            Add Item
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

export default InventoryList;