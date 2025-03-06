import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';

// Layout components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

// Page components
import Dashboard from './pages/Dashboard';
import InventoryList from './pages/inventory/InventoryList';
import InventoryDetail from './pages/inventory/InventoryDetail';
import OrdersList from './pages/orders/OrdersList';
import OrderDetail from './pages/orders/OrderDetail';
import SuppliersList from './pages/suppliers/SuppliersList';
import SupplierDetail from './pages/suppliers/SupplierDetail';
import ForecastingDashboard from './pages/forecasting/ForecastingDashboard';
import LogisticsDashboard from './pages/logistics/LogisticsDashboard';
import ReportsDashboard from './pages/reports/ReportsDashboard';
import Login from './pages/auth/Login';

// Auth context
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <AuthProvider>
      <AppContent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </AuthProvider>
  );
}

// Separate component to use the auth context after it's been provided
function AppContent({ sidebarOpen, setSidebarOpen }) {
  const { currentUser } = useAuth();
  
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      {currentUser && <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
      {currentUser && <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: currentUser ? { sm: `calc(100% - ${sidebarOpen ? 240 : 0}px)` } : '100%',
          ml: currentUser ? { sm: sidebarOpen ? '240px' : 0 } : 0,
          transition: theme => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
          <Box sx={{ height: 64 }} /> {/* Toolbar spacer */}
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              
              {/* Inventory Routes */}
              <Route path="/inventory" element={<InventoryList />} />
              <Route path="/inventory/:id" element={<InventoryDetail />} />
              
              {/* Order Routes */}
              <Route path="/orders" element={<OrdersList />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              
              {/* Supplier Routes */}
              <Route path="/suppliers" element={<SuppliersList />} />
              <Route path="/suppliers/:id" element={<SupplierDetail />} />
              
              {/* Forecasting Routes */}
              <Route path="/forecasting" element={<ForecastingDashboard />} />
              
              {/* Logistics Routes */}
              <Route path="/logistics" element={<LogisticsDashboard />} />
              
              {/* Reports Routes */}
              <Route path="/reports" element={<ReportsDashboard />} />
            </Route>
            
            {/* Redirect to dashboard if path doesn't match */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
  );
}

export default App;