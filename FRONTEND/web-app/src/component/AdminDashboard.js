import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(`/admin/${path}`);
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
        <div className="nav-links">
          <button onClick={() => handleNavigation('admin-event')}>Event</button>
          <button onClick={() => handleNavigation('admin-venue-home')}>Venue</button>
          <button onClick={() => handleNavigation('task-dashboard')}>Task</button>
          <button onClick={() => handleNavigation('reminders')}>Reminder</button>
          <button onClick={() => handleNavigation('confirm')}>Confirm Event</button>
        </div>
        
      </nav>
      <div className="admin-content">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the EventEase Admin Panel</p>
      </div>
    </div>
  );
};

export default AdminDashboard; 