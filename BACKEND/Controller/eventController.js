// BACKEND/Controller/eventController.js
const Event = require("../Model/Event");

// Get All Events
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        if (!events || events.length === 0) {
            return res.status(404).json({ message: "No events found" });
        }
        return res.status(200).json({ events });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching events", error: err.message });
    }
};

// Search Events
const searchEvents = async (req, res) => {
    try {
        const { searchTerm } = req.query;
        
        const events = await Event.find({
            $or: [
                { eventName: { $regex: searchTerm, $options: 'i' } },
                { eventType: { $regex: searchTerm, $options: 'i' } }
            ]
        });

        if (!events || events.length === 0) {
            return res.status(404).json({ message: "No events found matching your search" });
        }

        return res.status(200).json({ events });
    } catch (err) {
        return res.status(500).json({ message: "Error searching events", error: err.message });
    }
};

//create new event
const addEvents = async (req, res) => {
    const { eventType, eventName, contactNumber, email, date, guestCount, guestDetails, specialNotes } = req.body;

    try {
        const event = new Event({ eventType, eventName, contactNumber, email, date, guestCount, guestDetails, specialNotes });
        await event.save();
        return res.status(201).json(event);
    } catch (err) {
        return res.status(500).json({ message: "Error inserting event", error: err.message });
    }
};

// Get Event by ID
const getById = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json({ event });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching event", error: err.message });
    }
};

// Update Event by ID
const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { eventType, eventName, contactNumber, email, date, guestCount, guestDetails, specialNotes } = req.body;

    try {
        const event = await Event.findByIdAndUpdate(
            id,
            { eventType, eventName, contactNumber, email, date, guestCount, guestDetails, specialNotes },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        return res.status(200).json({ event });
    } catch (err) {
        return res.status(500).json({ message: "Error updating event", error: err.message });
    }
};

// Delete Event by ID
const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting event", error: err.message });
    }
};

// Export all functions
module.exports = {
    getAllEvents,
    searchEvents,
    addEvents,
    getById,
    updateEvent,
    deleteEvent
};