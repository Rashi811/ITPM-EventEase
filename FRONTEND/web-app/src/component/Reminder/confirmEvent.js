import React, { useEffect, useState } from "react";

const ConfirmEventCards = () => {
    const [confirmations, setConfirmations] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all"); // Filter state: "all", "confirmed", "notConfirmed"

    useEffect(() => {
        fetch("http://localhost:5000/confirm/allconfirm")
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched confirmations:", data);
                setConfirmations(data);
            })
            .catch((error) => console.error("Error fetching confirmations:", error));
    }, []);

    const filteredConfirmations = confirmations.filter((confirmation) => {
        const matchesSearch = confirmation.email.toLowerCase().includes(searchQuery.toLowerCase());
        if (filter === "confirmed") {
            return matchesSearch && confirmation.confirm;
        } else if (filter === "notConfirmed") {
            return matchesSearch && !confirmation.confirm;
        }
        return matchesSearch;
    });

    if (!confirmations || confirmations.length === 0) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px", color: "#555" }}>
                <h2>No Confirmed Events</h2>
                <p>No events have been confirmed yet.</p>
            </div>
        );
    }

    return (
        <div>
            <header style={{ textAlign: "center", padding: "20px", backgroundColor: "#f1f1f1" }}>
                <h1>Confirmed Events</h1>
                <input
                    type="text"
                    placeholder="Search by email..."
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
                <div style={{ marginTop: "10px" }}>
                    <label>
                        <input
                            type="radio"
                            name="filter"
                            value="all"
                            checked={filter === "all"}
                            onChange={() => setFilter("all")}
                        />
                        All
                    </label>
                    <label style={{ marginLeft: "10px" }}>
                        <input
                            type="radio"
                            name="filter"
                            value="confirmed"
                            checked={filter === "confirmed"}
                            onChange={() => setFilter("confirmed")}
                        />
                        Confirmed
                    </label>
                    <label style={{ marginLeft: "10px" }}>
                        <input
                            type="radio"
                            name="filter"
                            value="notConfirmed"
                            checked={filter === "notConfirmed"}
                            onChange={() => setFilter("notConfirmed")}
                        />
                        Not Confirmed
                    </label>
                </div>
            </header>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "20px" }}>
                {filteredConfirmations.map((confirmation) => (
                    <div
                        key={confirmation._id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "16px",
                            width: "300px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            backgroundColor: confirmation.confirm
                                ? "#d4edda" // Green for confirmed
                                : confirmation.reson
                                ? "#f8d7da" // Red for not confirmed with a reason
                                : "#fff3cd", // Yellow for pending confirmation
                        }}
                    >
                        <h3 style={{ color: "#333", textAlign: "center", marginBottom: "10px" }}>
                            {confirmation.confirm
                                ? "Confirmed"
                                : confirmation.reson
                                ? "Not Confirmed"
                                : "Pending to Confirm"}
                        </h3>
                        <p><strong>Email:</strong> {confirmation.email}</p>
                        <p><strong>Reminder Note:</strong> {confirmation.reminder_note}</p>
                        {!confirmation.confirm && confirmation.reson && (
                            <p style={{ color: "#721c24" }}><strong>Reason:</strong> {confirmation.reson}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConfirmEventCards;
