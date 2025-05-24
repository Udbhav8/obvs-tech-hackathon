// controllers/bookingController.js
import Booking from '../models/Booking';
import ServiceProgramBooking from '../models/ServiceProgramBooking';
import EventBooking from '../models/EventBooking';
import BookingClientRelation from '../models/BookingClientRelation';
import BookingVolunteerRelation from '../models/BookingVolunteerRelation';
import JobHistory from '../models/JobHistory';
import VolunteerAbsence from '../models/VolunteerAbsence';

export async function createServiceProgramBooking(req, res) {
  try {
    const base = await Booking.create(req.body);
    await ServiceProgramBooking.create({ booking: base._id, ...req.body });
    res.status(201).json({ message: 'Service/Program booking created', booking_id: base._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createEventBooking(req, res) {
  try {
    const base = await Booking.create(req.body);
    await EventBooking.create({ booking: base._id, ...req.body });
    res.status(201).json({ message: 'Event booking created', booking_id: base._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getBookingById(req, res) {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateBooking(req, res) {
  try {
    const { bookingId } = req.params;
    await Booking.findByIdAndUpdate(bookingId, req.body);
    res.json({ message: 'Booking updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteBooking(req, res) {
  try {
    const { bookingId } = req.params;
    await Booking.findByIdAndUpdate(bookingId, { status: 'Deleted' });
    res.json({ message: 'Booking marked as deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function addClientToBooking(req, res) {
  try {
    const { bookingId } = req.params;
    await BookingClientRelation.create({ booking: bookingId, ...req.body });
    res.json({ message: 'Client added to booking' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function addVolunteerToBooking(req, res) {
  try {
    const { bookingId } = req.params;
    await BookingVolunteerRelation.create({ booking: bookingId, ...req.body });
    res.json({ message: 'Volunteer assigned to booking' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function cancelBooking(req, res) {
  try {
    const { bookingId } = req.params;
    await Booking.findByIdAndUpdate(bookingId, {
      status: 'Cancelled',
      cancellation_reason: req.body.cancellation_reason,
      cancellation_notes: req.body.cancellation_notes
    });
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function replicateBooking(req, res) {
  try {
    // Implement recurrence logic to clone booking into future dates
    res.json({ message: 'Booking replication logic placeholder' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getJobHistory(req, res) {
  try {
    const { bookingId } = req.params;
    const history = await JobHistory.find({ booking: bookingId });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getAvailableVolunteers(req, res) {
  try {
    // Match volunteer by availability, vehicle type, scent sensitivity, etc.
    res.json([]); // Placeholder
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
