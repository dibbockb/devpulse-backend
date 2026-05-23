# DevPulse — Issue Tracker API

A REST API for a collaborative issue tracking platform where teams can report bugs, suggest features, and manage resolutions.

**Live API:** https://devpulse-sable.vercel.app/  
**GitHub:** https://github.com/dibbockb/devpulse-backend

---

## Tech Stack

- **Runtime:** Node.js (LTS) + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (native `pg` driver, raw SQL)
- **Auth:** JWT + bcrypt
- **Deployment:** Vercel + NeonDB

---

## Features

- JWT-based authentication with role support (`contributor`, `maintainer`)
- Create, read, update, and delete issues
- Filter issues by `type` and `status`, sort by `newest` or `oldest`
- Role-based access control on all protected routes
- Input validation and consistent error responses

---

## Setup

```bash
git clone https://github.com/dibbockb/devpulse-backend
cd devpulse-backend
pnpm install
```

Create a `.env` file:
```env
PORT=5000
DB_KEY=your_neondb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

```bash
pnpm dev
```

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |

### Issues
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/issues` | Public | Get all issues (filter + sort) |
| GET | `/api/issues/:id` | Public | Get single issue |
| POST | `/api/issues` | Authenticated | Create an issue |
| PATCH | `/api/issues/:id` | Authenticated | Update an issue |
| DELETE | `/api/issues/:id` | Maintainer only | Delete an issue |

**Query params for GET /api/issues:**
- `sort` — `newest` (default) or `oldest`
- `type` — `bug` or `feature_request`
- `status` — `open`, `in_progress`, or `resolved`

**Auth header:** `Authorization: <token>`

---

## Database Schema

### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | Primary key |
| name | VARCHAR(255) | Required |
| email | VARCHAR(255) | Unique, required |
| password | TEXT | Hashed with bcrypt |
| role | TEXT | `contributor` (default) or `maintainer` |
| created_at | TIMESTAMP | Auto-generated |
| updated_at | TIMESTAMP | Auto-updated |

### `issues`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | Primary key |
| title | VARCHAR(150) | Required |
| description | TEXT | Min 20 characters |
| type | TEXT | `bug` or `feature_request` |
| status | TEXT | `open` (default), `in_progress`, `resolved` |
| reporter_id | INTEGER | References users.id |
| created_at | TIMESTAMP | Auto-generated |
| updated_at | TIMESTAMP | Auto-updated |