import env from '../config/env.js';
import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (statusCode >= 500) {
    logger.error(`Unhandled error on ${req.method} ${req.originalUrl}: ${message}`);
  }

  const response = {
    success: false,
    message,
  };

  if (err.details !== undefined && err.details !== null) {
    response.details = err.details;
  }

  if (env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorHandler;

