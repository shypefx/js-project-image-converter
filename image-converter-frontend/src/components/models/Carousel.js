import React, { useState, useEffect } from 'react';
import { IconButton, Slide, Stack } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Card from './Card'; // Import your Card component

const Carousel = () => {
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [slideDirection, setSlideDirection] = useState('left');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/latest-images');
        if (response.ok) {
          const data = await response.json();
          setCards(data);
        } else {
          console.error('Failed to fetch images');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    setSlideDirection('left');
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setSlideDirection('right');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '80%', maxWidth: '1000px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
        <IconButton onClick={handlePrevPage} disabled={currentPage === 0}>
        <NavigateBeforeIcon />
      </IconButton>
          {cards.slice(currentPage * 4, (currentPage + 1) * 4).map((card, index) => (
            <Slide key={index} direction={slideDirection} in>
              <div style={{ width: '25%', minWidth: '200px', padding: '10px' }}> {/* 4 images per line */}
                {/* Render the Card component */}
                <Card key={index} imageUrl={card.imageUrl} imageDate={card.updatedAt.substring(0, 10)} imageSize={card.imageSize} />
              </div>
            </Slide>
          ))}
                <IconButton
        onClick={handleNextPage}
        disabled={currentPage === Math.ceil(cards.length / 4) - 1}
      >
        <NavigateNextIcon />
      </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
