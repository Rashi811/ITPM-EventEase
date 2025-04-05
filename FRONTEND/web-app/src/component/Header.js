import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "./logo.png";
import { FaSearch, FaUser, FaRegUser } from "react-icons/fa";

const Header = () => {
  return (
    <header className="header-container">
      <div className="header-logo">
        <img src={logo} alt="EventEase Logo" className="header-logo-img" />
        <h1 className="header-event-name">EventEase</h1>
      </div>
      <nav className="header-nav-links">
        <Link to="/" className="header-nav-item">Home</Link>
        <Link to="/search" className="header-nav-item">
          <FaSearch className="header-icon" />
        </Link>
        <Link to="/login" className="header-nav-item">
          <FaUser className="header-icon" /> Login
        </Link>
        <Link to="/signup" className="header-nav-item">
          <FaRegUser className="header-icon" /> Signup
        </Link>
      </nav>
    </header>
  );
};

export default Header;