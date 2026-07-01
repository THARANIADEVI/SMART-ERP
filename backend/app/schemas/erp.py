from datetime import datetime
from pydantic import BaseModel, ConfigDict


class StockItemCreate(BaseModel):
    name: str
    qty: float
    price: float


class StockItemOut(BaseModel):
    id: int
    name: str
    qty: float
    price: float


class LedgerCreate(BaseModel):
    name: str


class LedgerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class VoucherCreate(BaseModel):
    party: str
    amt: float


class VoucherOut(BaseModel):
    id: int
    date: str
    party: str
    amt: float


class ReportSummary(BaseModel):
    title: str
    total: float
    count: int
    generated_at: datetime
