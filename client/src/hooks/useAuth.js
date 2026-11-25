// src/hooks/useAuth.js
import { useAuth } from '@clerk/clerk-react';

export const useAuthToken = () => {
  const { getToken } = useAuth();
  return getToken;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const userData = await AuthService.verifyToken(token);
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user: userData, token } = await AuthService.login(credentials);
      
      localStorage.setItem('auth_token', token);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const { user: newUser, token } = await AuthService.register(userData);
      
      localStorage.setItem('auth_token', token);
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      setError(null);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      const updatedUser = await AuthService.updateProfile(user.id, updates);
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
export const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    if (!isAuthenticated) {
      return <div className="text-center p-8">Please log in to access this page.</div>;
    }

    return <WrappedComponent {...props} />;
  };
};
