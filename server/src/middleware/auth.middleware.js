import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const AUTH_COOKIE_NAME = 'sentinelqa_token';

/**
 * Authentication middleware verifying JWT from HTTP-only cookie or Authorization header.
 * Attaches authenticated User document to req.user.
 */
export const requireAuth = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Authentication required. Please sign in to continue.');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'User associated with this session no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Session expired. Please log in again.');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid authentication token. Please log in again.');
    }
    throw error;
  }
});

export default requireAuth;

