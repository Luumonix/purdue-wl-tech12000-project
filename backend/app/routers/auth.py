from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if username exists
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserProfile)
async def get_current_user_profile(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Get user stats
    total_attempts = db.query(models.UserAttempt).filter(
        models.UserAttempt.user_id == current_user.id
    ).count()
    
    correct_attempts = db.query(models.UserAttempt).filter(
        models.UserAttempt.user_id == current_user.id,
        models.UserAttempt.is_correct == True
    ).count()
    
    accuracy = (correct_attempts / total_attempts * 100) if total_attempts > 0 else 0.0
    
    # Get user rank
    users_with_higher_points = db.query(models.User).filter(
        models.User.total_points > current_user.total_points
    ).count()
    rank = users_with_higher_points + 1
    
    return schemas.UserProfile(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        total_points=current_user.total_points,
        created_at=current_user.created_at,
        rank=rank,
        total_attempts=total_attempts,
        correct_attempts=correct_attempts,
        accuracy=round(accuracy, 2)
    )
