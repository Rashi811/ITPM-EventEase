import React, { useState, useEffect } from 'react';
import './HomePage.css';

function HomePage() {
  // Set initial index to the first image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    '/images/img6.jpg', 
    '/images/img7.jpg',
    '/images/img8.jpg',
    '/images/img9.jpg',
    '/images/img10.jpg',
  ];

  // Update the image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
  
    return () => clearInterval(interval);
  }, [images.length]); // Add images.length to dependencies
  

  return (
    <div className="homepage-container">
      

      <div className="homepage-hero-section">
        <h1 className="homepage-title">You Keep Dreaming... We'll Keep Working...</h1>
        <br /><br />
        
        <div className="homepage-image-carousel">
          <img src={images[currentImageIndex]} alt="EventEase" className="homepage-carousel-image" />
        </div>

        <br></br>

        {/* First paragraph (left side of the image) */}
        <p className="homepage-paragraph homepage-left-text">
          Plan your event effortlessly with EventEase. We handle the details, you enjoy the moment.
        </p>

        {/* Second paragraph (right side of the image) */}
        <p className="homepage-paragraph homepage-right-text">
          Experience simplified event planning with our dedicated team. Your perfect event starts here!
        </p>

        <p className="homepage-paragraph homepage-right-text2">
          #Sri Lanka's No.1 Event Management Company!
        </p>
      </div>
    </div>
  );
}

export default HomePage;