import React, { useState } from 'react';
import { Card as MuiCard, CardContent, CardActions, CardMedia, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const Card = ({ imageUrl, imageDate, imageSize, imageId }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/delete-image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: imageId, imageName: imageUrl})
      });
      if (response.ok) {
        console.log('Image deleted successfully');
      } else {
        console.error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
  
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `image_${imageId}.jpg`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = () => {
    handleClose();
    handleDelete();
  };

  return (
    <MuiCard>
      <CardMedia
        component="img"
        height="140"
        image={imageUrl}
        alt="Converted Image"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Date: {imageDate}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Size: {imageSize} mo
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleDownload}><CloudDownloadIcon /></Button>
        <Button size="small" onClick={handleClickOpen}><DeleteIcon color="secondary" /></Button>
      </CardActions>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this image?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </MuiCard>
  );
};

export default Card;
