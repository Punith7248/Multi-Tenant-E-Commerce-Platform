import { Router } from 'express';
import { auth, requireRole } from '../utils/auth.js';
import { uploadImage } from '../services/integrations.js';
const router = Router();
router.post('/upload', auth, requireRole('vendor'), async (req, res) => {
  try {
    if (!req.body.dataUri) return res.status(400).json({ message: 'Image data is required' });
    const url = await uploadImage(req.body.dataUri, `novacart/${req.user.tenantId}`);
    res.json({ url });
  } catch (e) { res.status(400).json({ message: e.message }); }
});
export default router;
