Book Loop

Book Loop is a web application for tracking reading and managing a personal library.
The project is built using React + TypeScript + Vite and connects to a Node.js/Express/MongoDB API.

Features:
Favorites and “Want to read”
Book statuses: to-read, reading, finished
Ratings and notes for books
Search and filters (title, author, language, genre, year)
User registration and authentication
Role-based access control (admin / user)
Responsive design (mobile-friendly)
API integration with server-side data persistence
Tech Stack:
React + TypeScript
React Router
Axios
Vite
Node.js + Express + MongoDB/Mongoose
Joi (validation)
JWT (for authentication)
Getting Started (Monorepo: client + server):

1. Clone the repository
git clone <your-repo-url>
cd book-loop

2. Start the backend
cd server
cp .env.example .env
npm install
npm run dev

3. Start the frontend
cd ../client
cp .env.example .env
npm install
npm run dev

Environment Variables:
client/.env
VITE_BOOKS_API_URL=http://localhost:5566/api/books
VITE_USERS_API_URL=http://localhost:5566/api/users

server/.env
PORT=5566
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/bookloop
JWT_SECRET=change_me
CORS_ORIGIN=http://localhost:5173

Scripts:
client
npm run dev // start dev server
npm run build // production build
npm run preview // preview production build
server
npm run dev // development (nodemon/ts-node-dev)
npm run start // production
npm run lint // optional linter
npm run seed // optional seed demo data

Backend (Server):
The backend provides a REST API for authentication, users, and books.
Built with Node.js + Express + MongoDB/Mongoose and JWT authentication.
Prerequisites:
Node.js LTS
MongoDB (local or Atlas)
API Overview (base URL: http://localhost:5566/api):

Auth
POST /auth/register — create account
POST /auth/login — returns JWT
Users
GET /users/me — get current user
PATCH /users/me — update profile
PATCH /users/me/password — change password
(optional) PATCH /users/me/bio — { text, lang, visibility }
Books
GET /books — list with filters (?q=&genre=&lang=&page=&limit=)
GET /books/:id — get by id
POST /books — create (auth)
PATCH /books/:id — update (owner/admin)
DELETE /books/:id — delete (owner/admin)
PATCH /books/:id/like — toggle favorite
PATCH /books/:id/want — toggle “want to read”
PATCH /books/:id/status — set { status: "to-read" | "reading" | "finished" }
GET /books/my-books — current user’s books with status filters

Auth Header:
Use either header
Authorization: Bearer <token>
x-auth-token: <token>

Error Format (example):
{ "error": "Invalid or expired token" }

Notes:
Forms/validation can be implemented with Formik/Yup or React Hook Form/Yup.
Axios instance should read VITE_* env variables and attach JWT from storage.
Pagination is synced with URL query params (?page=).
Internationalization and RTL (Hebrew) can be handled via locale and direction toggles.