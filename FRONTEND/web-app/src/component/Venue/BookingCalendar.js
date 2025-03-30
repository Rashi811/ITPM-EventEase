import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Proper import
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './BookingCalendar.css';

const localizer = momentLocalizer(moment);

const BookingCalendar = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const eventStyleGetter = (event) => {
    let backgroundColor;
    switch (event.status) {
      case "approved":
        backgroundColor = "#28a745";
        break;
      case "pending":
        backgroundColor = "#ffc107";
        break;
      case "rejected":
        backgroundColor = "#dc3545";
        break;
      case "suggestion":
        backgroundColor = "#17a2b8";
        break;
      default:
        backgroundColor = "#6c757d";
    }

    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "5px",
        border: "none",
        opacity: 0.8,
        display: "block",
        padding: "2px 5px",
      },
    };
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [bookingsRes, suggestionsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/bookings"),
        axios.get("http://localhost:5000/api/venue-suggestions")
      ]);

      const bookingEvents = bookingsRes.data.map(booking => ({
        id: booking._id,
        title: `${booking.customerName} - ${booking.eventType}`,
        start: moment(`${booking.date} ${booking.time}`, "YYYY-MM-DD HH:mm").toDate(),
        end: moment(`${booking.date} ${booking.time}`, "YYYY-MM-DD HH:mm").add(2, 'hours').toDate(),
        allDay: false,
        status: booking.status || "pending",
        type: "booking",
        customer: booking.customerName,
        email: booking.customerEmail,
        phone: booking.phoneNumber,
        requirements: booking.specificRequirements
      }));

      const suggestionEvents = suggestionsRes.data
        .filter(suggestion => suggestion.preferredDate)
        .map(suggestion => ({
          id: suggestion._id,
          title: `${suggestion.clientName} - Venue Suggestion`,
          start: moment(suggestion.preferredDate).toDate(),
          end: moment(suggestion.preferredDate).add(1, 'day').toDate(),
          allDay: true,
          status: suggestion.status || "pending",
          type: "suggestion",
          customer: suggestion.clientName,
          email: suggestion.email,
          phone: suggestion.phoneNumber,
          venue: suggestion.venueName,
          location: suggestion.location
        }));

      setEvents([...bookingEvents, ...suggestionEvents]);
    } catch (error) {
      console.error("API Error:", error);
      setError(`Failed to load data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const EventComponent = ({ event }) => {
    return (
      <div className="custom-event">
        <strong>{event.title}</strong>
        <div className="event-time">
          {!event.allDay && moment(event.start).format("h:mm A")}
          {!event.allDay && " - " + moment(event.end).format("h:mm A")}
        </div>
        <div className="event-status">{event.status}</div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading-spinner">Loading calendar data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="booking-calendar-container">
      <h2 className="calendar-header">Venue Booking Calendar</h2>
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color approved"></span>
          <span>Approved Bookings</span>
        </div>
        <div className="legend-item">
          <span className="legend-color pending"></span>
          <span>Pending Bookings</span>
        </div>
        <div className="legend-item">
          <span className="legend-color rejected"></span>
          <span>Rejected Bookings</span>
        </div>
        <div className="legend-item">
          <span className="legend-color suggestion"></span>
          <span>Venue Suggestions</span>
        </div>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultDate={currentDate}
        date={currentDate}
        views={["month", "week", "day", "agenda"]}
        onNavigate={(date) => setCurrentDate(date)}
        eventPropGetter={eventStyleGetter}
        components={{
          event: EventComponent
        }}
        onSelectEvent={(event) => {
          alert(
            `Details:\n\n` +
            `Type: ${event.type}\n` +
            `Customer: ${event.customer}\n` +
            `Email: ${event.email}\n` +
            `Phone: ${event.phone}\n` +
            (event.venue ? `Venue: ${event.venue}\nLocation: ${event.location}\n` : '') +
            (event.requirements ? `Requirements: ${event.requirements}\n` : '') +
            `Status: ${event.status}`
          );
        }}
        style={{ height: 700 }}
      />
    </div>
  );
};

export default BookingCalendar;