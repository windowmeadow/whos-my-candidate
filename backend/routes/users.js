import { Router } from 'express';

const router = Router();

// Users endpoints removed. If user storage is needed, reintroduce DB code.
router.get('/', (req, res) => {
  res.status(410).json({ error: 'Users endpoints removed.' });
});

export default router;