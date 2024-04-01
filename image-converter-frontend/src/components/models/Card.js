import React from 'react';
import { Card as MuiCard, CardContent, CardActions, CardMedia, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';


const Card = ({ imageUrl, imageDate, imageSize }) => {
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
          Size: {imageSize} bytes
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" ><CloudDownloadIcon/></Button>
        <Button size="small"><DeleteIcon color="secondary"/></Button>
      </CardActions>
    </MuiCard>
  );
};

export default Card;
