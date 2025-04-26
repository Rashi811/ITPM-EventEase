const express = require('express');
const router = express.Router();
const VenueSuggestion = require('../Model/venueSuggestion');
const { sendSuggestionConfirmation } = require('../services/emailService');
const {
  getAllVenueSuggestions,
  getVenueSuggestionById,
  createVenueSuggestion,
  updateVenueSuggestion,
  deleteVenueSuggestion,
  approveVenueSuggestion,
  rejectVenueSuggestion
} = require("../Controller/venueSuggestionController");

// Routes for venue suggestions
router.get("/", getAllVenueSuggestions);
router.get("/:id", getVenueSuggestionById);
router.post("/", createVenueSuggestion);
router.put("/:id", updateVenueSuggestion);
router.delete("/:id", deleteVenueSuggestion);

// Approve suggestion
router.put("/approved/:id", async (req, res) => {
  console.log('Received request to approve suggestion:', req.params.id);
  try {
    console.log('Finding suggestion in database...');
    const suggestion = await VenueSuggestion.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    console.log('Suggestion found:', suggestion);

    if (!suggestion) {
      console.log('Suggestion not found');
      return res.status(404).json({ message: 'Suggestion not found' });
    }
    
    try {
      console.log('Attempting to send approval email...');
      await sendSuggestionConfirmation(suggestion);
      console.log('Approval email sent successfully');
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
      // Don't fail the request if email fails
    }
    
    console.log('Sending success response');
    res.json(suggestion);
  } catch (err) {
    console.error('Error in approve suggestion route:', err);
    res.status(500).json({ error: 'Server error while approving suggestion' });
  }
});

// Reject suggestion
router.put("/reject/:id", async (req, res) => {
  console.log('Received request to reject suggestion:', req.params.id);
  try {
    console.log('Finding suggestion in database...');
    const suggestion = await VenueSuggestion.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    console.log('Suggestion found:', suggestion);

    if (!suggestion) {
      console.log('Suggestion not found');
      return res.status(404).json({ message: 'Suggestion not found' });
    }
    
    try {
      console.log('Attempting to send rejection email...');
      await sendSuggestionConfirmation(suggestion);
      console.log('Rejection email sent successfully');
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
      // Don't fail the request if email fails
    }
    
    console.log('Sending success response');
    res.json(suggestion);
  } catch (err) {
    console.error('Error in reject suggestion route:', err);
    res.status(500).json({ error: 'Server error while rejecting suggestion' });
  }
});

module.exports = router;