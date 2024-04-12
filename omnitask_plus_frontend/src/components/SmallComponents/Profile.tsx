import React, { useState, useEffect } from 'react';
// Utility function for converting files to Base64
import { fileToBase64 } from '../../utils/utils';
// Material UI components for UI design
import { TextField, Button, Paper, Avatar, Box, Container, Typography, IconButton, Grid } from '@mui/material';
// Styled component from Material UI for custom styling
import { styled } from '@mui/material/styles';
// Theme interface from Material UI for theming support
import { Theme } from '@mui/material/styles';
// Icons from Material UI for edit and camera functionality
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
// Publish-subscribe utility for component communication
import { publish } from '../../utils/pubSub';
// API functions for fetching and updating user data
import { getUserData, updateUserData } from '../apis/UserApi';

// Custom styled component for the profile container
const Item = styled(Paper)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
}));

// Profile component for displaying and editing user profile information
const Profile = () => {
  // State for storing profile data
  const [profileData, setProfileData] = useState<{
    [key: string]: string;
  }>({
    username: '',
    firstname: '',
    lastname: '',
    middlename: '',
    email: '',
    contact: '',
    image: '',
  });
  // State for toggling edit mode
  const [isEditing, setIsEditing] = useState(false);
  // Retrieve the user ID from session storage
  const userId = sessionStorage.getItem('userId');

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const response = await getUserData(userId)
        const {username, firstname, lastname, email, contact, image} = response;
        const imageUrl = image ? `${image}` : 'default-profile.png';
        setProfileData({ username, firstname, lastname, email, contact, image: imageUrl });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfile();
  }, [userId]);

  // Handler for input changes to update profile data state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Handler for file input changes to update profile image
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && userId) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Error: The file must be an image.');
        return;
      }
      const base64 = await fileToBase64(file);
      try {
        setProfileData({ ...profileData, image: base64 });
      } catch (error) {
        console.error('Error updating profile image:', error);
      }
    }
  };

  // Handler for submitting updated profile data
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;
    const updatedData = { ...profileData };

    try {
      await updateUserData(userId, updatedData);
      alert('Profile updated successfully');
      setIsEditing(false);
      publish('profileUpdate', updatedData); // Publishing the update for other components
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Fields to display in the profile view
  const displayFields = ['username', 'firstname', 'middlename', 'lastname', 'email', 'contact'];

  // Render the profile component
  return (
    <Container maxWidth="md">
      <Item elevation={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
          <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 'medium' }}>
            User Profile
          </Typography>
          <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
            <Avatar src={profileData.image} sx={{ width: 128, height: 128 }} />
            {isEditing && (
              <IconButton
                sx={{ position: 'absolute', right: -10, bottom: 0, backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.dark' } }}
                component="label"
              >
                <input type="file" hidden onChange={handleFileChange} />
                <CameraAltIcon />
              </IconButton>
            )}
          </Box>
          {isEditing ? (
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
              <Grid container spacing={2}>
                {displayFields.map((field) => (
                  <Grid item xs={12} sm={field === 'email' || field === 'contact' ? 12 : 6} key={field}>
                    <TextField
                      name={field}
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={profileData[field]}
                      onChange={handleInputChange}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                    />
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>Save</Button>
                <Button onClick={() => setIsEditing(false)} variant="outlined" color="error">Cancel</Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ mt: 1, width: '100%' }}>
              {displayFields.map((field) => (
                <Typography key={field} sx={{ mt: 2, textAlign: 'center' }}>
                  {`${field.charAt(0).toUpperCase() + field.slice(1)}: ${profileData[field]}`}
                </Typography>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <IconButton onClick={() => setIsEditing(true)} color="primary">
                  <EditIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      </Item>
    </Container>
  );
};

export default Profile;
