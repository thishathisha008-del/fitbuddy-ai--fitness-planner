"""
FastAPI route definitions for FitBuddy.
Handles home page, plan generation, nutrition tips, feedback updates, and admin dashboard.
"""

import uuid
from fastapi import APIRouter, Request, Depends, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from app.database import get_db, User, WorkoutPlan
from app.gemini_generator import generate_workout_plan
from app.gemini_flash_generator import generate_nutrition_tip
from app.updated_plan import update_workout_plan

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.get("/", response_class=HTMLResponse)
async def home_page(request: Request, db: Session = Depends(get_db)):
    """Renders the FitBuddy Home Page with athlete parameters form."""
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "title": "FitBuddy – AI Fitness Plan Generator"}
    )


@router.post("/generate", response_class=HTMLResponse)
async def generate_plan_route(
    request: Request,
    name: str = Form(...),
    user_id: str = Form(...),
    age: int = Form(...),
    weight: float = Form(...),
    fitness_goal: str = Form(...),
    workout_intensity: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    1. Collects user input details.
    2. Uses Gemini AI to generate a 7-day personalized workout plan.
    3. Uses Gemini Flash to generate a goal-based nutrition/recovery tip.
    4. Persists the user and original plan into the SQLite database.
    5. Displays the result.
    """
    clean_user_id = user_id.strip()
    clean_name = name.strip()

    # 1. Check or create User record
    user = db.query(User).filter(User.id == clean_user_id).first()
    if not user:
        user = User(
            id=clean_user_id,
            name=clean_name,
            age=age,
            weight=weight,
            fitness_goal=fitness_goal,
            workout_intensity=workout_intensity
        )
        db.add(user)
    else:
        user.name = clean_name
        user.age = age
        user.weight = weight
        user.fitness_goal = fitness_goal
        user.workout_intensity = workout_intensity

    db.commit()

    # 2. Generate 7-Day Workout Plan with Gemini AI
    original_plan_text = generate_workout_plan(
        name=clean_name,
        user_id=clean_user_id,
        age=age,
        weight=weight,
        fitness_goal=fitness_goal,
        workout_intensity=workout_intensity
    )

    # 3. Generate Nutrition Tip with Gemini Flash
    nutrition_tip_text = generate_nutrition_tip(
        fitness_goal=fitness_goal,
        workout_intensity=workout_intensity,
        weight=weight
    )

    # 4. Save Plan in SQLite Database
    plan_id = f"PLAN-{clean_user_id}-{uuid.uuid4().hex[:6].upper()}"
    workout_plan = WorkoutPlan(
        id=plan_id,
        user_id=clean_user_id,
        version=1,
        is_original=True,
        plan_title=f"7-Day {fitness_goal.title()} Microcycle",
        original_plan=original_plan_text,
        updated_plan=None,
        nutrition_tip=nutrition_tip_text,
        feedback=None
    )
    db.add(workout_plan)
    db.commit()
    db.refresh(workout_plan)

    return templates.TemplateResponse(
        "result.html",
        {
            "request": request,
            "user": user,
            "plan": workout_plan,
            "original_plan": original_plan_text,
            "updated_plan": None,
            "nutrition_tip": nutrition_tip_text,
            "message": "Original 7-Day Plan Generated Successfully with Google Gemini AI!"
        }
    )


@router.post("/update-plan", response_class=HTMLResponse)
async def update_plan_route(
    request: Request,
    plan_id: str = Form(...),
    feedback: str = Form(...),
    db: Session = Depends(get_db)
):
    """
    Submits user feedback (e.g. 'Add more cardio', 'Include more rest days', 'Add yoga').
    Calls Gemini Pro with the original plan and feedback to generate an updated plan,
    then updates the SQLite database record.
    """
    workout_plan = db.query(WorkoutPlan).filter(WorkoutPlan.id == plan_id).first()
    if not workout_plan:
        raise HTTPException(status_code=404, detail="Plan not found")

    user = db.query(User).filter(User.id == workout_plan.user_id).first()
    user_name = user.name if user else "Athlete"
    fitness_goal = user.fitness_goal if user else "General Fitness"

    # Send original plan + feedback to Gemini
    updated_plan_text = update_workout_plan(
        original_plan=workout_plan.original_plan,
        feedback=feedback.strip(),
        athlete_name=user_name,
        fitness_goal=fitness_goal
    )

    # Persist updated plan and feedback into SQLite
    workout_plan.updated_plan = updated_plan_text
    workout_plan.feedback = feedback.strip()
    workout_plan.version = 2
    workout_plan.is_original = False

    db.commit()
    db.refresh(workout_plan)

    return templates.TemplateResponse(
        "result.html",
        {
            "request": request,
            "user": user,
            "plan": workout_plan,
            "original_plan": workout_plan.original_plan,
            "updated_plan": updated_plan_text,
            "nutrition_tip": workout_plan.nutrition_tip,
            "feedback": feedback,
            "message": "Workout Plan Successfully Updated with Your Feedback (Version 2)!"
        }
    )


@router.get("/all_users", response_class=HTMLResponse)
@router.get("/admin", response_class=HTMLResponse)
async def all_users_page(request: Request, db: Session = Depends(get_db)):
    """
    Admin Dashboard (all_users.html).
    Displays all athletes, User ID, Age, Weight, Fitness Goal, Workout Intensity,
    Original Plan, and Updated Plan from the SQLite database.
    """
    users = db.query(User).order_by(User.created_at.desc()).all()
    records = []

    for user in users:
        plans = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == user.id).order_by(WorkoutPlan.created_at.desc()).all()
        latest_plan = plans[0] if plans else None
        records.append({
            "user": user,
            "latest_plan": latest_plan,
            "all_plans": plans,
            "has_updated_plan": bool(latest_plan and latest_plan.updated_plan),
        })

    return templates.TemplateResponse(
        "all_users.html",
        {
            "request": request,
            "records": records,
            "total_users": len(users)
        }
    )


@router.get("/api/users")
def api_users(db: Session = Depends(get_db)):
    """JSON API endpoint returning all registered users and their plan count."""
    users = db.query(User).all()
    result = []
    for u in users:
        plan_count = db.query(WorkoutPlan).filter(WorkoutPlan.user_id == u.id).count()
        result.append({
            **u.to_dict(),
            "planCount": plan_count
        })
    return result
