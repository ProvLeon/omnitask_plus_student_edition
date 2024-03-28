import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Link } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import { styled } from '@mui/system';
import { Link as ScrollLink } from 'react-scroll'; // Import from react-scroll and rename to avoid conflict with react-router-dom's Link

const FooterBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#0A192F',
  color: '#dfdfdf',
  padding: theme.spacing(8, 0),
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: '#dfdfdf',
  cursor: 'pointer',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const FooterSection = () => {
  return (
    <FooterBox>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} sm={5}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'white'}}>
              OmniTask+ Student Edition
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1rem' }}>
              Elevate Your Productivity with Real-Time Communication, Smart Chat Algorithms, and Student-Focused Features.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' , color: 'white'}}>
              Quick Links
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1rem' }}>
              <ScrollLink to="features" smooth={true} duration={500} style={{ textDecoration: 'none' }} offset={-70}>
                <FooterLink>Features</FooterLink><br />
              </ScrollLink>
              <ScrollLink to="about" smooth={true} duration={500} style={{ textDecoration: 'none' }} offset={-70}>
                <FooterLink>About</FooterLink><br />
              </ScrollLink>
              <ScrollLink to="contact" smooth={true} duration={500} style={{ textDecoration: 'none' }} offset={-70}>
                <FooterLink>Contact</FooterLink>
              </ScrollLink>
              {/* <FooterLink href="/about">About</FooterLink><br />
              <FooterLink href="/contact">Contact</FooterLink> */}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
              Follow Us
            </Typography>
            <IconButton href={import.meta.env.VITE_LINKEDIN_LINK} target="_blank" rel="noopener" color="inherit">
              <LinkedInIcon />
            </IconButton>
            <IconButton href={import.meta.env.VITE_GITHUB_LINK} target="_blank" rel="noopener" color="inherit">
              <GitHubIcon />
            </IconButton>
            <IconButton href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`} color="inherit">
              <EmailIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Typography variant="body2" align="center" sx={{ pt: 5, fontSize: '0.875rem' }}>
          © {new Date().getFullYear()} OmniTask+ Student Edition. All rights reserved.
        </Typography>
      </Container>
    </FooterBox>
  );
};

export default FooterSection;
