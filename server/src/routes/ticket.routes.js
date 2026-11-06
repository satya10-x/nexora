import { Router } from 'express';
import {
  parseCriteriaPreview,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from '../controllers/ticket.controller.js';
import requireAuth from '../middleware/auth.middleware.js';

const router = Router();

// All ticket routes require authentication
router.use(requireAuth);

/**
 * IMPORTANT: Register POST /parse-criteria BEFORE any generic /:ticketId routes
 * so Express router doesn't interpret "parse-criteria" as a ticketId parameter.
 */
router.post('/parse-criteria', parseCriteriaPreview);

router.route('/')
  .get(getAllTickets);

router.route('/:ticketId')
  .get(getTicketById)
  .patch(updateTicket)
  .delete(deleteTicket);

export default router;

