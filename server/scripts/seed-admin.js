// Creates the first super admin (admins can't register through the API, by design).
//   1. set ADMIN_EMAIL and ADMIN_PASSWORD (and optionally ADMIN_NAME) in .env
//   2. npm run seed:admin
// Safe to run twice: an existing account with that email is left untouched.
const mongoose = require('mongoose');
require('../src/config/env'); // loads .env
const connectDB = require('../src/config/db');
const User = require('../src/models/user.model');
const { ROLES } = require('../src/utils/constants');

const run = async () => {
  const { ADMIN_NAME = 'Super Admin', ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('[seed] Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env first.');
    process.exit(1);
  }

  await connectDB();

  const email = ADMIN_EMAIL.trim().toLowerCase();
  if (await User.exists({ email })) {
    console.log(`[seed] ${email} already exists, nothing changed.`);
  } else {
    // create() (a save) runs the password-hashing hook; never insert admins with insertMany/updateOne.
    await User.create({ name: ADMIN_NAME, email, password: ADMIN_PASSWORD, role: ROLES.ADMIN });
    console.log(`[seed] Admin created: ${email}. You can remove ADMIN_PASSWORD from .env now.`);
  }

  await mongoose.connection.close();
};

run().catch((error) => {
  console.error(`[seed] Failed: ${error.message}`);
  process.exit(1);
});
