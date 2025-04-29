import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EventDetails.css";

const EventDetails = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/events/${id}`);
        setEvents(events.filter(event => event._id !== id));
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleUpdate = (event) => {
    navigate("/update-event", { state: { eventData: event } });
  };

  const filteredEvents = events.filter(event => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.eventName.toLowerCase().includes(searchLower) ||
      event.eventType.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="event-details-container">
      <h1 className="event-details-title">All Events</h1>
      
      <div className="event-details-search">
        <input
          type="text"
          placeholder="Search by event name or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="event-details-search-input"
        />
      </div>

      <div className="event-details-list">
        {filteredEvents.length === 0 ? (
          <p className="event-details-no-events">
            {searchTerm ? "No events found matching your search." : "No events found."}
          </p>
        ) : (
          filteredEvents.map((event) => (
            <div key={event._id} className="event-details-card">
              <h3>{event.eventName}</h3>
              <p><strong>Event Type:</strong> {event.eventType}</p>
              <p><strong>Event Name:</strong> {event.eventName}</p>
              <p><strong>Contact Number:</strong> {event.contactNumber}</p>
              <p><strong>Email:</strong> {event.email}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p><strong>Guest Count:</strong> {event.guestCount}</p>
              <p><strong>Guest Details:</strong> {event.guestDetails}</p>
              <p><strong>Special Notes:</strong> {event.specialNotes}</p>

              <div className="event-details-actions">
                <button 
                  className="event-details-button update" 
                  onClick={() => handleUpdate(event)}
                >
                  Update
                </button>
                <button 
                  className="event-details-button delete" 
                  onClick={() => handleDelete(event._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button 
        className="event-details-back-button" 
        onClick={() => navigate("/event")}
      >
        Back to Home
      </button>
    </div>
  );
};

export default EventDetails;