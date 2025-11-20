# whos-my-candidate

CIS 4160 Semester Project

This repository contains a small full-stack app with a Vite + React frontend and an Express backend. The backend includes proxy routes to the Google Civic Information API. The app ships an "Election participants by ZIP" UI that looks up elections and voter information (contests and candidates) for a supplied ZIP code without exposing the API key in the browser.

Quick start
1. Backend - set API key and run

	 - Option A (temporary, shell-only):

		 ```bash
		 export GOOGLE_CIVIC_API_KEY="your_real_key_here"
		 cd backend
		 npm install
		 npm start
		 ```

	 - Option B (recommended for local dev): create a `backend/.env` file from `backend/.env.example` and add your key (the backend is configured to load `.env` in development):

		 ```bash
		 cd backend
		 cp .env.example .env
		 # edit .env and set GOOGLE_CIVIC_API_KEY=your_real_key_here
		 npm install
		 npm start
		 ```

	 Notes:
	 - The backend runs on port 3000 by default.
	 - The repository uses ES modules in `backend/` (see `backend/package.json` "type": "module").

2. Frontend - run dev server

	 ```bash
	 cd frontend
	 npm install
	 npm run dev
	 ```

	 The Vite dev server proxies `/api` to `http://localhost:3000` (see `frontend/vite.config.js`).


How to use the elections/voterinfo endpoints

- In the frontend UI (use the "Election participants by ZIP" card) enter a 5-digit ZIP and click "Load elections". The frontend calls the backend proxy at:

	- `GET /api/elections?zip=02139`

	The backend will return the list of available elections and (if available) voter information for the first election. You can also request a specific election ID:

	- `GET /api/elections?zip=02139&electionId=2000`

- You can test the endpoints directly with curl (when backend is running):

	```bash
	curl 'http://localhost:3000/api/elections?zip=02139'
	```

Security and environment variablesexport 

- API keys and secrets should NEVER be committed to the repository. Use one of the following:
	- Export the variable in your shell (temporary): `export GOOGLE_CIVIC_API_KEY=...`
	- Use a local `.env` file (not checked in). A `.env.example` is provided in `backend/` to document the variable name.
	- Use your deployment platform's secret store for production (GitHub Actions, Vercel, Heroku, etc.).

- Make sure `.env` is added to `.gitignore` so it is not accidentally committed.

Notes and next steps

- The backend currently returns the raw JSON from the Google Civic API. If you want a smaller payload or specific fields, I can filter the response server-side.
- Consider adding caching or rate-limiting to avoid hitting API quotas for repeated lookups.

If you'd like, I can add a short `backend/README.md` or update the top-level README with deployment instructions, or implement UI improvements to render representatives in a friendly format.
