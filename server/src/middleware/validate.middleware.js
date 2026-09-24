const AppError = require('../utils/app-error');

// validate(schema): checks req.body against a Zod schema.
//  - success: req.body is REPLACED by the parsed result (trimmed, lowercased, defaults applied),
//    so controllers only ever see clean data.
//  - failure: 400 { success: false, message: 'Validation failed', errors: { field: message } },
//    the same shape the error handler produces for Mongoose validation errors.
// (Body only on purpose: in Express 5 req.query is read-only, so query validation needs its own approach.)
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body ?? {}); // req.body is undefined when no body was sent

  if (!result.success) {
    const errors = {};
    for (const issue of result.error.issues) {
      if (issue.code === 'unrecognized_keys') {
        for (const key of issue.keys) errors[key] = 'Unknown field';
        continue;
      }
      const field = issue.path.join('.') || 'body';
      if (!(field in errors)) errors[field] = issue.message; // first message per field
    }
    return next(new AppError(400, 'Validation failed', errors));
  }

  req.body = result.data;
  next();
};

module.exports = validate;
