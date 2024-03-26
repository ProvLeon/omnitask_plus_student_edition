import React, { useState } from 'react';
import { requestPasswordRecovery } from '../components/apis/RecoverPassword';
import { Button, TextField, Box, Grid, Paper, Typography, Container } from '@mui/material';

const PassRecoveryPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await requestPasswordRecovery(email);
      setMessage(response.message);
    } catch (error) {
      setMessage('Failed to request password recovery. Please try again.');
    }
  };

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
