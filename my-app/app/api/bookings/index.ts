import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createServiceProgramBooking,
  createEventBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
  addClientToBooking,
  addVolunteerToBooking,
  cancelBooking,
  replicateBooking,
  getJobHistory,
  getAvailableVolunteers
} from '../../../controllers/bookingController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;

  const action: string = (query.action as string) || body.action;
  const bookingId: string = (query.bookingId as string) || body.bookingId;

  try {
    switch (action) {
      case 'createService':
        if (method === 'POST') return createServiceProgramBooking(req, res);
        break;

      case 'createEvent':
        if (method === 'POST') return createEventBooking(req, res);
        break;

      case 'get':
        if (method === 'GET') return getBookingById({ ...req, params: { bookingId } }, res);
        break;

      case 'update':
        if (method === 'PUT') return updateBooking({ ...req, params: { bookingId } }, res);
        break;

      case 'delete':
        if (method === 'DELETE') return deleteBooking({ ...req, params: { bookingId } }, res);
        break;

      case 'addClient':
        if (method === 'POST') return addClientToBooking({ ...req, params: { bookingId } }, res);
        break;

      case 'addVolunteer':
        if (method === 'POST') return addVolunteerToBooking({ ...req, params: { bookingId } }, res);
        break;

      case 'cancel':
        if (method === 'POST') return cancelBooking({ ...req, params: { bookingId } }, res);
        break;

      case 'replicate':
        if (method === 'POST') return replicateBooking({ ...req, params: { bookingId } }, res);
        break;

      case 'history':
        if (method === 'GET') return getJobHistory({ ...req, params: { bookingId } }, res);
        break;

      case 'availableVolunteers':
        if (method === 'GET') return getAvailableVolunteers(req, res);
        break;

      default:
        return res.status(400).json({ error: 'Invalid action or method' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
