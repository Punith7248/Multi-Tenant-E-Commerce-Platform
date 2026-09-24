const express = require('express');
const validate = require('../middleware/validate.middleware');
const { authMiddleware } = require('../middleware/auth.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const { register, login, logout, getMe } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getMe);

module.exports = router;
