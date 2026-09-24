// Builds the Express app but does NOT listen or connect to the database (server.js does that),
// so tests can import it and call it without opening a port.
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const env = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

// ---- Middleware order matters: Express runs these top to bottom for every request. ----

// 1. helmet: first, so every response carries the security headers, including 404s, errors and
//    replies from anything below that ends the request early (like a CORS preflight).
app.use(helmet());

// 2. cors: before the parsers and routes. The browser's preflight (OPTIONS) request has no body or
//    token, so it must be answered here before auth or a parser can reject it. It also puts the CORS
//    headers on error responses, which the browser needs to be allowed to read our JSON error.
//    `credentials: true` is required for the browser to send/accept cookies (the auth token, Day 5).
app.use(cors({ origin: env.CLIENT_URLS, credentials: true }));

// 3. logger: before the body parsers so requests that FAIL parsing (malformed JSON) still get a log
//    line. After an error, Express skips every remaining normal middleware, so a logger placed
//    after express.json() would never see them. (Preflights are answered by cors above, so they're
//    not logged.)
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

// 4. body parsers: must come before any route that reads req.body.
//    STRIPE WEBHOOK (Week 3): it needs the RAW body, so its route must be mounted with
//    express.raw() ABOVE this line. That's the one known future edit to this file.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. cookie-parser: makes req.cookies available (the httpOnly auth token cookie, Day 5).
app.use(cookieParser());

// ---- Routes ----
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', routes);

// ---- Must be last, in this order: 404 catches whatever no route matched and forwards it to the
//      error handler, which must come after everything that can call next(err). ----
app.use(notFound);
app.use(errorHandler);

module.exports = app;
