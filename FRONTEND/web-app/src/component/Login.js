import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../component/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Admin credentials (in a real app, these would be stored securely)
    const adminCredentials = {
      username: 'admin',
      password: 'admin123'
    };

    try {
      if (formData.username === adminCredentials.username && 
          formData.password === adminCredentials.password) {
        login({ username: formData.username, isAdmin: true });
        navigate('/admin-dashboard');
      } else {
        // Here you would typically make an API call to your backend
        // For now, we'll just navigate to home for regular users
        login({ username: formData.username, isAdmin: false });
        localStorage.setItem('email', formData.username);
        navigate('/');
      }
    } catch (err) {
      setError('Incorrect login credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="signup-link">
          Don't have an account? <span onClick={() => navigate('/signUp')}>Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default Login; 