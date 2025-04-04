import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddReport.css";  // Make sure this import is at the top

const AddReport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventType: "",
    eventName: "",
    hostName: "",
    contactNumber: "",
    email: "",
    totalCost: "",
    advancePayment: "",
    pendingPayment: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Report added successfully!");
        navigate("/all-reports");
      } else {
        alert("Failed to add report.");
      }
    } catch (error) {
      console.error("Error adding report:", error);
    }
  };

  return (
    <div className="report-add-container">
      <h2 className="report-add-title">Enter Report Details Here!</h2>
      <form className="report-add-form" onSubmit={handleSubmit}>
        <select 
          className="report-add-select"
          name="eventType" 
          value={formData.eventType} 
          required 
          onChange={handleChange}
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
          className="report-add-input"
          type="text" 
          name="eventName" 
          placeholder="Event Name" 
          required 
          onChange={handleChange} 
        />
        
        <input 
          className="report-add-input"
          type="text" 
          name="hostName" 
          placeholder="Host Name" 
          required 
          onChange={handleChange} 
        />
        
        <input 
          className="report-add-input"
          type="text" 
          name="contactNumber" 
          placeholder="Contact Number" 
          required 
          onChange={handleChange} 
        />
        
        <input 
          className="report-add-input"
          type="email" 
          name="email" 
          placeholder="Email" 
          required 
          onChange={handleChange} 
        />
        
        <input 
          className="report-add-input"
          type="number" 
          name="totalCost" 
          placeholder="Total Cost" 
          required 
          onChange={handleChange} 
        />
        
        <input 
          className="report-add-input"
          type="number" 
          name="advancePayment" 
          placeholder="Advance Payment" 
          required 
          onChange={handleChange} 
        />
        
        <input 
          className="report-add-input"
          type="number" 
          name="pendingPayment" 
          placeholder="Pending Payment" 
          required 
          onChange={handleChange} 
        />
        
        <button className="report-add-button" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddReport;