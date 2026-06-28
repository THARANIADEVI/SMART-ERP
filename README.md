# SMART-ERP

SmartERP is a comprehensive Enterprise Resource Planning system built with modern technologies.

## Project Structure

- **Backend**: FastAPI-based REST API with SQLAlchemy ORM
- **Frontend**: Next.js 16 with React 19 and TypeScript
- **Database**: PostgreSQL (via Docker)

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

### Backend
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
# API available at http://127.0.0.1:8000
```

For detailed setup instructions, see:
- Backend setup: [backend/README.md](backend/README.md)
- Frontend setup: [frontend/README.md](frontend/README.md)

## Features

- User authentication with JWT
- Stock management
- Customer & Supplier ledger
- Sales & Purchase vouchers
- Financial reports
- Responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI, SQLAlchemy, Pydantic
- **Database**: PostgreSQL
- **Authentication**: JWT with Bearer tokens
