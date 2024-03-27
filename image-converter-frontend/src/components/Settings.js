import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AppAppBar from './navbar/AppAppBar';

const paperStyle = {
  maxWidth: 600,
  margin: 'auto',
  padding: '20px',
};

const sectionStyle = {
  marginBottom: '16px',
};

const Settings = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({ userId }),
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleDisconnect = () => {
    localStorage.removeItem('token'); // Clear token from local storage
    navigate('/login'); // Redirect to login page
  };

  return (
    <>
      <AppAppBar />
      <div style={{ marginTop: '200px' }}></div>
      <Paper style={paperStyle}>
        <Typography variant="h4" gutterBottom>Settings</Typography>
        {user && (
          <>
            <div style={sectionStyle}>
              <Typography variant="h6">User Information:</Typography>
              <Typography><strong>First Name:</strong> {user.name}</Typography>
              <Typography><strong> Name:</strong> {user.firstname}</Typography>
              <Typography><strong>Email:</strong> {user.email}</Typography>
              {/* Add more user information as needed */}
            </div>
            <div style={sectionStyle}>
              <Button variant="contained" color="primary" onClick={handleDisconnect}>Disconnect</Button>
            </div>
          </>
        )}
      </Paper>
    </>
  );
};

export default Settings;
