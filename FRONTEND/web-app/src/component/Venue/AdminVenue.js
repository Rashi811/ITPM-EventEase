import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminVenue.css';

const AdminVenue = () => {
  // State management
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [actionType, setActionType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    date: '',
    time: '',
    requirements: '',
    status: 'pending',
    venueName: '',
    venueId: ''
  });

  // Hardcoded venue data to match MainVenuePage
  const venues = [
    { _id: "1", name: "Dutchman Street", location: "1/9 Court Road, Dutch Fort, Matara" },
    { _id: "2", name: "Virticle by Jetwing", location: "Access Tower II, Union Place, Colombo 02" },
    { _id: "3", name: "The Barnhouse Studio", location: "96/2 Galpoththa Road 11 Lane, Kalutara" },
    { _id: "4", name: "Honey Beach Club", location: "No 48, Janadhipathi Mawatha, Colombo 1" },
    { _id: "5", name: "Araliya Beach Resort", location: "Yaddehimulla Rd, Unawatuna" },
    { _id: "6", name: "The Blue Water Hotel", location: "Thalpitiya, Wadduwa" }
  ];

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, suggestionsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/bookings`),
        axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/venue-suggestions`)
      ]);

      // Process bookings to include venue names
      const processedBookings = bookingsRes.data.map(booking => {
        const venue = venues.find(v => v._id === booking.venueId);
        return {
          ...booking,
          venueName: venue ? venue.name : 'Unknown Venue',
          venueLocation: venue ? venue.location : ''
        };
      });

      setBookings(Array.isArray(processedBookings) ? processedBookings : []);
      
      // Process suggestions
      let suggestionsData = suggestionsRes.data;
      if (suggestionsData && typeof suggestionsData === 'object' && !Array.isArray(suggestionsData)) {
        suggestionsData = suggestionsData.suggestions || [];
      }
      setSuggestions(Array.isArray(suggestionsData) ? suggestionsData : []);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
      setLoading(false);
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle status change (approve/reject)
  const handleStatusChange = async (id, newStatus, type) => {
    try {
      const endpoint = type === 'booking' ? 'bookings' : 'venue-suggestions';
      await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/${endpoint}/${newStatus}/${id}`
      );
      fetchData(); // Refresh data
    } catch (err) {
      setError(`Failed to update ${type} status. Please try again.`);
      console.error(`Error updating ${type} status:`, err);
    }
  };

  // Handle edit click
  const handleEdit = (item, type) => {
    setCurrentItem(item);
    setActionType(type);
    
    // Format the date for the date input (YYYY-MM-DD)
    let formattedDate = '';
    if (type === 'booking' && item.date) {
      const dateObj = new Date(item.date);
      formattedDate = dateObj.toISOString().split('T')[0];
    }

    setFormData({
      name: type === 'booking' ? item.customerName : item.clientName,
      email: type === 'booking' ? item.customerEmail : item.email,
      phone: item.phoneNumber,
      eventType: item.eventType,
      date: formattedDate,
      time: type === 'booking' ? item.time : '',
      requirements: item.specificRequirements || '',
      status: item.status || 'pending',
      venueName: item.venueName || '',
      venueId: item.venueId || ''
    });
    setShowEditModal(true);
  };

  // Handle delete click
  const handleDeleteClick = (item, type) => {
    setCurrentItem(item);
    setActionType(type);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const endpoint = actionType === 'booking' ? 'bookings' : 'venue-suggestions';
      await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/${endpoint}/${currentItem._id}`
      );
      fetchData(); // Refresh data
      setShowDeleteModal(false);
    } catch (err) {
      setError(`Failed to delete ${actionType}. Please try again.`);
      console.error(`Error deleting ${actionType}:`, err);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle venue selection change
  const handleVenueChange = (e) => {
    const selectedVenueId = e.target.value;
    const selectedVenue = venues.find(v => v._id === selectedVenueId);
    setFormData(prev => ({
      ...prev,
      venueId: selectedVenueId,
      venueName: selectedVenue ? selectedVenue.name : ''
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = actionType === 'booking' ? 'bookings' : 'venue-suggestions';
      const payload = {
        ...formData,
        [actionType === 'booking' ? 'customerName' : 'clientName']: formData.name,
        [actionType === 'booking' ? 'customerEmail' : 'email']: formData.email,
        phoneNumber: formData.phone,
        eventType: formData.eventType,
        specificRequirements: formData.requirements,
        status: formData.status,
        venueName: formData.venueName,
        venueId: formData.venueId
      };

      if (actionType === 'booking') {
        payload.date = formData.date;
        payload.time = formData.time;
      }

      await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/${endpoint}/${currentItem._id}`,
        payload
      );
      
      fetchData(); // Refresh data
      setShowEditModal(false);
    } catch (err) {
      setError(`Failed to update ${actionType}. Please try again.`);
      console.error(`Error updating ${actionType}:`, err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">Loading data...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  // Render helper functions
  const renderStatusBadge = (status) => {
    const className = `status-badge ${
      status === 'approved' ? 'approved' : 
      status === 'rejected' ? 'rejected' : 'pending'
    }`;
    return <span className={className}>{status}</span>;
  };

  const renderActionButtons = (item, type) => {
    return (
      <div className="action-buttons">
        <button className="edit-button" onClick={() => handleEdit(item, type)}>
          Edit
        </button>
        {item.status !== 'approved' && (
          <button className="approve-button" onClick={() => handleStatusChange(item._id, 'approved', type)}>
            Approve
          </button>
        )}
        {item.status !== 'rejected' && (
          <button className="reject-button" onClick={() => handleStatusChange(item._id, 'rejected', type)}>
            Reject
          </button>
        )}
        <button className="delete-button" onClick={() => handleDeleteClick(item, type)}>
          Delete
        </button>
      </div>
    );
  };

  const renderFormGroup = (id, type, label, value) => {
    return (
      <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={handleInputChange}
        />
      </div>
    );
  };

  const renderEmptyState = (message) => {
    return <div className="empty-state">{message}</div>;
  };

  const renderDeleteModal = () => {
    return (
      <div className="modal-overlay">
        <div className="confirmation-dialog">
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete this {actionType}? This action cannot be undone.</p>
          <div className="dialog-actions">
            <button className="cancel-button" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
            <button className="confirm-button" onClick={confirmDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEditModal = () => {
    return (
      <div className="modal-overlay">
        <form className="edit-form" onSubmit={handleSubmit}>
          <h3>Edit {actionType === 'booking' ? 'Booking' : 'Venue Suggestion'}</h3>
          
          {renderFormGroup('name', 'text', 'Name', formData.name)}
          {renderFormGroup('email', 'email', 'Email', formData.email)}
          {renderFormGroup('phone', 'tel', 'Phone Number', formData.phone)}
          
          {actionType === 'booking' && (
            <div className="form-group">
              <label htmlFor="venueId">Venue</label>
              <select
                id="venueId"
                name="venueId"
                value={formData.venueId}
                onChange={handleVenueChange}
                className="form-control"
              >
                <option value="">Select Venue</option>
                {venues.map(venue => (
                  <option key={venue._id} value={venue._id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="eventType">Event Type</label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select Event Type</option>
              {['Wedding', 'Birthday Party', 'Conference', 'Concert', 'Exhibition', 'Other'].map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          {actionType === 'booking' && renderFormGroup('date', 'date', 'Event Date', formData.date)}
          {actionType === 'booking' && renderFormGroup('time', 'time', 'Event Time', formData.time)}
          
          <div className="form-group">
            <label htmlFor="requirements">Specific Requirements</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => setShowEditModal(false)}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderBookingsTable = () => {
    return (
      <div className="bookings-section">
        <div className="section-header">
          <h2>All Booking Requests</h2>
          <div className="total-count">{bookings.length} bookings</div>
        </div>
        
        {bookings.length === 0 ? (
          renderEmptyState('No booking requests found.')
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Venue</th>
                  <th>Location</th>
                  <th>Event Details</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id}>
                    <td>
                      <div className="client-info">
                        <div className="client-name">{booking.customerName}</div>
                        <div className="contact-info">
                          <div>{booking.customerEmail}</div>
                          <div>{booking.phoneNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td>{booking.venueName}</td>
                    <td>{booking.venueLocation}</td>
                    <td>
                      <div className="event-details">
                        <div>{booking.eventType}</div>
                        {booking.specificRequirements && (
                          <div className="requirements">
                            Requirements: {booking.specificRequirements}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="event-details">
                        <div>{new Date(booking.date).toLocaleDateString()}</div>
                        <div>{booking.time}</div>
                      </div>
                    </td>
                    <td>{renderStatusBadge(booking.status)}</td>
                    <td>{renderActionButtons(booking, 'booking')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderSuggestionsTable = () => {
    return (
      <div className="suggestions-section">
        <div className="section-header">
          <h2>All Venue Suggestions</h2>
          <div className="total-count">{suggestions.length} suggestions</div>
        </div>
        
        {suggestions.length === 0 ? (
          renderEmptyState('No venue suggestions found.')
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Suggested By</th>
                  <th>Venue Details</th>
                  <th>Event Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map(suggestion => (
                  <tr key={suggestion._id}>
                    <td>
                      <div className="client-info">
                        <div className="client-name">{suggestion.clientName}</div>
                        <div className="contact-info">
                          <div>{suggestion.email}</div>
                          <div>{suggestion.phoneNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="venue-details">
                        <div className="venue-name">{suggestion.venueName}</div>
                        <div className="venue-location">{suggestion.location}</div>
                        {suggestion.capacity && (
                          <div>Capacity: {suggestion.capacity}</div>
                        )}
                        {suggestion.description && (
                          <div className="venue-description">{suggestion.description}</div>
                        )}
                      </div>
                    </td>
                    <td>{suggestion.eventType}</td>
                    <td>{renderStatusBadge(suggestion.status)}</td>
                    <td>{renderActionButtons(suggestion, 'suggestion')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Venue Management Dashboard</h1>
      
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => handleTabChange('bookings')}
        >
          Booking Requests
        </button>
        <button
          className={`tab-button ${activeTab === 'suggestions' ? 'active' : ''}`}
          onClick={() => handleTabChange('suggestions')}
        >
          Venue Suggestions
        </button>
      </div>
      
      {activeTab === 'bookings' ? renderBookingsTable() : renderSuggestionsTable()}
      
      {showDeleteModal && renderDeleteModal()}
      {showEditModal && renderEditModal()}
    </div>
  );
};

export default AdminVenue;