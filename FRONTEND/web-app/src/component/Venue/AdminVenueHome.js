import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";


const MainVenuePage = () => {
  const navigate = useNavigate();

  // Hardcoded venue data with locations
  const venues = [
    { 
      _id: "1", 
      name: "Dutchman Street",
      location: "1/9 Court Road, Dutch Fort, Matara"
    },
    { 
      _id: "2", 
      name: "Virticle by Jetwing",
      location: "Access Tower II, Union Place, Colombo 02" 
    },
    { 
      _id: "3", 
      name: "The Barnhouse Studio",
      location: "96/2 Galpoththa Road 11 Lane, Kalutara" 
    },
    { 
      _id: "4", 
      name: "Honey Beach Club",
      location: "No 48, Janadhipathi Mawatha, Colombo 1" 
    },
    { 
      _id: "5", 
      name: "Araliya Beach Resort",
      location: "Yaddehimulla Rd, Unawatuna" 
    },
    { 
      _id: "6", 
      name: "The Blue Water Hotel",
      location: "Thalpitiya, Wadduwa" 
    }
  ];

  const handleBookNow = (venue) => {
    navigate("/book", { state: { venue } });
  };

  const openWhatsApp = () => {
    const phoneNumber = "+94763793360";
    const message = "Hello, I need help with my venue booking";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="main-venue-container">
      {/* Navigation Bar */}
      <nav className="venue-navbar">
        <ul>
          <li><Link to="/booking-calendar">Booking Calendar</Link></li>
          <li><Link to="/admin-venue">Admin Venue</Link></li>
          <li><Link to="/suggest-venue">Suggest a Venue</Link></li>
        </ul>
      </nav>

      <h1 className="venue-title">Choose Your Venue</h1>
      
      {/* WhatsApp Floating Button */}
      <div className="whatsapp-float" onClick={openWhatsApp}>
        <FaWhatsapp className="whatsapp-icon" />
        <span>Contact Us</span>
      </div>

      <div className="venue-grid">
        {venues.map((venue) => (
          <div key={venue._id} className="venue-card">
            <h2>{venue.name}</h2>
            <div className="venue-location">
              <FaMapMarkerAlt className="location-icon" />
              <span>{venue.location}</span>
            </div>
            <button
              className="book-now-btn"
              onClick={() => handleBookNow(venue)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
      
      <div className="suggestion-form-link">
        <p>
          Can't find your venue?{" "}
          <Link to="/suggest-venue">Suggest a new venue</Link>
        </p>
      </div>
    </div>
  );
};

export default MainVenuePage;