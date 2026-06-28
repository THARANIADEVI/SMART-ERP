from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from app.database.session import Base
import datetime


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)


class Ledger(Base):
    __tablename__ = "ledgers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    ledger_type = Column(String, nullable=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), index=True)


class StockItem(Base):
    __tablename__ = "stock_items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    qty = Column(Float, default=0.0)
    price = Column(Float, default=0.0)
    owner_id = Column(Integer, ForeignKey("users.id"), index=True)


class VoucherEntry(Base):
    __tablename__ = "voucher_entries"
    id = Column(Integer, primary_key=True, index=True)
    voucher_type = Column(String, index=True)
    party = Column(String, nullable=False)
    amt = Column(Float, default=0.0)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"), index=True)
