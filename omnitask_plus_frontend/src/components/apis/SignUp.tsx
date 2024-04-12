import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios'; // Add this import
import { Button, TextField, Box, Grid, Paper, Typography, Container } from '@mui/material';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface ErrorResponse {
  error: string;
}


const SignUp = () => {
  const [userDetails, setUserDetails] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    email: '',
    contact: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/users/create`, JSON.stringify(userDetails), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      navigate('/login'); // Redirect to login page after successful signup
    } catch (error) {
      if (axios.isAxiosError(error)) { // Check if error is an AxiosError
        const serverError = error as AxiosError;
        if (serverError && serverError.response) {
          const errorResponse = serverError.response.data as ErrorResponse;
          alert(`Failed to sign up. Please check your details:\n\n${errorResponse.error}`);
        }
      } else {
        alert('Failed to sign up due to an unexpected error. Please try again.');
      }
      // console.log(error);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={5} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <Grid item xs={5}>
            <img src="https://cdn.dribbble.com/users/4241563/screenshots/11874468/media/7796309c77cf752615a3f9062e6a3b3d.gif" alt="Task Management" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover',justifyContent: 'center', marginBottom: '20px' }} />
          </Grid>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome to OmniTask+ (Student Edition)
            </Typography>
            <Typography variant="body1" paragraph>
              Elevate Your Productivity with Real-Time Communication, Smart Chat Algorithms, and Student-Focused Features.
            </Typography>
            <Typography variant="body1" paragraph>
              Join virtual study sessions, manage tasks with ease, and enhance your study experience with our integrated Pomodoro timer.
            </Typography>
            <Button variant="outlined" color="primary" onClick={() => navigate('/login')}>
              Already have an account? Log in
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '40px', border: '1px solid #ddd', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="username"
                  value={userDetails.username}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="password"
                  type="password"
                  value={userDetails.password}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="firstname"
                  value={userDetails.firstname}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="lastname"
                  value={userDetails.lastname}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="email"
                  type="email"
                  value={userDetails.email}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Contact"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="contact"
                  value={userDetails.contact}
                  onChange={handleChange}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
                  Sign Up
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SignUp;
