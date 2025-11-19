from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import random

from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/api/questions", tags=["questions"])

@router.get("/random", response_model=List[schemas.Question])
async def get_random_questions(
    count: int = 5,
    category: str = None,
    difficulty: str = None,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get random questions for the daily challenge"""
    query = db.query(models.Question)
    
    if category:
        query = query.filter(models.Question.category == category)
    if difficulty:
        query = query.filter(models.Question.difficulty == difficulty)
    
    all_questions = query.all()
    
    if len(all_questions) < count:
        count = len(all_questions)
    
    selected_questions = random.sample(all_questions, count)
    return selected_questions

@router.get("/categories", response_model=List[str])
async def get_categories(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get all available question categories"""
    categories = db.query(models.Question.category).distinct().all()
    return [cat[0] for cat in categories]

@router.post("/submit", response_model=schemas.AnswerResult)
async def submit_answer(
    submission: schemas.AnswerSubmission,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Submit an answer and get immediate feedback"""
    # Get the question
    question = db.query(models.Question).filter(
        models.Question.id == submission.question_id
    ).first()
    
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    # Check if answer is correct
    is_correct = submission.selected_answer == question.correct_answer
    points_earned = question.points_value if is_correct else 0
    
    # Record the attempt
    attempt = models.UserAttempt(
        user_id=current_user.id,
        question_id=question.id,
        is_correct=is_correct,
        points_earned=points_earned,
        time_taken=submission.time_taken
    )
    db.add(attempt)
    
    # Update user's total points
    if is_correct:
        current_user.total_points += points_earned
    
    db.commit()
    db.refresh(current_user)
    
    return schemas.AnswerResult(
        is_correct=is_correct,
        correct_answer=question.correct_answer,
        explanation=question.explanation,
        points_earned=points_earned,
        total_points=current_user.total_points
    )

@router.get("/stats", response_model=schemas.UserStats)
async def get_user_stats(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed user statistics"""
    # Total attempts
    total_attempts = db.query(models.UserAttempt).filter(
        models.UserAttempt.user_id == current_user.id
    ).count()
    
    # Correct attempts
    correct_attempts = db.query(models.UserAttempt).filter(
        models.UserAttempt.user_id == current_user.id,
        models.UserAttempt.is_correct == True
    ).count()
    
    # Accuracy
    accuracy = (correct_attempts / total_attempts * 100) if total_attempts > 0 else 0.0
    
    # Rank
    users_with_higher_points = db.query(models.User).filter(
        models.User.total_points > current_user.total_points
    ).count()
    rank = users_with_higher_points + 1
    
    # Questions by category
    category_stats = db.query(
        models.Question.category,
        func.count(models.UserAttempt.id).label('attempts'),
        func.sum(func.cast(models.UserAttempt.is_correct, db.Integer)).label('correct')
    ).join(
        models.UserAttempt,
        models.Question.id == models.UserAttempt.question_id
    ).filter(
        models.UserAttempt.user_id == current_user.id
    ).group_by(
        models.Question.category
    ).all()
    
    questions_by_category = {
        cat: {
            'attempts': attempts,
            'correct': int(correct) if correct else 0,
            'accuracy': round((int(correct) / attempts * 100) if attempts > 0 and correct else 0, 2)
        }
        for cat, attempts, correct in category_stats
    }
    
    # Recent activity
    recent_attempts = db.query(models.UserAttempt).filter(
        models.UserAttempt.user_id == current_user.id
    ).order_by(
        models.UserAttempt.created_at.desc()
    ).limit(10).all()
    
    recent_activity = [
        {
            'question_id': attempt.question_id,
            'is_correct': attempt.is_correct,
            'points_earned': attempt.points_earned,
            'created_at': attempt.created_at.isoformat()
        }
        for attempt in recent_attempts
    ]
    
    return schemas.UserStats(
        total_points=current_user.total_points,
        total_attempts=total_attempts,
        correct_attempts=correct_attempts,
        accuracy=round(accuracy, 2),
        rank=rank,
        questions_by_category=questions_by_category,
        recent_activity=recent_activity
    )
