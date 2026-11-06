import mongoose from 'mongoose';
import Project from '../models/project.model.js';
import Ticket from '../models/ticket.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const urlRegex = /^(https?:\/\/)(localhost|127\.0\.0\.1|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|[a-zA-Z0-9-]+)(:[0-9]{1,5})?(\/.*)?$/i;

/**
 * Create a new testing project.
 * POST /api/projects
 */
export const createProject = asyncHandler(async (req, res) => {
  const { name, description, targetUrl, status } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    throw new ApiError(400, 'Project name is required and must be at least 2 characters.');
  }

  if (!targetUrl || typeof targetUrl !== 'string' || !urlRegex.test(targetUrl.trim())) {
    throw new ApiError(
      400,
      'A valid target URL is required (e.g. http://localhost:4000 or https://app.example.com).'
    );
  }

  const project = await Project.create({
    name: name.trim(),
    description: description ? description.trim() : '',
    targetUrl: targetUrl.trim(),
    status: status === 'archived' ? 'archived' : 'active',
    owner: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    project,
  });
});

/**
 * List all projects owned by authenticated user with ticket counts.
 * GET /api/projects
 */
export const getProjects = asyncHandler(async (req, res) => {
  const { status, search } = req.query || {};

  const query = { owner: req.user._id };

  if (status && ['active', 'archived'].includes(status)) {
    query.status = status;
  }

  if (search && typeof search === 'string' && search.trim()) {
    query.name = { $regex: search.trim(), $options: 'i' };
  }

  const projects = await Project.find(query).sort({ createdAt: -1 });

  // Compute ticket counts via aggregation
  const projectIds = projects.map((p) => p._id);
  const ticketCounts = await Ticket.aggregate([
    { $match: { project: { $in: projectIds } } },
    {
      $group: {
        _id: '$project',
        totalTickets: { $sum: 1 },
        openTickets: {
          $sum: { $cond: [{ $in: ['$status', ['open', 'in_progress']] }, 1, 0] },
        },
        resolvedTickets: {
          $sum: { $cond: [{ $in: ['$status', ['resolved', 'closed']] }, 1, 0] },
        },
      },
    },
  ]);

  const countMap = new Map();
  ticketCounts.forEach((c) => {
    countMap.set(c._id.toString(), c);
  });

  const projectsWithCounts = projects.map((proj) => {
    const json = proj.toJSON();
    const stats = countMap.get(proj._id.toString()) || {
      totalTickets: 0,
      openTickets: 0,
      resolvedTickets: 0,
    };
    return {
      ...json,
      ticketCount: stats.totalTickets,
      openTicketsCount: stats.openTickets,
      resolvedTicketsCount: stats.resolvedTickets,
    };
  });

  res.status(200).json({
    success: true,
    count: projectsWithCounts.length,
    projects: projectsWithCounts,
  });
});

/**
 * Get project details by ID with ticket summary metrics.
 * GET /api/projects/:projectId
 */
export const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, 'Invalid project ID format.');
  }

  const project = await Project.findOne({
    _id: projectId,
    owner: req.user._id,
  });

  if (!project) {
    throw new ApiError(404, 'Project not found or access denied.');
  }

  // Aggregate metrics for this project
  const stats = await Ticket.aggregate([
    { $match: { project: project._id } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
        in_progress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
        critical: { $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] } },
        high: { $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] } },
      },
    },
  ]);

  const metrics = stats[0] || {
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
    critical: 0,
    high: 0,
  };

  res.status(200).json({
    success: true,
    project,
    metrics,
  });
});

/**
 * Update project details.
 * PATCH /api/projects/:projectId
 */
export const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description, targetUrl, status } = req.body || {};

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, 'Invalid project ID format.');
  }

  const project = await Project.findOne({
    _id: projectId,
    owner: req.user._id,
  });

  if (!project) {
    throw new ApiError(404, 'Project not found or access denied.');
  }

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 2) {
      throw new ApiError(400, 'Project name must be at least 2 characters.');
    }
    project.name = name.trim();
  }

  if (description !== undefined) {
    project.description = typeof description === 'string' ? description.trim() : '';
  }

  if (targetUrl !== undefined) {
    if (typeof targetUrl !== 'string' || !urlRegex.test(targetUrl.trim())) {
      throw new ApiError(400, 'Please provide a valid target URL (e.g. http://localhost:4000).');
    }
    project.targetUrl = targetUrl.trim();
  }

  if (status !== undefined) {
    if (!['active', 'archived'].includes(status)) {
      throw new ApiError(400, 'Status must be either "active" or "archived".');
    }
    project.status = status;
  }

  await project.save();

  res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    project,
  });
});

/**
 * Safe transaction-backed cascade deletion of project and all associated tickets.
 * DELETE /api/projects/:projectId
 */
export const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, 'Invalid project ID format.');
  }

  const project = await Project.findOne({
    _id: projectId,
    owner: req.user._id,
  });

  if (!project) {
    throw new ApiError(404, 'Project not found or access denied.');
  }

  let session = null;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    await Ticket.deleteMany({ project: projectId }, { session });
    await Project.deleteOne({ _id: projectId }, { session });

    await session.commitTransaction();
  } catch (error) {
    if (session && session.inTransaction()) {
      await session.abortTransaction();
    }

    // Fallback if environment does not support replica set transactions
    if (error.message?.includes('Transaction') || error.message?.includes('replica set')) {
      await Ticket.deleteMany({ project: projectId });
      await Project.deleteOne({ _id: projectId });
    } else {
      throw error;
    }
  } finally {
    if (session) {
      await session.endSession();
    }
  }

  res.status(200).json({
    success: true,
    message: 'Project and all associated tickets deleted successfully.',
    deletedProjectId: projectId,
  });
});

export default {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};

