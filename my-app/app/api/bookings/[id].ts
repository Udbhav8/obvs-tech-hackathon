import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getBookingById,
  updateBooking,
  deleteBooking,
  cancelBooking, // Imported for specific sub-routes if needed, but usually handled by separate POST route
  replicateBooking, // Imported for specific sub-routes if needed, but usually handled by separate POST route
  getBookingHistory,
} from '../../../controllers/bookingController'; // Adjust path as necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // In a real application, you would implement authentication/authorization middleware here
  // and ensure the user has permission to access/modify the requested booking.

  const { id } = req.query;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: 'Booking ID is required and must be a number.' });
  }

  // Handle specific sub-routes for a booking ID
  if (req.url?.includes(`/api/booking/${id}/history`)) {
    if (req.method === 'GET') {
      return getBookingHistory(req, res);
    } else {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed for history`);
    }
  }

  // Handle main booking operations by ID
  switch (req.method) {
    case 'GET':
      return getBookingById(req, res);
    case 'PUT':
      return updateBooking(req, res);
    case 'DELETE':
      return deleteBooking(req, res);
    case 'POST':
      // Specific POST actions like cancel/replicate are typically handled by their own routes
      // e.g., /api/booking/:id/cancel, /api/booking/:id/replicate
      // If you intend to use POST on /api/booking/:id for other specific actions,
      // you would add more `if (req.url?.includes(...))` checks here.
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed for booking ID`);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
