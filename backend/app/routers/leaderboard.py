from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])

@router.get("/", response_model=List[schemas.LeaderboardEntry])
async def get_leaderboard(
    limit: int = 10,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get the top users by points"""
    # Get users ordered by points
    users = db.query(models.User).order_by(
        models.User.total_points.desc()
    ).limit(limit).all()
    
    leaderboard = []
    for rank, user in enumerate(users, start=1):
        # Get user stats
        total_attempts = db.query(models.UserAttempt).filter(
            models.UserAttempt.user_id == user.id
        ).count()
        
        correct_attempts = db.query(models.UserAttempt).filter(
            models.UserAttempt.user_id == user.id,
            models.UserAttempt.is_correct == True
        ).count()
        
        accuracy = (correct_attempts / total_attempts * 100) if total_attempts > 0 else 0.0
        
        leaderboard.append(schemas.LeaderboardEntry(
            rank=rank,
            username=user.username,
            total_points=user.total_points,
            correct_attempts=correct_attempts,
            total_attempts=total_attempts,
            accuracy=round(accuracy, 2)
        ))
    
    return leaderboard

@router.get("/me", response_model=schemas.LeaderboardEntry)
async def get_my_rank(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's rank and stats"""
    # Calculate rank
    users_with_higher_points = db.query(models.User).filter(
        models.User.total_points > current_user.total_points
    ).count()
    rank = users_with_higher_points + 1
    
    # Get user stats
    total_attempts = db.query(models.UserAttempt).filter(
        models.UserAttempt.user_id == current_user.id
    ).count()
    
    correct_attempts = db.query(models.UserAttempt).filter(
        models.UserAttempt.user_id == current_user.id,
        models.UserAttempt.is_correct == True
    ).count()
    
    accuracy = (correct_attempts / total_attempts * 100) if total_attempts > 0 else 0.0
    
    return schemas.LeaderboardEntry(
        rank=rank,
        username=current_user.username,
        total_points=current_user.total_points,
        correct_attempts=correct_attempts,
        total_attempts=total_attempts,
        accuracy=round(accuracy, 2)
    )
