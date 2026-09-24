// Everything about the login token lives here: signing, verifying, and the cookie it travels in.
//
// TOKEN DELIVERY DECISION: an httpOnly cookie, not the JSON body.
//  + JavaScript on the page can never read it, so an XSS bug can't steal the session.
//  + The frontend never handles the token at all, and the login response body is unchanged.
//  - The React app must send credentials on every request (fetch: credentials: 'include',
//    axios: withCredentials: true). CORS already allows this (Day 3).
//  - Cookie auth is exposed to CSRF, so the cookie is SameSite=Lax (not sent on cross-site POSTs)
//    and CORS only allows our frontend origin.
//  - DEPLOYMENT CAVEAT: this works while the frontend and API share a "site" (localhost in dev, or
//    app.example.com + api.example.com). If they are deployed on different domains (e.g. Vercel + Render),
//    browsers block the cookie, and we'd switch to returning the token in the body + an
//    Authorization: Bearer header. That change touches only this file, login, and auth.middleware.js.
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const AUTH_COOKIE = 'token';
const ALGORITHM = 'HS256'; // pinned on both sign and verify, so a token can't pick its own algorithm

// Minimal payload: who they are and what they may do. No email, no password, nothing personal.
// role and storeId are immutable on the User model, so they can't go stale inside a token.
const signToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role, storeId: user.storeId ? user.storeId.toString() : null },
    env.JWT_SECRET,
    { algorithm: ALGORITHM, expiresIn: env.JWT_EXPIRES_IN }
  );

// Throws JsonWebTokenError / TokenExpiredError on any bad token; the error handler turns those into 401.
const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET, { algorithms: [ALGORITHM] });

const cookieBase = { httpOnly: true, secure: env.isProduction, sameSite: 'lax' };

// The cookie expires exactly when the token does (read from the token itself, so there's one source of truth).
const setAuthCookie = (res, token) => {
  const { exp } = jwt.decode(token);
  res.cookie(AUTH_COOKIE, token, { ...cookieBase, expires: new Date(exp * 1000) });
};

// httpOnly means the browser's JS can't delete it, so logout has to be a server call.
const clearAuthCookie = (res) => res.clearCookie(AUTH_COOKIE, cookieBase);

module.exports = { AUTH_COOKIE, signToken, verifyToken, setAuthCookie, clearAuthCookie };
