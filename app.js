// app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const reservationRoutes = require('./routes/reservations');
const { sendExpirationNotification } = require('./utils/mailer');
const Reservation = require('./models/reservation');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', reservationRoutes);

// Schedule task to check for expired reservations and send notifications
const checkExpiredReservations = async () => {
  try {
    const expiredReservations = await Reservation.getExpiredReservations();
    for (const reservation of expiredReservations) {
      await sendExpirationNotification(reservation);
      // Optionally, you can delete the expired reservation from the database here
      // await Reservation.delete(reservation.id);
    }
  } catch (error) {
    console.error('Error checking expired reservations:', error);
  }
};

// Run the check every hour (adjust as needed)
setInterval(checkExpiredReservations, 60 * 5 * 1000);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

