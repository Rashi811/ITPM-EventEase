const express = require("express");
const reportController = require("../Controller/reportController");

const router = express.Router();

router.post("/", reportController.addReport);
router.get("/", reportController.getAllReports); 
router.get("/generate/:id", reportController.generateReportPDF);
router.get("/send-email/:id", reportController.sendReportEmail);

module.exports = router;
