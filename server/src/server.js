import mongoose from 'mongoose';
import app from './app.js';
import env from './config/env.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';

let server;

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    logger.error(`Initial database connection failed: ${error.message}`);
    logger.warn('Server will continue running in degraded state with database disconnected.');
  }

  server = app.listen(env.PORT, () => {
    logger.success(`SentinelQA API server running in [${env.NODE_ENV}] mode on port ${env.PORT}`);
    logger.info(`Health check available at: http://localhost:${env.PORT}/api/health`);
    logger.info(`Static artifacts served at: http://localhost:${env.PORT}/artifacts`);
  });
};

const handleGracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Initiating graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      try {
        if (mongoose.connection.readyState !== 0) {
          await mongoose.connection.close(false);
          logger.info('MongoDB connection cleanly closed.');
        }
      } catch (err) {
        logger.error(`Error closing MongoDB connection: ${err.message}`);
      }
      process.exit(0);
    });

    // Force exit if connections do not close in time
    setTimeout(() => {
      logger.error('Graceful shutdown timeout exceeded. Forcing exit.');
      process.exit(1);
    }, 10000).unref();
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection:', reason);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();

