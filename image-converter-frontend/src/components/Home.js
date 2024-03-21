import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Grid } from '@mui/material';
import Carousel from './Carousel'; // Replace with your Carousel component
import AppAppBar from './navbar/AppAppBar';
// Style
import '../style/home.css'; // Import your Home page styles


const Home = () => {
  const [latestImages, setLatestImages] = useState([]);

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
      </Grid>

      <div className="latest-images">
        <Typography variant="h3" gutterBottom>Latest Converted Images</Typography>
        <Carousel images={latestImages} />
      </div>
    </div>
  );
};

export default Home;
