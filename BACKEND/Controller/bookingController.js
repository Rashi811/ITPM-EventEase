const VenueSuggestion = require("../models/venueSuggestion");
const { v4: uuidv4 } = require('uuid');

// Get all suggestions (pagination/filtering)
const getAllVenueSuggestion = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};

    const suggestions = await VenueSuggestion.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await VenueSuggestion.countDocuments(filter);

    res.status(200).json({
      suggestions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalSuggestions: count
    });
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to fetch suggestions",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get single suggestion by ID
const getVenueSuggestionById = async (req, res) => {
  try {
    const suggestion = await VenueSuggestion.findById(req.params.id);
    if (!suggestion) {
      return res.status(404).json({ message: "Venue suggestion not found" });
    }
    res.status(200).json(suggestion);
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to fetch suggestion",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add new suggestion
const addVenueSuggestion = async (req, res) => {
  try {
    const requiredFields = [
      'clientName', 'phoneNumber', 'email',
      'venueName', 'location', 'eventType',
      'capacity', 'date', 'time'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields
      });
    }

    // Generate custom ID if not provided
    const venueId = req.body.id || `VEN-${uuidv4()}`;

    const newSuggestion = new VenueSuggestion({
      _id: venueId,
      clientName: req.body.clientName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      venueName: req.body.venueName,
      location: req.body.location,
      eventType: req.body.eventType,
      capacity: Number(req.body.capacity),
      date: new Date(req.body.date),
      time: req.body.time,
      specificRequirements: req.body.specificRequirements || "",
      status: "Pending"
    });

    const savedSuggestion = await newSuggestion.save();
    res.status(201).json(savedSuggestion);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: "Duplicate ID detected",
        solution: "Retry without providing an ID to auto-generate one"
      });
    }
    res.status(500).json({
      error: "Failed to submit venue suggestion",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update suggestion
const updateVenueSuggestion = async (req, res) => {
  try {
    // Prevent direct status updates
    if (req.body.status) {
      return res.status(400).json({ 
        message: "Use dedicated approve/reject endpoints for status changes"
      });
    }

    const updatedSuggestion = await VenueSuggestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSuggestion) {
      return res.status(404).json({ message: "Venue suggestion not found" });
    }

    res.status(200).json(updatedSuggestion);
  } catch (error) {
    res.status(500).json({
      error: "Failed to update venue suggestion",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete suggestion
const deleteVenueSuggestion = async (req, res) => {
  try {
    const deletedSuggestion = await VenueSuggestion.findByIdAndDelete(req.params.id);
    if (!deletedSuggestion) {
      return res.status(404).json({ message: "Venue suggestion not found" });
    }
    res.status(200).json({ message: "Suggestion deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete venue suggestion",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Approve suggestion
const approveVenueSuggestion = async (req, res) => {
  try {
    const suggestion = await VenueSuggestion.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );

    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    res.status(200).json(suggestion);
  } catch (error) {
    res.status(500).json({
      error: "Failed to approve venue suggestion",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Reject suggestion
const rejectVenueSuggestion = async (req, res) => {
  try {
    const suggestion = await VenueSuggestion.findByIdAndUpdate(
      req.params.id,
      { 
        status: "Rejected",
        rejectionReason: req.body.rejectionReason || "No reason provided" 
      },
      { new: true }
    );

    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    res.status(200).json(suggestion);
  } catch (error) {
    res.status(500).json({
      error: "Failed to reject venue suggestion",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllVenueSuggestion,
  getVenueSuggestionById,
  addVenueSuggestion,
  updateVenueSuggestion,
  deleteVenueSuggestion,
  approveVenueSuggestion,
  rejectVenueSuggestion
};