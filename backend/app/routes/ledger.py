from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.erp import LedgerCreate, LedgerOut
from app.services.auth import get_current_user
import app.models.models as models

router = APIRouter(prefix="/ledger", tags=["ledger"])


@router.get("/{type}", response_model=list[LedgerOut])
def list_ledgers(type: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return (
        db.query(models.Ledger)
        .filter(models.Ledger.owner_id == user.id, models.Ledger.ledger_type == type)
        .all()
    )


@router.post("/{type}", response_model=LedgerOut)
def create_ledger(type: str, payload: LedgerCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    item = models.Ledger(name=payload.name, ledger_type=type, owner_id=user.id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{type}/{item_id}")
def delete_ledger(type: str, item_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    item = (
        db.query(models.Ledger)
        .filter(models.Ledger.id == item_id, models.Ledger.owner_id == user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(item)
    db.commit()
    return {"ok": True}
