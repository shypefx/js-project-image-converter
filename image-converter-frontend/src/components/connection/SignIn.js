import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, CssBaseline, TextField, Typography, Avatar, Box, FormControlLabel, Checkbox, Grid } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import ErrorIcon from '@mui/icons-material/Error';

const defaultTheme = createTheme();

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(false); // State to track login error

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userRole', data.userRole);
        if (data.userRole === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/home';
        }
      } else {
        setError(true); // Set error state to true
        console.error('Login failed:', response.status);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container 
            sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
              <Button variant='outlined' href='/signup'>
                Create Account
              </Button>
            </Grid>
          </Box>
          {/* Display error alert if there's an error */}
          {error && (
            <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />}>
              Login failed. Please check your credentials and try again.
            </Alert>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignIn;
