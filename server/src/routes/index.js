const express = require('express');

const router = express.Router();

// Mounted at /api (see app.js). One line per resource router:
router.use('/auth', require('./auth.routes'));
router.use('/admin', require('./admin.routes'));
// Week 2 adds, e.g.:
//   router.use('/stores', require('./store.routes'));
//   router.use('/products', require('./product.routes'));

module.exports = router;
