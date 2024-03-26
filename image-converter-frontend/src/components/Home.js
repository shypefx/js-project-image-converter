import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Grid } from '@mui/material';
import AppAppBar from './navbar/AppAppBar';
import ConversionHistoryGrid from './ConvertionHistoryGrid';

const Home = () => {
  return (
    <div className="home-container">
      <AppAppBar/>
      <div style={{ marginTop: '200px' }}></div>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} textAlign="center">
          <Typography variant="h3" fontFamily={'Roboto'}  gutterBottom>Welcome to the Image Converter!</Typography>
          <Typography variant="body1" gutterBottom>Convert your images to different formats with ease.</Typography>
          <Link to="/convert">
            <Button variant="contained" color="primary">Convert Images</Button>
          </Link>
        </Grid>
        <ConversionHistoryGrid></ConversionHistoryGrid>
      </Grid>
    </div>
  );
};

export default Home;
