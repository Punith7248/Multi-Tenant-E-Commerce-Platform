# Architecture overview

NovaCart is a single Express application backed by MongoDB. Requests move through a fixed pipeline:

```
Request
  -> Helmet, CORS, request logging
  -> Rate limiter (/api)
  -> Stripe webhook route (raw body, mounted before JSON parsing)
  -> JSON body parsing
  -> Router (auth, stores, products, orders, payments, analytics)
       -> protect (JWT)  ->  authorize (role)  ->  controller
  -> notFound -> errorHandler
```

## Layers

| Layer | Folder | Responsibility |
|---|---|---|
| Routes | `src/routes` | Map URLs to middleware and controllers |
| Middleware | `src/middleware` | Authentication, role checks, image upload, error formatting |
| Controllers | `src/controllers` | Business logic and database access |
| Models | `src/models` | Mongoose schemas and indexes |
| Utils / config | `src/utils`, `src/config` | Token signing, email, DB and Cloudinary setup |

## Data model

```
User  1 ---- 0..1  Store  1 ---- *  Product
  |                  |
  | 1                | (referenced per order item)
  *                  *
Order  ---- items[] { product, store, name, price, quantity }
```

- A **User** has a role. A vendor links to at most one **Store**.
- A **Product** belongs to exactly one Store.
- An **Order** belongs to one customer and can contain items from several stores. Each item stores a snapshot of name and price, plus its store id, so vendor-level reporting works without joins.

## Multi-tenancy

Tenants are stores. Role checks happen in the routes, and tenant isolation happens in the controllers: a vendor can only read or modify products and orders tied to the store found via `Store.findOne({ owner: req.user._id })`, never an id taken from the request body.

## Order and payment lifecycle

1. Customer creates an order. Stock is decremented in a transaction. Status: `pending`.
2. Customer requests a PaymentIntent for the order and confirms payment with Stripe.js.
3. Stripe calls the webhook.
   - Success: order becomes `paid` and a confirmation email is sent.
   - Failure: order becomes `failed` and stock is restored.

See [AUTH_ARCHITECTURE.md](AUTH_ARCHITECTURE.md) for the authentication and RBAC design.
