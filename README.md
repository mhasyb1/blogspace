# BlogSpace — Full-Stack Blogging Platform

A modern blogging platform built with **React** (frontend) and **Django REST Framework** (backend).

---

## Tech Stack

| Layer     | Technology                                          |
|-----------|-----------------------------------------------------|
| Frontend  | React 18, React Router v6, Context API, Axios       |
| Styling   | Custom CSS (dark theme), Google Fonts               |
| Backend   | Django 4.2, Django REST Framework, SimpleJWT        |
| Database  | SQLite (dev) — will swap to MySQL                   |
| Auth      | JWT (access + refresh tokens with blacklisting)     |

---

## Features

- User Registration & Login with JWT auth + auto token refresh
- Dashboard — create, edit, delete posts with live stats
- Profile page — public profile with published posts
- Settings — account & profile management (3 tabs)
- Post detail — full post view with comments
- Home feed — browse published posts, filter by category, search
- Responsive dark-theme design

---

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend runs at: http://localhost:8000


```

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at: http://localhost:3000

Or use **start-dev.bat** to launch both servers at once.

---

## API Endpoints

| Method | Endpoint                | Description            | Auth     |
|--------|-------------------------|------------------------|----------|
| POST   | `/api/auth/register/`   | Register new user      | Public   |
| POST   | `/api/auth/login/`      | Login (get JWT tokens) | Public   |
| POST   | `/api/auth/refresh/`    | Refresh access token   | Public   |
| GET    | `/api/users/me/`        | Get current user       | Required |
| PUT    | `/api/users/me/`        | Update current user    | Required |
| GET    | `/api/posts/`           | List posts             | Public   |
| POST   | `/api/posts/`           | Create post            | Required |
| GET    | `/api/posts/{id}/`      | Get post detail        | Public   |
| PUT    | `/api/posts/{id}/`      | Update post            | Required |
| DELETE | `/api/posts/{id}/`      | Delete post            | Required |
| GET    | `/api/comments/`        | List comments          | Public   |
| POST   | `/api/comments/`        | Create comment         | Required |
| DELETE | `/api/comments/{id}/`   | Delete comment         | Required |

---

## Deployment (Free)

| Part     | Platform          |
|----------|-------------------|
| Frontend | Vercel            |
| Backend  | Railway           |
| Database | Railway PostgreSQL |

### Frontend → Vercel
1. Push to GitHub
2. Import repo on vercel.com, set root directory to `frontend`
3. Add env var: `REACT_APP_API_URL=https://your-backend.railway.app/api`

### Backend → Railway
1. Import repo on railway.app, set root directory to `backend`
2. Add env vars: `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`
3. Start command: `gunicorn core.wsgi:application`

---

## Project Structure

```
web-project/
├── start-dev.bat              # Launch both servers with one click
├── frontend/
│   ├── src/
│   │   ├── api/index.js       # Axios API client + interceptors
│   │   ├── context/
│   │   │   ├── AuthContext.js # Global auth state
│   │   │   └── PostContext.js # Global post state
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   ├── pages/
│   │   │   ├── Home.js        # Feed + search + category filters
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js   # CRUD posts + stats
│   │   │   ├── PostDetail.js  # Post + comments
│   │   │   ├── Profile.js
│   │   │   ├── Settings.js
│   │   │   └── NotFound.js
│   │   ├── App.js
│   │   └── index.css          # Full design system
│   ├── vercel.json
│   └── package.json
└── backend/
    ├── core/
    │   ├── settings.py
    │   └── urls.py
    ├── blogapp/
    │   ├── models.py          # Post, Comment, UserProfile
    │   ├── serializers.py
    │   ├── views.py
    │   ├── urls.py
    │   ├── signals.py         # Auto-create UserProfile on register
    │   └── management/
    │       └── commands/
    │           └── seed_data.py
    ├── requirements.txt
    ├── manage.py
    └── .env.example
```
