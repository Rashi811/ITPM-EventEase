import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateEvent.css";

const UpdateEvent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(location.state?.eventData || {});

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/events/${eventData._id}`, eventData);
      navigate("/event-details"); // Redirect to event details after update
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <div className="update-event">
      <h1>Update Event</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="eventName" value={eventData.eventName || ""} placeholder="Event Name" onChange={handleChange} required />
        <input type="text" name="eventType" value={eventData.eventType || ""} placeholder="Event Type" onChange={handleChange} required />
        <input type="text" name="contactNumber" value={eventData.contactNumber || ""} placeholder="Contact Number" onChange={handleChange} required />
        <input type="email" name="email" value={eventData.email || ""} placeholder="Email" onChange={handleChange} required />
        <input type="date" name="date" value={eventData.date ? eventData.date.split("T")[0] : ""} onChange={handleChange} required />
        <input type="number" name="guestCount" value={eventData.guestCount || ""} placeholder="Guest Count" onChange={handleChange} required />
        <textarea name="guestDetails" value={eventData.guestDetails || ""} placeholder="Guest Details" onChange={handleChange}></textarea>
        <textarea name="specialNotes" value={eventData.specialNotes || ""} placeholder="Special Notes" onChange={handleChange}></textarea>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateEvent;
