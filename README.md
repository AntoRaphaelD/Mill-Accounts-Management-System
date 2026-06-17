# AccuFlow ERP (Accounts Management System)

A full-stack accounting/ERP application for maintaining masters and generating accounting vouchers + reports.

## Features (from the current codebase)

### Masters
- Accounts head master
- Groups / Sub-group hierarchy
- TDS master
- Service Tax master
- Reverse Charge (RCM) master
- P&L settings
- Balance Sheet main-group / group mapping
- Bill-wise opening

### Vouchers / Registers
- Journal Voucher (JV)
- Cash Payment (CP) / Cash Receipt (CR)
- Bank Payment (BP) / Bank Receipt (BR)
- Contra Entry
- Reverse Bill Entries (RCM Bills)
- Provisions + notes
- Debit Note (DN)
- Credit Note (CN)

### Reports
- General Ledger (including From-To and party ledgers)
- Trial Balance / Cash Book / Bank Book / Journal Book
- Profit & Loss / Trading / Profit & Loss Account
- Balance Sheet
- Audit Reports / Audit Trail
- Various registers (C Form/F Form/H Form/E1 Form/C Form Purchase)

## Architecture
- **Frontend:** `frontend/` (React + Vite)
- **Backend:** `backend/` (Express + Sequelize + MySQL)
- **Communication:** Frontend calls backend REST endpoints under `/api/*`.

## Prerequisites
- Node.js
- MySQL (or a compatible DB configured in backend)

## Setup

### 1) Install dependencies
At the repository root:
```bash
npm install
```

### 2) Configure environment variables
Backend uses dotenv from `backend/.env`.

Create/modify:
- `backend/.env`

You must set values required by Sequelize (DB host/user/password/name) and API/runtime flags.

> Frontend default API base is `http://localhost:5000` unless overridden by `VITE_API_BASE_URL`.

### 3) Run backend
```bash
npm run backend
```
Backend listens on:
- `http://localhost:5000` (default)
- Health check: `GET /api/health` is available as `GET http://localhost:5000/health`

### 4) Run frontend
```bash
npm run frontend
```
Frontend runs on Vite dev server (commonly `http://127.0.0.1:5173`).

## Helpful Notes
- CORS: backend reads `CLIENT_URL` (comma-separated) to allow frontend origins.
- Database syncing:
  - `DB_SYNC=true` enables `sequelize.sync({ alter: DB_ALTER })`.

## Scripts
At repo root:
- `npm run frontend` — start Vite dev server
- `npm run backend` — start Express API via `node server.js`
- `npm run build` — build frontend

## Folder structure
- `frontend/` — UI components, screens, and report viewers
- `backend/` — Express app, controllers, routes, Sequelize models and middleware

## Troubleshooting
- If reports/vouchers appear empty:
  - Ensure backend DB is reachable.
  - Ensure `frontend/src/database.js` can reach `BASE_URL + /api/db`.
- If CORS errors happen in the browser:
  - Update `backend/.env` → `CLIENT_URL` to include your frontend origin.

