const env = require('./config/env'); // first: loads .env and fails fast if something required is missing
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const app = require('./app');

const start = async () => {
  // Database first, then the port: the server never accepts requests while half-connected.
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`[server] ${env.NODE_ENV} server listening on http://localhost:${env.PORT}`);
    console.log(`[server] health check: http://localhost:${env.PORT}/api/health`);
  });

  server.on('error', (error) => {
    console.error(
      error.code === 'EADDRINUSE'
        ? `[server] Port ${env.PORT} is already in use. Stop the other process or change PORT in .env.`
        : `[server] Failed to start: ${error.message}`
    );
    process.exit(1);
  });

  // Finish in-flight requests, close the DB connection, then exit. Force-exit if it hangs.
  const shutdown = (reason, exitCode = 0) => {
    console.log(`[server] ${reason}: shutting down...`);
    setTimeout(() => process.exit(1), 10000).unref();
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(exitCode);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (reason) => {
    console.error('[server] Unhandled promise rejection:', reason);
    shutdown('unhandledRejection', 1);
  });
  process.on('uncaughtException', (error) => {
    console.error('[server] Uncaught exception:', error);
    shutdown('uncaughtException', 1);
  });
};

start();
