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
  Select
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Mock data - in a real app, this would come from API calls
const mockOrdersData = [
  { id: 1, order_date: '2023-05-15T10:30:00Z', status: 'pending', total_amount: 12500, supplier_name: 'ABC Electronics', items_count: 5 },
  { id: 2, order_date: '2023-05-14T09:15:00Z', status: 'processing', total_amount: 8750, supplier_name: 'XYZ Manufacturing', items_count: 3 },
  { id: 3, order_date: '2023-05-12T14:45:00Z', status: 'completed', total_amount: 15200, supplier_name: 'Global Supplies Inc.', items_count: 7 },
  { id: 4, order_date: '2023-05-10T11:20:00Z', status: 'completed', total_amount: 6300, supplier_name: 'Tech Components Ltd.', items_count: 2 },
  { id: 5, order_date: '2023-05-08T16:00:00Z', status: 'cancelled', total_amount: 4500, supplier_name: 'Acme Supplies', items_count: 4 },
  { id: 6, order_date: '2023-05-05T13:10:00Z', status: 'completed', total_amount: 9800, supplier_name: 'ABC Electronics', items_count: 6 },
  { id: 7, order_date: '2023-05-03T10:45:00Z', status: 'completed', total_amount: 7200, supplier_name: 'XYZ Manufacturing', items_count: 3 },
  { id: 8, order_date: '2023-05-01T09:30:00Z', status: 'completed', total_amount: 11000, supplier_name: 'Global Supplies Inc.', items_count: 5 },
];

const mockSuppliersData = [
  { id: 1, name: 'ABC Electronics', contact_name: 'John Smith', email: 'john@abcelectronics.com' },
  { id: 2, name: 'XYZ Manufacturing', contact_name: 'Jane Doe', email: 'jane@xyzmanufacturing.com' },
  { id: 3, name: 'Global Supplies Inc.', contact_name: 'Robert Johnson', email: 'robert@globalsupplies.com' },
  { id: 4, name: 'Tech Components Ltd.', contact_name: 'Sarah Williams', email: 'sarah@techcomponents.com' },
  { id: 5, name: 'Acme Supplies', contact_name: 'Michael Brown', email: 'michael@acmesupplies.com' },
];

const mockInventoryData = [
  { id: 1, product_name: 'Microprocessor A1', unit_price: 89.99, quantity_available: 150 },
  { id: 2, product_name: 'RAM Module 8GB', unit_price: 45.50, quantity_available: 200 },
  { id: 3, product_name: 'SSD 500GB', unit_price: 120.00, quantity_available: 75 },
  { id: 4, product_name: 'Graphics Card X2', unit_price: 350.00, quantity_available: 30 },
  { id: 5, product_name: 'Motherboard Z490', unit_price: 180.00, quantity_available: 45 },
];

const OrdersList = () => {
  const navigate = useNavigate();
  const { logActivity, hasRole } = useAuth();
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

  useEffect(() => {
    // Log orders view activity
    logActivity('view', { page: 'orders-list' });
    
    // Simulate API calls to fetch orders data, suppliers, and inventory
    const fetchData = async () => {
      try {
        // In a real app, these would be API calls
        // const ordersResponse = await axios.get('/api/orders');
        // const suppliersResponse = await axios.get('/api/suppliers');
        // const inventoryResponse = await axios.get('/api/inventory');
        
        // Using mock data for demonstration
        setTimeout(() => {
          setOrdersData(mockOrdersData);
          setSuppliers(mockSuppliersData);
          setInventory(mockInventoryData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
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
    logActivity('navigate', { to: `order-edit`, id });
    navigate(`/orders/${id}/edit`);
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
    // Validate item
    if (!currentItem.inventory_id || currentItem.quantity <= 0) return;
    
    const selectedItem = inventory.find(item => item.id === parseInt(currentItem.inventory_id));
    
    // Add item to order
    setNewOrder(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          ...currentItem,
          product_name: selectedItem.product_name,
          total: currentItem.quantity * currentItem.unit_price
        }
      ]
    }));
    
    // Reset current item
    setCurrentItem({
      inventory_id: '',
      quantity: 1,
      unit_price: 0
    });
  };

  const handleRemoveItem = (index) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleCreateOrder = () => {
    // Validate order
    if (!newOrder.supplier_id || newOrder.items.length === 0) return;
    
    // Calculate total amount
    const totalAmount = newOrder.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    
    // In a real app, this would be an API call to create the order
    const newOrderWithId = {
      ...newOrder,
      id: ordersData.length > 0 ? Math.max(...ordersData.map(order => order.id)) + 1 : 1,
      order_date: new Date().toISOString(),
      total_amount: totalAmount,
      supplier_name: suppliers.find(s => s.id === parseInt(newOrder.supplier_id))?.name,
      items_count: newOrder.items.length
    };
    
    setOrdersData([newOrderWithId, ...ordersData]);
    logActivity('create', { entity: 'order', id: newOrderWithId.id });
    handleNewOrderDialogClose();
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
          disabled={!hasRole('user')}
        >
          New Order
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
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
            sx={{ flexGrow: 1 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <DataGrid
          rows={filteredOrders}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
          checkboxSelection
          disableSelectionOnClick
          autoHeight
          components={{
            Toolbar: GridToolbar,
          }}
          sx={{ minHeight: 400 }}
        />
      </Paper>

      {/* New Order Dialog */}
      <Dialog open={openNewOrderDialog} onClose={handleNewOrderDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Create New Order</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="supplier-label">Supplier</InputLabel>
              <Select
                labelId="supplier-label"
                name="supplier_id"
                value={newOrder.supplier_id}
                label="Supplier"
                onChange={handleOrderInputChange}
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Order Items
            </Typography>

            {/* Add Item Form */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-end' }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="inventory-label">Product</InputLabel>
                <Select
                  labelId="inventory-label"
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
                label="Quantity"
                name="quantity"
                type="number"
                value={currentItem.quantity}
                onChange={handleItemInputChange}
                InputProps={{ inputProps: { min: 1 } }}
                sx={{ width: 120 }}
              />
              <TextField
                label="Unit Price"
                name="unit_price"
                type="number"
                value={currentItem.unit_price}
                InputProps={{ readOnly: true, startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                sx={{ width: 150 }}
              />
              <Button
                variant="contained"
                onClick={handleAddItem}
                disabled={!currentItem.inventory_id || currentItem.quantity <= 0}
              >
                Add Item
              </Button>
            </Box>

            {/* Items List */}
            {newOrder.items.length > 0 ? (
              <Paper sx={{ mt: 2 }}>
                <Box sx={{ p: 2 }}>
                  {newOrder.items.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, p: 1, borderBottom: '1px solid #eee' }}>
                      <Box>
                        <Typography variant="subtitle1">{item.product_name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.quantity} x ${item.unit_price.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ mr: 2 }}>
                          ${(item.quantity * item.unit_price).toFixed(2)}
                        </Typography>
                        <IconButton size="small" color="error" onClick={() => handleRemoveItem(index)}>
                          <span>×</span>
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                    <Typography variant="h6">
                      Total: ${newOrder.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
                No items added yet. Add items to create an order.
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewOrderDialogClose}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateOrder}
            disabled={!newOrder.supplier_id || newOrder.items.length === 0}
          >
            Create Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersList;