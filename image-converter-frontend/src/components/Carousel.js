// Carousel.js
import React from 'react';
import '../style/carousel.css'; // Import your Carousel styles

const Carousel = ({ images }) => {
  return (
    <div className="carousel-container">
      {/* Your carousel implementation here */}
      {images.map((image, index) => (
        <div key={index} className="carousel-item">
          <img src={image.url} alt={`Converted Image ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default Carousel;
