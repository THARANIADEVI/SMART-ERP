SmartERP backend scaffold (FastAPI)

Steps to run locally:
1. Create a virtualenv: python -m venv .venv
2. Activate it and install requirements: pip install -r requirements.txt
3. Start Postgres (docker-compose up -d db) or configure DATABASE_URL
4. Run: uvicorn app.main:app --reload

Docker compose: docker-compose up --build
