import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ textAlign: 'center' }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        <Typography variant="h1" component="h2" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
          Oops! Page not found.
        </Typography>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 3 }}
        >
          Go Back Home
        </Button>
      </motion.div>
    </Box>
  );
};

export default NotFoundPage;
