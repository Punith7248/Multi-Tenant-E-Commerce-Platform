# Contributing to NovaCart Backend

Thanks for helping out. This guide covers how to set up, make changes and submit them.

## Getting started

1. Fork the repository and clone your fork.
2. Install dependencies and create your environment file:
   ```bash
   npm install
   cp .env.example .env
   ```
3. Run the tests to confirm a clean baseline:
   ```bash
   npm test
   ```

## Workflow

1. Create a branch from `main`:
   ```bash
   git checkout -b feat/short-description
   ```
   Branch prefixes: `feat/`, `fix/`, `docs/`, `refactor/`, `test/`, `chore/`.
2. Make your change, keeping each commit focused on one thing.
3. Add or update tests for any behavior change.
4. Run `npm test` and make sure it passes.
5. Open a pull request against `main` and describe what changed and why.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add password reset endpoint
fix: restore stock when payment fails
docs: document analytics query params
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

## Code guidelines

- Follow the existing layout: routes call middleware and controllers, controllers hold the logic, models hold schemas.
- Wrap async controllers in `express-async-handler` and throw errors with an appropriate `res.status(...)` set, so the central error handler formats the response.
- Enforce roles with `authorize(...)` in the route, and enforce ownership inside the controller. Never trust a store or owner id from the request body.
- Never commit secrets. New environment variables must be added to `.env.example` and `docs/CONFIGURATION.md`.
- Keep API changes in sync with `docs/API.md`, and add an entry under `[Unreleased]` in `CHANGELOG.md`.

## Pull request checklist

- [ ] Tests added or updated, and `npm test` passes
- [ ] Docs updated (`docs/API.md`, `docs/CONFIGURATION.md`) if behavior or config changed
- [ ] `CHANGELOG.md` updated
- [ ] No secrets or `.env` files included

## Reporting bugs and requesting features

Open an issue with steps to reproduce (or the use case for a feature), the expected behavior, and the actual behavior. For security issues, do not open a public issue; contact the maintainers privately instead.
