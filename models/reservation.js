// models/reservation.js
const db = require('../config/database');

class Reservation {
  static async create(reservationData) {
    const { vm_name, user_email, start_time, end_time } = reservationData;
    try {
      const [result] = await db.execute(
        'INSERT INTO reservations (vm_name, user_email, start_time, end_time) VALUES (?, ?, ?, ?)',
        [vm_name, user_email, start_time, end_time]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM reservations ORDER BY start_time DESC');
      return rows;
    } catch (error) {
      console.error('Error fetching reservations:', error);
      throw error;
    }
  }

  static async getExpiredReservations() {
    const now = new Date();
    try {
      const [rows] = await db.execute('SELECT * FROM reservations WHERE end_time <= ?', [now]);
      return rows;
    } catch (error) {
      console.error('Error fetching expired reservations:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute('SELECT * FROM reservations WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error fetching reservation by ID:', error);
      throw error;
    }
  }

  static async updateLastNotifyDate(id) {
    const now = new Date();
    try {
      await db.execute('UPDATE reservations SET last_notify_date = ? WHERE id = ?', [now, id]);
      return true;
    } catch (error) {
      console.error('Error updating last notify date:', error);
      return false;
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute('DELETE FROM reservations WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting reservation:', error);
      throw error;
    }
  }
}

module.exports = Reservation;


