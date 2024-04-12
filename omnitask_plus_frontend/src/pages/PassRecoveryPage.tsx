import React, { useState } from 'react';
// Importing requestPasswordRecovery function from the RecoverPassword API component
import { requestPasswordRecovery } from '../components/apis/RecoverPassword';
// Importing necessary components from Material UI for UI design
import { Button, TextField, Box, Grid, Paper, Typography, Container } from '@mui/material';

// PassRecoveryPage component for handling password recovery requests
const PassRecoveryPage = () => {
  // State for storing user's email and message response
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Function to handle changes in the email input field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Function to handle form submission for password recovery
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Attempting to request password recovery with the provided email
      const response = await requestPasswordRecovery(email);
      // Setting the response message on success
      setMessage(response.message);
    } catch (error) {
      // Setting a failure message on error
      setMessage('Failed to request password recovery. Please try again.');
    }
  };

  // Rendering the password recovery page
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container maxWidth="md">
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom color="white">
              Secure Your Account
            </Typography>
            <Typography variant="body1" paragraph color="white">
              OmniTask+ takes your security seriously. Follow the steps to recover your password securely. If you didn’t request this, please ignore the email you receive and ensure your account details are up to date.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '40px', border: '1px solid #ddd', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
              <Typography variant="h5" component="h3" marginBottom="20px">
                Password Recovery
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
                  Request Recovery Link
                </Button>
                {message && (
                  <Typography variant="body2" style={{ marginTop: '20px', color: 'green' }}>
                    {message}
                  </Typography>
                )}
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PassRecoveryPage;
