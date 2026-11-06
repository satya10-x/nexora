import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import env from './config/env.js';
import routes from './routes/index.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const artifactsPath = path.resolve(__dirname, '../../artifacts');

const app = express();

// Security headers with resource policy allowing cross-origin asset access
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// Request parsing & cookies
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// HTTP request logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve artifacts statically (e.g. screenshots, test run reports)
app.use('/artifacts', express.static(artifactsPath));

// Mount API routes
app.use('/api', routes);

// 404 handler for unknown routes
app.use(notFound);

// Global centralized error handler
app.use(errorHandler);

export default app;
