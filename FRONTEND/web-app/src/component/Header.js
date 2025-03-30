import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "./logo.png";
import { FaCartPlus, FaSearch, FaUser, FaRegUser } from "react-icons/fa"; // Import icons from React Icons

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="EventEase Logo" className="logo-img" />
        <h1 className="event-name">EventEase</h1>
      </div>
      <nav className="nav-links">
        <Link to="/" className="nav-item">Home</Link> {/* Home link */}
       
      
        { /* <Link to="/task-dashboard" className="nav-item">Task</Link>  */}
          
        <Link to="/search" className="nav-item">
          <FaSearch className="icon" /> {/* Search Icon */}
        </Link>
        <Link to="/login" className="nav-item">
          <FaUser className="icon" /> Login {/* Login Icon */}
        </Link>
        <Link to="/signup" className="nav-item">
          <FaRegUser className="icon" /> Signup {/* Signup Icon */}
        </Link>
      </nav>
    </header>
  );
};

export default Header;
