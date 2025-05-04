import React, { useState } from "react";
import "./CreateReminder.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";

const CreateReminder = ({ onClose, onSubmit = () => {} }) => {
    const [formData, setFormData] = useState({
        reminder_topic: "",
        reminder_note: "",
        contactNumber: "",
        email: "",
        date: "",
        time: "",
    });

    const [errors, setErrors] = useState({}); // State to store validation errors
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate contact number
        if (!/^0\d{9}$/.test(formData.contactNumber)) {
            newErrors.contactNumber = "Contact number must be 10 digits and start with 0.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const postReminder = async (data) => {
        try {
            const response = await fetch("http://localhost:5000/reminder/createreminder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error("Failed to create reminder");
            }
            const result = await response.json();
            console.log("Reminder created successfully:", result);
            navigate("/reminder"); // Navigate back to reminders page
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            postReminder(formData); // Call the API
            onSubmit(formData); // Trigger the parent callback
        }
    };

    const handleCancel = () => {
        navigate("/reminder"); // Navigate back to reminders page
    };

    return (
        <div className="add-event-container">
            <div className="add-event">
                <header>
                    <h2>Create Reminder</h2>
                </header>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="reminder_topic"
                        value={formData.reminder_topic}
                        onChange={handleInputChange}
                        placeholder="Topic"
                        required
                    />
                    <textarea
                        name="reminder_note"
                        value={formData.reminder_note}
                        onChange={handleInputChange}
                        placeholder="Note"
                        required
                    />
                    <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        placeholder="Contact Number"
                        required
                    />
                    {errors.contactNumber && (
                        <p style={{ color: "red", fontSize: "14px" }}>{errors.contactNumber}</p>
                    )}
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">Submit</button>
                    <button
                        type="button"
                        onClick={handleCancel} // Navigate back on cancel
                        className="cancel-button"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateReminder;
