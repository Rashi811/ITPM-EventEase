import React, { useEffect, useState } from "react";
import "./AllReports.css";

const AllReports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/reports");
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const generateReport = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reports/generate/${id}`);
      if (response.ok) {
        window.location.href = `http://localhost:5000/api/reports/generate/${id}`;
      } else {
        alert("Failed to generate report.");
      }
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const sendEmail = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reports/send-email/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        alert("Email sent successfully!");
      } else {
        alert(data.message || "Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while sending the email. Please try again.");
    }
  };

  return (
    <div className="reports-list-container">
    <h2 className="reports-list-title">All Reports</h2>
    <table className="reports-list-table">
      <thead>
          <tr>
            <th>Event Name</th>
            <th>Event Type</th>
            <th>Host Name</th>
            <th>Contact Number</th>
            <th>Email</th>
            <th>Total Cost</th>
            <th>Advance Payment</th>
            <th>Pending Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (
            reports.map((report) => (
              <tr key={report._id}>
                <td>{report.eventName}</td>
                <td>{report.eventType}</td>
                <td>{report.hostName}</td>
                <td>{report.contactNumber}</td>
                <td>{report.email}</td>
                <td>Rs.{report.totalCost}</td>
                <td>Rs.{report.advancePayment}</td>
                <td>Rs.{report.pendingPayment}</td>
                <td>
                <div className="reports-list-actions">
                  <button 
                    className="reports-list-button generate"
                    onClick={() => generateReport(report._id)}
                  >
                    Generate Report
                  </button>
                  <button 
                    className="reports-list-button email"
                    onClick={() => sendEmail(report._id)}
                  >
                    Send Email
                  </button>
                </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="reports-list-no-data">
              No reports found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllReports;
