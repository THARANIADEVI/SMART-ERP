from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.auth import UserCreate, UserOut, Token
from app.services import auth as auth_service
import app.models.models as models

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = auth_service.create_user(db, user_in.email, user_in.password)
    return user


@router.post("/login", response_model=Token)
def login(user_in: UserCreate, db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, user_in.email, user_in.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = auth_service.create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}
