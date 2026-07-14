# Backend - Work Report Manager

FastAPI backend for authentication, work reports, dashboard, and attachments.

## Run

1. Create virtual environment:
   - `python -m venv .venv`
   - `\.venv\Scripts\activate`
2. Install dependencies:
   - `pip install -r requirements.txt`
3. Configure environment:
   - Copy `.env.example` to `.env` and update values.
4. Start server:
   - `uvicorn app.main:app --reload --port 8000`

API base URL: `http://localhost:8000/api/v1`
