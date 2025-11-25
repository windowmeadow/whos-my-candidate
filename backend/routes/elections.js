import { Router } from 'express';

const router = Router();

// Endpoint intentionally removed. Return 410 Gone to indicate deprecation.
router.get('/', (req, res) => {
  res.status(410).json({ error: 'Elections endpoint removed.' });
});

export default router;
