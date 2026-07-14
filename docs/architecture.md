# Work Report Manager - Architecture (V1)

## Overview
Work Report Manager is a modular full-stack web application for capturing and managing daily work reports.

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: FastAPI + SQLAlchemy
- Database: SQLite (local), PostgreSQL-ready via SQLAlchemy database URL
- Auth: JWT token auth with bcrypt password hashing
- Files: local uploads with metadata in database (storage abstraction kept for future cloud migration)

## High-Level Components

1. Frontend (SPA)
- Auth context and protected routing
- Dashboard summary widgets
- Report CRUD pages
- Search/filter list page
- Voice-to-text input via browser speech API
- Attachment upload and attachment list/delete

2. Backend API
- /auth endpoints for register/login/me
- /reports endpoints for CRUD + filtering
- /dashboard endpoint for summary
- attachment endpoints for upload/list/delete
- activity log service for audit-ready tracking

3. Data Layer
- SQLAlchemy ORM models
- clean schema split for users, work reports, attachments, activity logs
- easy migration path to PostgreSQL by changing DATABASE_URL and adding Alembic migrations

## Module Boundaries
- app/api: HTTP route handlers
- app/auth: security and dependency guards
- app/models: ORM models
- app/schemas: input/output contracts
- app/services: storage and logging services
- app/database: base/session management

## Future Extensibility Hooks
- services/storage.py can be replaced with Azure Blob implementation
- new module folders can be added under app/api and app/services (AI, reminders, integration)
- dashboard and report filters are designed to expand into weekly or AI summaries
