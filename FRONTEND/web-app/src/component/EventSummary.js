import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./EventSummary.css";

const EventSummary = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL
  console.log("Extracted ID from URL:", id);
  const [eventData, setEventData] = useState(null);

  useEffect(() => {

    if (!id) {
      console.error("No ID found in URL");
      return;
    }

    axios.get(`http://localhost:5000/events/${id}`)
      .then((response) => setEventData(response.data))
      .catch((error) => console.error("Error fetching event:", error));
  }, [id]);

  if (!eventData) {
    return <h1>Loading event details...</h1>;
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/events/${eventData._id}`);
      alert("Details deleted successfully");
      navigate("/events");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete the event.");
    }
  };

  return (
    <div className="event-summary">
      <h1>Event Summary</h1>
      <p><strong>Event Type:</strong> {eventData.eventType}</p>
      <p><strong>Event Name:</strong> {eventData.eventName}</p>
      <p><strong>Contact Number:</strong> {eventData.contactNumber}</p>
      <p><strong>Email:</strong> {eventData.email}</p>
      <p><strong>Date:</strong> {eventData.date}</p>
      <p><strong>Guests:</strong> {eventData.guestCount}</p>
      <p><strong>Guest Details:</strong> {eventData.guestDetails}</p>
      <p><strong>Special Notes:</strong> {eventData.specialNotes}</p>

      <button onClick={() => navigate(`/update-event/${eventData._id}`)}>Update</button>
      <button onClick={handleDelete} className="delete-btn">Delete</button>
    </div>
  );
};

export default EventSummary;
