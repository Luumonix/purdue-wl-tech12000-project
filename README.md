# 🛡️ CyberGuard - Gamified Cybersecurity Training Platform

A full-stack web application designed to improve cybersecurity awareness among Purdue students through gamified, interactive learning. Built as part of the TECH 120 Final Project (Fall 2025).

## 📋 Project Overview

CyberGuard addresses the critical gap between cybersecurity knowledge and actual secure behavior among college students. Based on extensive research documented in the design journal, this platform provides:

- **Interactive Learning**: Real-world cybersecurity scenarios based on actual Purdue campus observations
- **Gamification**: Points, leaderboards, and immediate feedback to drive engagement
- **Comprehensive Coverage**: Questions spanning phishing, passwords, WiFi security, MFA, and general security practices
- **Progress Tracking**: Detailed statistics and performance analytics

## 🏗️ Architecture

### Backend (Python/FastAPI)
- RESTful API with JWT authentication
- PostgreSQL database for data persistence
- Automatic question seeding from research-based content
- Real-time scoring and leaderboard calculations

### Frontend (Next.js/React)
- Modern, responsive UI with Tailwind CSS
- Client-side routing and state management
- Real-time feedback and progress tracking
- Mobile-friendly design

### Database (PostgreSQL)
- User management with secure password hashing
- Question bank with 20+ cybersecurity scenarios
- User attempt tracking and analytics
- Leaderboard rankings

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Luumonix/purdue-wl-t120-gamified.git
cd purdue-wl-t120-gamified
```

2. **Start the application with Docker**
```bash
docker-compose up --build
```

This will start:
- PostgreSQL database on port 5432
- Backend API on http://localhost:8000
- Frontend application on http://localhost:3000

3. **Access the application**
- Open your browser to http://localhost:3000
- Register a new account
- Start answering questions!

### Manual Setup (Without Docker)

#### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. **Start PostgreSQL** (if not using Docker)
```bash
# Make sure PostgreSQL is running and create the database
createdb cybersecurity_game
```

6. **Run the backend**
```bash
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

#### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# .env.local is already configured for local development
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. **Run the development server**
```bash
npm run dev
```

The frontend will be available at http://localhost:3000

## 📚 Features

### For Students
- **Daily Challenges**: Answer 5 random cybersecurity questions
- **Immediate Feedback**: Learn from detailed explanations after each answer
- **Progress Tracking**: Monitor your accuracy and improvement over time
- **Leaderboard**: Compete with peers and climb the rankings
- **Category Coverage**: 
  - 🎣 Phishing Detection
  - 🔐 Password Security
  - 📡 WiFi Safety
  - 🔑 Multi-Factor Authentication
  - 🛡️ General Security Practices

### Technical Features
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Real-time Scoring**: Instant point calculation and leaderboard updates
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Question Randomization**: Prevents answer sharing and memorization
- **Time Tracking**: Records how long users take to answer questions
- **Comprehensive Analytics**: Track performance by category and difficulty

## 🗄️ Database Schema

### Users Table
- User credentials and authentication
- Total points and ranking
- Account creation timestamp

### Questions Table
- Question text and multiple-choice options
- Correct answer and detailed explanation
- Category, difficulty level, and point value

### User Attempts Table
- Links users to questions they've answered
- Tracks correctness and points earned
- Records time taken per question

### Daily Challenges Table
- Manages daily question sets
- Ensures variety in question selection

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user profile

### Questions
- `GET /api/questions/random` - Get random questions (with filters)
- `GET /api/questions/categories` - List all categories
- `POST /api/questions/submit` - Submit answer and get feedback
- `GET /api/questions/stats` - Get detailed user statistics

### Leaderboard
- `GET /api/leaderboard` - Get top users
- `GET /api/leaderboard/me` - Get current user's rank

## 📊 Research Foundation

This project is based on extensive research documented in `design_journal.pdf`, including:

- **Ethnographic Research**: Observations at WALC, Starbucks, and other campus locations
- **Interviews**: Conversations with students, professors, and IT staff
- **Literature Review**: Analysis of existing cybersecurity training solutions
- **Benchmarking**: Evaluation of platforms like Hoxhunt, Infosec IQ, and KnowBe4

### Key Findings
- 40% of students leave laptops unattended in public spaces
- 100% of observed students left screens unlocked
- 81% of students never received formal cybersecurity training
- 68% reuse passwords across multiple accounts
- Only 37% regularly use multi-factor authentication

## 🎯 Design Principles

1. **Engagement Over Compliance**: Gamification makes learning voluntary and enjoyable
2. **Immediate Feedback**: Users learn from mistakes in real-time
3. **Relevant Scenarios**: Questions based on actual Purdue campus situations
4. **Progressive Difficulty**: Mix of easy, medium, and hard questions
5. **Behavioral Change**: Focus on practical actions, not just awareness

## 🛠️ Technology Stack

- **Backend**: Python 3.11, FastAPI, SQLAlchemy, PostgreSQL
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Authentication**: JWT tokens, bcrypt password hashing
- **Deployment**: Docker, Docker Compose
- **API Documentation**: OpenAPI/Swagger

## 📝 Development

### Adding New Questions

Edit `backend/app/seed_data.py` and add questions following this format:

```python
{
    "question_text": "Your question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "Option A",
    "explanation": "Detailed explanation of why this is correct...",
    "category": "phishing",  # phishing, passwords, wifi, mfa, general
    "difficulty": "medium",  # easy, medium, hard
    "points_value": 15
}
```

### Running Tests

```bash
# Backend tests (when implemented)
cd backend
pytest

# Frontend tests (when implemented)
cd frontend
npm test
```

## 🔒 Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens expire after 30 minutes
- SQL injection prevention through SQLAlchemy ORM
- CORS configured for specific origins
- Environment variables for sensitive data

## 🤝 Contributing

This is an academic project for TECH 120 at Purdue University. The team members are:
- Abhi Sunkara
- Ishmeet Thethi
- Seungchan Kim
- Samuel Winiger
- Derek Woodward

## 📄 License

This project is created for educational purposes as part of TECH 120 coursework at Purdue University.

## 🙏 Acknowledgments

- Purdue University TECH 120 instructors and staff
- Research participants who provided valuable insights

## 📞 Support

For questions or issues:
1. Check the API documentation at http://localhost:8000/docs
2. Review the design journal PDF for project context
3. Contact team members via the information in the design journal

---

**Built with ❤️ by Ishmeet Thethi for Purdue University TECH 120 - Fall 2025**
