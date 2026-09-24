# Day 5: JWT auth + role-based access (handoff for Week 2)

**For:** Person A, who starts Store/Product CRUD on Monday and wraps every write route in these middleware. This is where they live and how to use them.

## The 30-second version

```js
const { authMiddleware } = require('../middleware/auth.middleware');
const { restrictTo, ownsStore, storeIdOf } = require('../middleware/rbac.middleware');
const { ROLES } = require('../utils/constants');

// vendor creates something: NO id in the URL, so the storeId is stamped from the token
router.post('/', authMiddleware, restrictTo(ROLES.VENDOR), validate(createProductSchema), createProduct);

// vendor touches something by id: check the boundary before the controller
router.patch('/:id',  authMiddleware, restrictTo(ROLES.VENDOR), ownsStore(storeIdOf(Product)), validate(updateProductSchema), updateProduct);
router.delete('/:id', authMiddleware, restrictTo(ROLES.VENDOR), ownsStore(storeIdOf(Product)), deleteProduct);
```

Then in the controller, **always scope the query too** (the boundary is guarded twice):

```js
const product = await Product.findOneAndUpdate(
  { _id: req.params.id, storeId: req.user.storeId },   // never req.body.storeId
  req.body,
  { returnDocument: 'after', runValidators: true }
);
if (!product) throw new AppError(404, 'Product not found');
```
and on create: `Product.create({ ...req.body, storeId: req.user.storeId })`.

## What each piece does

