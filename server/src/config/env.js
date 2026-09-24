// Loads .env once and exports every setting the app uses. The rest of the code imports from here
// and never reads process.env directly, so a missing variable fails at boot, not mid-request.
const path = require('path');
const dotenv = require('dotenv');

// Resolved from this file, not process.cwd(), so it works no matter where node is started from.
dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

// Only what the server can't start without. Stripe/Cloudinary/email are read below but stay
// optional until the feature that uses them lands.
const REQUIRED = ['MONGO_URI', 'JWT_SECRET'];
const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`\n[env] Missing required environment variable(s): ${missing.join(', ')}`);
  console.error('[env] Copy .env.example to .env and fill them in.\n');
  process.exit(1);
}

const NODE_ENV = process.env.NODE_ENV || 'development';

// A guessable JWT secret means anyone can forge a token (including an admin one). The example value
// ships in the repo, so it must never be used for real.
const weakSecret = process.env.JWT_SECRET.length < 32 || /^replace-with/i.test(process.env.JWT_SECRET);
if (weakSecret) {
  const advice = 'JWT_SECRET is too short or still the placeholder. Generate one: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"';
  if (NODE_ENV === 'production') {
    console.error(`\n[env] ${advice}\n`);
    process.exit(1);
  }
  console.warn(`[env] WARNING: ${advice}`);
}

module.exports = {
  NODE_ENV,
  isProduction: NODE_ENV === 'production',
  PORT: Number(process.env.PORT) || 5000,

  // Comma-separated list of allowed frontend origins (Vite's dev server defaults to 5173).
  CLIENT_URLS: (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),

  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  // One 7-day token in an httpOnly cookie. There is no refresh token (see utils/token.js).
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,
};
