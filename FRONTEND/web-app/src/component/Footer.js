import React from "react";
import { FaYoutube, FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  // Google Maps link for the specific address
  const mapLink = "https://www.google.com/maps/place/Malabe,+Sri+Lanka/@6.8281986,80.0128946,13z";

  return (
    <div className="footer">
      <div className="footer-content">
        {/* Left side: Contact Information */}
        <div className="contact-info">
          <p><FaMapMarkerAlt /> No.12, New Kandy Rd, Malabe</p>
          <p><FaPhoneAlt /> +94 11 2233445</p>
        </div>

        {/* Center: Social Media Links */}
        <div className="social-icons">
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /> YouTube</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /> Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /> Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /> Instagram</a>
        </div>

        {/* Right side: Map Link */}
        <div className="map-link">
          <a href={mapLink} target="_blank" rel="noopener noreferrer">
            <FaMapMarkerAlt /> View on Map
          </a>
        </div>
      </div>
      <div className="copyright">
        © All rights reserved by EventEase (PVT) 2025.
      </div>
    </div>
  );
};

export default Footer;