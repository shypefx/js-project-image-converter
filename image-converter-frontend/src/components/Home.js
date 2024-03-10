// Home.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageConverter from './converter/ImageConverter'; // Replace with your ImageConverter component
import Carousel from './Carousel'; // Replace with your Carousel component
import '../style/home.css'; // Import your Home page styles

const Home = () => {
  const [latestImages, setLatestImages] = useState([]);
  return (
    <div className="home-container">
      <div className="main-theme">
        <h2>Welcome to the Image Converter!</h2>
        <p>Convert your images to different formats with ease.</p>
        <Link to="/convert">
          <button>Get Started</button>
        </Link>
      </div>

      <div className="latest-images">
        <h2>Latest Converted Images</h2>
        <Carousel images={latestImages} />
      </div>
    </div>
  );
};

export default Home;
