from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.erp import VoucherCreate, VoucherOut
from app.services.auth import get_current_user
import app.models.models as models

router = APIRouter(prefix="/voucher", tags=["voucher"])


@router.get("/{type}", response_model=list[VoucherOut])
def list_vouchers(type: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    return (
        db.query(models.VoucherEntry)
        .filter(models.VoucherEntry.owner_id == user.id, models.VoucherEntry.voucher_type == type)
        .all()
    )


@router.post("/{type}", response_model=VoucherOut)
def create_voucher(type: str, payload: VoucherCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    item = models.VoucherEntry(voucher_type=type, party=payload.party, amt=payload.amt, owner_id=user.id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{type}/{item_id}")
def delete_voucher(type: str, item_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    item = (
        db.query(models.VoucherEntry)
        .filter(models.VoucherEntry.id == item_id, models.VoucherEntry.owner_id == user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(item)
    db.commit()
    return {"ok": True}
