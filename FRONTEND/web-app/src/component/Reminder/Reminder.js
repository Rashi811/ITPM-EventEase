import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReminderCards = ({ reminders, onDelete, setReminders }) => { // Add setReminders as a prop
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [selectedReminder, setSelectedReminder] = useState(null);

    const formatTime = (timeString) => {
        if (!timeString) return "";
        const [hours, minutes] = timeString.split(":");
        return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    };

    const handleDeleteClick = (id) => {
        setSelectedReminder({ _id: id });
        setShowPopup(true);
    };

    const confirmDelete = () => {
        onDelete(selectedReminder._id);
        setShowPopup(false);
        setSelectedReminder(null);
    };

    const cancelDelete = () => {
        setShowPopup(false);
        setSelectedReminder(null);
    };

    const handleConfirmClick = (reminder) => {
        setSelectedReminder(reminder);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedReminder(null);
    };

    const sendEmail = () => {
        const emailData = {
            email: selectedReminder.email,
            reminder_note: selectedReminder.reminder_note,
            id: selectedReminder._id, // Include the reminder ID
        };

        fetch("http://localhost:5000/confirm/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(emailData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Email confirmation saved:", data);
                alert(`Email sent to: ${selectedReminder.email}`);
                closePopup();
                navigate("/admin/confirm"); // Navigate to the confirmation page
                // Refresh reminders by calling the "Get All Reminders" API
                fetch("http://localhost:5000/reminder/allreminder")
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("Refreshed reminders:", data);
                        setReminders(data.reminders); // Use setReminders from props
                    })
                    .catch((error) => console.error("Error refreshing reminders:", error));
            })
            .catch((error) => {
                console.error("Error saving email confirmation:", error);
                alert("Failed to send email. Please try again.");
            });
    };

    if (reminders.length === 0) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px", color: "#555" }}>
                <h2>No Reminders Found</h2>
                <p>Add a new reminder to get started!</p>
            </div>
        );
    }

    return (
        <div>
            {showPopup && selectedReminder && (
                <div
                    style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: "1000",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            textAlign: "center",
                        }}
                    >
                        <h3>Reminder Details</h3>
                        <p><strong>Email:</strong> {selectedReminder.email}</p>
                        <p><strong>Reminder Note:</strong> {selectedReminder.reminder_note}</p>
                        <div style={{ marginTop: "20px" }}>
                            <button
                                onClick={sendEmail}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#007BFF",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    marginRight: "10px",
                                }}
                            >
                                Send Email
                            </button>
                            <button
                                onClick={closePopup}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#ccc",
                                    color: "#333",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "20px" }}>
                {reminders.map((reminder) => (
                    <div
                        key={reminder._id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "16px",
                            width: "300px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            position: "relative",
                        }}
                    >
                        <div
                            onClick={() => navigate("/update-reminder", { state: { reminder } })}
                            style={{
                                cursor: "pointer",
                            }}
                        >
                            <h3
                                style={{
                                    color: "#333",
                                    textAlign: "center",
                                    marginBottom: "10px",
                                }}
                            >
                                {reminder.reminder_topic}
                            </h3>
                            <p style={{ color: "#555" }}>{reminder.reminder_note}</p>
                            <p><strong>Contact:</strong> {reminder.contactNumber}</p>
                            <p><strong>Email:</strong> {reminder.email}</p>
                            <p><strong>Date:</strong> {new Date(reminder.date).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {formatTime(reminder.time)}</p>
                        </div>
                        <div style={{ textAlign: "center", marginTop: "10px" }}>
                            <button
                                onClick={() => handleConfirmClick(reminder)}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#007BFF",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    marginTop: "10px",
                                }}
                            >
                                Get Confirm
                            </button>
                        </div>
                        <button
                            onClick={() => handleDeleteClick(reminder._id)}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                color: "red",
                                border: "none",
                                borderRadius: "50%",
                                width: "30px",
                                height: "30px",
                                cursor: "pointer",
                                fontSize: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "none",
                            }}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const RemindersPage = () => {
    const [reminders, setReminders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/reminder/allreminder")
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched reminders:", data);
                fetch("http://localhost:5000/confirm/allconfirm")
                    .then((response) => response.json())
                    .then((confirmData) => {
                        const filteredReminders = data.reminders.filter(
                            (reminder) =>
                                !confirmData.some(
                                    (confirm) =>
                                        confirm.email === reminder.email &&
                                        confirm.reminder_note === reminder.reminder_note
                                )
                        );
                        setReminders(filteredReminders);
                    })
                    .catch((error) => console.error("Error fetching confirmations:", error));
            })
            .catch((error) => console.error("Error fetching reminders:", error));
    }, []);

    const handleDeleteReminder = (id) => {
        fetch(`http://localhost:5000/reminder/reminder/${id}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Reminder deleted:", data);
                setReminders((prevReminders) => prevReminders.filter((reminder) => reminder._id !== id));
                alert("Reminder deleted successfully!");
            })
            .catch((error) => console.error("Error deleting reminder:", error));
    };

    const handleCreateReminder = () => {
        navigate("/create-reminder");
    };

    const filteredReminders = reminders.filter((reminder) =>
        reminder.reminder_topic.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <header style={{ textAlign: "center", padding: "20px", backgroundColor: "#f1f1f1" }}>
                <h1>Reminders</h1>
                <input
                    type="text"
                    placeholder="Search by reminder name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: "10px",
                        width: "300px",
                        marginTop: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        fontSize: "16px",
                    }}
                />
            </header>
            <ReminderCards reminders={filteredReminders} onDelete={handleDeleteReminder} setReminders={setReminders} />
            <button
                onClick={handleCreateReminder}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    backgroundColor: "#007BFF",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    fontSize: "24px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    cursor: "pointer",
                }}
            >
                +
            </button>
        </div>
    );
};

export default RemindersPage;
