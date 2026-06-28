from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth as auth_router
from app.database.session import init_db

app = FastAPI(title="SmartERP API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include auth routes
app.include_router(auth_router.router)

@app.on_event("startup")
def on_startup():
    # create sqlite tables for local development
    init_db()

@app.get("/")
def read_root():
    return {"message": "SmartERP API - FastAPI backend scaffold with auth and SQLite"}
