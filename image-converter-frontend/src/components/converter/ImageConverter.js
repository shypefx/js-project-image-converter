import React, { useState } from 'react';
import { Button, Container, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import AppAppBar from '../navbar/AppAppBar';

const ImageConverter = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [conversionType, setConversionType] = useState('png');
  const [convertedImageUrl, setConvertedImageUrl] = useState('');

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
    formData.append('userId', localStorage.getItem('userId'));

    try {
      const response = await fetch('http://localhost:5000/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Display the converted image
        const imageUrl = URL.createObjectURL(await response.blob());
        setConvertedImageUrl(imageUrl);
      } else {
        alert('Image conversion failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during image conversion:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 20}}>
      <AppAppBar />
      <Typography variant="h4" align="center" gutterBottom>Image Converter</Typography>
      <form onSubmit={handleSubmit}>
        <div>
          <FormControl fullWidth>
            <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
          </FormControl>
        </div>
        <div>
          <FormControl fullWidth>
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
      {convertedImageUrl && (
        <div>
          <Typography variant="h6" gutterBottom>Converted Image:</Typography>
          <img width="60%" src={convertedImageUrl} alt="Converted" />
        </div>
      )}
    </Container>  
  );
};

export default ImageConverter;
