import sys
import os
from sqlalchemy import create_engine, text

# Add current directory to sys.path to ensure we can import app
sys.path.append(os.getcwd())

from app.core.config import get_settings

try:
    settings = get_settings()
    print(f"Testing connection to: {settings.DATABASE_URL.split('@')[-1]}") # Print host only for security
    
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Connection successful!")
        print(f"Result: {result.fetchone()}")
except Exception as e:
    print("Connection failed!")
    print(e)
