import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminVenue.css';

const AdminVenue = () => {
  // ========== HELPER FUNCTIONS ========== //
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

  const renderEmptyState = (message) => {
    return <div className="empty-state">{message}</div>;
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

  const renderDeleteModal = () => {
    return (
      <div className="modal-overlay">
        <div className="confirmation-dialog">
          <h3>Confirm Deletion</h3>
          <p>
            Are you sure you want to delete this {actionType}? This action cannot be undone.
          </p>
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
        <form className="edit-form compact-form" onSubmit={handleSubmit}>
          <h3>Edit {actionType === 'booking' ? 'Booking' : 'Venue Suggestion'}</h3>
          
          <div className="form-row">
            {renderFormGroup('name', 'text', 'Name', formData.name)}
            {renderFormGroup('email', 'email', 'Email', formData.email)}
            {renderFormGroup('phone', 'tel', 'Phone Number', formData.phone)}
          </div>

          {actionType === 'booking' && (
            <div className="form-row">
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
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="form-row">
            {renderFormGroup('date', 'date', actionType === 'booking' ? 'Event Date' : 'Suggested Date', formData.date)}
            {renderFormGroup('time', 'time', actionType === 'booking' ? 'Event Time' : 'Suggested Time', formData.time)}
          </div>

          <div className="form-group">
            <label htmlFor="requirements">
              {actionType === 'booking' ? 'Specific Requirements' : 'Description'}
            </label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="form-group status-group">
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

  // ========== STATE MANAGEMENT ========== //
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [actionType, setActionType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
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

  // Hardcoded venue data
  const venues = [
    { _id: "1", name: "Dutchman Street", location: "1/9 Court Road, Dutch Fort, Matara" },
    { _id: "2", name: "Virticle by Jetwing", location: "Access Tower II, Union Place, Colombo 02" },
    { _id: "3", name: "The Barnhouse Studio", location: "96/2 Galpoththa Road 11 Lane, Kalutara" },
    { _id: "4", name: "Honey Beach Club", location: "No 48, Janadhipathi Mawatha, Colombo 1" },
    { _id: "5", name: "Araliya Beach Resort", location: "Yaddehimulla Rd, Unawatuna" },
    { _id: "6", name: "The Blue Water Hotel", location: "Thalpitiya, Wadduwa" }
  ];

  // ========== API FUNCTIONS ========== //
  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, suggestionsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/bookings`),
        axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/venue-suggestions`)
      ]);
  
      // Process bookings
      const processedBookings = bookingsRes.data.map(booking => {
        const venue = venues.find(v => v._id === booking.venueId);
        return {
          ...booking,
          venueName: venue ? venue.name : 'Unknown Venue',
          venueLocation: venue ? venue.location : ''
        };
      });
  
      setBookings(Array.isArray(processedBookings) ? processedBookings : []);
      setFilteredBookings(Array.isArray(processedBookings) ? processedBookings : []);
      
      // Process suggestions
      let suggestionsData = suggestionsRes.data;
      if (!Array.isArray(suggestionsData)) {
        suggestionsData = suggestionsData.data || suggestionsData.suggestions || [];
      }
      setSuggestions(Array.isArray(suggestionsData) ? suggestionsData : []);
      setFilteredSuggestions(Array.isArray(suggestionsData) ? suggestionsData : []);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
      setLoading(false);
      console.error('Error fetching data:', err);
    }
  };

  // ========== EFFECT HOOKS ========== //
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredBookings(bookings);
      setFilteredSuggestions(suggestions);
      return;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();

    if (activeTab === 'bookings') {
      const filtered = bookings.filter(booking => {
        return (
          booking.customerName?.toLowerCase().includes(lowerCaseSearch) ||
          booking.customerEmail?.toLowerCase().includes(lowerCaseSearch) ||
          booking.phoneNumber?.toLowerCase().includes(lowerCaseSearch) ||
          booking.venueName?.toLowerCase().includes(lowerCaseSearch) ||
          booking.eventType?.toLowerCase().includes(lowerCaseSearch) ||
          (booking.specificRequirements && 
            booking.specificRequirements.toLowerCase().includes(lowerCaseSearch)) ||
          booking.status?.toLowerCase().includes(lowerCaseSearch)
        );
      });
      setFilteredBookings(filtered);
    } else {
      const filtered = suggestions.filter(suggestion => {
        return (
          suggestion.clientName?.toLowerCase().includes(lowerCaseSearch) ||
          suggestion.email?.toLowerCase().includes(lowerCaseSearch) ||
          suggestion.phoneNumber?.toLowerCase().includes(lowerCaseSearch) ||
          suggestion.venueName?.toLowerCase().includes(lowerCaseSearch) ||
          suggestion.location?.toLowerCase().includes(lowerCaseSearch) ||
          suggestion.eventType?.toLowerCase().includes(lowerCaseSearch) ||
          (suggestion.description && 
            suggestion.description.toLowerCase().includes(lowerCaseSearch)) ||
          suggestion.status?.toLowerCase().includes(lowerCaseSearch) ||
          (suggestion.date && new Date(suggestion.date).toLocaleDateString().toLowerCase().includes(lowerCaseSearch)) ||
          (suggestion.time && suggestion.time.toLowerCase().includes(lowerCaseSearch))
        );
      });
      setFilteredSuggestions(filtered);
    }
  }, [searchTerm, activeTab, bookings, suggestions]);

  // ========== EVENT HANDLERS ========== //
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const handleStatusChange = async (id, newStatus, type) => {
    try {
      const endpoint = type === 'booking' ? 'bookings' : 'venue-suggestions';
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          // Add authentication headers if needed
        }
      };
  
      // Remove the /status from the endpoint
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/${endpoint}/${id}`,
        { status: newStatus },
        config
      );
  
      if (response.data.success) {
        fetchData(); // Refresh the data
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          `Failed to update ${type} status. Please try again.`;
      setError(errorMessage);
      console.error(`Error updating ${type} status:`, err);
      
      if (err.response) {
        console.error('Error details:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });
      }
    }
  };

  const handleEdit = (item, type) => {
    setCurrentItem(item);
    setActionType(type);
    
    let formattedDate = '';
    if (item.date) {
      const dateObj = new Date(item.date);
      formattedDate = dateObj.toISOString().split('T')[0];
    }

    setFormData({
      name: type === 'booking' ? item.customerName : item.clientName,
      email: type === 'booking' ? item.customerEmail : item.email,
      phone: item.phoneNumber,
      eventType: item.eventType,
      date: formattedDate,
      time: item.time || '',
      requirements: item.specificRequirements || item.description || '',
      status: item.status || 'pending',
      venueName: item.venueName || '',
      venueId: item.venueId || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (item, type) => {
    setCurrentItem(item);
    setActionType(type);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const endpoint = actionType === 'booking' ? 'bookings' : 'venue-suggestions';
      await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/${endpoint}/${currentItem._id}`
      );
      fetchData();
      setShowDeleteModal(false);
    } catch (err) {
      setError(`Failed to delete ${actionType}. Please try again.`);
      console.error(`Error deleting ${actionType}:`, err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVenueChange = (e) => {
    const selectedVenueId = e.target.value;
    const selectedVenue = venues.find(v => v._id === selectedVenueId);
    setFormData(prev => ({
      ...prev,
      venueId: selectedVenueId,
      venueName: selectedVenue ? selectedVenue.name : ''
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

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
        [actionType === 'booking' ? 'specificRequirements' : 'description']: formData.requirements,
        status: formData.status,
        venueName: formData.venueName,
        venueId: formData.venueId,
        date: formData.date,
        time: formData.time
      };

      await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/${endpoint}/${currentItem._id}`,
        payload
      );
      
      fetchData();
      setShowEditModal(false);
    } catch (err) {
      setError(`Failed to update ${actionType}. Please try again.`);
      console.error(`Error updating ${actionType}:`, err);
    }
  };

  // ========== RENDER FUNCTIONS ========== //
  const renderBookingsTable = () => {
    return (
      <div className="bookings-section compact-view">
        <div className="section-header">
          <h2>All Booking Requests</h2>
          <div className="header-controls">
            <div className="total-count">{filteredBookings.length} bookings</div>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              <i className="search-icon">🔍</i>
            </div>
          </div>
        </div>
        
        {filteredBookings.length === 0 ? (
          renderEmptyState(searchTerm ? 'No bookings match your search.' : 'No booking requests found.')
        ) : (
          <div className="table-container">
            <table className="data-table compact-table">
              <thead>
                <tr>
                  <th style={{ width: '18%' }}>Customer</th>
                  <th style={{ width: '15%' }}>Venue</th>
                  <th style={{ width: '15%' }}>Event</th>
                  <th style={{ width: '12%' }}>Date</th>
                  <th style={{ width: '10%' }}>Status</th>
                  <th style={{ width: '20%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(booking => (
                  <tr key={booking._id}>
                    <td>
                      <div className="compact-client-info">
                        <div className="client-name">{booking.customerName}</div>
                        <div className="contact-info">
                          <div>{booking.customerEmail}</div>
                        </div>
                        <div className="contact-info">
                          <div>{booking.phoneNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="compact-venue-info">
                        <div>{booking.venueName}</div>
                        <div className="venue-location">{booking.venueLocation}</div>
                      </div>
                    </td>
                    <td>
                      <div className="compact-event-info">
                        <div>{booking.eventType}</div>
                      </div>
                    </td>
                    <td>
                      <div className="compact-date-info">
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
          <div className="header-controls">
            <div className="total-count">{filteredSuggestions.length} suggestions</div>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              <i className="search-icon">🔍</i>
            </div>
          </div>
        </div>
        
        {filteredSuggestions.length === 0 ? (
          renderEmptyState(searchTerm ? 'No suggestions match your search.' : 'No venue suggestions found.')
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Suggested By</th>
                  <th style={{ width: '25%' }}>Venue Details</th>
                  <th style={{ width: '15%' }}>Event Type</th>
                  <th style={{ width: '10%' }}>Date/Time</th>
                  <th style={{ width: '10%' }}>Status</th>
                  <th style={{ width: '20%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuggestions.map(suggestion => (
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
                    <td>
                      <div className="date-time-info">
                        {suggestion.date && (
                          <div>{new Date(suggestion.date).toLocaleDateString()}</div>
                        )}
                        {suggestion.time && <div>{suggestion.time}</div>}
                      </div>
                    </td>
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

  // ========== MAIN RENDER ========== //
  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-spinner">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-message">{error}</div>
      </div>
    );
  }

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