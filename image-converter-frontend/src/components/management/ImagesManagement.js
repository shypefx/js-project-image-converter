import React, { useState, useEffect } from 'react';
import { Button, Typography, Grid, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Modal, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';

const ImagesManagement = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [updatedImageData, setUpdatedImageData] = useState({
    id: '',
    name: '',
    size: '',
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/images', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response server:', data);
        setImages(data);
      } else {
        console.error('Failed to fetch images:', response.status);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleEditImage = (image) => {
    setSelectedImage(image);
    setUpdatedImageData(image); // Set initial values for modal fields
    setOpenModal(true);
  };

  const handleUpdateImage = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/images/${selectedImage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedImageData), // Send updated image data
      });

      if (response.ok) {
        console.log('Image updated successfully');
        setOpenModal(false);
        setSelectedImage(null);
        fetchImages();
      } else {
        console.error('Failed to update image:', response.status);
      }
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  const handleDeleteImage = async (imageId) => {
    // Implementation for deleting image...
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
  };

  const handleModalFieldChange = (e) => {
    const { name, value } = e.target;
    setUpdatedImageData({ ...updatedImageData, [name]: value });
  };

  return (
    <div>
    <Grid container spacing={2} justifyContent="center">
        <Grid item xs={10} margin={2} textAlign={'center'}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h5" gutterBottom>
              User Management
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>URL</TableCell>
                    <TableCell>TYPE</TableCell>
                    <TableCell>SIZE</TableCell>
                    <TableCell>DATE</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {images.map((image) => (
                    <TableRow key={image.id}>
                        
                      <TableCell>{image.id}</TableCell>
                      <TableCell>{image.imageUrl}</TableCell>
                      <TableCell>{image.conversionType}</TableCell>
                      <TableCell>{image.imageSize} Mo</TableCell>
                      <TableCell>{image.createdAt}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleEditImage(image)} size="small"><ModeEditOutlineIcon color="warning" /></Button>
                        <Button onClick={() => handleDeleteImage(image.id)} size="small"><DeleteIcon color="error" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Edit Image
          </Typography>
          {selectedImage && (
            <form>
              <TextField name="id" label="ID" disabled value={updatedImageData.id} fullWidth margin="normal" />
              <TextField name="name" label="Name" value={updatedImageData.name} onChange={handleModalFieldChange} fullWidth margin="normal" />
              <TextField name="size" label="Size" value={updatedImageData.size} onChange={handleModalFieldChange} fullWidth margin="normal" />
              <Button variant="contained" onClick={handleUpdateImage}>Update</Button>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ImagesManagement;