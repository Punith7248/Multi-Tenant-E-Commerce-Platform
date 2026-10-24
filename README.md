# NovaCart Backend

REST API for **NovaCart**, a multi-tenant e-commerce marketplace where independent vendors run their own stores and customers shop across all of them.

Built with Node.js, Express, MongoDB (Mongoose), JWT authentication, Stripe payments, Cloudinary image hosting and Nodemailer email.

## Features

- Customer and vendor accounts with JWT auth and role-based access control (`customer`, `vendor`, `admin`)
- One store per vendor, with product CRUD scoped to the vendor's own store
- Product image uploads to Cloudinary (up to 5 images per request)
- Orders with transactional stock decrement
- Stripe Payment Intents and a signature-verified webhook that marks orders paid or failed
- Order confirmation email on successful payment
- Analytics: per-store revenue and units sold, plus platform totals for admins
- Security basics: Helmet, CORS allow-list, rate limiting, bcrypt password hashing

## Tech stack

| Layer | Tools |
|---|---|
| Server | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth / security | JWT, bcryptjs, Helmet |
| Integrations | Stripe, Cloudinary, Nodemailer |
| Testing | Jest, Supertest, mongodb-memory-server |

## Prerequisites

- Node.js 18 or newer
- A MongoDB deployment running as a **replica set** (MongoDB Atlas works out of the box). Order creation uses transactions, which standalone MongoDB does not support.
- Accounts and keys for Cloudinary, Stripe (test mode is fine) and an SMTP provider

## Installation

```bash
git clone https://github.com/<your-username>/novacart-backend.git
cd novacart-backend
npm install
cp .env.example .env
```

Fill in `.env` (see [docs/CONFIGURATION.md](docs/CONFIGURATION.md)), then start the server:

```bash
npm run dev     # development, auto-reload with nodemon
npm start       # production
```

The API runs on `http://localhost:5000` by default. Check it is up:

```bash
curl http://localhost:5000/api/health
```

### Stripe webhook (local development)

Use the Stripe CLI to forward events to your machine and copy the signing secret it prints into `STRIPE_WEBHOOK_SECRET`:

```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

## Running tests

```bash
npm test
```

Tests run against an in-memory MongoDB, so no database setup is needed.

## Project structure

```
src/
  config/        database and Cloudinary setup
  models/        User, Store, Product, Order
  middleware/    JWT auth + RBAC, upload, error handling
  controllers/   business logic per resource
  routes/        Express routers
  utils/         token signing, email sending
  server.js      app bootstrap
tests/           Jest + Supertest suites
docs/            API reference, configuration, architecture
```

## Documentation

- [API reference](docs/API.md)
- [Configuration](docs/CONFIGURATION.md)
- [Architecture overview](docs/ARCHITECTURE.md)
- [Auth architecture](docs/AUTH_ARCHITECTURE.md)
- [Contributing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## License

Released under the [MIT License](LICENSE).
