import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import BookingForm from '../../Venue/BookingForm';
import './BookingPage.css';

const BookingPage = () => {
  const location = useLocation();
  const venue = location.state?.venue;
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleBookingSuccess = () => {
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000); // Popup auto-closes after 3 seconds
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <h1>Book Venue: <span className="highlight">{venue?.name}</span></h1>
        {/* Removed the empty venue-details divs */}
      </div>

      <div className="booking-section">
        <h2>Make Your Reservation</h2>
        <div className="booking-form-container">
          <BookingForm 
            venueId={venue?._id} 
            onBookingSuccess={handleBookingSuccess}
          />
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup">
          <div className="popup-content">
            <div className="popup-icon">✓</div>
            <h3>Booking Successful!</h3>
            <p>Your reservation at {venue?.name} has been confirmed.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;