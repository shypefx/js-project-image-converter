import React, { useState } from 'react';
import { Button, Container, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import App from '../../App';
import AppAppBar from '../navbar/AppAppBar';

const ImageConverter = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [conversionType, setConversionType] = useState('png');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleConversionTypeChange = (event) => {
    setConversionType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedImage) {
      alert('Please select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('conversionType', conversionType);

    try {
      const authToken = localStorage.getItem('token'); // Retrieve the token from localStorage
      const response = await fetch('http://localhost:5000/api/convert', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        // Handle successful conversion, e.g., display a success message
        alert('Image converted successfully!');
      } else {
        // Handle conversion failure, e.g., display an error message
        alert('Image conversion failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during image conversion:', error);
    }
  };

  const handleDisconnect = () => {
    // Remove authToken from localStorage
    localStorage.removeItem('authToken');
    // Redirect to the login page or perform any other necessary actions
    window.location.href = '/login';
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <AppAppBar />
      <Typography sx={{ pb: 20 }}></Typography>
      <Typography variant="h4" align="center" gutterBottom>Image Converter</Typography>
      <form onSubmit={handleSubmit}>
        <div>
          <FormControl sx={{ pb: 2 }} fullWidth>
            <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
          </FormControl>
        </div>
        <div>
          <FormControl sx={{ pb: 2 }} fullWidth>
            <InputLabel id="conversionTypeLabel">Choose conversion type:</InputLabel>
            <Select
              labelId="conversionTypeLabel"
              id="conversionType"
              value={conversionType}
              onChange={handleConversionTypeChange}
            >
              <MenuItem value="png">PNG</MenuItem>
              <MenuItem value="jpeg">JPEG</MenuItem>
              {/* Add more conversion options as needed */}
            </Select>
          </FormControl>
        </div>
        <Button type="submit" variant="contained" color="primary">Convert Image</Button>
      </form>
      <Button onClick={handleDisconnect} variant="contained">Disconnect</Button>
    </Container>  
  );
};

export default ImageConverter;
