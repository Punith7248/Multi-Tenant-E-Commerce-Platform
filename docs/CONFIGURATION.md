# Configuration

All configuration is read from environment variables. Copy `.env.example` to `.env` for local development. Never commit `.env`.

| Variable | Required | Example | Description |
|---|---|---|---|
| `PORT` | no | `5000` | Port the server listens on |
| `NODE_ENV` | no | `development` | `production` hides stack traces in error responses |
| `CLIENT_URL` | no | `http://localhost:5173` | Allowed CORS origin (the frontend). Falls back to `*` if unset, so set it in production |
| `MONGO_URI` | yes | `mongodb+srv://user:pass@cluster.mongodb.net/novacart` | MongoDB connection string. Must be a replica set for order transactions |
| `JWT_SECRET` | yes | long random string | Secret used to sign tokens. Changing it logs everyone out |
| `JWT_EXPIRES_IN` | no | `7d` | Token lifetime, default `7d` |
| `CLOUDINARY_CLOUD_NAME` | yes | | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | yes | | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | yes | | Cloudinary API secret |
| `STRIPE_SECRET_KEY` | yes | `sk_test_...` | Stripe secret key. Use a test key outside production |
| `STRIPE_WEBHOOK_SECRET` | yes | `whsec_...` | Signing secret for the `/api/webhooks/stripe` endpoint |
| `SMTP_HOST` | yes | `smtp.gmail.com` | SMTP server |
| `SMTP_PORT` | no | `587` | SMTP port, default `587` |
| `SMTP_USER` | yes | | SMTP username |
| `SMTP_PASS` | yes | | SMTP password or app password |
| `EMAIL_FROM` | yes | `"NovaCart <no-reply@novacart.com>"` | Sender shown on outgoing email |

## Generating a JWT secret

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Production checklist

- Set `NODE_ENV=production` and a specific `CLIENT_URL`
- Use live Stripe keys and register the production webhook URL in the Stripe dashboard
- Store secrets in your host's secret manager, not in the repo
- Consider a stricter rate limit on `/api/auth`
