from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.deps import get_current_user
from app.auth.security import create_access_token, get_password_hash, verify_password
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import (
    ChangePasswordRequest,
    LoginRequest,
    RegisterRequest,
    UpdateProfileRequest,
    TokenResponse,
    UserResponse,
)
from app.services.activity_logger import log_activity

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == payload.username).first()
    if existing:
        raise HTTPException(status_code=409, detail="Username already exists")

    user = User(
        username=payload.username,
        password_hash=get_password_hash(payload.password),
        full_name=payload.full_name,
        role="admin",
    )
    db.add(user)
    db.flush()
    log_activity(
        db,
        user_id=user.id,
        action="REGISTER",
        entity_type="user",
        entity_id=str(user.id),
        details=f"User {user.username} created",
    )
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token(user.username)
    log_activity(
        db,
        user_id=user.id,
        action="LOGIN",
        entity_type="auth",
        entity_id=str(user.id),
        details="User login",
    )
    db.commit()
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserResponse)
def update_profile(
    payload: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_user.full_name = payload.full_name.strip()
    db.add(current_user)
    log_activity(
        db,
        user_id=current_user.id,
        action="UPDATE_PROFILE",
        entity_type="user",
        entity_id=str(current_user.id),
        details="Updated profile name",
    )
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/change-password", status_code=status.HTTP_200_OK)
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    if payload.current_password == payload.new_password:
        raise HTTPException(
            status_code=400,
            detail="New password must be different from current password",
        )

    current_user.password_hash = get_password_hash(payload.new_password)
    log_activity(
        db,
        user_id=current_user.id,
        action="CHANGE_PASSWORD",
        entity_type="user",
        entity_id=str(current_user.id),
        details="Password changed",
    )
    db.commit()
    return {"message": "Password updated successfully"}
