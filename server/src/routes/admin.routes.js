const express = require('express');
const { authMiddleware } = require('../middleware/auth.middleware');
const { restrictTo } = require('../middleware/rbac.middleware');
const { ROLES } = require('../utils/constants');
const { ping } = require('../controllers/admin.controller');

const router = express.Router();

// Applied to the whole router, so every admin route added later is admin-only by default.
router.use(authMiddleware, restrictTo(ROLES.ADMIN));

router.get('/ping', ping);

module.exports = router;
