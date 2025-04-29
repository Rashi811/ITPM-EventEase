import React, { useState } from "react";
import axios from "axios";
import "./SuggestVenueForm.css";

const SuggestVenueForm = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    phoneNumber: "",
    venueName: "",
    location: "",
    eventType: "",
    capacity: "",
    date: "",
    time: "",
    email: "",
    specificRequirements: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,}$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.clientName.trim()) errors.clientName = "Your name is required";
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 digits";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.toLowerCase())) {
      errors.email = "Please enter a valid email address (lowercase letters and numbers only)";
    }
    if (!formData.venueName.trim()) errors.venueName = "Venue name is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.capacity || formData.capacity < 1) 
      errors.capacity = "Capacity must be at least 1";
    if (!formData.eventType.trim()) errors.eventType = "Event type is required";
    if (!formData.date.trim()) {
      errors.date = "Event date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = "Cannot select a past date";
      }
    }
    if (!formData.time.trim()) errors.time = "Event time is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert email to lowercase as user types
    if (name === 'email') {
      setFormData((prev) => ({ ...prev, [name]: value.toLowerCase() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!validateForm()) return;

    setLoading(true);

    try {
      console.log('submit try');
      
      const response = await axios.post(
        "http://localhost:5000/api/venue-suggestions",
        formData
      );
      

      setMessage({ 
        text: "Venue suggestion submitted successfully!", 
        type: "success" 
      });

      setFormData({
        clientName: "",
        phoneNumber: "",
        venueName: "",
        location: "",
        eventType: "",
        date: "",
        time: "",
        capacity: "",
        email: "",
        specificRequirements: "",
      });

      setTimeout(() => setMessage({ text: "", type: "" }), 5000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 
             "Error submitting venue suggestion. Please try again.",
        type: "error",
      });
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const eventTypes = [
    "Wedding",
    "Birthday Party",
    "Conference",
    "Concert",
    "Exhibition",
    "Other"
  ];

  return (
    <div className="suggest-venue-container">
      <h2>Suggest a New Venue</h2>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit} className="suggest-venue-form">
        <div className="form-section">
          <h3>Your Information</h3>

          <div className="form-group">
            <label htmlFor="clientName">Your Name *</label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className={validationErrors.clientName ? "error" : ""}
            />
            {validationErrors.clientName && <span className="error-text">{validationErrors.clientName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={validationErrors.phoneNumber ? "error" : ""}
              placeholder="10 digit number"
            />
            {validationErrors.phoneNumber && <span className="error-text">{validationErrors.phoneNumber}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Your Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={validationErrors.email ? "error" : ""}
              placeholder="example@gmail.com"
            />
            {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Venue Details</h3>

          <div className="form-group">
            <label htmlFor="venueName">Venue Name *</label>
            <input
              type="text"
              id="venueName"
              name="venueName"
              value={formData.venueName}
              onChange={handleChange}
              className={validationErrors.venueName ? "error" : ""}
            />
            {validationErrors.venueName && <span className="error-text">{validationErrors.venueName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={validationErrors.location ? "error" : ""}
              placeholder="Address or area"
            />
            {validationErrors.location && <span className="error-text">{validationErrors.location}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Capacity *</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              min="1"
              value={formData.capacity}
              onChange={handleChange}
              className={validationErrors.capacity ? "error" : ""}
              placeholder="Number of people"
            />
            {validationErrors.capacity && <span className="error-text">{validationErrors.capacity}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Event Details</h3>

          <div className="form-group">
            <label htmlFor="eventType">Event Type *</label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className={validationErrors.eventType ? "error" : ""}
            >
              <option value="">Select event type</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {validationErrors.eventType && <span className="error-text">{validationErrors.eventType}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Event Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={validationErrors.date ? "error" : ""}
            />
            {validationErrors.date && <span className="error-text">{validationErrors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="time">Event Time *</label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={validationErrors.time ? "error" : ""}
            >
              <option value="">Select Time</option>
              {[
                "8:00 AM", "8:30 AM",
                "9:00 AM", "9:30 AM",
                "10:00 AM", "10:30 AM",
                "11:00 AM", "11:30 AM",
                "12:00 PM", "12:30 PM",
                "1:00 PM", "1:30 PM",
                "2:00 PM", "2:30 PM",
                "3:00 PM", "3:30 PM",
                "4:00 PM", "4:30 PM",
                "5:00 PM", "5:30 PM",
                "6:00 PM", "6:30 PM",
                "7:00 PM", "7:30 PM",
                "8:00 PM", "8:30 PM",
                "9:00 PM", "9:30 PM",
                "10:00 PM"
              ].map((time, index) => (
                <option key={index} value={time}>{time}</option>
              ))}
            </select>
            {validationErrors.time && (
              <span className="error-text">{validationErrors.time}</span>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Information</h3>

          <div className="form-group">
            <label htmlFor="specificRequirements">Specific Requirements</label>
            <textarea
              id="specificRequirements"
              name="specificRequirements"
              value={formData.specificRequirements}
              onChange={handleChange}
              rows="4"
              placeholder="Any special requirements for your event"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className={loading ? "loading" : ""}
        >
          {loading ? (
            <>
              <span className="spinner"></span> Submitting...
            </>
          ) : (
            "Submit Suggestion"
          )}
        </button>
      </form>
    </div>
  );
};

export default SuggestVenueForm;