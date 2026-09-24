"""
Main entry point for the FitBuddy FastAPI application.
Run locally with:
    uvicorn app.main:app --reload --port 8000
"""

import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.database import init_db
from app.routes import router

app = FastAPI(
    title="FitBuddy – AI Fitness Plan Generator using Gemini Models",
    description="Full-stack AI fitness application generating 7-day personalized workout plans, Gemini Flash nutrition tips, and feedback-based adaptations.",
    version="1.0.0"
)

# Initialize SQLite database and tables
init_db()

# Mount static folder for stylesheets and client assets
os.makedirs("static/css", exist_ok=True)
os.makedirs("static/js", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Register routes
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
