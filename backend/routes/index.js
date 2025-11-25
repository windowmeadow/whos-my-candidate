import { Router } from 'express';
const router = Router();

// Minimal placeholder root route (keep framework structure).
router.get('/', (req, res) => {
  res.json({ ok: true });
});

export default router;
