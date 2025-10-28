# Book Loop

A full‑stack web app for tracking reading and managing a personal library.

**Frontend:** React + TypeScript + Vite · React Router · Axios  
**Backend:** Node.js + Express + MongoDB/Mongoose · JWT · Joi

---

## Repository Structure
book-loop/
   front/book-loop/   # React + Vite + TypeScript (client)
   backend/           # Express + MongoDB (server)

## Prerequisites
- Node.js LTS (18+ recommended)
- MongoDB (local Compass **or** Atlas)

## Quick Start (Local)

### 1) Backend
   bash
cd backend
cp .env.example .env    # copy the template
# open .env and set your Mongo URI and JWT secret if needed
npm install
npm run dev             # API at http://localhost:5566

**`backend/.env.example`** (already provided):
   dotenv
# === Security / Auth ===
JWT_SECRET=random_secret
JWT_EXPIRES_IN=1h

# === Server ===
PORT=5566
NODE_ENV=development

# === Database ===
# Local MongoDB (from your env):
MONGODB_URI=mongodb://127.0.0.1:27017/fullstack-library

# MongoDB Atlas (template — replace with your own credentials/cluster/db):
# MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority&appName=<appName>

# === Misc / toggles ===
DB=MONGODB
LOGGER=morgan
VALIDATOR=Joi

# === CORS for local dev (frontend URL) ===
CORS_ORIGIN=http://localhost:5173


**Backend scripts (package.json):**
- `npm run dev` → development (nodemon)
- `npm start` → `node app.js` (production style)

---

### 2) Frontend
   bash
cd front/book-loop
cp .env.example .env    # usually fine for local dev
npm install
npm run dev             # http://localhost:5173
 

**`front/book-loop/.env.example`** (already provided):
   dotenv
VITE_USERS_API_URL=http://localhost:5566/api/users
VITE_BOOKS_API_URL=http://localhost:5566/api/books
  

 The client reads these URLs and attaches JWT from storage to requests.

---

 ## Admin Access (for reviewer)

The app includes an Admin Panel. To quickly test it locally, you can manually grant admin rights to **any** user via MongoDB Compass (or Atlas Data Explorer):

### Option A — MongoDB Compass (local)
1. Open **MongoDB Compass** and connect to your local DB (URI from `backend/.env` → `MONGODB_URI`).
2. Go to your database → the **`users`** collection.
3. Find your test user (search by `email`).
4. Open the document and set:
     json
   "isAdmin": true

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

## REST API (Brief)
**Base URL:** `http://localhost:5566/api`

**Auth**
- `POST /auth/register`
- `POST /auth/login` - JWT

**Users**
- `GET /users/me`
- `PATCH /users/me`
- `PATCH /users/me/password`

**Books**
- `GET /books?q=&genre=&lang=&page=&limit=`
- `GET /books/:id`
- `POST /books` *(auth)*
- `PATCH /books/:id`
- `DELETE /books/:id`
- `PATCH /books/:id/like`
- `PATCH /books/:id/want`
- `PATCH /books/:id/status` `{ status: "to-read" | "reading" | "finished" }`
- `GET /books/my-books` *(filters: favorites / want / status)*

**Auth Headers**

Authorization: Bearer <token>
# or
x-auth-token: <token>

## Notes
- **Do not commit** real `.env` files — use `*.env.example` templates.
- Keep DB credentials in env only.
- For a static demo (frontend only) you can deploy to GitHub Pages. For full stack, deploy backend to a PaaS (Render/Railway) and point `VITE_*_API_URL` to it.
