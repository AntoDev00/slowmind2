import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If we have a token, try to get user data
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      
      // Verifica se abbiamo già dati utente nel localStorage
      const savedUser = localStorage.getItem('userData');
      if (savedUser) {
        try {
          // Utilizza i dati utente salvati direttamente
          setCurrentUser(JSON.parse(savedUser));
          return; // Usiamo i dati salvati, non decodifichiamo il token
        } catch (error) {
          console.error('Error parsing saved user data', error);
          // Continua con il metodo di fallback se c'è un errore
        }
      }
      
      // Fallback: decodifica il token JWT
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userData = {
          id: payload.id,
          email: payload.email,
          username: payload.username || payload.email.split('@')[0]
        };
        setCurrentUser(userData);
        
        // Salva i dati utente per uso futuro
        localStorage.setItem('userData', JSON.stringify(userData));
      } catch (error) {
        console.error('Error parsing token', error);
        logout();
      }
    }
    setIsLoading(false);
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/register', userData);
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
      const res = await axios.post('http://localhost:5000/api/login', userData);
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
    delete axios.defaults.headers.common['x-auth-token'];
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
