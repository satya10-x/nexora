import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/project.controller.js';
import {
  createTicket,
  getTicketsForProject,
} from '../controllers/ticket.controller.js';
import requireAuth from '../middleware/auth.middleware.js';

const router = Router();

// All project routes require authentication
router.use(requireAuth);

router.route('/')
  .post(createProject)
  .get(getProjects);

router.route('/:projectId')
  .get(getProjectById)
  .patch(updateProject)
  .delete(deleteProject);

// Nested ticket routes under /api/projects/:projectId/tickets
router.route('/:projectId/tickets')
  .post(createTicket)
  .get(getTicketsForProject);

export default router;

