import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const ForecastingDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Forecasting Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Demand Forecasting
            </Typography>
            <Typography>
              Forecasting dashboard is under development. Check back soon for demand prediction and inventory optimization features.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ForecastingDashboard;