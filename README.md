# AniTime

AniTime is a full-stack anime watch-time calculator app.

## Project Structure

- `backend/`: FastAPI application (Python)
- `frontend/`: Expo application (React Native)

## Prerequisites

- Python 3.9+
- Node.js & npm
- Docker & Docker Compose (optional, for DB/Redis)
- PostgreSQL & Redis (if not using Docker)

## Setup

### Backend

1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Create virtual environment and install dependencies:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Set up environment variables in `.env`:
   ```env
   DATABASE_URL=postgresql://user:pass@localhost/dbname
   REDIS_URL=redis://localhost:6379/0
   ```
4. Initialize Database:
   ```bash
   # Make sure DB is running
   alembic upgrade head
   ```
5. Run Server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend

1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run Expo:
   ```bash
   npx expo start
   ```
   - Press `w` for Web
   - Scan QR code for Android/iOS (requires Expo Go app)

## Features

- **Search**: Find anime using Jikan API.
- **Popular**: See trending anime.
- **Calculator**: Calculate completion date based on daily episodes or target date.
