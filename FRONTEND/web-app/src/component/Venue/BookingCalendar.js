
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './BookingCalendar.css';

const BookingCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());

  // Format month and year for display
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Navigation handlers
  const handlePrevMonth = () => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    setViewDate(newDate);
    setDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    setViewDate(newDate);
    setDate(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    setViewDate(today);
    setDate(today);
  };

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, suggestionsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/bookings`),
        axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/venue-suggestions`)
      ]);

      const bookingsData = bookingsRes.data.data || bookingsRes.data || [];
      const suggestionsData = suggestionsRes.data.data || suggestionsRes.data || [];

      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setSuggestions(Array.isArray(suggestionsData) ? suggestionsData : []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      setLoading(false);
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter events for selected date
  useEffect(() => {
    const filterEventsForDate = (selectedDate) => {
      if (!selectedDate) return;
      
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      const dayBookings = bookings
        .filter(booking => {
          try {
            const bookingDate = new Date(booking.date);
            return bookingDate.toISOString().split('T')[0] === dateStr;
          } catch (e) {
            return false;
          }
        })
        .map(booking => ({
          ...booking,
          type: 'booking',
          title: booking.venueName || booking.venueId || 'Venue Not Specified',
          color: getStatusColor(booking.status)
        }));

      const daySuggestions = suggestions
        .filter(suggestion => {
          try {
            const suggestionDate = new Date(suggestion.date);
            return suggestionDate.toISOString().split('T')[0] === dateStr;
          } catch (e) {
            return false;
          }
        })
        .map(suggestion => ({
          ...suggestion,
          type: 'suggestion',
          title: suggestion.venueName || 'Venue Not Specified',
          color: getStatusColor(suggestion.status)
        }));

      const allEvents = [...dayBookings, ...daySuggestions]
        .sort((a, b) => {
          const timeA = a.time || '00:00';
          const timeB = b.time || '00:00';
          return timeA.localeCompare(timeB);
        });

      setSelectedDateEvents(allEvents);
    };

    filterEventsForDate(date);
  }, [date, bookings, suggestions]);

  // Get status color with darker shades
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return '#28a745'; // Dark green
      case 'rejected':
        return '#dc3545'; // Dark red
      default:
        return '#ffc107'; // Dark yellow/amber
    }
  };

  // Check if date has events
  const hasEvents = (date) => {
    if (!date) return false;
    
    const dateStr = date.toISOString().split('T')[0];
    return bookings.some(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate.toISOString().split('T')[0] === dateStr;
    }) || suggestions.some(suggestion => {
      const suggestionDate = new Date(suggestion.date);
      return suggestionDate.toISOString().split('T')[0] === dateStr;
    });
  };

  // Render tile content
  const tileContent = ({ date, view }) => {
    if (view === 'month' && hasEvents(date)) {
      const dateStr = date.toISOString().split('T')[0];
      const dayEvents = [
        ...bookings.filter(booking => {
          const bookingDate = new Date(booking.date);
          return bookingDate.toISOString().split('T')[0] === dateStr;
        }),
        ...suggestions.filter(suggestion => {
          const suggestionDate = new Date(suggestion.date);
          return suggestionDate.toISOString().split('T')[0] === dateStr;
        })
      ];

      return (
        <div className="event-indicators">
          {dayEvents.slice(0, 3).map((event, index) => (
            <div
              key={index}
              className={`event-dot ${event.status?.toLowerCase()}`}
              style={{ backgroundColor: getStatusColor(event.status) }}
            />
          ))}
          {dayEvents.length > 3 && (
            <div className="more-events">+{dayEvents.length - 3}</div>
          )}
        </div>
      );
    }
    return null;
  };

  // Format weekday labels
  const formatShortWeekday = (locale, date) => {
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return weekdays[date.getDay()];
  };

  // Render event details
  const renderEventDetails = (event) => {
    return (
      <div className="event-info">
        <p><strong>Venue:</strong> {event.venueName || event.venueId || 'Not Specified'}</p>
        <p><strong>Time:</strong> {event.time || 'No time set'}</p>
        <p><strong>Status:</strong> {event.status || 'Pending'}</p>
        {event.customerName && <p><strong>Customer:</strong> {event.customerName}</p>}
        {event.eventType && <p><strong>Event Type:</strong> {event.eventType}</p>}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading calendar...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="booking-calendar">
      <h2>Event Calendar</h2>
      
      <div className="calendar-navigation">
        <button onClick={handlePrevMonth}>&lt; Previous</button>
        <div className="current-month">{formatMonthYear(viewDate)}</div>
        <button onClick={handleNextMonth}>Next &gt;</button>
        <button className="today-button" onClick={handleToday}>Today</button>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="event-dot approved" /> Approved
        </div>
        <div className="legend-item">
          <div className="event-dot pending" /> Pending
        </div>
        <div className="legend-item">
          <div className="event-dot rejected" /> Rejected
        </div>
      </div>

      <div className="calendar-container">
        <Calendar
          onChange={setDate}
          value={date}
          view="month"
          tileContent={tileContent}
          formatShortWeekday={formatShortWeekday}
          showNeighboringMonth={true}
          minDetail="year"
          prev2Label={null}
          next2Label={null}
          navigationLabel={({ date }) => formatMonthYear(date)}
        />
        <div className="events-list">
          <h3>Events for {date.toLocaleDateString()}</h3>
          <div className="events-container">
            {selectedDateEvents.length === 0 ? (
              <p>No events scheduled for this date</p>
            ) : (
              selectedDateEvents.map((event, index) => (
                <div 
                  key={`${event.type}-${index}`}
                  className={`event-item ${event.type}`}
                  style={{ borderLeftColor: event.color }}
                >
                  <div className="event-time">{event.time || 'No time set'}</div>
                  <div className="event-details">
                    <div className="event-title">{event.title}</div>
                    {renderEventDetails(event)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
