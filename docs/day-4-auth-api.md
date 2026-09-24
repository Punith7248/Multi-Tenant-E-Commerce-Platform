# Day 4: Register & Login API (handoff to Day 5)

**For:** Person B, who builds JWT + RBAC (Day 5) on top of this. Read "What login returns" and "Day 5: where you plug in" first.

Base URL (local): `http://localhost:5000/api` (port from `PORT` in `.env`). Every response is JSON: `{ success, message?, data? , errors? }`.

## What login returns

`POST /api/auth/login` → **200**

```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": "6ab17d34b68fb6cb479da247",
      "name": "Vic Vendor",
      "email": "vic@example.com",
      "role": "vendor",
      "storeId": "6ab17d34b68fb6cb479da248",
      "isActive": true,
      "createdAt": "2026-09-21T18:53:40.501Z",
      "updatedAt": "2026-09-21T18:53:40.501Z"
    }
  }
}
```

**No token in the body.** Since Day 5 a successful login also sets an httpOnly `token` cookie ([details](day-5-auth-rbac.md)); the JSON is exactly as shown. Register returns the same `data.user` shape, with status 201 (and does not log you in).

### The `user` object: the public contract

| Field | Type | Notes |
|---|---|---|
| `id` | string | The user's id (it is `id` inside the JWT too). There is **no `_id`** in API output |
| `name` | string | |
| `email` | string | Always lowercase |
| `role` | `"customer"` \| `"vendor"` \| `"admin"` | |
| `storeId` | string | **Only present when `role` is `"vendor"`.** For customers and admins the key is absent (not `null`) |
| `isActive` | boolean | |
| `createdAt`, `updatedAt` | ISO date string | |

`password` is never returned, by any endpoint or any query. It is `select: false` on the model and stripped again in `toJSON`.

## POST /api/auth/register

Body:

| Field | Required | Rules |
|---|---|---|
| `name` | yes | 2–80 chars, trimmed |
| `email` | yes | valid email, trimmed and lowercased (`Ann@X.com` is stored as `ann@x.com`) |
| `password` | yes | 8+ chars, at most 72 **bytes** (bcrypt ignores anything longer) |
| `role` | no | `"customer"` (default) or `"vendor"`. `"admin"` is rejected: admins are seeded, never registered |
| `storeName` | vendors only | 2–80 chars. **Required** when `role` is `vendor`, **rejected** otherwise |

Any other field (`storeId`, `isActive`, ...) is rejected with `Unknown field`. A client can't smuggle values in.

**Decision: a vendor's Store is created here, at registration.** The User schema (Day 2) refuses a vendor without a `storeId`, so creating the store "later" isn't possible. Registering as a vendor creates a Store with `name = storeName` and a slug derived from it (`"Vic Coffee & Co."` → `vic-coffee-co`), and links both ways (`User.storeId` ↔ `Store.ownerId`). Week 2's Store CRUD only *edits* it (description, logo). The store is inserted first and deleted again if the user insert fails, so there are no orphan stores. Not a transaction, because a plain local `mongod` can't run them.

Responses:

| Status | When | Body |
|---|---|---|
| **201** | created | `{ success: true, message: "Registered successfully", data: { user } }` |
| **400** | validation failed | `{ success: false, message: "Validation failed", errors: { "<field>": "<message>" } }` |
| **409** | email already registered (case-insensitive) | `{ success: false, message: "An account with this email already exists" }` |
| **409** | vendor's store name/slug taken | `{ success: false, message: "A store with this name already exists" }` |

## POST /api/auth/login

Body: `{ "email": "...", "password": "..." }` (email is case-insensitive; no other fields allowed).

| Status | When | Body |
|---|---|---|
| **200** | credentials valid, account active | `{ success: true, message: "Logged in successfully", data: { user } }` |
| **400** | missing/invalid fields | validation shape, as above |
| **401** | unknown email **or** wrong password | `{ success: false, message: "Invalid email or password" }` (identical for both, and they take the same time: for an unknown email we still run a bcrypt comparison against a dummy hash) |
| **403** | right password but `isActive` is false | `{ success: false, message: "This account has been deactivated" }` (only checked after the password matches, so it can't be used to probe which emails exist) |

## Day 5 is done: see [day-5-auth-rbac.md](day-5-auth-rbac.md)

Login now also sets an httpOnly `token` cookie (the JSON body above is unchanged), and `GET /api/auth/me`, `POST /api/auth/logout`, `authMiddleware`, `restrictTo`, `ownsStore` and the admin seed script all exist.

Things that will bite:
- To read the hash you must ask: `User.findOne(...).select('+password')`.
- **Never set `password` with an update query or `insertMany`:** they skip the hashing hook, so the model throws if you try. Change a password with `user.password = x; await user.save()`.
- `role` and `storeId` are immutable on the model: an update that tries to change them is silently dropped.

## Try it (curl)

Works in Git Bash, macOS and Linux. Start the server first (`npm run dev`). In **Postman**: method POST, the URL below, Body → raw → JSON, paste the JSON in single quotes from each command.

```bash
# Register a customer (role defaults to "customer")
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ann Lee","email":"ann@example.com","password":"password123"}'

# Register a vendor (creates their store too)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Vic Vendor","email":"vic@example.com","password":"password123","role":"vendor","storeName":"Vic Coffee & Co."}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ann@example.com","password":"password123"}'

# Login with the wrong password -> 401 "Invalid email or password" (same for an unknown email)
curl -i -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ann@example.com","password":"wrong-password"}'

# Duplicate email (case-insensitive) -> 409
curl -i -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ann Two","email":"ANN@example.com","password":"password123"}'

# Validation errors -> 400 with a per-field "errors" object
curl -i -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"A","email":"nope","password":"short"}'
```

**PowerShell** (its `curl` is an alias for something else; use this instead, and note it throws on 4xx responses):

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/auth/login `
  -ContentType 'application/json' `
  -Body '{"email":"ann@example.com","password":"password123"}'
```

## Not done yet (on purpose)

- **Refresh tokens**: not planned; one 7-day cookie token (Day 5).
- **Rate limiting on login/register.** Right now nothing stops password guessing. Add `express-rate-limit` on `/api/auth` before this goes anywhere public.
- **Email verification and password reset**: stretch/later.
- bcrypt runs in pure JS (`bcryptjs`), so each register/login takes ~0.4 s at cost 12. That's fine for now; swap to native `bcrypt` if it ever matters.

## Files

| File | What it is |
|---|---|
| [user.model.js](../server/src/models/user.model.js) | schema, `pre('save')` hashing hook, `comparePassword`, update-query guard |
| [auth.controller.js](../server/src/controllers/auth.controller.js) | `register` (+ `registerVendor`), `login` |
| [auth.routes.js](../server/src/routes/auth.routes.js) | the two routes; mounted at `/auth` in `routes/index.js` |
| [auth.validator.js](../server/src/validators/auth.validator.js) | Zod schemas for both bodies |
| [validate.middleware.js](../server/src/middleware/validate.middleware.js) | runs a Zod schema, turns failures into a 400 `AppError` |
| [slugify.js](../server/src/utils/slugify.js) | store name → URL slug |
