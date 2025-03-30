import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EventDetails.css";

const EventDetails = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios
      .get("http://localhost:5000/events")
      .then((response) => {
        setEvents(response.data.events);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/events/${id}`);
      setEvents(events.filter(event => event._id !== id)); // Remove deleted event
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleUpdate = (event) => {
    navigate("/update-event", { state: { eventData: event } });
  };

  return (
    <div className="event-details">
      <h1>All Events</h1>
      <div className="event-list">
        {events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <h3>{event.eventName}</h3>
              <p><strong>Event Type:</strong> {event.eventType}</p>
              <p><strong>Event Name:</strong> {event.eventName}</p>
              <p><strong>Contact Number:</strong> {event.contactNumber}</p>
              <p><strong>Email:</strong> {event.email}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Guest Count:</strong> {event.guestCount}</p>
              <p><strong>Guest Details:</strong> {event.guestDetails}</p>
              <p><strong>Special Notes:</strong> {event.specialNotes}</p>

              <button className="update-button" onClick={() => handleUpdate(event)}>Update</button>
              <button className="delete-button" onClick={() => handleDelete(event._id)}>Delete</button>

            </div>
          ))
        )}
      </div>
<br></br><br></br>
      {/* Back to Home Button */}
      <button className="back-home-btn" onClick={() => navigate("/event")}>
        Back to Home
      </button>

    </div>
  );
};

export default EventDetails;
