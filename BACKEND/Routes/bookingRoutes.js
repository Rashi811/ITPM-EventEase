const express = require('express');
const nodemailer = require('nodemailer');
const Booking = require('../Model/Booking');
const router = express.Router();

// Setup Nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email notifications
const sendEmailNotification = (email, status) => {
  const subject = `Your Venue Booking is ${status}`;
  const message =
    status === 'approved'
      ? 'Your booking has been approved!'
      : status === 'rejected'
      ? 'Your booking has been rejected!'
      : status === 'updated'
      ? 'Your booking has been updated!'
      : 'Your booking has been deleted!';

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Create a new booking
router.post('/bookings', async (req, res) => {
  try {
    const { customerName, customerEmail, phoneNumber, venueId, eventType, date, time, specificRequirements } = req.body;

    // Check if the booking already exists
    const existingBooking = await Booking.findOne({ venueId, date, time });
    if (existingBooking) {
      return res.status(400).json({ message: 'The venue is already booked for this date and time.' });
    }

    const newBooking = new Booking({
      customerName,
      customerEmail,
      phoneNumber,
      venueId,
      eventType,
      date,
      time,
      specificRequirements,
      status: 'Pending',
    });

    await newBooking.save();
    sendEmailNotification(customerEmail, 'pending');

    res.status(201).json({
      message: 'Booking successfully created',
      booking: newBooking,
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Server error while creating booking' });
  }
});


// Fetch all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find(); // Fetch data from MongoDB
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: 'Server error while fetching bookings' });
  }
});


router.get('/booked-dates', async (req, res) => {
  try {
      const bookings = await Booking.find({}, 'date'); // Fetch only the date field
      const bookedDates = bookings.map(booking => booking.date.toISOString().split('T')[0]); // Convert to YYYY-MM-DD
      res.json(bookedDates);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching booked dates', error });
  }
});




// Approve booking
router.put('/bookings/approved/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    sendEmailNotification(booking.customerEmail, 'approved');
    res.json(booking);
  } catch (err) {
    console.error('Error approving booking:', err);
    res.status(500).json({ error: 'Server error while approving booking' });
  }
});

// Reject booking
router.post('/bookings/reject/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    sendEmailNotification(booking.customerEmail, 'rejected');
    res.json(booking);
  } catch (err) {
    console.error('Error rejecting booking:', err);
    res.status(500).json({ error: 'Server error while rejecting booking' });
  }
});

router.put('/bookings/:id', async (req, res) => {
  try {
    console.log("Updating booking with ID:", req.params.id); // Debugging log

    // Check if the booking exists
    const existingBooking = await Booking.findById(req.params.id);
    if (!existingBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Ensure only necessary fields are updated
      { new: true, runValidators: true } // Return updated document & validate data
    );

    console.log("Updated Booking:", updatedBooking); // Debugging log

    // Send email notification if customer email exists
    if (updatedBooking.customerEmail) {
      sendEmailNotification(updatedBooking.customerEmail, 'updated');
    }

    res.json(updatedBooking);
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ error: 'Server error while updating booking' });
  }
});


// Delete booking
router.delete('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    sendEmailNotification(booking.customerEmail, 'deleted');
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ error: 'Server error while deleting booking' });
  }
});

// Check availability for a venue
router.get('/availability/:venueId', async (req, res) => {
  try {
    const bookings = await Booking.find({ venueId: req.params.venueId });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Error checking venue availability' });
  }
});

module.exports = router;
