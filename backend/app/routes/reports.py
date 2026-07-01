from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models import models
from app.routes.deps import get_current_user
from app.schemas.erp import ReportSummary

router = APIRouter(prefix="/reports", tags=["reports"])


def voucher_summary(db: Session, user_id: int, voucher_type: str) -> tuple[int, float]:
    count, total = (
        db.query(func.count(models.Voucher.id), func.coalesce(func.sum(models.Voucher.amount), 0.0))
        .filter(models.Voucher.company_id == user_id, models.Voucher.voucher_type == voucher_type)
        .one()
    )
    return int(count), float(total)


@router.get("/balance-sheet", response_model=ReportSummary)
def balance_sheet(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    sales_count, sales_total = voucher_summary(db, user.id, "sales")
    purchase_count, purchase_total = voucher_summary(db, user.id, "purchase")
    return ReportSummary(
        title="Balance Sheet",
        total=sales_total - purchase_total,
        count=sales_count + purchase_count,
        generated_at=datetime.utcnow(),
    )


@router.get("/profit-loss", response_model=ReportSummary)
def profit_loss(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    sales_count, sales_total = voucher_summary(db, user.id, "sales")
    purchase_count, purchase_total = voucher_summary(db, user.id, "purchase")
    return ReportSummary(
        title="Profit & Loss",
        total=sales_total - purchase_total,
        count=sales_count + purchase_count,
        generated_at=datetime.utcnow(),
    )


@router.get("/stock-summary", response_model=ReportSummary)
def stock_summary(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    count, total = (
        db.query(
            func.count(models.StockItem.id),
            func.coalesce(func.sum(models.StockItem.quantity * models.StockItem.price), 0.0),
        )
        .filter(models.StockItem.company_id == user.id)
        .one()
    )
    return ReportSummary(
        title="Stock Summary",
        total=float(total),
        count=int(count),
        generated_at=datetime.utcnow(),
    )


@router.get("/sales-summary", response_model=ReportSummary)
def sales_summary(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    count, total = voucher_summary(db, user.id, "sales")
    return ReportSummary(
        title="Sales Summary",
        total=total,
        count=count,
        generated_at=datetime.utcnow(),
    )
