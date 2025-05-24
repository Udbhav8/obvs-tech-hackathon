import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  cancelBooking,
  replicateBooking,
  getBookingHistory,
  createVolunteerAbsence,
  getVolunteerAbsences,
} from '../../../controllers/bookingController'; // Adjust path as necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // In a real application, you would implement authentication/authorization middleware here
  // For example:
  // if (!req.user) {
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }
  // You might also extract `currentUserId` from `req.user` and pass it to controllers.

  switch (req.method) {
    case 'POST':
      if (req.url?.includes('/api/booking/cancel')) {
        // Specific route for cancelling a booking
        return cancelBooking(req, res);
      } else if (req.url?.includes('/api/booking/replicate')) {
        // Specific route for replicating a booking
        return replicateBooking(req, res);
      } else {
        // Default POST for creating a new booking
        return createBooking(req, res);
      }
    case 'GET':
      // Check if it's a request for a specific booking by ID or all bookings
      if (req.query.id) {
        // This case is handled by /api/booking/[id].ts
        // For /api/booking/[id]/history, it's handled by a specific route.
        // This `index.ts` should primarily handle `/api/booking` (GET all)
        return res.status(400).json({ message: 'Invalid request. Use /api/booking/[id] for specific bookings.' });
      } else {
        return getAllBookings(req, res);
      }
    case 'PUT':
      // PUT requests for /api/booking/:id are handled by /api/booking/[id].ts
      return res.status(400).json({ message: 'Invalid request. Use /api/booking/[id] for updating specific bookings.' });
    case 'DELETE':
      // DELETE requests for /api/booking/:id are handled by /api/booking/[id].ts
      return res.status(400).json({ message: 'Invalid request. Use /api/booking/[id] for deleting specific bookings.' });
    default:
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
