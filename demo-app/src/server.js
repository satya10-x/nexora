import app from './app.js';
import env from './config/env.js';

const server = app.listen(env.PORT, () => {
  console.log(`\n🛍️  ShopEase Demo App running on http://localhost:${env.PORT}`);
  console.log(`   - Login Page:    http://localhost:${env.PORT}/login`);
  console.log(`   - Control Panel: http://localhost:${env.PORT}/__control`);
  console.log(`   - Control API:   http://localhost:${env.PORT}/__control/state\n`);
});

const handleShutdown = (signal) => {
  console.log(`\n${signal} received. Closing ShopEase Demo App server...`);
  server.close(() => {
    console.log('ShopEase HTTP server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 5000).unref();
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection in ShopEase Demo App:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception in ShopEase Demo App:', err);
  process.exit(1);
});

