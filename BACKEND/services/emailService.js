const nodemailer = require('nodemailer');

// Setup Nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true,
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('Transporter verification failed:', error);
    console.error('Email configuration:', {
      user: process.env.EMAIL_USER,
      host: 'smtp.gmail.com',
      port: 587,
    });
  } else {
    console.log('Email service is ready to send messages');
    console.log('Email configuration:', {
      user: process.env.EMAIL_USER,
      host: 'smtp.gmail.com',
      port: 587,
    });
  }
});

// Function to send booking confirmation email
const sendBookingConfirmation = async (booking) => {
  try {
    console.log('Starting email sending process...');
    console.log('Booking details:', {
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      status: booking.status,
      venueName: booking.venueName,
    });
    console.log('Using email account:', process.env.EMAIL_USER);

    const subject = `Venue Booking Confirmation - ${booking.status}`;
    const message = `
Dear ${booking.customerName},

Your venue booking has been ${booking.status.toLowerCase()}.

Booking Details:
---------------
Venue: ${booking.venueName}
Event Type: ${booking.eventType}
Date: ${new Date(booking.date).toLocaleDateString()}
Time: ${booking.time}
${booking.specificRequirements ? `Requirements: ${booking.specificRequirements}` : ''}

Status: ${booking.status}

${booking.status === 'approved' ? `
Your booking has been confirmed! We look forward to hosting your event.
Please arrive 30 minutes before your scheduled time.

If you have any questions, please don't hesitate to contact us.
` : booking.status === 'rejected' ? `
We apologize, but we are unable to accommodate your booking request at this time.
If you have any questions, please don't hesitate to contact us.
` : `
Your booking is currently under review. We will notify you once a decision has been made.
`}

Best regards,
EventEase Team
    `;

    const mailOptions = {
      from: `EventEase <${process.env.EMAIL_USER}>`,
      to: booking.customerEmail,
      subject: subject,
      text: message,
      html: message.replace(/\n/g, '<br>'),
    };

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    throw error;
  }
};

// Function to send venue suggestion confirmation email
const sendSuggestionConfirmation = async (suggestion) => {
  try {
    console.log('Attempting to send suggestion confirmation email to:', suggestion.email);
    console.log('Using email account:', process.env.EMAIL_USER);

    const subject = `Venue Suggestion Status Update - ${suggestion.status}`;
    const message = `
Dear ${suggestion.clientName},

Your venue suggestion has been ${suggestion.status.toLowerCase()}.

Suggestion Details:
-----------------
Venue Name: ${suggestion.venueName}
Location: ${suggestion.location}
Event Type: ${suggestion.eventType}
Date: ${new Date(suggestion.date).toLocaleDateString()}
Time: ${suggestion.time}
Capacity: ${suggestion.capacity} people
${suggestion.specificRequirements ? `Requirements: ${suggestion.specificRequirements}` : ''}

Status: ${suggestion.status}

${suggestion.status === 'approved' ? `
Congratulations! Your venue suggestion has been approved.
We will be in touch shortly with next steps and additional information.
` : suggestion.status === 'rejected' ? `
We regret to inform you that we are unable to proceed with your venue suggestion at this time.
If you have any questions, please don't hesitate to contact us.
` : `
Your venue suggestion is currently under review. We will notify you once a decision has been made.
`}

Best regards,
EventEase Team
    `;

    const mailOptions = {
      from: `EventEase <${process.env.EMAIL_USER}>`,
      to: suggestion.email,
      subject: subject,
      text: message,
      html: message.replace(/\n/g, '<br>'),
    };

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending suggestion confirmation email:', error);
    throw error;
  }
};

module.exports = {
  sendBookingConfirmation,
  sendSuggestionConfirmation,
};
