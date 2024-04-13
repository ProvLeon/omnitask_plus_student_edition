import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion'; // Importing motion for animation effects
import { useNavigate } from 'react-router-dom'; // Hook for navigation

// NotFoundPage component displays a 404 error page with an option to navigate back to the homepage
const NotFoundPage = () => {
  const navigate = useNavigate(); // Using the navigate hook for redirection

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh" // Ensures the box takes up the full viewport height
      sx={{ textAlign: 'center' }} // Centers the text inside the Box
    >
      <motion.div
        initial={{ scale: 0 }} // Animation starts with the component scaled down to 0
        animate={{ rotate: 360, scale: 1 }} // Ends with the component fully scaled and rotated
        transition={{
          type: "spring", // Specifies the type of animation
          stiffness: 260, // How stiff the motion should be
          damping: 20 // Amount of motion damping
        }}
      >
        <Typography variant="h1" component="h2" gutterBottom>
          {/* // Displaying the error code prominently */}
          404
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
          {/* // A simple message indicating the page is not found */}
          Oops! Page not found.
        </Typography>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.1 }} // Scales up the button on hover
        whileTap={{ scale: 0.9 }} // Scales down the button on click
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')} // Navigates the user back to the homepage on click
          sx={{ mt: 3 }} // Adds margin top for spacing
        >
          {/* // Button text */}
          Go Back Home
        </Button>
      </motion.div>
    </Box>
  );
};

export default NotFoundPage; // Exporting the NotFoundPage component
