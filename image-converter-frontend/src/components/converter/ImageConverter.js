import React, { useState } from 'react';
import { Button, Container, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import AppAppBar from '../navbar/AppAppBar';

const ImageConverter = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [conversionType, setConversionType] = useState('png');
  const [compressionLevel, setCompressionLevel] = useState(80); // Default compression level
  const [resizeWidth, setResizeWidth] = useState(500); // Default resize width
  const [resizeHeight, setResizeHeight] = useState(500); // Default resize height
  const [convertedImageUrl, setConvertedImageUrl] = useState(null);
  const [convertedImageSize, setConvertedImageSize] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleConversionTypeChange = (event) => {
    setConversionType(event.target.value);
  };

  const handleCompressionLevelChange = (event) => {
    setCompressionLevel(event.target.value);
  };

  const handleResizeWidthChange = (event) => {
    setResizeWidth(event.target.value);
  };

  const handleResizeHeightChange = (event) => {
    setResizeHeight(event.target.value);
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
    formData.append('compressionLevel', compressionLevel);
    formData.append('resizeWidth', resizeWidth);
    formData.append('resizeHeight', resizeHeight);

    try {
      // Send image conversion request to server
      const response = await fetch('http://localhost:5000/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Handle successful conversion
        const data = await response.json();
        setConvertedImageUrl(data.convertedImageUrl);
        setConvertedImageSize(data.convertedImageSize);
        alert('Image converted successfully!');
        // Navigate to home page after successful conversion
        //navigate('/home');
      } else {
        // Handle conversion failure
        alert('Image conversion failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during image conversion:', error);
    }
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
        <div>
          <FormControl sx={{ pb: 2 }} fullWidth>
            <InputLabel id="compressionLevelLabel">Compression Level:</InputLabel>
            <Select
              labelId="compressionLevelLabel"
              id="compressionLevel"
              value={compressionLevel}
              onChange={handleCompressionLevelChange}
            >
              <MenuItem value={80}>Low</MenuItem>
              <MenuItem value={50}>Medium</MenuItem>
              <MenuItem value={20}>High</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControl sx={{ pb: 2 }} fullWidth>
            <InputLabel id="resizeWidthLabel">Resize Width:</InputLabel>
            <input
              type="number"
              id="resizeWidth"
              value={resizeWidth}
              onChange={handleResizeWidthChange}
            />
          </FormControl>
        </div>
        <div>
          <FormControl sx={{ pb: 2 }} fullWidth>
            <InputLabel id="resizeHeightLabel">Resize Height:</InputLabel>
            <input
              type="number"
              id="resizeHeight"
              value={resizeHeight}
              onChange={handleResizeHeightChange}
            />
          </FormControl>
        </div>
        <Button type="submit" variant="contained" color="primary">Convert Image</Button>
      </form>
      {convertedImageUrl && (
        <div>
          <img src={convertedImageUrl} alt="Converted Image" />
          <Typography variant="body2">Size: {convertedImageSize} bytes</Typography>
        </div>
      )}
    </Container>  
  );
};

export default ImageConverter;
