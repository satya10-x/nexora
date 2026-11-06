import mongoose from 'mongoose';
import Ticket from '../models/ticket.model.js';
import Project from '../models/project.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { parseAcceptanceCriteria } from '../services/criteriaParser.service.js';

/**
 * Validates that an ID is a valid MongoDB ObjectId.
 * @param {string} id
 * @param {string} fieldName
 */
const assertObjectId = (id, fieldName = 'ID') => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `Invalid ${fieldName} format.`);
  }
};

/**
 * Helper to verify that a project exists and is owned by authenticated user.
 * @param {string} projectId
 * @param {string} userId
 * @returns {Promise<Document>}
 */
const assertProjectOwnership = async (projectId, userId) => {
  assertObjectId(projectId, 'project ID');
  const project = await Project.findOne({ _id: projectId, owner: userId });
  if (!project) {
    throw new ApiError(404, 'Project not found or access denied.');
  }
  return project;
};

/**
 * Create a new ticket inside a project.
 * POST /api/projects/:projectId/tickets
 */
export const createTicket = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const {
    title,
    description,
    acceptanceCriteria,
    severity,
    priority,
    status,
    expectedResult,
    actualResult,
    reproductionSteps,
  } = req.body || {};

  await assertProjectOwnership(projectId, req.user._id);

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    throw new ApiError(400, 'Ticket title is required and must be at least 3 characters.');
  }

  const validSeverities = ['critical', 'high', 'medium', 'low'];
  const validPriorities = ['high', 'medium', 'low'];
  const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];

  const rawCriteria = typeof acceptanceCriteria === 'string' ? acceptanceCriteria.trim() : '';
  const parsed = parseAcceptanceCriteria(rawCriteria);

  const ticket = await Ticket.create({
    title: title.trim(),
    description: typeof description === 'string' ? description.trim() : '',
    project: projectId,
    acceptanceCriteria: rawCriteria,
    parsedCriteria: parsed.scenarios || [],
    severity: validSeverities.includes(severity) ? severity : 'medium',
    priority: validPriorities.includes(priority) ? priority : 'medium',
    status: validStatuses.includes(status) ? status : 'open',
    expectedResult: typeof expectedResult === 'string' ? expectedResult.trim() : '',
    actualResult: typeof actualResult === 'string' ? actualResult.trim() : '',
    reproductionSteps: Array.isArray(reproductionSteps)
      ? reproductionSteps
      : typeof reproductionSteps === 'string' && reproductionSteps.trim()
      ? reproductionSteps.split('\n').map((s) => s.trim()).filter(Boolean)
      : [],
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Ticket created successfully',
    ticket,
  });
});

/**
 * Get tickets belonging to a specific project.
 * GET /api/projects/:projectId/tickets
 */
