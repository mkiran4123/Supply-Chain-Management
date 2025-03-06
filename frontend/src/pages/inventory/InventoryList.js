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
  CircularProgress
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

// Mock data - in a real app, this would come from API calls
const mockInventoryData = [
  { id: 1, product_name: 'Microprocessor A1', description: 'High-performance CPU', quantity: 150, unit_price: 89.99, category: 'Electronics', location: 'Warehouse A' },
  { id: 2, product_name: 'RAM Module 8GB', description: 'DDR4 Memory', quantity: 200, unit_price: 45.50, category: 'Electronics', location: 'Warehouse A' },
  { id: 3, product_name: 'SSD 500GB', description: 'Solid State Drive', quantity: 75, unit_price: 120.00, category: 'Storage', location: 'Warehouse B' },
  { id: 4, product_name: 'Graphics Card X2', description: 'Gaming GPU', quantity: 30, unit_price: 350.00, category: 'Electronics', location: 'Warehouse A' },
  { id: 5, product_name: 'Motherboard Z490', description: 'ATX Form Factor', quantity: 45, unit_price: 180.00, category: 'Electronics', location: 'Warehouse C' },
  { id: 6, product_name: 'Power Supply 750W', description: 'Modular PSU', quantity: 60, unit_price: 95.00, category: 'Power', location: 'Warehouse B' },
  { id: 7, product_name: 'CPU Cooler', description: 'Liquid cooling system', quantity: 25, unit_price: 120.00, category: 'Cooling', location: 'Warehouse A' },
  { id: 8, product_name: 'Case Mid-Tower', description: 'Computer case', quantity: 40, unit_price: 85.00, category: 'Accessories', location: 'Warehouse C' },
  { id: 9, product_name: 'Monitor 27"', description: '4K IPS Display', quantity: 20, unit_price: 299.99, category: 'Displays', location: 'Warehouse D' },
  { id: 10, product_name: 'Keyboard Mechanical', description: 'RGB Gaming Keyboard', quantity: 35, unit_price: 110.00, category: 'Peripherals', location: 'Warehouse D' },
];

const InventoryList = () => {
  const navigate = useNavigate();
  const { logActivity, hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [inventoryData, setInventoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    product_name: '',
    description: '',
    quantity: 0,
    unit_price: 0,
    category: '',
    location: ''
  });

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

  useEffect(() => {
    // Log inventory view activity
    logActivity('view', { page: 'inventory-list' });
    
    // Simulate API call to fetch inventory data
    const fetchInventoryData = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await axios.get('/api/inventory');
        // setInventoryData(response.data);
        
        // Using mock data for demonstration
        setTimeout(() => {
          setInventoryData(mockInventoryData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, [logActivity]);

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

  const handleDelete = (id) => {
    // In a real app, this would be an API call to delete the item
    // For now, just filter it out from the local state
    setInventoryData(inventoryData.filter(item => item.id !== id));
    logActivity('delete', { entity: 'inventory', id });
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

  const handleAddItem = () => {
    // In a real app, this would be an API call to add the item
    const newItemWithId = {
      ...newItem,
      id: inventoryData.length > 0 ? Math.max(...inventoryData.map(item => item.id)) + 1 : 1
    };
    
    setInventoryData([...inventoryData, newItemWithId]);
    logActivity('create', { entity: 'inventory', id: newItemWithId.id });
    handleAddDialogClose();
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
    </Box>
  );
};

export default InventoryList;