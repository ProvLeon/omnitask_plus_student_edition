import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import { Link as ScrollLink } from 'react-scroll'; // Import from react-scroll and rename to avoid conflict with react-router-dom's Link
import animationData from '../../assets/animations/Animation-1711404365495.json';
import Header from './Header';
import IntroSection from './Intro';
import FeaturesSection from './Features';
import ContactSection from './Contact';
import AboutSection from './About';
import FooterSection from './FooterSection';

const LandingPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.5, duration: 1.5 } },
  };

  const iconVariants = {
    hidden: { scale: 0.95, y: 0 },
    visible: {
      scale: [0.95, 1.05, 0.95],
      y: [0, -5, 0],
      transition: { repeat: Infinity, ease: "linear", duration: 2 },
    },
  };

  return (
    <div>
    <Header/>
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
      <Container maxWidth="lg">
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to OmniTask+ Student Edition
            </Typography>
            <Typography variant="h5" color="textSecondary" paragraph>
              Elevate Your Productivity with Real-Time Communication, Smart Chat Algorithms, and Student-Focused Features.
            </Typography>
            <Box mt={3}>
              <Button variant="contained" color="primary" onClick={() => navigate('/signup')}>
                Get Started
              </Button>
              <ScrollLink to="features" smooth={true} duration={500} style={{ textDecoration: 'none' }} offset={-70}>
                <Button variant="outlined" color="primary" style={{ marginLeft: '8px' }}>
                  Explore Features
                </Button>
              </ScrollLink>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              style={{ width: '400px', height: '400px' }}
              >
              <Player
                autoplay
                loop
                src={animationData}
                style={{ height: '400px', width: '400px' }}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
    <div>
      <ScrollLink to="intro" smooth={true} duration={500} style={{ textDecoration: 'none' }} offset={-70}><IntroSection id="intro" /></ScrollLink>
      <ScrollLink to="features" smooth={true} duration={500} style={{ textDecoration: 'none' }} offset={-70}><FeaturesSection id="features" /></ScrollLink>
      <ScrollLink to="contact" smooth={true} duration={500} style={{ textDecoration: 'none' }} offset={-70}><ContactSection id="contact" /></ScrollLink>
      <ScrollLink to="about" smooth={true} duration={500} style={{ textDecoration: 'none' }} offset={-70}><AboutSection id="about" /></ScrollLink>
      <FooterSection />
    </div>
    </div>

  );
};

export default LandingPage;
