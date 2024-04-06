import React, { useState, useEffect } from 'react';
import { fileToBase64 } from '../../utils/utils'; // Assuming TaskApi.tsx is in the apis folder
import { TextField, Button, Paper, Avatar, Box, Container, Typography, IconButton, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { publish } from '../../utils/pubSub'; // Adjust the path as necessary
import { getUserData, updateUserData, updateUserImage } from '../apis/UserApi';


const Item = styled(Paper)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
}));

const Profile = () => {
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
  const [isEditing, setIsEditing] = useState(false);
  const userId = sessionStorage.getItem('userId');

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && userId) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Error: The file must be an image.');
        return;
      }
      const base64 = await fileToBase64(file);
      try {
        await updateUserData(userId, base64);
        setProfileData({ ...profileData, image: base64 });
        alert('Profile image updated successfully');
        publish('profileUpdate', { ...profileData, image: base64 }); // Publishing the update
      } catch (error) {
        console.error('Error updating profile image:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;
    const updatedData = { ...profileData };

    try {
      await updateUserData(userId, updatedData);
      alert('Profile updated successfully');
      setIsEditing(false);
      publish('profileUpdate', updatedData); // Publishing the update
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const displayFields = ['username', 'firstname', 'middlename', 'lastname', 'email', 'contact'];

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

