// services/cognitoService.js
// This handles all direct API communication with your backend

import axios from 'axios';

// Change this to your backend URL
const API_URL = 'http://localhost:3000/auth';
// For testing on physical device, use your computer's IP:
// const API_URL = 'http://192.168.1.100:3000/auth';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ==================== AUTH SERVICE ====================

// Sign up new user
export const signUp = async (userData) => {
  try {
    const response = await api.post('/signup', {
      email: userData.email,
      password: userData.password,
      fullName: userData.fullName,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Sign up failed. Please try again.'
    );
  }
};

// Confirm sign up with verification code
export const confirmSignUp = async (email, code) => {
  try {
    const response = await api.post('/confirm-signup', {
      email,
      code,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Verification failed. Please check the code.'
    );
  }
};

// Resend verification code
export const resendConfirmationCode = async (email) => {
  try {
    const response = await api.post('/resend-code', {
      email,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Failed to resend code. Please try again.'
    );
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await api.post('/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Login failed. Please check your credentials.'
    );
  }
};

// Get user information
export const getUserInfo = async (accessToken) => {
  try {
    const response = await api.get('/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Failed to get user information.'
    );
  }
};

// Refresh access token
export const refreshToken = async (refreshToken, email) => {
  try {
    const response = await api.post('/refresh', {
      refreshToken,
      email,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Failed to refresh token.'
    );
  }
};

// Forgot password - request reset code
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/forgot-password', {
      email,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Failed to send reset code.'
    );
  }
};

// Confirm forgot password with code and new password
export const confirmForgotPassword = async (email, code, newPassword) => {
  try {
    const response = await api.post('/confirm-forgot-password', {
      email,
      code,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Failed to reset password.'
    );
  }
};

// Change password (when logged in)
export const changePassword = async (accessToken, oldPassword, newPassword) => {
  try {
    const response = await api.post(
      '/change-password',
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Failed to change password.'
    );
  }
};

// Logout user
export const logout = async (accessToken) => {
  try {
    const response = await api.post(
      '/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 'Failed to logout.'
    );
  }
};

export default api;