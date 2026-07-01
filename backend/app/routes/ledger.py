from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models import models
from app.routes.deps import get_current_user
from app.schemas.erp import LedgerCreate, LedgerOut

router = APIRouter(prefix="/ledger", tags=["ledger"])
VALID_LEDGER_TYPES = {"customer", "supplier"}


def to_ledger_out(ledger: models.Ledger) -> LedgerOut:
    return LedgerOut(id=ledger.id, name=ledger.name)


def validate_type(ledger_type: str) -> str:
    normalized = ledger_type.lower()
    if normalized not in VALID_LEDGER_TYPES:
        raise HTTPException(status_code=400, detail="Ledger type must be customer or supplier")
    return normalized


@router.get("/{ledger_type}", response_model=list[LedgerOut])
def list_ledgers(
    ledger_type: str,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    normalized = validate_type(ledger_type)
    ledgers = (
        db.query(models.Ledger)
        .filter(models.Ledger.company_id == user.id, models.Ledger.ledger_type == normalized)
        .order_by(models.Ledger.id.desc())
        .all()
    )
    return [to_ledger_out(ledger) for ledger in ledgers]


@router.post("/{ledger_type}", response_model=LedgerOut, status_code=status.HTTP_201_CREATED)
def create_ledger(
    ledger_type: str,
    payload: LedgerCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    normalized = validate_type(ledger_type)
    ledger = models.Ledger(name=payload.name.strip(), ledger_type=normalized, company_id=user.id)
    if not ledger.name:
        raise HTTPException(status_code=400, detail="Ledger name is required")
    db.add(ledger)
    db.commit()
    db.refresh(ledger)
    return to_ledger_out(ledger)


@router.put("/{ledger_type}/{ledger_id}", response_model=LedgerOut)
def update_ledger(
    ledger_type: str,
    ledger_id: int,
    payload: LedgerCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    normalized = validate_type(ledger_type)
    ledger = (
        db.query(models.Ledger)
        .filter(
            models.Ledger.id == ledger_id,
            models.Ledger.company_id == user.id,
            models.Ledger.ledger_type == normalized,
        )
        .first()
    )
    if ledger is None:
        raise HTTPException(status_code=404, detail="Ledger not found")
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Ledger name is required")
    ledger.name = name
    db.commit()
    db.refresh(ledger)
    return to_ledger_out(ledger)


@router.delete("/{ledger_type}/{ledger_id}")
def delete_ledger(
    ledger_type: str,
    ledger_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    normalized = validate_type(ledger_type)
    ledger = (
        db.query(models.Ledger)
        .filter(
            models.Ledger.id == ledger_id,
            models.Ledger.company_id == user.id,
            models.Ledger.ledger_type == normalized,
        )
        .first()
    )
    if ledger is None:
        raise HTTPException(status_code=404, detail="Ledger not found")
    db.delete(ledger)
    db.commit()
    return {"ok": True}
