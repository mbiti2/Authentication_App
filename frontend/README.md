# Authentication App

A modern fullstack authentication app with admin and user dashboards, secure login, registration, and profile editing.

---

## Features
- **User Registration & Login** (JWT-based)
- **Admin & User Roles**
- **Admin Dashboard**: View all users, register new admins
- **Profile Page**: View and edit your profile
- **Persistent Login**: Stay logged in on refresh
- **Beautiful UI**: Tailwind CSS, shadcn-ui, and modern design

---

## Tech Stack
- **Backend:** Rust, Axum, utoipa (OpenAPI), bcrypt (password hashing)
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn-ui

---

## Getting Started

### 1. Clone the Repository
```sh
git clone <YOUR_GIT_URL>
cd Authentication_App
```

### 2. Backend Setup (Rust/Axum)
```sh
cd backend
# Set up .env if needed (see .env.example)
cargo run
```
- The backend runs on `http://localhost:3000` by default.

### 3. Frontend Setup (React/Vite)
```sh
cd ../frontend
npm install
npm run dev
```
- The frontend runs on `http://localhost:8080` by default.

---

## Usage

### User
- Register and log in as a user.
- View your profile and edit your name or email.

### Admin
- Log in as an admin to access the admin dashboard.
- View all users, register new admins.
- Edit your own profile from the profile page.

### Persistent Login
- Your session persists on refresh as long as your JWT is valid.

---

## API Endpoints (Backend)
- `POST /register` — Register a new user
- `POST /login` — Login and receive JWT
- `GET /user/profile` — Get current user profile
- `PUT /user/profile` — Update current user profile
- `GET /admin/dashboard` — Admin: view all users
- `POST /admin/register` — Admin: register a new admin

---

## Customization
- Update the favicon and Open Graph image in `frontend/index.html`.
- Tailwind and shadcn-ui for easy UI customization.

---

## License
MIT
