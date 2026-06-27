from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.session import Base
import datetime


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    companies = relationship("Company", back_populates="owner")


class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="companies")


class Ledger(Base):
    __tablename__ = "ledgers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    ledger_type = Column(String, nullable=True)
    company_id = Column(Integer, ForeignKey("companies.id"))


class StockItem(Base):
    __tablename__ = "stock_items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sku = Column(String, index=True)
    quantity = Column(Float, default=0.0)
    company_id = Column(Integer, ForeignKey("companies.id"))


class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String, nullable=False, unique=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    total = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class VoucherEntry(Base):
    __tablename__ = "voucher_entries"
    id = Column(Integer, primary_key=True, index=True)
    voucher_type = Column(String)
    amount = Column(Float, default=0.0)
    invoice_id = Column(Integer, ForeignKey("invoices.id"))
