from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    total_points: int
    created_at: datetime

    class Config:
        from_attributes = True

class UserProfile(User):
    rank: Optional[int] = None
    total_attempts: int = 0
    correct_attempts: int = 0
    accuracy: float = 0.0

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Question Schemas
class QuestionBase(BaseModel):
    question_text: str
    options: List[str]
    category: str
    difficulty: str
    points_value: int

class QuestionCreate(QuestionBase):
    correct_answer: str
    explanation: str

class Question(QuestionBase):
    id: int

    class Config:
        from_attributes = True

class QuestionWithAnswer(Question):
    correct_answer: str
    explanation: str

# Answer Submission Schema
class AnswerSubmission(BaseModel):
    question_id: int
    selected_answer: str
    time_taken: Optional[int] = None

class AnswerResult(BaseModel):
    is_correct: bool
    correct_answer: str
    explanation: str
    points_earned: int
    total_points: int

# Leaderboard Schema
class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    total_points: int
    correct_attempts: int
    total_attempts: int
    accuracy: float

# Daily Challenge Schema
class DailyChallengeResponse(BaseModel):
    date: datetime
    questions: List[Question]
    total_possible_points: int

# Stats Schema
class UserStats(BaseModel):
    total_points: int
    total_attempts: int
    correct_attempts: int
    accuracy: float
    rank: int
    questions_by_category: dict
    recent_activity: List[dict]
