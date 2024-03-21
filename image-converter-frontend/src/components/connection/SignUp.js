import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const SignUp = () => {
    const [formData, setFormData] = useState({
      firstname: '',
      name: '',
      email: '',
      password: '',
    });
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // TODO: Send data to the server and save to the database
      try {
        const response = await fetch('http://localhost:5000/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          window.location.href = '/login';
        } else {
          const errorData = await response.json();
          console.error('Sign Up failed:', errorData);
          alert('Sign Up failed. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

  return (
    <ThemeProvider theme={createTheme()}>
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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
  <Grid item xs={12} sm={6}>
    <TextField
      name="firstname" // Corrected name attribute
      required
      fullWidth
      id="firstName"
      label="First Name"
      autoComplete="given-name"
      value={formData.firstname}
      onChange={handleChange}
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <TextField
      name="name" // Corrected name attribute
      required
      fullWidth
      id="lastName"
      label="Last Name"
      autoComplete="name"
      value={formData.name}
      onChange={handleChange}
    />
  </Grid>
  <Grid item xs={12}>
    <TextField
      required
      fullWidth
      id="email"
      label="Email Address"
      name="email"
      autoComplete="email"
      value={formData.email}
      onChange={handleChange}
    />
  </Grid>
  <Grid item xs={12}>
    <TextField
      required
      fullWidth
      name="password"
      label="Password"
      type="password"
      id="password"
      autoComplete="new-password"
      value={formData.password}
      onChange={handleChange}
    />
  </Grid>
  <Grid item xs={12}>
    <FormControlLabel
      control={<Checkbox value="allowExtraEmails" color="primary" />}
      label="I want to receive inspiration, marketing promotions and updates via email."
      name="allowExtraEmails"
    />
  </Grid>
</Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignUp;
