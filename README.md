# Multi-Tenant E-Commerce SaaS Platform

A multi-vendor e-commerce backend where independent vendors each run their own store, customers shop across every store from one account, and a super admin oversees the whole platform. Built with Node.js, Express, MongoDB/Mongoose, JWT auth, Stripe and Cloudinary.

**Start here, then go deeper:** this file orients you and gets the server running. The **`docs/`** folder is where the actual decisions live — read it before writing any route or schema, not after something breaks.

## Who's on this

Two-person backend team, one person leading each day, both walked through every decision before it's used the next day. See [docs/day-1-architecture.md §4.4](docs/day-1-architecture.md#4-coding-conventions) for the review habit this implies (short version: the other person looks at every PR before it merges, even briefly).

## Project status

Backend only, in progress. No frontend exists yet (`client/` is a placeholder). Built so far, day by day:

| Day | What it delivered | Doc |
|---|---|---|
| 1 | Requirement analysis, architecture diagram, folder structure, coding conventions | [day-1-architecture.md](docs/day-1-architecture.md) |
| 2 | Mongoose schemas: User, Store, Product, Order | amendments in day-1 doc |
| 3 | Express server bootstrap, MongoDB connection, core middleware, central error handling | amendments in day-1 doc |
| 4 | User model wiring, `POST /api/auth/register`, `POST /api/auth/login` (bcrypt) | [day-4-auth-api.md](docs/day-4-auth-api.md) |
| 5 | JWT issuance, `authMiddleware`, `restrictTo`/`ownsStore` (RBAC + multi-tenant boundary), `/api/auth/me`, admin seed script | [day-5-auth-rbac.md](docs/day-5-auth-rbac.md) |

**Each doc's top amendments block is the current truth for anything it revises** — later days override earlier ones (e.g. Day 5 replaces the auth design Day 1 sketched). Read a doc from the top: the amendments tell you what changed before you hit the original text.

**Next up (Week 2):** Store and Product CRUD, wrapped in `authMiddleware` + `restrictTo('vendor')` + `ownsStore` (see the Day 5 doc's "30-second version" before writing a route).

## The one rule everything else depends on

**A tenant is a Store. `storeId` = `Store._id`.** It lives on `Product.storeId` and `Order.storeId` (required, immutable). A vendor's `storeId` comes only from their signed JWT (`req.user.storeId`) — never from a request body, param or query. Every vendor-scoped write is checked twice: `restrictTo('vendor')` + `ownsStore(...)` in the route, and the same `storeId` scoped inside the controller's own query. Full reasoning: [day-1-architecture.md §2.3–2.4](docs/day-1-architecture.md).

## Tech stack

| Layer | Choice |
|---|---|
| Runtime | Node.js ≥ 20, CommonJS (`require`/`module.exports`) |
| API | Express 5 |
| Database | MongoDB via Mongoose 9 |
| Auth | JWT in an httpOnly cookie (not a header, not the response body) + bcrypt |
| Validation | Zod |
| File storage | Cloudinary (product images — Week 2) |
| Payments | Stripe (checkout — Week 3) |
| Email | Nodemailer |
| Frontend | React (not started) |

## Repository layout

```
.
├── docs/     reference docs — read these before working on anything they cover
├── server/   the Express API (everything currently runs here)
└── client/   React frontend (not built yet)
```

Inside `server/src/`: `models/`, `routes/`, `controllers/`, `middleware/`, `validators/`, `config/`, `utils/`. One model = one routes file = one controller file, so two people rarely edit the same file. Full layout and rationale: [day-1-architecture.md §3](docs/day-1-architecture.md).

## Getting started

Requires Node.js ≥ 20 and a MongoDB instance (local or [Atlas](https://www.mongodb.com/atlas)).

```bash
git clone <this-repo-url>
cd "Multi-E-Comerce-plaform/server"
npm install
cp .env.example .env      # Windows cmd: copy .env.example .env
```

Open `.env` and set, at minimum:

| Variable | What to put |
|---|---|
| `MONGO_URI` | Your connection string. Local default works, but **vendor registration uses a transaction-style rollback that needs a replica set** — Atlas has one; a bare local `mongod` needs `--replSet` |
| `JWT_SECRET` | A long random string, not the placeholder. Generate one: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. The server **refuses to start in production** with a weak or placeholder secret |

Everything else in `.env.example` (Cloudinary, Stripe, email, admin seed) is for later weeks — safe to leave as placeholders until that feature is built.

```bash
npm run dev
```

Confirm it's alive: open <http://localhost:5000/api/health> → `{"status":"ok"}`.

To get an admin account (there's no public admin signup, by design): set `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `.env`, then `npm run seed:admin` (safe to run twice).

## What's built right now (API)

Base URL: `http://localhost:5000/api`. Every response is `{ success, message?, data?, errors? }`.

| Method & path | Auth | What it does |
|---|---|---|
| `GET /health` | none | Liveness check |
| `POST /auth/register` | none | Create a customer or vendor account (`role`, and `storeName` if vendor) |
| `POST /auth/login` | none | Verify credentials; sets an httpOnly `token` cookie (7 days) |
| `POST /auth/logout` | none | Clears the cookie |
| `GET /auth/me` | any logged-in user | Returns the caller's own profile |
| `GET /admin/ping` | admin only | Proves the auth + role chain end to end |

Exact request/response shapes, curl examples, and what to build next: [day-4-auth-api.md](docs/day-4-auth-api.md) and [day-5-auth-rbac.md](docs/day-5-auth-rbac.md).

**Auth model in one line:** login sets an httpOnly cookie (never a token in the JSON body); the frontend must call the API with credentials included (`fetch(url, { credentials: 'include' })` / axios `withCredentials: true`); there is no refresh token, just one 7-day token re-checked against the database on every request so a ban takes effect immediately.

## Available scripts (run from `server/`)

| Command | Does |
|---|---|
| `npm run dev` | Start the API with nodemon (auto-restart) |
| `npm start` | Start the API once, no auto-restart |
| `npm run seed:admin` | Create the first admin account from `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `.env` |

## Working on this project

- **Read the relevant `docs/` file before you touch a model, route or middleware it covers.** These aren't post-hoc notes — they're the design record, including *why*, and the assumptions the rest of the sprint depends on.
- **Naming, Git branches (`feature/...`, `fix/...`), commit format, and the PR review habit** are all in [day-1-architecture.md §4](docs/day-1-architecture.md).
- **Errors:** throw `new AppError(statusCode, message)` from anywhere in a controller; never `res.status().send()` for an error, and never a bare `try/catch` that swallows one. Express 5 forwards a thrown/rejected error from any async handler to the central error middleware on its own.
- **401 vs 403:** 401 means "we don't know who you are" (no/bad/expired token). 403 means "we know exactly who you are, and the answer is no" (wrong role, someone else's store, deactivated account). Don't mix these up.
- **Secrets never get committed.** `.env` is git-ignored in `server/`; only `.env.example` (placeholders) is tracked. If you ever add a new required setting, add its placeholder to `.env.example` too.
- **Money is always an integer number of cents** (`price`, `totalAmount`), never a float.

## Known gaps (tracked, not forgotten)

- No frontend yet.
- `Store.isActive` isn't enforced anywhere yet — a vendor whose store is deactivated can still write. Slated for Week 2's Store CRUD.
- No rate limiting on `/auth/login` or `/auth/register` yet.
- No email verification or password-reset flow yet.
- This repo has no remote configured yet — push it to GitHub and set up branch protection on `main`/`dev` before the team starts branching (see [day-1-architecture.md §4.4](docs/day-1-architecture.md)).
