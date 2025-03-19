import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon, 
  ShoppingCart as OrderIcon, 
  People as SupplierIcon, 
  Assessment as ReportIcon,
  Timeline as ForecastIcon,
  LocalShipping as LogisticsIcon,
  Recommend as RecommendIcon,
  SmartToy as ChatbotIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole, logActivity } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
    { text: 'Orders', icon: <OrderIcon />, path: '/orders' },
    { text: 'Suppliers', icon: <SupplierIcon />, path: '/suppliers' },
    { text: 'Forecasting', icon: <ForecastIcon />, path: '/forecasting', role: 'manager' },
    { text: 'Logistics', icon: <LogisticsIcon />, path: '/logistics' },
    { text: 'Reports', icon: <ReportIcon />, path: '/reports' },
    { text: 'Supplier Recommendation', icon: <RecommendIcon />, path: '/supplier-recommendation' },
    { text: 'AI Assistant', icon: <ChatbotIcon />, path: '/ai-assistant' },
  ];

  const handleNavigation = (path, text) => {
    logActivity('navigation', { from: location.pathname, to: path });
    navigate(path);
    
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 600) {
      setOpen(false);
    }
  };

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.role) return true; // No role restriction
    return hasRole(item.role);
  });

  const drawer = (
    <>
      <Toolbar />
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => handleNavigation(item.path, item.text)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.12)',
                },
              },
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            transition: theme => theme.transitions.create(['width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            ...(!open && {
              width: 0,
              overflowX: 'hidden',
              transition: theme => theme.transitions.create(['width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }),
          },
        }}
        open={open}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;