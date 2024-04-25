import React from 'react';
import Carousel from './models/Carousel'; // Import your Carousel component
import { Button, Typography, Grid } from '@mui/material';
import AppAppBar from './navbar/AppAppBar';

const HistoryPage = () => {
  return (
    <div className="container">
      <AppAppBar></AppAppBar>
      <div style={{ marginTop: '100px' }}></div>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} textAlign="center">
            <h1 className="text-center">History</h1>
            <Carousel />
          </Grid>
      </Grid>
    </div>
  );
};

export default HistoryPage;
