const express = require("express");
const eventController = require("../Controller/eventController");

const router = express.Router();

// Route Definitions
router.get("/", eventController.getAllEvents);
router.post("/", eventController.addEvents);
router.get("/:id", eventController.getById);
router.get('/search', eventController.searchEvents);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

module.exports = router;
