import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./EventHome.css";

const images = [
  "/images/img1.jpg",
  "/images/img2.jpg",
  "/images/img3.jpg",
  "/images/img4.jpg",
  "/images/img5.jpg"
];

const EventHome = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="event-home">
      <div className="content">
        {/* Left Side: Text */}
        <div className="text-section">
          <h1>Effortless Event Planning, Simplified!</h1>
          <p>
            Plan and manage your events seamlessly with EventEase. From adding events 
            to managing guest lists, we make event planning hassle-free!
          </p>
          <div className="buttons">
            <Link to="/add-event" className="btn">Add Event</Link>
           
          </div>
        </div>

        {/* Right Side: Image Slider */}
        <div className="image-slider">
          <img src={images[currentImageIndex]} alt="Event" />
        </div>
      </div>
    </div>
  );
};

export default EventHome;
