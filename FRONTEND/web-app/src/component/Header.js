import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../component/AuthContext';
import './Header.css';
import logo from './logo.png';
import { FaSearch, FaUser, FaRegUser, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header-container">
      <div className="header-logo">
        <img src={logo} alt="EventEase Logo" className="header-logo-img" />
        <h1 className="header-event-name">EventEase</h1>
      </div>
      <nav className="header-nav-links">
        {isAuthenticated ? (
          <>
            <Link to="/search" className="header-nav-item">
              <FaSearch className="header-icon" />
            </Link>
            <Link to="/" className="header-nav-item">Home</Link>
            <Link to="/event" className="header-nav-item">Events</Link>
            <Link to="/venues" className="header-nav-item">Venues</Link>
            <Link to="/task-dashboard" className="header-nav-item">Tasks</Link>
            <Link to="/reminder" className="header-nav-item">Reminder</Link>
            <Link to="/about" className="header-nav-item">About</Link>


            {user?.isAdmin && (
              <Link to="/admin-dashboard" className="header-nav-item">
                <FaUser className="header-icon" /> Admin
              </Link>
            )}
            <button onClick={handleLogout} className="header-nav-item logout-button">
              <FaSignOutAlt className="header-icon" /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/about" className="header-nav-item">About Us</Link>
            <Link to="/login" className="header-nav-item">
              <FaUser className="header-icon" /> Login
            </Link>
            <Link to="/signUp" className="header-nav-item">
              <FaRegUser className="header-icon" /> Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header; 