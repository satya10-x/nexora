import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cookieParser from 'cookie-parser';

import env from './config/env.js';
import pagesRoutes from './routes/pages.routes.js';
import authRoutes from './routes/auth.routes.js';
import controlRoutes from './routes/control.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, 'public');

const app = express();

// Request body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static assets
app.use('/public', express.static(publicPath));
app.use(express.static(publicPath));

// CORS middleware allowing CLIENT_URL and SERVER_URL
const allowedOrigins = [env.CLIENT_URL, env.SERVER_URL];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// Control API (mounted under /__control)
app.use('/__control', controlRoutes);

// Auth API routes (mounted under /api)
app.use('/api', authRoutes);

// Server-rendered page routes (mounted at root /)
app.use('/', pagesRoutes);

// 404 Fallback for unmapped routes
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>404 Not Found | ShopEase</title>
      <link rel="stylesheet" href="/public/styles.css">
    </head>
    <body class="shopease-body" style="justify-content: center; align-items: center; text-align: center;">
      <div class="login-card" style="text-align: center;">
        <h1 style="color: #dc2626; font-size: 2rem; margin-bottom: 0.5rem;">404</h1>
        <h2>Page Not Found</h2>
        <p style="color: #64748b; margin: 1rem 0;">The requested resource does not exist on ShopEase.</p>
        <a href="/login" class="btn btn-primary" style="display: inline-block; width: auto;">Return to Sign In</a>
      </div>
    </body>
    </html>
  `);
});

export default app;

