const express = require("express");
const reminderController = require("../Controller/reminderController");

const router = express.Router();

// Route Definitions
router.get("/allreminder", reminderController.getAllReminders);
router.post("/createreminder", reminderController.createReminder);
router.get("/reminder/:id", reminderController.getReminderById);
router.put("/reminder/:id", reminderController.updateReminder);
router.delete("/reminder/:id", reminderController.deleteReminder);
router.delete("deleteAll", reminderController.deleteAllReminders);

module.exports = router;