| Piece | File | Fails with | Meaning |
|---|---|---|---|
| `authMiddleware` | [auth.middleware.js](../server/src/middleware/auth.middleware.js) | **401** | We don't know who you are: no cookie, malformed/forged/expired token, or the user no longer exists. **403** if the account is deactivated |
| `restrictTo('vendor')`, `restrictTo('vendor','admin')` | [rbac.middleware.js](../server/src/middleware/rbac.middleware.js) | **403** | We know who you are; your role isn't allowed. A typo like `restrictTo('vender')` throws when the server boots |
| `ownsStore(...)` | same file | **403** / **404** | The tenant boundary. 403: the target belongs to another store (or you're not a vendor). 404: the target doesn't exist. **Admins always pass** |
| `storeIdOf(Model, param='id')` | same file | | Builds the resolver for `ownsStore`: loads the doc by `req.params[param]` and returns its `storeId` |

**Always put them in this order:** `authMiddleware` → `restrictTo` → `ownsStore` → validate → controller.

`ownsStore` has three forms:
- `ownsStore()` compares a `:storeId` URL param with your store (`/stores/:storeId/...`).
- `ownsStore(storeIdOf(Product))` loads the product from `:id` and compares its `storeId`. For a different param name: `storeIdOf(Order, 'orderId')`.
- `ownsStore(async (req) => ...)` any function that returns a storeId (or `undefined` if the resource doesn't exist).

**`req.user`** (set by `authMiddleware`) is `{ id, role, storeId }`. `storeId` is `null` for customers and admins. Customer-owned data (cart, my orders) is filtered by `req.user.id`, not by store.

## What login and the token look like now

- `POST /api/auth/login` response body is **unchanged from Day 4** (`{ success, message, data: { user } }`).
- It also sets a cookie: `token=<jwt>; HttpOnly; SameSite=Lax; Path=/; Expires=<7 days>` (`Secure` in production).
- JWT payload: `{ id, role, storeId, iat, exp }`. No email, no password, nothing personal. `storeId` is `null` unless vendor.
- `GET /api/auth/me` → `{ success: true, data: { user } }` (same `user` shape as login).
- `POST /api/auth/logout` → clears the cookie. It exists because JavaScript can't delete an httpOnly cookie.
- `GET /api/admin/ping` → 200 only for admins. The whole `/api/admin` router is admin-only ([admin.routes.js](../server/src/routes/admin.routes.js) applies `authMiddleware, restrictTo('admin')` to the router), so any admin route you add there is protected by default.

## Decisions (please confirm; this changed the Day 1 design)

1. **Token in an httpOnly cookie, not in the JSON body.** JS on the page can never read it, so an XSS bug can't steal the session; the frontend never touches the token; and the login response shape does not change. **The frontend must send credentials on every request:** `fetch(url, { credentials: 'include' })` or axios `withCredentials: true` (CORS already allows it for `CLIENT_URL`). Cookie auth is exposed to CSRF, so the cookie is `SameSite=Lax` and CORS only allows our frontend origin. **If the frontend and API are ever deployed on different sites** (e.g. Vercel + Render), browsers block the cookie: switch to returning the token in the body and reading an `Authorization: Bearer` header. That change is confined to `utils/token.js`, `login`, and `auth.middleware.js`.
2. **Payload is `{ id, role, storeId }` and the token lasts 7 days, with no refresh token** (Day 1 planned 15 min + refresh). It's safe to put `role`/`storeId` in the token because both are immutable on the User model. What can change is `isActive`, so `authMiddleware` does one small DB read per request; a ban applies on the next request, not in 7 days.
3. **Cross-tenant = 403, not 404** (Day 1 said 404). The brief asked for a strict 401-vs-403 split, and "logged in but not allowed" is 403. The cost: a vendor can tell that an id exists in another store. ObjectIds aren't secrets, so we accept it.
4. **`requireStore` / `req.storeId` from Day 1 are gone;** use `req.user.storeId`.
5. **The admin seed script was needed to demonstrate the admin route,** so it exists now: set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`, run `npm run seed:admin`, then delete the password from `.env`. Safe to run twice.

## Hand-test it (Git Bash; server running on port 5000)

```bash
API=http://localhost:5000/api

# 1) no token -> 401
curl -i $API/auth/me

# 2) customer token on the admin route -> 403
curl -c cust.jar -X POST $API/auth/login -H "Content-Type: application/json" \
  -d '{"email":"ann@example.com","password":"password123"}'     # register her first (Day 4 doc)
curl -b cust.jar $API/admin/ping

# 3) vendor token -> 200 on /me
curl -c vend.jar -X POST $API/auth/login -H "Content-Type: application/json" \
  -d '{"email":"vic@example.com","password":"password123"}'
curl -b vend.jar $API/auth/me

# 4) admin token -> 200 on the admin route (after npm run seed:admin)
curl -c adm.jar -X POST $API/auth/login -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"<ADMIN_PASSWORD>"}'
curl -b adm.jar $API/admin/ping

# logout, then /me is 401 again
curl -b vend.jar -c vend.jar -X POST $API/auth/logout
curl -b vend.jar $API/auth/me
```

`-c file` saves the cookie, `-b file` sends it. **Postman** keeps cookies automatically per host: log in once, then call the protected routes. Delete the `*.jar` files afterwards.

## Before you start Week 2

- **Update your own `.env`:** `JWT_EXPIRES_IN=7d`. If you copied the old `.env.example` it still says `15m`, and with no refresh token you'd be logged out every 15 minutes. (`JWT_REFRESH_*` are no longer used and can be deleted.)
- **Use a real `JWT_SECRET`** (the server warns in development and **refuses to start in production** if it's the placeholder or under 32 characters). Generate one: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
- **`Store.isActive` is not enforced anywhere yet.** A vendor whose store an admin deactivated can still write. Decide where to check it when you build Store CRUD (likely inside `ownsStore` or a small extra middleware).
- **Every vendor route needs a two-vendor test:** vendor B against vendor A's product must be 403. The `ownsStore` behaviour was verified this way against real data (see below).
- **No rate limiting yet** on login/register.

## What was verified

Against a real (throwaway) MongoDB, by hand and with a script (40 checks):
- no token → 401 on `/auth/me` and `/admin/ping`; customer on admin → 403; vendor on `/auth/me` → 200; admin on `/admin/ping` → 200; logout then `/me` → 401.
- Forged tokens all get 401 and never crash the server: wrong secret, edited payload with the original signature, `alg: none`, a different algorithm, no `id`, an unknown role, expired, a deleted user, junk cookies. A valid token in an `Authorization` header alone is rejected (cookie-only).
- A deactivated user with a still-valid token gets 403 immediately, and works again the moment they're reactivated.
- `restrictTo` (one role, several roles, typo at definition time) and `ownsStore` (own store, other vendor's store, customer, admin, nonexistent id, malformed id, custom param name) with two real vendors, products and an order.

Not covered: a real browser sending the cookie from the React app (needs `credentials: 'include'`), and Atlas.

## Files

| File | What it is |
|---|---|
| [utils/token.js](../server/src/utils/token.js) | sign/verify, cookie set/clear, and the reasoning for cookie-vs-body |
| [middleware/auth.middleware.js](../server/src/middleware/auth.middleware.js) | `authMiddleware` |
| [middleware/rbac.middleware.js](../server/src/middleware/rbac.middleware.js) | `restrictTo`, `ownsStore`, `storeIdOf` |
| [controllers/auth.controller.js](../server/src/controllers/auth.controller.js) | `login` now issues the cookie; new `logout`, `getMe` |
| [routes/auth.routes.js](../server/src/routes/auth.routes.js), [routes/admin.routes.js](../server/src/routes/admin.routes.js) | `/auth/me`, `/auth/logout`, `/admin/ping` |
| [scripts/seed-admin.js](../server/scripts/seed-admin.js) | `npm run seed:admin` |
| [config/env.js](../server/src/config/env.js) | `JWT_EXPIRES_IN` defaults to 7d; refuses weak secrets in production |
