# Book Loop

A full-stack web app for tracking reading and managing a personal library.

**Frontend:** React + TypeScript + Vite · React Router · Axios  
**Backend:** Node.js + Express · MongoDB/Mongoose · JWT · Joi

---

## Live Demo (Render)

- **Frontend:** https://bookloop-staging-1.onrender.com  
- **Backend API:** https://bookloop-staging.onrender.com  

**Test users (seed):**
- `user-test12@gmail.com` / `1qazxsw2!Q`
- `user-admin13@gmail.com` / `1qazxsw2!Q`

> Verified: CRUD + like/want work both on Render and via Postman.

---

## Repository Structure

```text
book-loop/
  front/book-loop/   # React + Vite + TypeScript (client)
  backend/           # Express + MongoDB (server)
```

---

## Prerequisites

- Node.js LTS (18+ recommended)
- MongoDB (local Compass **or** Atlas)

---

## Quick Start (Local)

### 1) Backend

```bash
cd backend
cp .env.example .env     # copy the template
npm install
npm run dev              # API at http://localhost:5566
```

**`backend/.env.example`** (matches current backend code)

```dotenv
# === Security / Auth ===
JWT_SECRET=random_secret
JWT_EXPIRES_IN=1h

# === Server ===
PORT=5566
NODE_ENV=development
DB=MONGODB
LOGGER=morgan
VALIDATOR=Joi

# === Database ===
# Local MongoDB (development)
MONGO_LOCAL_URI=mongodb://localhost:27017/fullstack-library

# MongoDB Atlas (production on Render)
# MONGO_ATLAS_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority&appName=<appName>

# === CORS (comma separated list) ===
# Example: CORS_ORIGIN=http://localhost:5173,https://bookloop-staging-1.onrender.com
CORS_ORIGIN=http://localhost:5173

# === Seed (optional) ===
SEED=false
SEED_RESET=false
```

**Backend scripts (package.json):**
- `npm run dev` → development (nodemon)
- `npm start` → production-style start

---

### Seed data (optional)

To quickly populate a clean MongoDB with test users + books:

1) In `backend/.env` set:

```dotenv
SEED=true
SEED_RESET=true
```

2) Run:

```bash
cd backend
npm run seed
```

After the first run, set `SEED_RESET=false` to avoid wiping existing data:

```dotenv
SEED=false
SEED_RESET=false
```

Seed credentials:
- `user-test12@gmail.com` / `1qazxsw2!Q`
- `user-admin13@gmail.com` / `1qazxsw2!Q`

---

### 2) Frontend

```bash
cd front/book-loop
cp .env.example .env     # usually fine for local dev
npm install
npm run dev              # http://localhost:5173
```

**`front/book-loop/.env.example`** (already provided)

```dotenv
VITE_USERS_API_URL=http://localhost:5566/api/users
VITE_BOOKS_API_URL=http://localhost:5566/api/books
```

The client reads these URLs and attaches JWT from storage to requests.

---

## Admin Access (for reviewer)

The app includes an Admin Panel. To quickly test it locally, you can manually grant admin rights to any user via MongoDB Compass (or Atlas Data Explorer).

### Option A — MongoDB Compass (local)

1) Connect to your local DB (`MONGO_LOCAL_URI` from `backend/.env`).
2) Open your database → **`users`** collection.
3) Find your test user by `email`.
4) Set:

```json
"isAdmin": true
```

---

## Features

- Favorites & “Want to read”
- Book statuses: `to-read`, `reading`, `finished`
- Ratings and notes
- Search & filters (title, author, language, genre, year)
- User registration & authentication
- Role-based access (admin / user)
- Responsive layout
- REST API with persistence

---

## REST API (Brief)

**Local Base URL:** `http://localhost:5566/api`

### Users / Auth (base: `/users`)
- `POST /users/register`
- `POST /users/login` *(JWT)*
- `GET /users/me`
- `PUT /users/me`
- `PATCH /users/me`
- `PATCH /users/me/password`

> Note: Depending on your server implementation, profile update may be `PUT /users/me` or `PATCH /users/me`.

### Books (base: `/books`)
- `GET /books?q=&genre=&lang=&page=&limit=`
- `GET /books/:id`
- `POST /books` *(auth)*
- `PATCH /books/:id`
- `DELETE /books/:id`
- `PATCH /books/:id/like`
- `PATCH /books/:id/want`
- `PATCH /books/:id/status` with body `{ "status": "to-read" | "reading" | "finished" }`
- `GET /books/my-books` *(filters: favorites / want / status)*

### Auth Headers

```text
Authorization: Bearer <token>
# or
x-auth-token: <token>
```

---

## Postman Verification (Quick)

Verified endpoints (example):
- `PATCH http://localhost:5566/api/books/<id>/like`
- `PATCH http://localhost:5566/api/books/<id>/want`
- `POST  http://localhost:5566/api/books` (Create)
- `PATCH http://localhost:5566/api/books/<id>` (Update)
- `DELETE http://localhost:5566/api/books/<id>` (Delete)

---

## Troubleshooting

- **401 Unauthorized** → you are not logged in or the token is missing/expired.
- **CORS error in browser console** → set `CORS_ORIGIN` in `backend/.env` to the correct frontend URL  
  (e.g. `http://localhost:5173` for local dev, and add your Render frontend domain for production).
- **404 Not Found** → verify `VITE_USERS_API_URL` / `VITE_BOOKS_API_URL` point to the correct backend URL.
- **Empty lists** → DB may be empty; run seed or create data via the UI.

---

## Notes

- Do **not** commit real `.env` files — use `*.env.example`.
- Keep DB credentials in env only.
- For full stack deployment: deploy backend (Render/Railway) and point `VITE_*_API_URL` to the deployed API.
