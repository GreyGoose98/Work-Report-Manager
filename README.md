# Work Report Manager

Production-ready V1 application for capturing and managing daily work reports with authentication, dashboard, report CRUD, voice input, attachments, and search/filter.

## Tech Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS + React Router + Axios
- Backend: FastAPI + SQLAlchemy
- Auth: bcrypt password hash + JWT
- Database: SQLite (local), PostgreSQL-ready

## Folder Structure
- frontend/
- backend/
- docs/
- .github/workflows/

## Quick Start

## 1) Backend
1. Open terminal in backend folder.
2. Create venv and activate:
   - python -m venv .venv
   - .venv\Scripts\activate
3. Install dependencies:
   - pip install -r requirements.txt
4. Configure env:
   - copy .env.example .env
5. Run API:
   - uvicorn app.main:app --reload --port 8000

API base: http://localhost:8000/api/v1

## 2) Frontend
1. Open terminal in frontend folder.
2. Install dependencies:
   - npm install
3. Run dev server:
   - npm run dev

UI base: http://localhost:5173

## First Login
Create first user via API once:
- POST /api/v1/auth/register
- body:
  {
    "username": "admin",
    "password": "StrongPass123",
    "full_name": "Admin User"
  }

Then login from UI.

## Security Notes
- Passwords are hashed with bcrypt
- JWT has expiration
- API routes are protected
- Upload types are restricted
- Secrets are environment-based

## Checkpoint Commit Plan
1. chore: initialize Work Report Manager project structure
2. feat: add authentication and protected routes
3. feat: add work report CRUD module
4. feat: add responsive dashboard and navigation
5. feat: add voice input for work reports
6. feat: add report attachment support
7. feat: add search and filtering for reports
8. docs: add architecture and future roadmap

## Documentation
- docs/architecture.md
- docs/database_schema.md
- docs/api_contract.md
- docs/changelog.md
- docs/future_roadmap.md
