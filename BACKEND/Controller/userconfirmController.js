const Confirm = require("../Model/userconfirm");
const nodemailer = require("nodemailer");


// Create a new confirmation
exports.createConfirm = async (req, res) => {
    try {
        const { email, reminder_note } = req.body;
        const newConfirm = new Confirm({ email, reminder_note});
        await newConfirm.save();
        await exports.sentAlert(email, reminder_note); // Correctly reference the sentAlert function
        res.status(201).json(newConfirm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Edit an existing confirmation
exports.editConfirm = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedConfirm = await Confirm.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedConfirm) {
            return res.status(404).json({ message: "Confirmation not found" });
        }
        res.status(200).json(updatedConfirm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single confirmation by email
exports.getConfirm = async (req, res) => {
    try {
        const { email } = req.params;
        const confirm = await Confirm.findOne({ email });
        if (!confirm) {
            return res.status(404).json({ message: "Confirmation not found" });
        }
        res.status(200).json(confirm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all confirmations
exports.getAllConfirms = async (req, res) => {
    try {
        const confirms = await Confirm.find();
        res.status(200).json(confirms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAllItems = async (req, res) => {
    try {
        await Confirm.deleteMany({});
        res.status(200).json({ message: "All items in the Reminder table have been deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting all items in the Reminder table", error });
    }
};

exports.sentAlert = async (Email, Description) => {
    console.log("Sending email to:", Email);
    console.log("Description:", Description);
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const subject = "Important Notification - Event Management System";

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #4CAF50;">Event Management System</h2>
          <p>Dear Valued User,</p>
          <p>We hope this message finds you well.</p>
          <p>This is an automated notification regarding the following:</p>
          <div style="background-color: #f0f0f0; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
            <strong>Details:</strong><br/>
            ${Description}
          </div>
          <p>Please update your confirmation at your earliest convenience.</p>
          <p>If you have any questions or require further assistance, please feel free to contact our support team.</p>
          <p>Thank you for your continued trust.</p>
          <p style="margin-top: 30px;">Best regards,<br/>
          <strong>Restaurant Management System Support Team</strong></p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: Email,
      subject,
      html, // Use HTML instead of text
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}
