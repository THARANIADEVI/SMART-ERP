from datetime import datetime
from pydantic import BaseModel


class LedgerCreate(BaseModel):
    name: str


class LedgerOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class StockCreate(BaseModel):
    name: str
    qty: float = 0.0
    price: float = 0.0


class StockOut(BaseModel):
    id: int
    name: str
    qty: float
    price: float

    class Config:
        from_attributes = True


class VoucherCreate(BaseModel):
    party: str
    amt: float = 0.0


class VoucherOut(BaseModel):
    id: int
    party: str
    amt: float
    date: datetime

    class Config:
        from_attributes = True
