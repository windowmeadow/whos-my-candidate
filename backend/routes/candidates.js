import { Router } from 'express';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = join(__dirname, '../data/candidates.json');

// GET /api/candidates or /api/candidates?zip=10026
// Currently zip filtering is trivial: if zip === 10026 return all; future logic could map districts.
router.get('/', async (req, res) => {
  try {
    const zip = req.query.zip;
    const raw = await readFile(dataPath, 'utf8');
    const candidates = JSON.parse(raw);

    // Placeholder filtering logic (may expand later)
    let filtered = candidates;
    if (zip && /^\d{5}$/.test(zip)) {
      if (zip === '10026') {
        filtered = candidates; // show all for this special ZIP
      } else {
        // For other ZIPs we could later restrict; for now still return all
        filtered = candidates;
      }
    }

    res.json({ candidates: filtered });
  } catch (err) {
    console.error('Error reading candidates:', err);
    res.status(500).json({ error: 'Failed to load candidates', details: err.message });
  }
});

// GET /api/candidates/:slug
router.get('/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const raw = await readFile(dataPath, 'utf8');
    const candidates = JSON.parse(raw);
    const found = candidates.find(c => c.slug === slug || c.id === slug);
    if (!found) return res.status(404).json({ error: 'Candidate not found' });
    res.json({ candidate: found });
  } catch (err) {
    console.error('Error reading candidate slug:', err);
    res.status(500).json({ error: 'Failed to load candidate', details: err.message });
  }
});

export default router;
