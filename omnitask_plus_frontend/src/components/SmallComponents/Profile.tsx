import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fileToBase64 } from '../apis/TaskApi'; // Assuming TaskApi.tsx is in the apis folder
import { TextField, Button, Paper, Avatar, Box, Container, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';

const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL + '/api';

const Item = styled(Paper)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

const Profile = () => {
  const [profileData, setProfileData] = useState<{
    [key: string]: string;
  }>({
    username: '',
    firstname: '',
    lastname: '',
    middlename: '', // Added middlename field
    email: '',
    contact: '',
    image: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const userId = localStorage.getItem('userId'); // Assuming the user's ID is stored in localStorage

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      if (!userId) return; // Guard clause if userId is not available
      try {
        const response = await axios.get(`${BASE_URL}/users/getuser/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const data = response.data;
        // Convert image to its original form if exists
        const imageUrl = data.image ? `data:image/jpeg;base64,${data.image}` : 'default-profile.png';
        setProfileData({ ...data, image: imageUrl });
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
    if (e.target.files) {
      const file = e.target.files[0];
      const base64 = await fileToBase64(file);
      try {
        await axios.post(`${BASE_URL}/users/update_user_image`, {
          user_id: userId,
          image: base64,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        });
        setProfileData({ ...profileData, image: base64 });
        alert('Profile image updated successfully');
      } catch (error) {
        console.error('Error updating profile image:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return; // Guard clause if userId is not available
    const updatedData = { ...profileData };
    if (file) {
      updatedData.image = await fileToBase64(file);
    }

    try {
      await axios.put(`${BASE_URL}/users/update/${userId}`, updatedData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });
      alert('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const displayFields = ['image', 'username', 'firstname', 'middlename', 'lastname', 'email', 'contact'];

  return (
    <Container maxWidth="sm">
      <Item elevation={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Avatar src={profileData.image} sx={{ width: 128, height: 128, mb: 2 }} />
            <IconButton
              sx={{ position: 'absolute', right: 0, bottom: 0, backgroundColor: 'white', '&:hover': { backgroundColor: '#f4f4f4' } }}
              component="label"
            >
              <input type="file" hidden onChange={handleFileChange} />
              <EditIcon color="action" />
            </IconButton>
          </Box>
          <Typography variant="h5" gutterBottom>
            User Profile
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {displayFields.map((field) => {
              if (field === 'image') return null; // Skip image field for text input
              return (
                <TextField
                  key={field}
                  name={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={profileData[field]}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />
              );
            })}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              {isEditing ? (
                <>
                  <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>Save</Button>
                  <Button onClick={() => setIsEditing(false)} variant="outlined" color="error">Cancel</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outlined">Edit Profile</Button>
              )}
            </Box>
          </Box>
        </Box>
      </Item>
    </Container>
  );
};

export default Profile;
