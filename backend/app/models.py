from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    total_points = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    attempts = relationship("UserAttempt", back_populates="user")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # List of answer options
    correct_answer = Column(String, nullable=False)
    explanation = Column(Text, nullable=False)
    category = Column(String, nullable=False)  # e.g., "phishing", "passwords", "wifi"
    difficulty = Column(String, nullable=False)  # "easy", "medium", "hard"
    points_value = Column(Integer, default=10)
    
    attempts = relationship("UserAttempt", back_populates="question")

class UserAttempt(Base):
    __tablename__ = "user_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    is_correct = Column(Boolean, nullable=False)
    points_earned = Column(Integer, default=0)
    time_taken = Column(Integer)  # seconds
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="attempts")
    question = relationship("Question", back_populates="attempts")

class DailyChallenge(Base):
    __tablename__ = "daily_challenges"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, unique=True, nullable=False)
    question_ids = Column(JSON, nullable=False)  # List of question IDs for the day
    created_at = Column(DateTime, default=datetime.utcnow)
