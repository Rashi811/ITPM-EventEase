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
          <button onClick={() => handleNavigation('events')}>Event</button>
          <button onClick={() => handleNavigation('venues')}>Venue</button>
          <button onClick={() => handleNavigation('tasks')}>Task</button>
          <button onClick={() => handleNavigation('reminders')}>Reminder</button>
        </div>
      </nav>
      <div className="admin-content">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the EventEase Admin Panel</p>
        <p>Select an option from the navigation bar above to manage different aspects of the system.</p>
      </div>
    </div>
  );
};

export default AdminDashboard; 