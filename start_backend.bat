@echo off
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate
)

echo Starting Backend Server...
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
