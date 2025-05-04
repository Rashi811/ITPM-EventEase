import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
    const [confirmations, setConfirmations] = useState([]);
    const [selectedConfirmation, setSelectedConfirmation] = useState(null);
    const [reason, setReason] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const navigator = useNavigate();

    const email = localStorage.getItem("email");

    useEffect(() => {
        fetch(`http://localhost:5000/confirm/allconfirm`)
            .then((response) => response.json())
            .then((data) => {
                const filteredData = data.filter((item) => item.email === email);
                setConfirmations(filteredData);
            })
            .catch((error) => console.error("Error fetching confirmations:", error));
    }, [email]);

    const isEditable = (createdAt, updatedAt) => {
        if (createdAt === updatedAt) return true; // Allow editing if createdAt and updatedAt are equal
        const updatedTime = new Date(updatedAt).getTime();
        const currentTime = new Date().getTime();
        const twoHoursInMs = 2 * 60 * 60 * 1000;
        return currentTime - updatedTime > twoHoursInMs;
    };

    const handleConfirm = (id, createdAt, updatedAt) => {
        if (!isEditable(createdAt, updatedAt)) {
            alert("You cannot edit this confirmation as it was updated within the last two hours.");
            return;
        }

        fetch(`http://localhost:5000/confirm/confrim/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ confirm: true }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Confirmation updated:", data);
                setConfirmations((prev) =>
                    prev.filter((item) => item._id !== id)
                );
                navigator("/");
            })
            .catch((error) => console.error("Error updating confirmation:", error));
    };

    const handleNotConfirm = (confirmation) => {
        if (!isEditable(confirmation.createdAt, confirmation.updatedAt)) {
            alert("You cannot edit this confirmation as it was updated within the last two hours.");
            return;
        }

        setSelectedConfirmation(confirmation);
        setShowPopup(true);
    };

    const submitReason = () => {
        fetch(`http://localhost:5000/confirm/confrim/${selectedConfirmation._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ confirm: false, reson: reason }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Reason updated:", data);
                setConfirmations((prev) =>
                    prev.filter((item) => item._id !== selectedConfirmation._id)
                );
                setShowPopup(false);
                setReason("");
                setSelectedConfirmation(null);
                window.location.reload(); // Refresh the page after updating
            })
            .catch((error) => console.error("Error updating reason:", error));
    };

    if (!confirmations || confirmations.length === 0) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px", color: "#555" }}>
                <h2>No Pending Events</h2>
                <p>No events require confirmation at this time.</p>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "20px" }}>
            {confirmations.map((confirmation) => (
                <div
                    key={confirmation._id}
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "16px",
                        width: "300px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <h3 style={{ color: "#333", textAlign: "center", marginBottom: "10px" }}>
                        Event Confirmation
                    </h3>
                    <p><strong>Email:</strong> {confirmation.email}</p>
                    <p><strong>Reminder Note:</strong> {confirmation.reminder_note}</p>
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                        {confirmation.confirm ? (
                            <button
                                onClick={() => {
                                    window.alert("If you want to update event confirmation, please contact administration.");
                                }}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#28a745",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                                
                            >
                                Update
                            </button>
                        ) : confirmation.reson ? (
                            <>
                                <p style={{ color: "#721c24" }}><strong>Reason:</strong> {confirmation.reson}</p>
                                <button
                                    onClick={() => {
                                        window.alert("You alreay update confirmation.If you want to update event confirmation, please contact administration.");
                                    }}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#dc3545",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                    
                                >
                                    Update
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleConfirm(confirmation._id, confirmation.createdAt, confirmation.updatedAt)}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#28a745",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        marginRight: "10px",
                                    }}
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => handleNotConfirm(confirmation)}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#dc3545",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Not Confirm
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}
            {showPopup && (
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
                        <h3>Provide a Reason</h3>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter your reason here..."
                            style={{
                                width: "100%",
                                height: "100px",
                                marginTop: "10px",
                                padding: "10px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                        />
                        <div style={{ marginTop: "20px" }}>
                            <button
                                onClick={submitReason}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#007bff",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    marginRight: "10px",
                                }}
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => setShowPopup(false)}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#ccc",
                                    color: "#333",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
