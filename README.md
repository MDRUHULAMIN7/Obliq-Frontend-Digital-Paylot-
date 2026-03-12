# Obliq RBAC Frontend

Next.js 16 (App Router) frontend for the RBAC system. The UI is fully permission‑driven: routes and navigation are gated by permission atoms, not roles.

## Features
- Dynamic route access via `middleware.ts` (permission atoms)
- Permission‑based sidebar navigation
- Auth with JWT + refresh token (cookies)
- Users management UI (list, filters, pagination, permissions editor)
- Core modules/pages: Dashboard, Leads, Tasks, Reports, Users, Audit, Settings, Customer Portal, Contacts, Messages, Help Center, Invoice
- Fully responsive UI

## Local Setup

### 1) Install dependencies
```bash
npm install
```

### 2) Environment variables
Create or edit `frontend/.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
# Optional for proxy mode:
# BACKEND_URL=https://your-backend.vercel.app
```

### 3) Run dev server
```bash
npm run dev
```

Open `http://localhost:3000`.

## Admin Credentials (Local)
Admin is auto‑seeded by the backend on first run:
- **Email:** `admin@obliq.local`
- **Password:** value of `SUPER_ADMIN_PASSWORD` in `backend/.env`

## Production Deploy (Vercel)

Recommended setup uses same‑origin proxy to ensure cookies are set on the frontend domain.

**Frontend Env Vars**
```env
NEXT_PUBLIC_API_URL=/api/v1
BACKEND_URL=https://your-backend.vercel.app
```

Then deploy the `frontend` directory to Vercel.

## Project Structure (Frontend)
```
app/                # App Router pages
components/         # UI + feature components
hooks/              # Auth + permission hooks
lib/                # API client, permissions, helpers
providers/          # Auth + Query providers
types/              # Shared TS types
middleware.ts       # Permission-based routing
```

## Notes
- If login succeeds but dashboard does not load in production, verify cookies are set on the frontend domain and use proxy mode.
- Use `admin@obliq.local` for the initial admin account.
