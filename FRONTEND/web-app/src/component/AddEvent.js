import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddEvent.css";

const AddEvent = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    eventType: "",
    eventName: "",
    contactNumber: "",
    email: "",
    date: "",
    guestCount: "",
    guestDetails: "",
    specialNotes: "",
  });

  const currentDate = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Event Data:", eventData);

    try {
      await axios.post("http://localhost:5000/events", eventData);
      alert("Event added successfully!");
      navigate('/');
    } catch (error) {
      console.error("Error adding event:", error.response ? error.response.data : error.message);
      alert("Failed to submit the event. Please try again.");
    }
  };

  return (
    <div className="event-form-container">
      <h1 className="event-form-title">Add Your Event Details Here!</h1>
      <form className="event-form-form" onSubmit={handleSubmit}>
        <select
          className="event-form-select"
          name="eventType"
          value={eventData.eventType}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select Event Type</option>
          <option value="Wedding">Wedding</option>
          <option value="Conference">Conference</option>
          <option value="Get-together">Get-together</option>
          <option value="Workshop">Workshop</option>
          <option value="Birthday">Birthday</option>
          <option value="Engagement">Engagement</option>
          <option value="Other">Other</option>
        </select>
        <input 
          className="event-form-input"
          type="text" 
          name="eventName" 
          placeholder="Event Name" 
          value={eventData.eventName} 
          onChange={handleChange} 
          required
        />
        <input 
          className="event-form-input"
          type="text" 
          name="contactNumber"  
          placeholder="Contact Number"  
          value={eventData.contactNumber} 
          onChange={handleChange} 
          required
        />
        <input 
          className="event-form-input"
          type="email" 
          name="email" 
          placeholder="Email" 
          value={eventData.email} 
          onChange={handleChange}  
          required  
        />
        <input 
          className="event-form-input"
          type="date" 
          name="date" 
          value={eventData.date}  
          onChange={handleChange} 
          required 
          min={currentDate}
        />
        <input 
          className="event-form-input"
          type="number" 
          name="guestCount" 
          placeholder="Guest Count" 
          value={eventData.guestCount}  
          onChange={handleChange} 
          required 
        />
        <textarea 
          className="event-form-textarea"
          name="guestDetails" 
          placeholder="Guest Details"  
          value={eventData.guestDetails} 
          onChange={handleChange}
        ></textarea>
        <textarea 
          className="event-form-textarea"
          name="specialNotes" 
          placeholder="Special Notes" 
          value={eventData.specialNotes} 
          onChange={handleChange}
        ></textarea>
        
        <button className="event-form-button" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddEvent;