import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="eventease-about-container">
      <h1 className="eventease-about-title">About EventEase</h1>
      <p className="eventease-about-text">
        Welcome to <span className="eventease-brand-name">EventEase</span>, your trusted partner in simplified event management. 
        Whether it's a corporate gathering, a wedding, a concert, or a private celebration, we bring your vision to life 
        with precision and creativity.
      </p>

      <h2 className="eventease-about-heading">Our Mission</h2>
      <p className="eventease-about-text">
        At EventEase, we believe that every event should be an unforgettable experience. 
        Our mission is to provide top-notch event planning services tailored to your unique needs, 
        ensuring perfection in every detail.
      </p>

      <h2 className="eventease-about-heading">Why Choose Us?</h2>
      <ul className="eventease-about-list">
        <li>✅ Professional and experienced event planners</li>
        <li>✅ Personalized event solutions</li>
        <li>✅ Seamless coordination and execution</li>
        <li>✅ Affordable packages for all event types</li>
      </ul>

      <p className="eventease-about-text">
        Let’s make your dream event a reality! 
      </p>
      <p className="eventease-about-text">
      Contact us today to start planning your next big occasion</p>
    </div>
  );
};

export default AboutUs;
