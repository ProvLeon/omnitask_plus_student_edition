import React, { useState, useEffect } from 'react'; // Import useEffect
import { Box, Grid, Typography, TextField, Button, Container, Paper, Fade } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import XIcon from '@mui/icons-material/X';
import { send } from '@emailjs/browser'; // Import send from emailjs/browser

const ContactSection = ({id}: {id:string}) => {
  const [from_name, setFromName] = useState('');
  const [contact, setContact] = useState('');
  const [from_email, setFromEmail] = useState('');
  // const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [iconSwitch, setIconSwitch] = useState(true); // Add this line

  const to_name = import.meta.env.VITE_TO_NAME; // the name of the person to send the email to (thus you receiving the email)

  useEffect(() => {
    const timer = setInterval(() => {
      setIconSwitch(prevIconSwitch => !prevIconSwitch);
    }, 3000); // Switch icon every second

    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const contactDetails = { from_name, to_name , contact, from_email, message };

    // Use emailjs for handling form submissions
    try {
      const response = await send(
        process.env.VITE_EMAILJS_SERVICE_ID || "",
        process.env.VITE_EMAILJS_TEMPLATE_ID || "",
        contactDetails,
        process.env.VITE_EMAILJS_PUBLIC_KEY || ""
      );

      console.log('Message sent successfully', response);
      alert('Your message has been sent successfully!');
    } catch (error) {
      console.error('Failed to send message', error);
      alert('Failed to send the message, please try again.');
    }

    // Reset form fields
    setFromName('');
    setContact('');
    setFromEmail('');
    // setSubject('');
    setMessage('');
  };

  return (
    <Container id={id} maxWidth="lg" sx={{ my: 10, paddingTop:'10px' }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>Contact Us</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Name"
                fullWidth
                required
                value={from_name}
                onChange={(e) => setFromName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Contact"
                fullWidth
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={from_email}
                onChange={(e) => setFromEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              {/* <TextField
                label="Subject"
                fullWidth
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                sx={{ mb: 2 }}
              /> */}
              <TextField
                label="Message"
                fullWidth
                required
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" color="primary" sx={{ boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>Send Message</Button>
            </form>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center' }}>
            <div className='flex flex-row items-center'>
            <Typography variant="h5" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold'}} component="div">
              We'd love to hear from you!
            </Typography>
              <Box sx={{  display: 'flex', alignItems: 'center'}} >
                <Fade in={iconSwitch} timeout={600}>
                  <MailOutlineIcon sx={{ color: '#1976d2', fontSize: 40, position: 'absolute' }} />
                </Fade>
                <Fade in={!iconSwitch} timeout={600}>
                  <PhoneIcon sx={{ color: '#1976d2', fontSize: 40, position: 'absolute' }} />
                </Fade>
              </Box>
              </div>
            <Typography paragraph sx={{ textAlign: 'justify' }}>
              Whether you have a question about features, trials, need a demo, or anything else, our team is ready to answer all your questions.
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Email: <a href="mailto:leotech.digital@gmail.com" style={{ textDecoration: 'none', color: '#1976d2' }}>leotech.digital@gmail.com</a>
            </Typography>
            <div className='flex gap-4'>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Follow us on:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, color: '#1976d2', mt:1 }}>
              <a href={import.meta.env.VITE_LINKEDIN_LINK} style={{ textDecoration: 'none', color: '#1976d2' }}><LinkedInIcon /></a>
              <a href={import.meta.env.VITE_GITHUB_LINK} style={{ textDecoration: 'none', color: '#1976d2' }}><GitHubIcon /></a>
              <a href={import.meta.env.VITE_TWITTER_LINK} style={{ textDecoration: 'none', color: '#1976d2' }}><XIcon /></a>
            </Box>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ContactSection;

