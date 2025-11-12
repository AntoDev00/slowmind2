import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const savedUser = localStorage.getItem('userData');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error parsing saved user data', error);
          localStorage.removeItem('userData');
        }
      }

      try {
        const response = await apiClient.get('/api/users/me');
        setCurrentUser(response.data);
        localStorage.setItem('userData', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching user profile', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      const res = await apiClient.post('/api/register', userData);
      setToken(res.data.token);
      setCurrentUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      // Salva i dati utente per mantenerli tra le sessioni
      localStorage.setItem('userData', JSON.stringify(res.data.user));
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during registration' };
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      const res = await apiClient.post('/api/login', userData);
      setToken(res.data.token);
      setCurrentUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      // Salva i dati utente per mantenerli tra le sessioni
      localStorage.setItem('userData', JSON.stringify(res.data.user));
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  };

  // Logout user
  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData'); // Rimuovi anche i dati utente salvati
    delete apiClient.defaults.headers.common['x-auth-token'];
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        register,
        login,
        logout,
        setCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
