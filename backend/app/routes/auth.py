from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from ..database import get_db
from ..models.models import Admin
from ..schemas import AdminLogin, Token, AdminCreate
from ..utils.auth import verify_password, get_password_hash, create_access_token, get_current_admin
from ..config import get_settings

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()

@router.post("/login", response_model=Token)
async def login(login_data: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.username == login_data.username).first()
    if not admin or not verify_password(login_data.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": admin.username},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=Token)
async def register(admin_data: AdminCreate, db: Session = Depends(get_db)):
    existing = db.query(Admin).filter(Admin.username == admin_data.username).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    admin_count = db.query(Admin).count()
    if admin_count > 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin already exists. Contact existing admin."
        )
    
    admin = Admin(
        username=admin_data.username,
        password_hash=get_password_hash(admin_data.password)
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    
    access_token = create_access_token(data={"sub": admin.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def get_current_admin_info(admin: Admin = Depends(get_current_admin)):
    return {"username": admin.username, "id": admin.id}
