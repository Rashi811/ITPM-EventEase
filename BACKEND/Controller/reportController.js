const Report = require("../Model/Report");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const nodemailer = require("nodemailer");
const path = require("path");
require('dotenv').config();

// Add Report
const addReport = async (req, res) => {
    const { eventName, eventType, hostName, contactNumber, email, totalCost, advancePayment, pendingPayment } = req.body;

    try {
        const report = new Report({ eventName, eventType, hostName, contactNumber, email, totalCost, advancePayment, pendingPayment });
        await report.save();
        return res.status(201).json(report);
    } catch (err) {
        return res.status(500).json({ message: "Error saving report", error: err.message });
    }
};

// Generate PDF
const generateReportPDF = async (req, res) => {
    const { id } = req.params;

    try {
        const report = await Report.findById(id);
        if (!report) return res.status(404).json({ message: "Report not found" });

        const doc = new PDFDocument();
        const pdfPath = path.join(__dirname, `../reports/report_${id}.pdf`);
        
        // Ensure the reports directory exists
        if (!fs.existsSync(path.dirname(pdfPath))) {
            fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
        }

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=report_${id}.pdf`);

        doc.pipe(res);

        doc.fontSize(20).text("Event Report", { align: "center" });
        doc.moveDown();
        doc.fontSize(14).text(`Event Name: ${report.eventName}`);
        doc.text(`Event Type: ${report.eventType}`);
        doc.text(`Host Name: ${report.hostName}`);
        doc.text(`Contact Number: ${report.contactNumber}`);
        doc.text(`Email: ${report.email}`);
        doc.text(`Total Cost: Rs.${report.totalCost}`);
        doc.text(`Advance Payment: Rs.${report.advancePayment}`);
        doc.text(`Pending Payment: Rs.${report.pendingPayment}`);

        doc.end();
    } catch (err) {
        return res.status(500).json({ message: "Error generating PDF", error: err.message });
    }
};

// Send Email with Report Details
const sendReportEmail = async (req, res) => {
    const { id } = req.params;

    try {
        const report = await Report.findById(id);
        if (!report) return res.status(404).json({ message: "Report not found" });

        // Check if email credentials are set
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            return res.status(500).json({ 
                message: "Email configuration error", 
                error: "Email credentials not set in .env file" 
            });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Verify transporter configuration
        try {
            await transporter.verify();
            console.log("Email server is ready to send messages");
        } catch (error) {
            console.error("Email server verification failed:", error);
            return res.status(500).json({ 
                message: "Email server configuration error", 
                error: error.message 
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: report.email,
            subject: `Event Report - ${report.eventName}`,
            text: `Dear ${report.hostName},

Thank you for choosing our services. Here are the details of your event:

Event Name: ${report.eventName}
Event Type: ${report.eventType}
Host Name: ${report.hostName}
Contact Number: ${report.contactNumber}
Email: ${report.email}
Total Cost: Rs.${report.totalCost}
Advance Payment: Rs.${report.advancePayment}
Pending Payment: Rs.${report.pendingPayment}

If you have any questions or need further assistance, please don't hesitate to contact us.

Best regards,
EventEase Team`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
        
        res.status(200).json({ 
            message: "Email sent successfully!",
            emailId: info.messageId
        });
    } catch (err) {
        console.error("Email error:", err);
        return res.status(500).json({ 
            message: "Error sending email", 
            error: err.message 
        });
    }
};

// Get All Reports
const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find();
        if (!reports || reports.length === 0) {
            return res.status(404).json({ message: "No reports found" });
        }
        return res.status(200).json(reports);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching reports", error: err.message });
    }
};

// Export Controllers
exports.addReport = addReport;
exports.generateReportPDF = generateReportPDF;
exports.sendReportEmail = sendReportEmail;
exports.getAllReports = getAllReports; 