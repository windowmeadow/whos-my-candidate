# whos-my-candidate

CIS 4160 Semester Project

Quick start
1. Backend - run

	```bash
	cd backend
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

Data sources

- This app uses local candidate information stored in `backend/data/candidates.json`. No external API keys are required to run the app locally.

Security and environment variables

- API keys and secrets should NEVER be committed to the repository. If you do add `.env` files for other services, make sure `.env` is added to `.gitignore` so it is not accidentally committed.
