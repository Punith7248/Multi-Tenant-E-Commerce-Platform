# API reference

Base URL: `http://localhost:5000/api`

## Conventions

- Request and response bodies are JSON unless noted (product create/update use `multipart/form-data`).
- Authenticated routes need the header `Authorization: Bearer <token>`.
- Successful responses look like `{ "success": true, "data": ... }`.
- Errors look like `{ "success": false, "message": "..." }` with a matching HTTP status.
- All `/api` routes are rate limited to 300 requests per 15 minutes per IP.

| Status | Meaning |
|---|---|
| 400 | Validation error, duplicate value, or bad input |
| 401 | Missing, invalid or expired token; wrong credentials |
| 403 | Authenticated but the role is not allowed, or not the resource owner |
| 404 | Resource or route not found |

## Health

### `GET /health`
Public. Returns `{ "success": true, "status": "ok", "timestamp": "..." }`.

## Auth

### `POST /auth/register`
Public.

```json
{ "fullName": "Jordan Rivera", "email": "jordan@example.com", "password": "supersecure1", "phone": "+1 555 000 0000", "role": "customer" }
```

`role` can be `customer` (default) or `vendor`. `admin` cannot be self-assigned. Password must be at least 8 characters.

Response `201`:

```json
{ "success": true, "data": { "_id": "...", "fullName": "Jordan Rivera", "email": "jordan@example.com", "role": "customer", "token": "<jwt>" } }
```

### `POST /auth/login`
Public. Body: `{ "email", "password" }`. Returns the same shape as register.

### `GET /auth/me`
Requires login. Returns the current user.

## Stores

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/stores` | vendor | Create your store (one per vendor). Body: `name`, `description?`, `contactEmail?` |
| GET | `/stores/me` | vendor | Get your store |
| PATCH | `/stores/me` | vendor | Update `name`, `description`, `logoUrl`, `bannerUrl`, `contactEmail` |
| GET | `/stores/:idOrSlug` | public | Get a store by Mongo id or slug |

## Products

| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/products` | public | List products |
| GET | `/products/:id` | public | Get one product (includes store name and slug) |
| POST | `/products` | vendor | Create a product in your store |
| PATCH | `/products/:id` | vendor (owner) | Update a product |
| DELETE | `/products/:id` | vendor (owner) | Delete a product and its Cloudinary images |

**List query params:** `store`, `category`, `q` (text search), `page` (default 1), `limit` (default 20).

**Create / update** use `multipart/form-data`:

| Field | Type | Notes |
|---|---|---|
| `name` | string | required on create |
| `price` | number | required on create, min 0 |
| `stock` | number | defaults to 0 |
| `description`, `category` | string | optional |
| `isActive` | boolean | update only |
| `images` | file(s) | up to 5 per request, 5 MB each, jpg / jpeg / png / webp |

## Orders

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/orders` | customer | Create an order |
| GET | `/orders/me` | customer | Your orders, newest first |
| GET | `/orders/store` | vendor | Orders containing items from your store |
| GET | `/orders/:id` | customer owner, vendor in the order, or admin | Get one order |

Create body:

```json
{
  "items": [{ "product": "<productId>", "quantity": 2 }],
  "shippingAddress": { "line1": "1 Main St", "city": "Austin", "state": "TX", "postalCode": "78701", "country": "US" }
}
```

Stock is decremented inside a transaction. If any item is unavailable or out of stock the request fails with `400` and nothing is changed. The new order starts as `pending` / `unpaid`.

Order statuses: `pending`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`, `failed`.

## Payments

### `POST /payments/create-intent`
Customer only. Body: `{ "orderId": "<id>" }`. Creates a Stripe PaymentIntent (USD) for the order total and returns:

```json
{ "success": true, "data": { "clientSecret": "pi_..._secret_..." } }
```

Use the `clientSecret` with Stripe.js on the frontend to confirm payment.

### `POST /webhooks/stripe`
Called by Stripe, not by your frontend. Requires a valid `Stripe-Signature` header.

| Event | Effect |
|---|---|
| `payment_intent.succeeded` | Order becomes `paid`, confirmation email is sent |
| `payment_intent.payment_failed` | Order becomes `failed`, stock is restored |

## Analytics

### `GET /analytics/store?from=YYYY-MM-DD&to=YYYY-MM-DD`
Vendor only. Counts orders in `paid`, `processing`, `shipped` or `delivered` status that contain your store's items.

```json
{ "success": true, "data": { "summary": { "revenue": 240, "unitsSold": 12, "orderCount": 5 }, "dailyRevenue": [{ "_id": "2026-10-01", "revenue": 80 }] } }
```

### `GET /analytics/platform`
Admin only. Returns `totalRevenue`, `totalOrders` and `ordersByStatus`.
