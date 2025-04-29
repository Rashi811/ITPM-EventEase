// controllers/venueSuggestionController.js
const VenueSuggestion = require('../Model/venueSuggestion');

// Create a new venue suggestion
exports.createVenueSuggestion = async (req, res) => {
  try {
    const {
      clientName,
      phoneNumber,
      email,
      venueName,
      location,
      eventType,
      capacity,
      date,
      time,
      specificRequirements
    } = req.body;

    // Create new venue suggestion
    const venueSuggestion = new VenueSuggestion({
      clientName,
      phoneNumber,
      email,
      venueName,
      location,
      eventType,
      capacity,
      date,
      time,
      specificRequirements
    });

    // Save to database
    await venueSuggestion.save();

    res.status(201).json({
      success: true,
      message: 'Venue suggestion submitted successfully!',
      data: venueSuggestion
    });
  } catch (error) {
    console.error('Error creating venue suggestion:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error submitting venue suggestion. Please try again.'
    });
  }
};

// Get all venue suggestions (for admin)
exports.getAllVenueSuggestions = async (req, res) => {
  try {
    const venueSuggestions = await VenueSuggestion.find()
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: venueSuggestions.length,
      data: venueSuggestions
    });
  } catch (error) {
    console.error('Error fetching venue suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching venue suggestions'
    });
  }
};

// Get single venue suggestion by ID
exports.getVenueSuggestionById = async (req, res) => {
  try {
    const venueSuggestion = await VenueSuggestion.findById(req.params.id);
    
    if (!venueSuggestion) {
      return res.status(404).json({
        success: false,
        message: 'Venue suggestion not found'
      });
    }

    res.status(200).json({
      success: true,
      data: venueSuggestion
    });
  } catch (error) {
    console.error('Error fetching venue suggestion:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching venue suggestion'
    });
  }
};

// Update venue suggestion status (for admin)
exports.updateVenueSuggestionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const venueSuggestion = await VenueSuggestion.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!venueSuggestion) {
      return res.status(404).json({
        success: false,
        message: 'Venue suggestion not found'
      });
    }

    res.status(200).json({
      success: true,
      data: venueSuggestion
    });
  } catch (error) {
    console.error('Error updating venue suggestion:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating venue suggestion'
    });
  }
};

// Delete venue suggestion
exports.deleteVenueSuggestion = async (req, res) => {
  try {
    const venueSuggestion = await VenueSuggestion.findByIdAndDelete(req.params.id);
    
    if (!venueSuggestion) {
      return res.status(404).json({
        success: false,
        message: 'Venue suggestion not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Venue suggestion deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting venue suggestion:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting venue suggestion'
    });
  }
};

// Approve a venue suggestion
exports.approveVenueSuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const venueSuggestion = await VenueSuggestion.findById(id);
    if (!venueSuggestion) {
      return res.status(404).json({
        success: false,
        message: 'Venue suggestion not found'
      });
    }

    venueSuggestion.status = 'approved';
    await venueSuggestion.save();

    res.status(200).json({
      success: true,
      message: 'Venue suggestion approved successfully',
      data: venueSuggestion
    });
  } catch (error) {
    console.error('Error approving venue suggestion:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving venue suggestion'
    });
  }
};

// Reject a venue suggestion
exports.rejectVenueSuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const venueSuggestion = await VenueSuggestion.findById(id);
    if (!venueSuggestion) {
      return res.status(404).json({
        success: false,
        message: 'Venue suggestion not found'
      });
    }

    venueSuggestion.status = 'rejected';
    await venueSuggestion.save();

    res.status(200).json({
      success: true,
      message: 'Venue suggestion rejected successfully',
      data: venueSuggestion
    });
  } catch (error) {
    console.error('Error rejecting venue suggestion:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting venue suggestion'
    });
  }
};

// Update venue suggestion
exports.updateVenueSuggestion = async (req, res) => {
  try {
    const venueSuggestion = await VenueSuggestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!venueSuggestion) {
      return res.status(404).json({
        success: false,
        message: 'Venue suggestion not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Venue suggestion updated successfully',
      data: venueSuggestion
    });
  } catch (error) {
    console.error('Error updating venue suggestion:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating venue suggestion'
    });
  }
};