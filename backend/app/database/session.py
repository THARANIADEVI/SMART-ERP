import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./smarterp.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # import models so they are registered on the Base.metadata
    import app.models.models as models  # noqa: F401
    Base.metadata.create_all(bind=engine)
    upgrade_sqlite_schema()


def upgrade_sqlite_schema():
    if not DATABASE_URL.startswith("sqlite"):
        return

    inspector = inspect(engine)
    table_names = inspector.get_table_names()
    if "stock_items" not in table_names:
        return

    stock_columns = {column["name"] for column in inspector.get_columns("stock_items")}
    with engine.begin() as conn:
        if "price" not in stock_columns:
            conn.execute(text("ALTER TABLE stock_items ADD COLUMN price FLOAT DEFAULT 0.0"))
