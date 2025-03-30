const express = require('express');
const router = express.Router();
const {
  createVenueSuggestion,deleteVenueSuggestion,getAllVenueSuggestions,getVenueSuggestionById,updateVenueSuggestionStatus
} = require("../Controller/venueSuggestionController");



// Routes for venue suggestions
router.get("/", getAllVenueSuggestions);               // GET all suggestions
router.get("/:id", getVenueSuggestionById);           // GET a single suggestion by ID
router.post("/", createVenueSuggestion);                 // POST a new suggestion
router.put("/:id", updateVenueSuggestionStatus);            // PUT update to a suggestion
router.delete("/:id", deleteVenueSuggestion);           // PATCH reject a suggestion

module.exports = router;
