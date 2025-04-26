const express = require('express');
const Booking = require('../Model/Booking');
const { sendBookingConfirmation } = require('../services/emailService');
const router = express.Router();
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus
} = require('../Controller/bookingController');

// Booking routes
router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);
router.put('/:id/status', updateBookingStatus);

// Fetch all bookings
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
router.put('/approved/:id', async (req, res) => {
  console.log('Received request to approve booking:', req.params.id);
  try {
    console.log('Finding booking in database...');
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    console.log('Booking found:', booking);

    if (!booking) {
      console.log('Booking not found');
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    try {
      console.log('Attempting to send approval email...');
      await sendBookingConfirmation(booking);
      console.log('Approval email sent successfully');
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
      // Don't fail the request if email fails
    }
    
    console.log('Sending success response');
    res.json(booking);
  } catch (err) {
    console.error('Error in approve booking route:', err);
    res.status(500).json({ error: 'Server error while approving booking' });
  }
});

// Reject booking
router.put('/reject/:id', async (req, res) => {
  console.log('Received request to reject booking:', req.params.id);
  try {
    console.log('Finding booking in database...');
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    console.log('Booking found:', booking);

    if (!booking) {
      console.log('Booking not found');
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    try {
      console.log('Attempting to send rejection email...');
      await sendBookingConfirmation(booking);
      console.log('Rejection email sent successfully');
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
      // Don't fail the request if email fails
    }
    
    console.log('Sending success response');
    res.json(booking);
  } catch (err) {
    console.error('Error in reject booking route:', err);
    res.status(500).json({ error: 'Server error while rejecting booking' });
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

// Test email endpoint
router.post('/test-email', async (req, res) => {
  console.log('Testing email service...');
  try {
    const testBooking = {
      customerName: 'Test User',
      customerEmail: 'nethmiruvindya10@gmail.com',
      status: 'approved',
      venueName: 'Test Venue',
      eventType: 'Test Event',
      date: new Date(),
      time: '10:00 AM'
    };

    await sendBookingConfirmation(testBooking);
    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Test email failed:', error);
    res.status(500).json({ error: 'Failed to send test email' });
  }
});

module.exports = router;