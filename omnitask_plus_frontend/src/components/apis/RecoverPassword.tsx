import axios from 'axios';

// Define the base URL for the backend API from environment variables
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Sends a request to the backend to initiate the password recovery process for a given email.
 * This function sends the user's email to the backend, which is expected to send a password recovery link to that email.
 * @param email The email address for which the password recovery process is requested.
 * @returns The response data from the backend, typically a confirmation message.
 */
const requestPasswordRecovery = async (email: string) => {
  try {
    // Send a POST request to the backend with the user's email
    const response = await axios.post(`${BASE_URL}/users/request-password-recovery`, JSON.stringify({ email }), {
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
    });
    return response.data; // Return the response data from the backend
  } catch (error) {
    console.error('Error requesting password recovery:', error); // Log any errors to the console
    throw error; // Rethrow the error for further handling
  }
};

/**
 * Resets the user's password using a token received from the password recovery link and the new password.
 * This function sends the token and new password to the backend, which resets the user's password.
 * @param token The token received from the password recovery link.
 * @param newPassword The new password chosen by the user.
 * @returns The response data from the backend, typically a confirmation message that the password has been reset.
 */
const resetPassword = async (token: string, newPassword: string) => {
  try {
    // Send a POST request to the backend with the token and new password
    const response = await axios.post(`${BASE_URL}/users/reset-password`, JSON.stringify({ token, newPassword }), {
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
    });
    return response.data; // Return the response data from the backend
  } catch (error) {
    console.error('Error resetting password:', error); // Log any errors to the console
    throw error; // Rethrow the error for further handling
  }
};

// Export the functions for use in other parts of the application
export { requestPasswordRecovery, resetPassword };

