import { Router } from 'express';

const router = Router();

// GET /api/elections?zip=02139 or /api/elections?zip=02139&electionId=2000
// Returns available elections and voterinfo for the provided electionId (or the first election if none provided).
router.get('/', async (req, res) => {
  try {
    const zip = req.query.zip;
    const electionId = req.query.electionId;

    if (!zip || !/^\d{5}$/.test(zip)) {
      return res.status(400).json({ error: 'query param "zip" required (5 digits)' });
    }

    const apiKey = process.env.GOOGLE_CIVIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server missing API key. Set GOOGLE_CIVIC_API_KEY environment variable.' });
    }

    // 1) Fetch list of elections
    const electionsUrl = `https://www.googleapis.com/civicinfo/v2/elections?key=${apiKey}`;
    const electionsRes = await fetch(electionsUrl);
    if (!electionsRes.ok) {
      const text = await electionsRes.text();
      return res.status(electionsRes.status).json({ error: 'Google API error (elections)', details: text });
    }
    const elections = await electionsRes.json();

    // determine electionId to use
    let chosenElectionId = electionId;
    if (!chosenElectionId) {
      if (Array.isArray(elections.elections) && elections.elections.length > 0) {
        chosenElectionId = elections.elections[0].id;
      }
    }

    let voterinfo = null;
    if (chosenElectionId) {
      const viUrl = `https://www.googleapis.com/civicinfo/v2/voterinfo?key=${apiKey}&address=${encodeURIComponent(zip)}&electionId=${encodeURIComponent(chosenElectionId)}`;
      const viRes = await fetch(viUrl);
      const text = await viRes.text();
      try {
        voterinfo = JSON.parse(text);
      } catch (e) {
        // keep raw text if not json
        voterinfo = { raw: text };
      }
      if (!viRes.ok) {
        // return elections but include google error in voterinfo
        return res.status(viRes.status).json({ elections, voterinfo });
      }
    }

    return res.json({ elections, voterinfo });
  } catch (err) {
    console.error('Elections proxy error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

export default router;
