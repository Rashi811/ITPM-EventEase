import React, { useState } from 'react';
import axios from 'axios';
import './BookingForm.css';

const BookingForm = ({ venueId, onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    customerEmail: '',
    eventType: '',
    bookingDate: '',
    time: '',
    specificRequirements: '',
  });

  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Define event types array
  const eventTypes = [
    "Wedding",
    "Birthday Party",
    "Conference",
    "Concert",
    "Exhibition",
    "Other"
  ];

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.customerName.trim()) errors.customerName = 'Name is required';
    if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
    else if (!phoneRegex.test(formData.phoneNumber)) errors.phoneNumber = 'Phone number must be 10 digits';

    // Convert email to lowercase before validation
    const lowercaseEmail = formData.customerEmail.trim().toLowerCase();
    if (!lowercaseEmail) {
      errors.customerEmail = 'Email is required';
    } else if (!emailRegex.test(lowercaseEmail)) {
      errors.customerEmail = 'Invalid email format';
    } else {
      // Update form data to store email in lowercase
      setFormData(prev => ({ ...prev, customerEmail: lowercaseEmail }));
    }

    if (!formData.eventType.trim()) errors.eventType = 'Event type is required';
    if (!formData.bookingDate) errors.bookingDate = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If email field is changed, convert it to lowercase
    if (name === 'customerEmail') {
      setFormData(prev => ({ ...prev, [name]: value.toLowerCase() }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/bookings', {
        venueId,
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        customerEmail: formData.customerEmail,
        eventType: formData.eventType,
        date: formData.bookingDate,
        time: formData.time,
        specificRequirements: formData.specificRequirements
      });
      
      setMessage({ 
        text: 'Booking successful!', 
        type: 'success' 
      });
      
      setFormData({
        customerName: '',
        phoneNumber: '',
        customerEmail: '',
        eventType: '',
        bookingDate: '',
        time: '',
        specificRequirements: ''
      });
      
      if (onBookingSuccess) {
        onBookingSuccess();
      }
      
    } catch (error) {
      let errorMessage = "Booking failed. Please try again.";
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      setMessage({ 
        text: errorMessage, 
        type: 'error' 
      });
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <div className="form-group">
        <label htmlFor="customerName">Your Name</label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          className={validationErrors.customerName ? 'error' : ''}
        />
        {validationErrors.customerName && (
          <span className="error-text">{validationErrors.customerName}</span>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="text"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className={validationErrors.phoneNumber ? 'error' : ''}
        />
        {validationErrors.phoneNumber && (
          <span className="error-text">{validationErrors.phoneNumber}</span>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="customerEmail">Email Address</label>
        <input
          type="email"
          id="customerEmail"
          name="customerEmail"
          value={formData.customerEmail}
          onChange={handleChange}
          className={validationErrors.customerEmail ? 'error' : ''}
        />
        {validationErrors.customerEmail && (
          <span className="error-text">{validationErrors.customerEmail}</span>
        )}
      </div>
      
      {/* Updated Event Type Field - Now a dropdown select */}
      <div className="form-group">
        <label htmlFor="eventType">Event Type</label>
        <select
          id="eventType"
          name="eventType"
          value={formData.eventType}
          onChange={handleChange}
          className={validationErrors.eventType ? 'error' : ''}
        >
          <option value="">Select Event Type</option>
          {eventTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
        {validationErrors.eventType && (
          <span className="error-text">{validationErrors.eventType}</span>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="bookingDate">Date</label>
        <input
          type="date"
          id="bookingDate"
          name="bookingDate"
          value={formData.bookingDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
          className={validationErrors.bookingDate ? 'error' : ''}
        />
        {validationErrors.bookingDate && (
          <span className="error-text">{validationErrors.bookingDate}</span>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="time">Time</label>
        <select 
          id="time"
          name="time" 
          onChange={handleChange} 
          value={formData.time} 
          className={validationErrors.time ? 'error' : ''}
        >
          <option value="">Select Time</option>
          {["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM"].map((time, index) => (
            <option key={index} value={time}>{time}</option>
          ))}
        </select>
        {validationErrors.time && (
          <span className="error-text">{validationErrors.time}</span>
        )}
      </div>

      {/* Specific Requirements */}
      <div className="form-group">
        <label htmlFor="specificRequirements">Specific Requirements</label>
        <textarea
          id="specificRequirements"
          name="specificRequirements"
          value={formData.specificRequirements}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <button type="submit" disabled={loading}>
          {loading ? "Booking..." : "Submit Booking"}
        </button>
      </div>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </form>
  );
};

export default BookingForm;