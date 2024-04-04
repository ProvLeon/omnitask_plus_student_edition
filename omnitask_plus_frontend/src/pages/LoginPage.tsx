import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../components/apis/LoginApi';
import { Button, TextField, Box, Grid, Paper, Typography, IconButton, InputAdornment, Container } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await loginUser(credentials);
      navigate('/main'); // Redirect to boards page after successful login
    } catch (error) {
      alert('Failed to login. Please check your credentials.');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={5}>
            <Typography variant="h4" component="h1" gutterBottom>
              Elevate Your Productivity
            </Typography>
            <Typography variant="body1" paragraph>
              Join OmniTask+ (Student Edition) and manage your tasks, participate in virtual study sessions, and enhance your study experience with our integrated Pomodoro timer.
            </Typography>
            <Button variant="outlined" color="primary" component={Link} to="/signup">
              Don't have an account? Sign Up
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '40px', border: '1px solid #ddd', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
              <Typography variant="h5" component="h3" marginBottom="20px">
                Login
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handlePasswordVisibility}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
                  Login
                </Button>
                <div className='flex gap-2'>
                  <p className='p-2' >
                    Forgotten Your Password?
                  </p>
                <Link className='text-blue-900 self-center' to="/passwordrecovery" >Click Here</Link>
                </div>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;
