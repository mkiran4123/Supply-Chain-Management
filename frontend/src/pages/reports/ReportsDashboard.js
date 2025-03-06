import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import FilterListIcon from '@mui/icons-material/FilterList';

// Sample data for charts
const inventoryData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

const orderData = [
  { name: 'Jan', completed: 400, pending: 240, cancelled: 20 },
  { name: 'Feb', completed: 300, pending: 139, cancelled: 15 },
  { name: 'Mar', completed: 200, pending: 980, cancelled: 30 },
  { name: 'Apr', completed: 278, pending: 390, cancelled: 25 },
  { name: 'May', completed: 189, pending: 480, cancelled: 10 },
  { name: 'Jun', completed: 239, pending: 380, cancelled: 18 },
];

const supplierData = [
  { name: 'On-Time', value: 70 },
  { name: 'Late', value: 20 },
  { name: 'Early', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ReportsDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('month');
  const [reportType, setReportType] = useState('all');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };

  const exportReport = () => {
    alert('Report exported to CSV');
    // Implementation for actual export would go here
  };

  const printReport = () => {
    window.print();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reports & Analytics
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />} 
            sx={{ mr: 1 }}
            onClick={exportReport}
          >
            Export
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />}
            onClick={printReport}
          >
            Print
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterListIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Filters</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={handleTimeRangeChange}
              >
                <MenuItem value="day">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
                <MenuItem value="quarter">This Quarter</MenuItem>
                <MenuItem value="year">This Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={handleReportTypeChange}
              >
                <MenuItem value="all">All Reports</MenuItem>
                <MenuItem value="inventory">Inventory</MenuItem>
                <MenuItem value="orders">Orders</MenuItem>
                <MenuItem value="suppliers">Suppliers</MenuItem>
                <MenuItem value="logistics">Logistics</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="report tabs">
          <Tab label="Dashboard" />
          <Tab label="KPI Reports" />
          <Tab label="Ad-hoc Reports" />
          <Tab label="Audit Trails" />
        </Tabs>
      </Box>

      {/* Dashboard Tab */}
      {tabValue === 0 && (
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            {/* KPI Summary Cards */}
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Inventory Value
                  </Typography>
                  <Typography variant="h4">$1,234,567</Typography>
                  <Typography color="textSecondary" sx={{ fontSize: 14 }}>
                    +5.3% from last month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Order Fulfillment Rate
                  </Typography>
                  <Typography variant="h4">94.7%</Typography>
                  <Typography color="textSecondary" sx={{ fontSize: 14 }}>
                    +2.1% from last month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Supplier On-Time Delivery
                  </Typography>
                  <Typography variant="h4">87.2%</Typography>
                  <Typography color="textSecondary" sx={{ fontSize: 14 }}>
                    -1.5% from last month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Average Order Value
                  </Typography>
                  <Typography variant="h4">$12,345</Typography>
                  <Typography color="textSecondary" sx={{ fontSize: 14 }}>
                    +3.7% from last month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Charts */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Inventory Levels" />
                <Divider />
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={inventoryData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Order Status" />
                <Divider />
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={orderData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" fill="#8884d8" />
                      <Bar dataKey="pending" fill="#82ca9d" />
                      <Bar dataKey="cancelled" fill="#ff8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Supplier Delivery Performance" />
                <Divider />
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={supplierData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {supplierData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Top Performing Products" />
                <Divider />
                <CardContent>
                  <Typography variant="body2" color="textSecondary" component="p" sx={{ mb: 2 }}>
                    Products ranked by sales volume and profitability
                  </Typography>
                  {[
                    { id: 1, name: 'Product A', sales: '$123,456', profit: '+24%' },
                    { id: 2, name: 'Product B', sales: '$98,765', profit: '+18%' },
                    { id: 3, name: 'Product C', sales: '$87,654', profit: '+15%' },
                    { id: 4, name: 'Product D', sales: '$76,543', profit: '+12%' },
                    { id: 5, name: 'Product E', sales: '$65,432', profit: '+10%' },
                  ].map((product) => (
                    <Box key={product.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
                      <Typography variant="body1">{product.name}</Typography>
                      <Box>
                        <Typography variant="body2" component="span" sx={{ mr: 2 }}>{product.sales}</Typography>
                        <Typography variant="body2" component="span" color="success.main">{product.profit}</Typography>
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* KPI Reports Tab */}
      {tabValue === 1 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>KPI Reports</Typography>
          <Typography variant="body1">
            This section will contain detailed KPI reports with metrics like inventory turnover, 
            order cycle time, supplier performance, and more.
          </Typography>
        </Box>
      )}

      {/* Ad-hoc Reports Tab */}
      {tabValue === 2 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Ad-hoc Reports</Typography>
          <Typography variant="body1">
            This section will allow users to create custom reports by selecting dimensions, 
            metrics, and filters according to their specific needs.
          </Typography>
        </Box>
      )}

      {/* Audit Trails Tab */}
      {tabValue === 3 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Audit Trails</Typography>
          <Typography variant="body1">
            This section will display system activity logs, user actions, and data changes 
            for compliance and security purposes.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ReportsDashboard;