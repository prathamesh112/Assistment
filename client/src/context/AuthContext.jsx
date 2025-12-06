import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to load user', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    
    loadUser();
  }, []);

  const signup = async (name, email, password) => {
    try {
      const response = await authAPI.signup(name, email, password);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      toast.success('Account created successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed';
      toast.error(message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      toast.success('Login successful!');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully!');
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};