from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models import models
from app.routes.deps import get_current_user
from app.schemas.erp import StockItemCreate, StockItemOut

router = APIRouter(prefix="/stock", tags=["stock"])


def to_stock_out(item: models.StockItem) -> StockItemOut:
    return StockItemOut(id=item.id, name=item.name, qty=item.quantity, price=item.price or 0.0)


@router.get("", response_model=list[StockItemOut])
def list_stock(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    items = (
        db.query(models.StockItem)
        .filter(models.StockItem.company_id == user.id)
        .order_by(models.StockItem.id.desc())
        .all()
    )
    return [to_stock_out(item) for item in items]


@router.post("", response_model=StockItemOut, status_code=status.HTTP_201_CREATED)
def create_stock(
    payload: StockItemCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    item = models.StockItem(
        name=payload.name.strip(),
        quantity=payload.qty,
        price=payload.price,
        company_id=user.id,
    )
    if not item.name:
        raise HTTPException(status_code=400, detail="Item name is required")
    db.add(item)
    db.commit()
    db.refresh(item)
    return to_stock_out(item)


@router.put("/{item_id}", response_model=StockItemOut)
def update_stock(
    item_id: int,
    payload: StockItemCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    item = (
        db.query(models.StockItem)
        .filter(models.StockItem.id == item_id, models.StockItem.company_id == user.id)
        .first()
    )
    if item is None:
        raise HTTPException(status_code=404, detail="Stock item not found")
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Item name is required")
    item.name = name
    item.quantity = payload.qty
    item.price = payload.price
    db.commit()
    db.refresh(item)
    return to_stock_out(item)


@router.delete("/{item_id}")
def delete_stock(
    item_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    item = (
        db.query(models.StockItem)
        .filter(models.StockItem.id == item_id, models.StockItem.company_id == user.id)
        .first()
    )
    if item is None:
        raise HTTPException(status_code=404, detail="Stock item not found")
    db.delete(item)
    db.commit()
    return {"ok": True}
