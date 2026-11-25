// src/services/authService.js
import { apiService } from './apiService';
import { API_ENDPOINTS } from '../utils/constants';

export class AuthService {
  // Login user
  static async login(credentials) {
    try {
      const response = await apiService.post(API_ENDPOINTS.LOGIN, {
        email: credentials.email,
        password: credentials.password,
      });

      if (response.success) {
        return {
          user: response.user,
          token: response.token,
        };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      throw new Error(error.message || 'Network error during login');
    }
  }

  // Register new user
  static async register(userData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.REGISTER, {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: userData.phone,
      });

      if (response.success) {
        return {
          user: response.user,
          token: response.token,
        };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      throw new Error(error.message || 'Network error during registration');
    }
  }

  // Verify token validity
  static async verifyToken(token) {
    try {
      const response = await apiService.get(API_ENDPOINTS.VERIFY_TOKEN);
      
      if (response.success) {
        return response.user;
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      throw new Error('Token verification failed');
    }
  }

  // Logout user
  static async logout() {
    try {
      await apiService.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Don't throw error for logout as we want to clear local data anyway
    }
  }

  // Forgot password
  static async forgotPassword(email) {
    try {
      const response = await apiService.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
      
      if (response.success) {
        return response.message;
      } else {
        throw new Error(response.message || 'Failed to send reset email');
      }
    } catch (error) {
      throw new Error(error.message || 'Network error during password reset');
    }
  }

  // Reset password
  static async resetPassword(token, newPassword) {
    try {
      const response = await apiService.post(API_ENDPOINTS.RESET_PASSWORD, {
        token,
        password: newPassword,
      });

      if (response.success) {
        return response.message;
      } else {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      throw new Error(error.message || 'Network error during password reset');
    }
  }

  // Change password (for logged-in users)
  static async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiService.post(API_ENDPOINTS.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });

      if (response.success) {
        return response.message;
      } else {
        throw new Error(response.message || 'Password change failed');
      }
    } catch (error) {
      throw new Error(error.message || 'Network error during password change');
    }
  }

  // Update user profile
  static async updateProfile(userId, updates) {
    try {
      const response = await apiService.put(`${API_ENDPOINTS.USERS}/${userId}`, updates);
      
      if (response.success) {
        return response.user;
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      throw new Error(error.message || 'Network error during profile update');
    }
  }

  // Refresh token
  static async refreshToken() {
    try {
      const response = await apiService.post(API_ENDPOINTS.REFRESH_TOKEN);
      
      if (response.success) {
        localStorage.setItem('auth_token', response.token);
        return response.token;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      // Clear invalid token
      localStorage.removeItem('auth_token');
      throw new Error('Session expired. Please login again.');
    }
  }

  // Get current user profile
  static async getCurrentUser() {
    try {
      const response = await apiService.get(API_ENDPOINTS.CURRENT_USER);
      
      if (response.success) {
        return response.user;
      } else {
        throw new Error('Failed to get user profile');
      }
    } catch (error) {
      throw new Error(error.message || 'Network error getting user profile');
    }
  }

  // Update user avatar
  static async updateAvatar(avatarFile) {
    try {
      const response = await apiService.uploadFile(
        API_ENDPOINTS.UPLOAD_AVATAR,
        avatarFile
      );

      if (response.success) {
        return response.avatarUrl;
      } else {
        throw new Error(response.message || 'Avatar upload failed');
      }
    } catch (error) {
      throw new Error(error.message || 'Network error during avatar upload');
    }
  }

  // Social login methods
  static async googleLogin(googleToken) {
    try {
      const response = await apiService.post(API_ENDPOINTS.GOOGLE_LOGIN, {
        token: googleToken,
      });

      if (response.success) {
        return {
          user: response.user,
          token: response.token,
        };
      } else {
        throw new Error(response.message || 'Google login failed');
      }
    } catch (error) {
      throw new Error(error.message || 'Google login error');
    }
  }

  // Check if email exists
  static async checkEmailExists(email) {
    try {
      const response = await apiService.post(API_ENDPOINTS.CHECK_EMAIL, { email });
      return response.exists;
    } catch (error) {
        console.error('Error checking email existence:', error);
      return false;
    }
  }
}
