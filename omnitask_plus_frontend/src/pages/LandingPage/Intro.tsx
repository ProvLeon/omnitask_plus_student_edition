import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const IntroSection = ({id}: {id: string}) => {
  const navigate = useNavigate();

  return (
    <Box
    id={id}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: '0.3s',
        '&:hover': {
          boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
        },
        borderRadius: '5px',
        margin: '20px',
        width: 'auto',
      }}
    >
      <Typography variant="h3" component="h2" gutterBottom>
        Elevate Your Productivity with OmniTask+ Student Edition
      </Typography>
      <Typography variant="h5" color="textSecondary" paragraph>
        OmniTask+ Student Edition is designed to revolutionize the way students manage their tasks, collaborate, and enhance their productivity. With features like real-time communication, smart chat algorithms, and student-focused features, OmniTask+ is your ultimate companion for academic success.
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/signup')}
            sx={{ marginTop: '20px' }}
          >
            Get Started
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/features')}
            sx={{ marginTop: '20px' }}
          >
            Explore Features
          </Button>
        </Grid>
      </Grid>
      <Typography variant="body1" color="textSecondary" paragraph sx={{ marginTop: '20px', textAlign: 'center' }}>
        From task management to virtual study sessions, OmniTask+ empowers you to stay organized, meet deadlines, and collaborate effectively. Whether you're tackling individual assignments or group projects, our platform is tailored to meet the unique needs of students navigating the complexities of academic life.
      </Typography>
    </Box>
  );
};

export default IntroSection;

