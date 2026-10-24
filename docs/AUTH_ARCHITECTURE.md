# Auth architecture

Covers `src/models/User.js`, `src/middleware/auth.js`, `src/controllers/authController.js`,
and the JWT + RBAC design used across every protected route.

## Components

| Component | File | Responsibility |
|---|---|---|
| `User` model | `src/models/User.js` | Stores `role` (`customer` \| `vendor` \| `admin`), hashes password on save via a `pre("save")` hook, exposes `comparePassword` |
| `authController` | `src/controllers/authController.js` | `register`, `login`, `getMe` — issues JWTs, never returns the password hash |
| `generateToken` | `src/utils/generateToken.js` | Signs `{ id: userId }` with `JWT_SECRET`, 7-day expiry by default |
| `protect` middleware | `src/middleware/auth.js` | Verifies the `Authorization: Bearer <token>` header, loads the user, attaches `req.user` |
| `authorize(...roles)` middleware | `src/middleware/auth.js` | Rejects with 403 if `req.user.role` isn't in the allowed list |

## Registration / login flow

1. Client `POST`s to `/api/auth/register` or `/api/auth/login`.
2. On register: password is hashed with bcrypt (10 salt rounds) before the
   `User` document is saved. Role defaults to `customer`; `vendor` is the
   only other self-selectable role — `admin` is never assigned from the API.
3. On login: `bcrypt.compare` checks the submitted password against the
   stored hash (password field is `select: false`, so it's pulled explicitly
   with `.select("+password")` only for this check).
4. On success, `generateToken` signs a JWT containing just the user's Mongo
   `_id` — no role or email in the payload, since those can change and the
   token would go stale. Role is always re-read from the DB on each request.
5. Response returns `{ _id, fullName, email, role, token }`. The password
   hash never leaves the server.

## Protected request flow

1. Client sends the token as `Authorization: Bearer <token>` on every
   subsequent request.
2. `protect` verifies the JWT signature and expiry, then loads the user by
   the `id` in the payload. Missing, malformed, expired, or
   user-no-longer-exists all return `401`.
3. Route-specific `authorize("vendor")` (or `"admin"`, or multiple roles)
   checks `req.user.role` against an allow-list. Mismatch returns `403`
   before the controller runs at all.
4. Only after both checks pass does the controller execute — e.g. a vendor
   creating a product can only ever write to *their own* store, enforced in
   the controller by looking up `Store.findOne({ owner: req.user._id })`
   rather than trusting an ID from the request body.

## Design decisions worth knowing

- **Stateless JWTs, no refresh tokens (v1).** Simpler to build and matches
  the 4-week plan; the tradeoff is no way to revoke a token before it
  expires short of rotating `JWT_SECRET` (which logs everyone out). Worth
  revisiting if the token lifetime needs to shrink for security reasons.
- **Role is re-fetched from the DB on every request**, not trusted from the
  JWT payload. Costs one extra query per request but means a role change
  (e.g. admin promotes a user) takes effect immediately instead of waiting
  for the old token to expire.
- **RBAC is enforced at the route layer, ownership at the controller
  layer.** `authorize("vendor")` only proves *a* vendor is calling — it's
  the controller's job to prove *this* vendor owns *this* resource (see
  `productController.getOwnedStoreOrFail`). Mixing the two up is the most
  common way multi-tenant APIs leak data across tenants.
- **Passwords are never in a JWT, a log line, or an error message.** The
  `User` schema's `select: false` on `password` means a stray
  `User.find()` elsewhere in the codebase can't accidentally leak hashes.

## Known gaps (not yet built)

Carried over from the earlier mockup review — still open:
- Password reset / forgot-password flow
- Google/Apple OAuth (buttons exist in the UI, no backend support yet)
- Email verification on signup
