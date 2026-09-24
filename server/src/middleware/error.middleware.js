const env = require('../config/env');
const AppError = require('../utils/app-error');

// Registered just before the error handler: any request that reached this point matched no route.
const notFound = (req, res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Turns errors thrown by libraries into AppErrors, so a bad :id or a duplicate email is a clean
// 4xx for the client instead of a 500. Returns null for anything unrecognised (= a real bug).
const toAppError = (err) => {
  if (err instanceof AppError) return err;

  // Mongoose: schema validation failed -> { field: message }
  if (err?.name === 'ValidationError' && err.errors) {
    const details = Object.fromEntries(Object.entries(err.errors).map(([field, e]) => [field, e.message]));
    return new AppError(400, 'Validation failed', details);
  }
  // Mongoose: malformed ObjectId in /:id, or a value of the wrong type
  if (err?.name === 'CastError') return new AppError(400, `Invalid value for "${err.path}"`);
  // MongoDB: unique index violated (e.g. email already registered)
  if (err?.code === 11000) {
    const fields = Object.keys(err.keyValue || {}).join(', ') || 'unique field';
    return new AppError(409, `A record with this ${fields} already exists`);
  }
  // jsonwebtoken (used from Day 5)
  if (err?.name === 'JsonWebTokenError') return new AppError(401, 'Invalid token');
  if (err?.name === 'TokenExpiredError') return new AppError(401, 'Token expired');
  // express.json(): bad body
  if (err?.type === 'entity.parse.failed') return new AppError(400, 'Malformed JSON in request body');
  if (err?.type === 'entity.too.large') return new AppError(413, 'Request body too large');

  return null;
};

// MUST be registered last, and MUST keep all four parameters: Express recognises an error
// handler by its arity.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err); // too late to send JSON; let Express close the connection

  const appError = toAppError(err);
  const statusCode = appError ? appError.statusCode : 500;

  // Log bugs and server-side failures. Expected 4xx errors are already visible in the morgan line.
  if (!appError || statusCode >= 500) console.error(err);

  // An AppError's message is written for the client. An unexpected error's message may leak
  // internals, so it's only shown outside production.
  const showMessage = Boolean(appError) || !env.isProduction;
  const body = {
    success: false,
    message: (showMessage && (appError || err)?.message) || 'Internal server error',
  };
  if (appError?.errors) body.errors = appError.errors;
  if (!appError && !env.isProduction) body.stack = err?.stack;

  res.status(statusCode).json(body);
};

module.exports = { notFound, errorHandler };
