import React, { useState, useEffect } from 'react';
import { Button, Typography, Grid, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Modal, TextField } from '@mui/material';
import AppAppBar from './navbar/AppAppBar';
import ImagesManagement from './management/ImagesManagement';
import UsersManagement from './management/UsersManagement';


const AdminPanel = () => {

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/logout';
};

    return (
    <div>
      <AppAppBar></AppAppBar>
      <Typography variant="h4" textAlign={'center'} gutterBottom style={{ marginTop: '100px' }}>
        Admin Panel
      </Typography>
      <UsersManagement></UsersManagement>
      <ImagesManagement></ImagesManagement>
      <Button variant="contained" onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default AdminPanel;
