// routes/reservations.js
const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');
const { sendExpirationNotification } = require('../utils/mailer'); // Import the mailer function

// GET - Display the reservation form
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.getAll();
    res.render('index', { reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.render('error', { message: 'Failed to load reservations.' });
  }
});

// POST - Handle the submission of a new reservation
router.post('/', async (req, res) => {
  const { vm_name, user_email, start_time, end_time } = req.body;

  if (!vm_name || !user_email || !start_time || !end_time) {
    return res.render('error', { message: 'All fields are required.' });
  }

  try {
    const reservationId = await Reservation.create({ vm_name, user_email, start_time: new Date(start_time), end_time: new Date(end_time) });
    res.render('reservation_success', { reservationId });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.render('error', { message: 'Failed to create reservation.' });
  }
});

// POST - Delete a reservation
router.post('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Reservation.delete(id);
    if (deleted) {
      res.redirect('/');
    } else {
      res.render('error', { message: 'Reservation not found or could not be deleted.' });
    }
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.render('error', { message: 'Failed to delete reservation.' });
  }
});

// POST - Send immediate notification for a reservation
router.post('/notify/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.render('error', { message: 'Reservation not found.' });
    }
    await sendExpirationNotification(reservation); // Reuse the existing notification function
    await Reservation.updateLastNotifyDate(id);   // Update the last notify date
    res.redirect('/'); // Redirect back to the reservation list
  } catch (error) {
    console.error('Error sending notification:', error);
    res.render('error', { message: 'Failed to send notification.' });
  }
});

module.exports = router;

