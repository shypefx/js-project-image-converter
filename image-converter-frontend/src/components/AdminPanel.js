import React, { useState, useEffect } from 'react';
import { Button, Typography, Grid, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Modal, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import AppAppBar from './navbar/AppAppBar';
import ImagesManagement from './management/ImagesManagement';


const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({
    id: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response server:', data);
        setUsers(data);
      } else {
        console.error('Failed to fetch users:', response.status);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUpdatedUserData(user); // Set initial values for modal fields
    setOpenModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedUserData), // Send updated user data
      });

      if (response.ok) {
        console.log('User updated successfully');
        setOpenModal(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        console.error('Failed to update user:', response.status);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        // Remove the deleted user from the state
        setUsers(users.filter(user => user.id !== userId));
        console.log('User deleted successfully');
      } else {
        console.error('Failed to delete user:', response.status);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/logout';
};

  const handleModalFieldChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData({ ...updatedUserData, [name]: value });
  };

    return (
    <div>
      <AppAppBar></AppAppBar>
      <Typography variant="h4" textAlign={'center'} gutterBottom style={{ marginTop: '100px' }}>
        Admin Panel
      </Typography>
      {/* User Management */}
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
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleEditUser(user)} size="small"><ModeEditOutlineIcon color="warning" /></Button>
                        <Button onClick={() => handleDeleteUser(user.id)} size="small"><DeleteIcon color="error" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Images Management */}
      <ImagesManagement></ImagesManagement>
      <Button variant="contained" onClick={handleLogout}>Logout</Button>

 {/* Modal for editing user */}
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Edit User
          </Typography>
          {selectedUser && (
            <form>
              <TextField label="ID" disabled value={selectedUser.id} fullWidth margin="normal" />
              <TextField label="Email" value={selectedUser.email} onChange={handleModalFieldChange} fullWidth margin="normal" />
              <TextField label="Role" value={selectedUser.role} onChange={handleModalFieldChange} fullWidth margin="normal" />
              <Button variant="contained" onClick={handleUpdateUser}>Update</Button>
            </form>
          )}
        </div>
      </Modal>

    </div>
  );
};

export default AdminPanel;
