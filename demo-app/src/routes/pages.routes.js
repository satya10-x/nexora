import { Router } from 'express';
import env from '../config/env.js';
import { getState } from '../state/toggles.js';
import { COOKIE_NAME, isValidSession } from '../state/sessions.js';
import renderLoginPage from '../views/loginPage.js';
import renderDashboardPage from '../views/dashboardPage.js';
import renderForgotPage from '../views/forgotPage.js';
import renderControlPage from '../views/controlPage.js';

const router = Router();

// GET / -> redirect to /login
router.get('/', (req, res) => {
  res.redirect('/login');
});

// GET /login -> login page
router.get('/login', (req, res) => {
  // If already authenticated, redirect to dashboard
  const token = req.cookies?.[COOKIE_NAME];
  if (token && isValidSession(token)) {
    return res.redirect('/dashboard');
  }

  const { mutations, bugs } = getState();
  const html = renderLoginPage({ mutations, bugs });
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// GET /forgot-password -> forgot password page
router.get('/forgot-password', (req, res) => {
  const html = renderForgotPage();
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// Route for bugBrokenForgotLink toggle target -> returns 404
router.get('/forgot-password-broken', (req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
      <head><title>404 Not Found</title></head>
      <body style="font-family: sans-serif; padding: 2rem; text-align: center;">
        <h1>404 Not Found</h1>
        <p>The requested URL /forgot-password-broken was not found on this server.</p>
        <hr><p><small>ShopEase Testing Mock Service</small></p>
      </body>
    </html>
  `);
});

// GET /dashboard -> protected (requires auth cookie, otherwise redirect to /login)
router.get('/dashboard', (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token || !isValidSession(token)) {
    return res.redirect('/login');
  }

  const { mutations } = getState();
  const html = renderDashboardPage({
    userName: env.DEMO_USER_NAME,
    mutations,
  });
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// GET /__control -> human-friendly control panel
router.get('/__control', (req, res) => {
  const html = renderControlPage();
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

export default router;