export const getTicketsForProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  await assertProjectOwnership(projectId, req.user._id);

  const {
    status,
    severity,
    priority,
    search,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query || {};

  const query = { project: projectId };

  if (status && status !== 'all') {
    query.status = status;
  }
  if (severity && severity !== 'all') {
    query.severity = severity;
  }
  if (priority && priority !== 'all') {
    query.priority = priority;
  }
  if (search && typeof search === 'string' && search.trim()) {
    query.$or = [
      { title: { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const sortDirection = sortOrder === 'asc' ? 1 : -1;
  const sort = { [sortBy]: sortDirection };

  const [tickets, total] = await Promise.all([
    Ticket.find(query).sort(sort).skip(skip).limit(limitNum),
    Ticket.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: tickets.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    tickets,
  });
});

/**
 * List all tickets across user's projects with optional project filter, search, & pagination.
 * GET /api/tickets
 */
export const getAllTickets = asyncHandler(async (req, res) => {
  // Find all projects owned by authenticated user
  const userProjects = await Project.find({ owner: req.user._id }).select('_id name targetUrl');
  const projectMap = new Map();
  userProjects.forEach((p) => projectMap.set(p._id.toString(), p));
  const userProjectIds = Array.from(projectMap.keys());

  const {
    projectId,
    status,
    severity,
    priority,
    search,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query || {};

  let targetProjectIds = userProjectIds;
  if (projectId && projectId !== 'all') {
    assertObjectId(projectId, 'project filter');
    if (!projectMap.has(projectId)) {
      throw new ApiError(404, 'Specified project not found or access denied.');
    }
    targetProjectIds = [projectId];
  }

  const query = { project: { $in: targetProjectIds } };

  if (status && status !== 'all') {
    query.status = status;
  }
  if (severity && severity !== 'all') {
    query.severity = severity;
  }
  if (priority && priority !== 'all') {
    query.priority = priority;
  }
  if (search && typeof search === 'string' && search.trim()) {
    query.$or = [
      { title: { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const sortDirection = sortOrder === 'asc' ? 1 : -1;
  const sort = { [sortBy]: sortDirection };

  const [tickets, total] = await Promise.all([
    Ticket.find(query)
      .populate('project', 'name targetUrl status')
      .sort(sort)
      .skip(skip)
      .limit(limitNum),
    Ticket.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: tickets.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    tickets,
  });
});

/**
 * Get individual ticket details.
 * GET /api/tickets/:ticketId
 */
export const getTicketById = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  assertObjectId(ticketId, 'ticket ID');

  const ticket = await Ticket.findById(ticketId).populate('project', 'name targetUrl status owner');

  if (!ticket || !ticket.project || ticket.project.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(404, 'Ticket not found or access denied.');
  }

  res.status(200).json({
    success: true,
    ticket,
  });
});

/**
 * Update ticket details.
 * PATCH /api/tickets/:ticketId
 */
export const updateTicket = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  assertObjectId(ticketId, 'ticket ID');

  const ticket = await Ticket.findById(ticketId).populate('project', 'owner');
  if (!ticket || !ticket.project || ticket.project.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(404, 'Ticket not found or access denied.');
  }

  const {
    title,
    description,
    acceptanceCriteria,
    severity,
    priority,
    status,
    expectedResult,
    actualResult,
    reproductionSteps,
  } = req.body || {};

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length < 3) {
      throw new ApiError(400, 'Title must be at least 3 characters long.');
    }
    ticket.title = title.trim();
  }

  if (description !== undefined) {
    ticket.description = typeof description === 'string' ? description.trim() : '';
  }

  if (acceptanceCriteria !== undefined) {
    const raw = typeof acceptanceCriteria === 'string' ? acceptanceCriteria.trim() : '';
    ticket.acceptanceCriteria = raw;
    const parsed = parseAcceptanceCriteria(raw);
    ticket.parsedCriteria = parsed.scenarios || [];
  }

  if (severity !== undefined) {
    if (!['critical', 'high', 'medium', 'low'].includes(severity)) {
      throw new ApiError(400, 'Invalid severity value.');
    }
    ticket.severity = severity;
  }

  if (priority !== undefined) {
    if (!['high', 'medium', 'low'].includes(priority)) {
      throw new ApiError(400, 'Invalid priority value.');
    }
    ticket.priority = priority;
  }

  if (status !== undefined) {
    if (!['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
      throw new ApiError(400, 'Invalid status value.');
    }
    ticket.status = status;
  }

  if (expectedResult !== undefined) {
    ticket.expectedResult = typeof expectedResult === 'string' ? expectedResult.trim() : '';
  }

  if (actualResult !== undefined) {
    ticket.actualResult = typeof actualResult === 'string' ? actualResult.trim() : '';
  }

  if (reproductionSteps !== undefined) {
    ticket.reproductionSteps = Array.isArray(reproductionSteps)
      ? reproductionSteps
      : typeof reproductionSteps === 'string' && reproductionSteps.trim()
      ? reproductionSteps.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];
  }

  await ticket.save();

  res.status(200).json({
    success: true,
    message: 'Ticket updated successfully',
    ticket,
  });
});

/**
 * Delete individual ticket.
 * DELETE /api/tickets/:ticketId
 */
export const deleteTicket = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  assertObjectId(ticketId, 'ticket ID');

  const ticket = await Ticket.findById(ticketId).populate('project', 'owner');
  if (!ticket || !ticket.project || ticket.project.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(404, 'Ticket not found or access denied.');
  }

  await Ticket.deleteOne({ _id: ticketId });

  res.status(200).json({
    success: true,
    message: 'Ticket deleted successfully',
    deletedTicketId: ticketId,
  });
});

/**
 * Live criteria parsing preview endpoint.
 * POST /api/tickets/parse-criteria
 */
export const parseCriteriaPreview = asyncHandler(async (req, res) => {
  const { criteria = '' } = req.body || {};
  const result = parseAcceptanceCriteria(typeof criteria === 'string' ? criteria : '');

  res.status(200).json({
    success: true,
    ...result,
  });
});

export default {
  createTicket,
  getTicketsForProject,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  parseCriteriaPreview,
};

