import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReminderForm.css"; // Assuming the CSS file is shared with CreateReminder

const UpdateReminder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { reminder } = location.state || {}; // Get reminder data from state

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    };

    const formatTime = (timeString) => {
        if (!timeString) return "";
        const [time, period] = timeString.split(" "); // Split time and AM/PM
        let [hours, minutes] = time.split(":").map(Number);

        if (period === "PM" && hours !== 12) {
            hours += 12; // Convert PM hours to 24-hour format
        } else if (period === "AM" && hours === 12) {
            hours = 0; // Convert 12 AM to 00
        }

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`; // Return HH:mm format
    };

    const [formData, setFormData] = useState({
        reminder_topic: reminder?.reminder_topic || "",
        reminder_note: reminder?.reminder_note || "",
        contactNumber: reminder?.contactNumber || "",
        email: reminder?.email || "",
        date: reminder?.date ? formatDate(reminder.date) : "",
        time: reminder?.time ? formatTime(reminder.time) : "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:5000/reminder/reminder/${reminder._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Reminder updated:", data);
                navigate("/admin/reminders"); // Navigate back to reminders page
            })
            .catch((error) => console.error("Error updating reminder:", error));
    };

    return (
        <div className="reminder-form-container">
            <h1 className="form-title">Update Reminder</h1>
            <form className="reminder-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="reminder_topic">Topic:</label>
                    <input
                        type="text"
                        id="reminder_topic"
                        name="reminder_topic"
                        value={formData.reminder_topic}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="reminder_note">Note:</label>
                    <textarea
                        id="reminder_note"
                        name="reminder_note"
                        value={formData.reminder_note}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="contactNumber">Contact Number:</label>
                    <input
                        type="text"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="time">Time:</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button className="submit-button" type="submit">Update Reminder</button>
            </form>
        </div>
    );
};

export default UpdateReminder;
