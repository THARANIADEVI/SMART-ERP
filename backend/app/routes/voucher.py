from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models import models
from app.routes.deps import get_current_user
from app.schemas.erp import VoucherCreate, VoucherOut

router = APIRouter(prefix="/voucher", tags=["voucher"])
VALID_VOUCHER_TYPES = {"sales", "purchase"}


def validate_type(voucher_type: str) -> str:
    normalized = voucher_type.lower()
    if normalized not in VALID_VOUCHER_TYPES:
        raise HTTPException(status_code=400, detail="Voucher type must be sales or purchase")
    return normalized


def to_voucher_out(voucher: models.Voucher) -> VoucherOut:
    return VoucherOut(
        id=voucher.id,
        date=voucher.date.date().isoformat(),
        party=voucher.party,
        amt=voucher.amount or 0.0,
    )


@router.get("/{voucher_type}", response_model=list[VoucherOut])
def list_vouchers(
    voucher_type: str,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    normalized = validate_type(voucher_type)
    vouchers = (
        db.query(models.Voucher)
        .filter(models.Voucher.company_id == user.id, models.Voucher.voucher_type == normalized)
        .order_by(models.Voucher.id.desc())
        .all()
    )
    return [to_voucher_out(voucher) for voucher in vouchers]


@router.post("/{voucher_type}", response_model=VoucherOut, status_code=status.HTTP_201_CREATED)
def create_voucher(
    voucher_type: str,
    payload: VoucherCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    normalized = validate_type(voucher_type)
    voucher = models.Voucher(
        voucher_type=normalized,
        party=payload.party.strip(),
        amount=payload.amt,
        company_id=user.id,
    )
    if not voucher.party:
        raise HTTPException(status_code=400, detail="Party is required")
    db.add(voucher)
    db.commit()
    db.refresh(voucher)
    return to_voucher_out(voucher)


@router.put("/{voucher_type}/{voucher_id}", response_model=VoucherOut)
def update_voucher(
    voucher_type: str,
    voucher_id: int,
    payload: VoucherCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    normalized = validate_type(voucher_type)
    voucher = (
        db.query(models.Voucher)
        .filter(
            models.Voucher.id == voucher_id,
            models.Voucher.company_id == user.id,
            models.Voucher.voucher_type == normalized,
        )
        .first()
    )
    if voucher is None:
        raise HTTPException(status_code=404, detail="Voucher not found")
    party = payload.party.strip()
    if not party:
        raise HTTPException(status_code=400, detail="Party is required")
    voucher.party = party
    voucher.amount = payload.amt
    db.commit()
    db.refresh(voucher)
    return to_voucher_out(voucher)


@router.delete("/{voucher_type}/{voucher_id}")
def delete_voucher(
    voucher_type: str,
    voucher_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    normalized = validate_type(voucher_type)
    voucher = (
        db.query(models.Voucher)
        .filter(
            models.Voucher.id == voucher_id,
            models.Voucher.company_id == user.id,
            models.Voucher.voucher_type == normalized,
        )
        .first()
    )
    if voucher is None:
        raise HTTPException(status_code=404, detail="Voucher not found")
    db.delete(voucher)
    db.commit()
    return {"ok": True}
