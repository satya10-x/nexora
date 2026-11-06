import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { AUTH_COOKIE_NAME } from '../middleware/auth.middleware.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Signs a JWT payload for authenticated user.
 * @param {string} userId
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Returns secure HTTP-only cookie configuration.
 * @returns {import('express').CookieOptions}
 */
const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  path: '/',
});

/**
 * Register a new SentinelQA user account.
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};

  // Validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    throw new ApiError(400, 'Name is required and must be at least 2 characters.');
  }

  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    throw new ApiError(400, 'A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters long.');
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Prevent duplicate email registrations
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email address already exists.');
  }

  // Create new user (pre-save hook hashes password)
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
  });

  const token = generateToken(user._id.toString());
  res.cookie(AUTH_COOKIE_NAME, token, getCookieOptions());

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
  });
});

/**
 * Authenticate existing SentinelQA user.
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.');
  }

  const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';

  // Find user by email, explicitly including password field
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = generateToken(user._id.toString());
  res.cookie(AUTH_COOKIE_NAME, token, getCookieOptions());

  res.status(200).json({
    success: true,
    message: 'Signed in successfully',
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
  });
});

/**
 * Sign out user and clear auth cookie.
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });

  res.status(200).json({
    success: true,
    message: 'Signed out successfully',
  });
});

/**
 * Fetch current authenticated user profile.
 * GET /api/auth/me
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
    },
  });
});

export default {
  register,
  login,
  logout,
  getCurrentUser,
};

