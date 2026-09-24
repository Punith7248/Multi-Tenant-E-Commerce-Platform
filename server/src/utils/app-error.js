// An *operational* error: something we expect can go wrong and can describe to the client
// (not found, not allowed, bad input). Throw it from anywhere; the central error handler turns it
// into { success: false, message }. Anything that is NOT an AppError is treated as a bug (500).
//
//   throw new AppError(404, 'Product not found');
//   throw new AppError(422, 'Out of stock', { productId: 'abc' });   // optional details -> `errors`
class AppError extends Error {
  constructor(statusCode, message, errors) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = true;
    if (errors) this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
