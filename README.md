# BagBank Frontend (Auth Demo)

Minimal React + Vite frontend scaffold with an authentication module that integrates with a FastAPI backend.

Features

- Login page (username / password)
- JWT storage (localStorage or sessionStorage via "Remember me")
- Global AuthContext (login, logout, fetchUser)
- ProtectedRoute wrapper to guard private pages
- Axios API client with Authorization header and 401 handler
- TailwindCSS for quick UI

Prerequisites

- Node.js 18+ and npm
- A FastAPI backend exposing the auth endpoints described below

Environment

Copy `.env.example` to `.env` at the project root and update values as needed. Important variables:

- VITE_API_BASE_URL — API base URL (e.g. `http://localhost:8000/api/v1`)
- VITE_AUTH_STORAGE_KEY — localStorage key for the token
- VITE_USER_STORAGE_KEY — localStorage key for the user object
- VITE_API_TIMEOUT — request timeout in ms

Install & run (development)

```powershell
cd c:\_projects\bagbank\frontend
npm install
npm run dev
```

Open the app at http://localhost:3000/ (Vite default). The login page is available at `/login`.

API Endpoints (expected)

- POST /auth/login — request: { username, password } → response: { access_token, token_type }
- GET /auth/me — requires Authorization: Bearer <token> → response: user object
- POST /auth/logout — requires Authorization header → response: null

Notes

- The app reads the API base URL from `import.meta.env.VITE_API_BASE_URL`.
- Tokens are stored in localStorage by default when "Remember me" is checked, otherwise stored in sessionStorage.
- On any 401 response the client calls the auth provider's unauthorized handler which clears session and redirects to `/login`.

Committing and publishing

This repository is intentionally minimal. To publish it to GitHub:

1. Create a new repo on GitHub (no README/license, since this repo already has them).
2. Add the remote and push:

```powershell
git remote add origin https://github.com/<your-user>/<your-repo>.git
git branch -M main
git push -u origin main
```

If you want, I can also create a simple GitHub Actions workflow to build the app on push.

License

Add a LICENSE file if you intend to publish this project publicly.

--
Generated scaffold: BagBank frontend auth demo
# BagBank Frontend (Auth Demo)

This is a minimal React + Vite frontend scaffold with an authentication module that integrates with a FastAPI backend.

Setup

1. Copy `.env.example` to `.env` and adjust values.
2. npm install
3. npm run dev

Environment variables
- VITE_API_BASE_URL - API base URL (e.g. http://localhost:8000/api/v1)
- VITE_AUTH_STORAGE_KEY - token key in localStorage
- VITE_USER_STORAGE_KEY - user key in localStorage

This demo includes:
- Axios API client with interceptor
- AuthContext with login, logout, fetchUser
- ProtectedRoute wrapper
- Login page and Dashboard page
- TailwindCSS
