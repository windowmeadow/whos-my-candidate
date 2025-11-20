import { Router } from 'express';
var router = Router();

/* GET home page. */
router.get('/api/test-get', function(req, res, next) {
  res.json({ title: 'Express' });
});

// Health endpoint: reports whether the server has the Google Civic API key and
// performs a quick probe to the Civic API (does NOT return the key).
router.get('/api/health', async (req, res) => {
  const hasApiKey = Boolean(process.env.GOOGLE_CIVIC_API_KEY);
  const health = { ok: true, hasApiKey };

  if (hasApiKey) {
    try {
      const probeUrl = `https://www.googleapis.com/civicinfo/v2/representatives?address=02139&key=${process.env.GOOGLE_CIVIC_API_KEY}`;
      const response = await fetch(probeUrl);
      const text = await response.text();

      if (response.ok) {
        health.google = { ok: true, status: response.status };
      } else {
        // Try to parse JSON error from Google, otherwise return raw text
        let body = null;
        try { body = JSON.parse(text); } catch (e) { body = text; }
        health.google = { ok: false, status: response.status, body };
      }
    } catch (err) {
      health.google = { ok: false, error: err.message };
    }
  }

  res.json(health);
});

export default router;
