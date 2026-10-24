# Auth architecture

Authentication and authorization design for the NovaCart multi-tenant platform. It follows the models in `src/models` (`User`, `Tenant`) and the settings in `src/config/env.js`.

## Roles

| Role | How it is created | Scope |
|---|---|---|
| `customer` | Self-registration | Browses all approved stores, places orders |
| `vendor` | Self-registration, which also creates a `pending` Tenant | Manages only their own tenant's products and orders |
| `admin` | Not stored in `User`. Logs in with `ADMIN_USERNAME` / `ADMIN_PASSWORD` from the environment | Approves or suspends tenants, views platform analytics |

Admin is never created through the public registration API.

## Components

| Component | File | Status |
|---|---|---|
| `User` model: `role`, `email`, `passwordHash`, `tenantId`, `status` | `src/models/User.js` | Implemented |
| `Tenant` model: `ownerId`, `slug`, `status` (`pending`, `approved`, `suspended`) | `src/models/Tenant.js` | Implemented |
| Environment config: `jwtSecret`, admin credentials | `src/config/env.js` | Implemented |
| `protect` and `authorize(...roles)` middleware | `src/middleware/auth.js` | Planned |
| Register, login and admin login controllers | `src/controllers/authController.js` | Planned |

## Registration and login flow

1. Client sends `POST /api/auth/register/customer`, `/register/vendor` or `/login`.
2. On register, the password is hashed with bcrypt and stored as `passwordHash`. The plain password is never stored or logged.
3. Vendor registration creates the `User`, then a `Tenant` with status `pending`, then sets `User.tenantId`.
4. On login, bcrypt compares the submitted password with `passwordHash`. This field should be `select: false`, so login queries it explicitly with `.select('+passwordHash')`.
5. A vendor whose tenant is not `approved` is rejected with `403`.
6. The server signs a JWT containing only the user id (or `role: admin` for the env-based admin) and returns `{ user, token }`.

## Protected request flow

1. Client sends `Authorization: Bearer <token>`.
2. `protect` verifies the signature and expiry, then loads the user. Missing, invalid or expired tokens, and users that no longer exist, return `401`.
3. `authorize('vendor')` (or another role list) compares `req.user.role` with the allow-list and returns `403` on a mismatch.
4. The controller runs. For vendor routes it filters every query by `req.user.tenantId`, never by an id taken from the request body.

## Design decisions

- **Stateless JWTs, no refresh tokens in v1.** Simple, but a token cannot be revoked before it expires except by rotating `JWT_SECRET`.
- **Role is re-read from the database on each request**, not trusted from the token, so role and status changes apply immediately.
- **Role checks happen in the routes, tenant isolation in the controllers.** `authorize('vendor')` only proves that some vendor is calling. The controller must prove the vendor owns the tenant that the data belongs to.
- **Secrets fail fast.** In production the app refuses to start if `JWT_SECRET` or the admin credentials are missing, rather than falling back to defaults.

## Known gaps

- Password reset
- Google and Apple sign-in
- Email verification
- Token revocation and refresh tokens
