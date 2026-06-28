from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.erp import StockCreate, StockOut
from app.services.auth import get_current_user
import app.models.models as models

router = APIRouter(prefix="/stock", tags=["stock"])


@router.get("", response_model=list[StockOut])
def list_stock(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(models.StockItem).filter(models.StockItem.owner_id == user.id).all()


@router.post("", response_model=StockOut)
def create_stock(payload: StockCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    item = models.StockItem(name=payload.name, qty=payload.qty, price=payload.price, owner_id=user.id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}")
def delete_stock(item_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    item = (
        db.query(models.StockItem)
        .filter(models.StockItem.id == item_id, models.StockItem.owner_id == user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(item)
    db.commit()
    return {"ok": True}
