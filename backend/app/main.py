from fastapi import FastAPI
from app.routes import auth as auth_router
from app.database.session import init_db

app = FastAPI(title="SmartERP API")

# include auth routes
app.include_router(auth_router.router)

@app.on_event("startup")
def on_startup():
    # create sqlite tables for local development
    init_db()

@app.get("/")
def read_root():
    return {"message": "SmartERP API - FastAPI backend scaffold with auth and SQLite"}
