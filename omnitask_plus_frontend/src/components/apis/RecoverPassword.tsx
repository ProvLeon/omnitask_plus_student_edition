import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Function to request password recovery link
const requestPasswordRecovery = async (email: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/request-password-recovery`, JSON.stringify({ email }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // Assuming the backend sends a confirmation message or instructions for the next steps
    return response.data;
  } catch (error) {
    console.error('Error requesting password recovery:', error);
    throw error;
  }
};

// Function to reset password using the token received from the password recovery link
const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/reset-password`, JSON.stringify({ token, newPassword }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // Assuming the backend sends a confirmation message that the password has been successfully reset
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

export { requestPasswordRecovery, resetPassword };

