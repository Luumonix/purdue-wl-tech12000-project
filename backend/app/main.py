from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, questions, leaderboard
from . import models
from .seed_data import QUESTIONS

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Cybersecurity Training Game API",
    description="Gamified cybersecurity awareness training for Purdue students",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://purdue-tech120-dev.ishmeet.net",
        "http://purdue-tech120-dev.ishmeet.net",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(questions.router)
app.include_router(leaderboard.router)

@app.get("/")
def read_root():
    return {
        "message": "Cybersecurity Training Game API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.on_event("startup")
async def startup_event():
    """Seed the database with questions if empty"""
    from .database import SessionLocal
    db = SessionLocal()
    
    try:
        # Check if questions already exist
        question_count = db.query(models.Question).count()
        
        if question_count == 0:
            print("Seeding database with questions...")
            for q_data in QUESTIONS:
                question = models.Question(**q_data)
                db.add(question)
            db.commit()
            print(f"Added {len(QUESTIONS)} questions to the database")
        else:
            print(f"Database already contains {question_count} questions")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
