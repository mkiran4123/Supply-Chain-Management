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
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Import the API services
import { orderAPI, supplierAPI, inventoryAPI } from '../../services/api';


const OrdersList = () => {
  const navigate = useNavigate();
  const { logActivity } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ordersData, setOrdersData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openNewOrderDialog, setOpenNewOrderDialog] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [inventory, setInventory] = useState([]);
  
  // New order form state
  const [newOrder, setNewOrder] = useState({
    supplier_id: '',
    status: 'pending',
    items: []
  });
  
  // Current item being added
  const [currentItem, setCurrentItem] = useState({
    inventory_id: '',
    quantity: 1,
    unit_price: 0
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  // Define columns for the data grid
  const columns = [
    { field: 'id', headerName: 'Order ID', width: 100 },
    { 
      field: 'order_date', 
      headerName: 'Date', 
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
    { 
      field: 'supplier_name', 
      headerName: 'Supplier', 
      width: 200 
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 150,
      renderCell: (params) => {
        let color;
        switch (params.value) {
          case 'pending':
            color = 'warning';
            break;
          case 'processing':
            color = 'info';
            break;
          case 'completed':
            color = 'success';
            break;
          case 'cancelled':
            color = 'error';
            break;
          default:
            color = 'default';
        }
        return (
          <Chip 
            label={params.value.charAt(0).toUpperCase() + params.value.slice(1)} 
            color={color} 
            size="small" 
          />
        );
      },
    },
    { 
      field: 'items_count', 
      headerName: 'Items', 
      type: 'number',
      width: 100 
    },
    { 
      field: 'total_amount', 
      headerName: 'Total Amount', 
      type: 'number', 
      width: 150,
      valueFormatter: (params) => `$${params.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
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
              onClick={() => handleViewOrder(params.row.id)}
              size="small"
            >
              <ViewIcon />
            </IconButton>
            <IconButton 
              color="secondary" 
              onClick={() => handleEditOrder(params.row.id)}
              size="small"
              disabled={params.row.status === 'completed' || params.row.status === 'cancelled'}
            >
              <EditIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // Function to fetch orders data
  const fetchOrdersData = async () => {
    try {
      setLoading(true);
      // Fetch orders from the API
      const ordersResponse = await orderAPI.getAll();
      
      // Fetch suppliers from the API
      const suppliersResponse = await supplierAPI.getAll();
      
      // Process orders data to include supplier name and items count
      const processedOrders = ordersResponse.map(order => {
        const supplier = suppliersResponse.find(s => s.id === order.supplier_id);
        return {
          ...order,
          supplier_name: supplier ? supplier.name : 'Unknown Supplier',
          items_count: order.order_items ? order.order_items.length : 0
        };
      });
      
      setOrdersData(processedOrders);
      setSuppliers(suppliersResponse);
      
      logActivity('view', { page: 'orders-list', count: processedOrders.length });
    } catch (error) {
      console.error('Error fetching orders data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load orders data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch inventory data
  const fetchInventoryData = async () => {
    try {
      // Fetch inventory data from the API
      const inventoryResponse = await inventoryAPI.getAll();
      setInventory(inventoryResponse);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load inventory data',
        severity: 'error'
      });
    }
  };

  useEffect(() => {
    fetchOrdersData();
    fetchInventoryData();
  }, [logActivity]);

  // Filter orders data based on search term and status filter
  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = 
      order.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (id) => {
    logActivity('navigate', { to: `order-detail`, id });
    navigate(`/orders/${id}`);
  };

  const handleEditOrder = (id) => {
    logActivity('navigate', { to: `order-detail`, id });
    navigate(`/orders/${id}`);
  };

  const handleNewOrderDialogOpen = () => {
    setOpenNewOrderDialog(true);
  };

  const handleNewOrderDialogClose = () => {
    setOpenNewOrderDialog(false);
    setNewOrder({
      supplier_id: '',
      status: 'pending',
      items: []
    });
  };

  const handleOrderInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({
      ...newOrder,
      [name]: value
    });
  };

  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: name === 'quantity' ? parseInt(value) : value
    });
    
    // If inventory item is selected, set the unit price
    if (name === 'inventory_id') {
      const selectedItem = inventory.find(item => item.id === parseInt(value));
      if (selectedItem) {
        setCurrentItem(prev => ({
          ...prev,
          unit_price: selectedItem.unit_price
        }));
      }
    }
  };

  const handleAddItem = () => {
    // Find the inventory item to get its details
    const inventoryItem = inventory.find(item => item.id === parseInt(currentItem.inventory_id));
    
    if (!inventoryItem) return;
    
    const itemToAdd = {
      inventory_id: parseInt(currentItem.inventory_id),
      product_name: inventoryItem.product_name,
      quantity: parseInt(currentItem.quantity),
      unit_price: parseFloat(currentItem.unit_price || inventoryItem.unit_price)
    };
    
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, itemToAdd]
    });
    
    // Reset current item form
    setCurrentItem({
      inventory_id: '',
      quantity: 1,
      unit_price: 0
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const handleRemoveItem = (index) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const resetNewOrderForm = () => {
    setNewOrder({
      supplier_id: '',
      status: 'pending',
      items: []
    });
    setCurrentItem({
      inventory_id: '',
      quantity: 1,
      unit_price: 0
    });
  };

  const handleCreateOrder = async () => {
    try {
      // Prepare order data for API
      const orderData = {
        supplier_id: parseInt(newOrder.supplier_id),
        status: newOrder.status,
        items: newOrder.items.map(item => ({
          inventory_id: parseInt(item.inventory_id),
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.unit_price)
        }))
      };
      
      // Create order via API
      const createdOrder = await orderAPI.create(orderData);
      
      // Add supplier name for display
      const supplier = suppliers.find(s => s.id === parseInt(newOrder.supplier_id));
      const orderWithSupplierName = {
        ...createdOrder,
        supplier_name: supplier ? supplier.name : 'Unknown Supplier',
        items_count: createdOrder.order_items ? createdOrder.order_items.length : 0
      };
      
      setOrdersData([...ordersData, orderWithSupplierName]);
      setOpenNewOrderDialog(false);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Order created successfully',
        severity: 'success'
      });
      
      // Log activity
      logActivity('create', { entity: 'order', id: createdOrder.id });
      
      // Reset form
      resetNewOrderForm();
    } catch (error) {
      console.error('Error creating order:', error);
      setSnackbar({
        open: true,
        message: 'Failed to create order',
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
          Orders Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewOrderDialogOpen}
        >
          New Order
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            sx={{ flexGrow: 1 }}
            variant="outlined"
            placeholder="Search orders..."
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
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredOrders}
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
                sortModel: [{ field: 'order_date', sort: 'desc' }],
              },
            }}
          />
        </div>
      </Paper>

      {/* New Order Dialog */}
      <Dialog open={openNewOrderDialog} onClose={handleNewOrderDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Order</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="supplier-select-label">Supplier</InputLabel>
              <Select
                labelId="supplier-select-label"
                name="supplier_id"
                value={newOrder.supplier_id}
                label="Supplier"
                onChange={handleOrderInputChange}
                required
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Order Items
            </Typography>
            
            {/* Add item form */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-end' }}>
              <FormControl sx={{ flexGrow: 1 }}>
                <InputLabel id="inventory-select-label">Product</InputLabel>
                <Select
                  labelId="inventory-select-label"
                  name="inventory_id"
                  value={currentItem.inventory_id}
                  label="Product"
                  onChange={handleItemInputChange}
                >
                  {inventory.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.product_name} (${item.unit_price.toFixed(2)})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                value={currentItem.quantity}
                onChange={handleItemInputChange}
                InputProps={{ inputProps: { min: 1 } }}
                sx={{ width: 120 }}
              />
              <Button 
                variant="outlined" 
                onClick={handleAddItem}
                disabled={!currentItem.inventory_id || currentItem.quantity < 1}
              >
                Add
              </Button>
            </Box>

            {/* Items list */}
            {newOrder.items.length > 0 ? (
              <TableContainer component={Paper} sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {newOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.product_name}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">${item.unit_price.toFixed(2)}</TableCell>
                        <TableCell align="right">${(item.quantity * item.unit_price).toFixed(2)}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => handleRemoveItem(index)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                        Total:
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                        ${newOrder.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0).toFixed(2)}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info" sx={{ mb: 2 }}>No items added yet</Alert>
            )}

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                name="status"
                value={newOrder.status}
                label="Status"
                onChange={handleOrderInputChange}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewOrderDialogClose}>Cancel</Button>
          <Button 
            onClick={handleCreateOrder} 
            variant="contained" 
            disabled={!newOrder.supplier_id || newOrder.items.length === 0}
          >
            Create Order
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

export default OrdersList;