// utils/mailer.js
const nodemailer = require('nodemailer');
const mailConfig = require('../config/mail');

const transporter = nodemailer.createTransport(mailConfig);

const sendExpirationNotification = async (reservation) => {
  const mailOptions = {
    from: mailConfig.auth.user,
    to: reservation.user_email,
    subject: `Virtual Machine Reservation: ${reservation.vm_name}`,
    html: `
      <p>Dear Caregiver,</p>
      <p>Your reservation for the virtual machine <strong>${reservation.vm_name}</strong> will expire soon.</p>
    <p>Owner: ${reservation.user_email}<Br>Expire Date: ${new Date(reservation.end_time).toLocaleString()}</p>
      <p>Please select one of the following options. <li>Rebuild virtual machine.<li>Extend Reservation. <li>Let reservation expire.</p>
      <p>Thank you,</p>
      <p>The Automation CoE Team</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Expiration notification sent:', info.messageId);
  } catch (error) {
    console.error('Error sending expiration notification:', error);
  }
};

module.exports = { sendExpirationNotification };

