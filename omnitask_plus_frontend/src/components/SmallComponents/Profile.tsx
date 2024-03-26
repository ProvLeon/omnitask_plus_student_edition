import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fileToBase64 } from '../apis/TaskApi'; // Assuming TaskApi.tsx is in the apis folder
import { TextField, Button, Paper, Avatar, Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';

const BASE_URL = import.meta.env.REACT_APP_BASE_URL;

const Item = styled(Paper)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

const Profile = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    firstname: '',
    lastname: '',
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
        const response = await axios.get(`${BASE_URL}/api/users/getuser/${userId}`, {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({ ...profileData, image: e.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
      setFile(e.target.files[0]);
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
      await axios.put(`${BASE_URL}/api/users/update/${userId}`, updatedData, {
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

  return (
    <Container maxWidth="sm">
      <Item elevation={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
          <Avatar src={profileData.image} sx={{ width: 128, height: 128, mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            User Profile
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {Object.entries(profileData).map(([key, value]) => {
              if (key !== 'image' && key !== 'id') { // Exclude 'id' from being displayed or edited
                return (
                  <TextField
                    key={key}
                    name={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={value}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                  />
                );
              }
              return null;
            })}
            {isEditing && <input type="file" name="image" onChange={handleFileChange} />}
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
