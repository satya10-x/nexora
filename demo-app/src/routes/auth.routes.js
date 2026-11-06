import { Router } from 'express';
import env from '../config/env.js';
import { getState } from '../state/toggles.js';
import { COOKIE_NAME, createSession, destroySession } from '../state/sessions.js';

const router = Router();

// POST /api/login -> authenticate user & set session cookie
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const { bugs } = getState();

  const isEmailMatch = email && email.trim() === env.DEMO_USER_EMAIL;
  const isPasswordMatch = password && password === env.DEMO_USER_PASSWORD;

  if (isEmailMatch && isPasswordMatch) {
    const token = createSession();

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      redirectUrl: '/dashboard',
    });
  }

  // Handle invalid credentials with bug toggle checks
  if (bugs.bugNoErrorOnWrongPassword) {
    return res.status(401).json({
      success: false,
      suppressError: true,
      message: '',
    });
  }

  if (bugs.bugWrongErrorText) {
    return res.status(401).json({
      success: false,
      message: 'Something went wrong',
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid credentials',
  });
});

// POST /api/logout -> destroy session & clear cookie
router.post('/logout', (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (token) {
    destroySession(token);
  }

  res.clearCookie(COOKIE_NAME, { path: '/' });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// POST /api/forgot-password -> simulates sending a reset link
router.post('/forgot-password', (req, res) => {
  const { email } = req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'A valid email is required',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'If this email exists, a reset link has been sent.',
  });
});

export default router;

