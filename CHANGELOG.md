# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Planned
- Password reset flow
- Google and Apple sign-in
- Email verification on signup
- CI workflow and deployment configuration

## [1.0.0] - 2026-10-24

### Added
- Express server with Helmet, CORS, request logging, rate limiting and a health check
- User registration and login with bcrypt password hashing and JWT authentication
- Role-based access control for `customer`, `vendor` and `admin`
- Store creation and management (one store per vendor)
- Product CRUD scoped to the owning vendor's store, with text search, filtering and pagination
- Cloudinary image uploads for products (up to 5 images per request)
- Order creation with transactional stock decrement
- Stripe Payment Intents and a signature-verified webhook
- Order confirmation emails via Nodemailer
- Store and platform analytics endpoints
- Jest and Supertest smoke tests for the auth flow
- Documentation: README, API reference, configuration guide, architecture overview
