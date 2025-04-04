import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateEvent.css";

const UpdateEvent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(location.state?.eventData || {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.put(`http://localhost:5000/events/${eventData._id}`, eventData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/event-details");
      }, 1500);
    } catch (error) {
      console.error("Error updating event:", error);
      setError("Failed to update event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="event-update-container">
      <h1 className="event-update-title">Update Event</h1>
      
      {success && (
        <div className="event-update-success">
          Event updated successfully! Redirecting...
        </div>
      )}
      
      {error && (
        <div className="event-update-error-message">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="event-update-loading">Updating event...</div>
      ) : (
        <form className="event-update-form" onSubmit={handleSubmit}>
          <input
            className="event-update-input"
            type="text"
            name="eventName"
            value={eventData.eventName || ""}
            placeholder="Event Name"
            onChange={handleChange}
            required
          />
          <input
            className="event-update-input"
            type="text"
            name="eventType"
            value={eventData.eventType || ""}
            placeholder="Event Type"
            onChange={handleChange}
            required
          />
          <input
            className="event-update-input"
            type="text"
            name="contactNumber"
            value={eventData.contactNumber || ""}
            placeholder="Contact Number"
            onChange={handleChange}
            required
          />
          <input
            className="event-update-input"
            type="email"
            name="email"
            value={eventData.email || ""}
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            className="event-update-input"
            type="date"
            name="date"
            value={eventData.date ? eventData.date.split("T")[0] : ""}
            onChange={handleChange}
            required
          />
          <input
            className="event-update-input"
            type="number"
            name="guestCount"
            value={eventData.guestCount || ""}
            placeholder="Guest Count"
            onChange={handleChange}
            required
          />
          <textarea
            className="event-update-textarea"
            name="guestDetails"
            value={eventData.guestDetails || ""}
            placeholder="Guest Details"
            onChange={handleChange}
          ></textarea>
          <textarea
            className="event-update-textarea"
            name="specialNotes"
            value={eventData.specialNotes || ""}
            placeholder="Special Notes"
            onChange={handleChange}
          ></textarea>
          <button className="event-update-button" type="submit">
            Update Event
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateEvent;