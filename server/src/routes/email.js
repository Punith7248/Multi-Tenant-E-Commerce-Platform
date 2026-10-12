import { Router } from 'express';
import { auth, requireRole } from '../utils/auth.js';
import { sendEmail } from '../services/integrations.js';
const router = Router();
router.post('/send', auth, requireRole('super_admin','vendor'), async (req, res) => {
  try { const sent = await sendEmail(req.body); res.json({ sent }); } catch (e) { res.status(400).json({ message: e.message }); }
});
export default router;
