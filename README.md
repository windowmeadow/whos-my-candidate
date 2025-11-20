# whos-my-candidate

CIS 4160 Semester Project

To run this file, you need an API key from Google. 
go to https://console.cloud.google.com/apis/dashboard --> Select Credentials --> Make a new API Key configuring it in whatever way so that it is allowed to access the Google Civic Information API.

Navigate to 'Enabled APIs and Services' and press the 'Enable APIs and Services' button. search for 'Google Civic Information API' and select in. Add that API to your project. Now, you have enabled the key for use with the Google Civic Information API.
dd

Quick start
1. Backend - set API key and run
		 ```bash
		 cd backend
		 cp .env.example .env
		 # edit the new .env and set GOOGLE_CIVIC_API_KEY=your_real_key_here
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
