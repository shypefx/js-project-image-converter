import React, { useState } from 'react';

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
      const response = await fetch('/api/convert', {
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
    <div>
      <h2>Image Converter</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="image">Choose an image:</label>
          <input type="file" id="image" accept="image/*" onChange={handleImageChange} />
        </div>
        <div>
          <label htmlFor="conversionType">Choose conversion type:</label>
          <select id="conversionType" value={conversionType} onChange={handleConversionTypeChange}>
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            {/* Add more conversion options as needed */}
          </select>
        </div>
        <button type="submit">Convert Image</button>
      </form>
      <button onClick={handleDisconnect}>Disconnect</button>
    </div>
  );
};

export default ImageConverter;
