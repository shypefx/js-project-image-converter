import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@mui/material';

const ConversionHistoryGrid = () => {
  const [conversionHistories, setConversionHistories] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchConversionHistories();
  }, [page]);

  const fetchConversionHistories = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/latest-images?page=${page}&limit=${itemsPerPage}`);
      if (response.ok) {
        const data = await response.json();
        setConversionHistories(data);
      } else {
        console.error('Failed to fetch conversion histories');
      }
    } catch (error) {
      console.error('Error fetching conversion histories:', error);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <>
  <Grid container spacing={2} justifyContent="center">
    {conversionHistories.map(history => (
      <Grid key={history.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
        <img 
          src={`http://localhost:5000` + history.imageUrl} 
          alt={`Converted Image ${history.id}`} 
          style={{ width: '200px', height: 'auto', display: 'block', margin: '0 auto', marginBottom: '10px' }} 
        />
      </Grid>
    ))}
  </Grid>
  <div style={{ marginTop: '20px', textAlign: 'center' }}>
    <Button disabled={page === 1} onClick={handlePrevPage} style={{ marginRight: '10px' }}>Previous</Button>
    <Button onClick={handleNextPage}>Next</Button>
  </div>
</>
  );
};

export default ConversionHistoryGrid;
