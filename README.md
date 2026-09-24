# FitBuddy – AI Fitness Plan Generator using Gemini Models

A modern, full-stack fitness application engineered with **Python**, **FastAPI**, **Google Gemini AI**, and **SQLite with SQLAlchemy**. It generates personalized 7-day workout plans, goal-targeted nutrition/recovery tips using Gemini Flash, and continuously adapts routines based on user feedback.

---

## 🚀 Key Features

1. **Personalized 7-Day Workout Plan** – Generates workouts based on age, weight, fitness goal, and intensity.
2. **AI-Powered Workout Generation** – Uses Gemini 1.5 Pro to create structured workout plans.
3. **Nutrition & Recovery Tips** – Gemini Flash provides quick, goal-based nutrition and recovery suggestions.
4. **Feedback-Based Plan Updating** – Users can give feedback, and AI updates the workout plan accordingly.
5. **User Data Storage** – User details and workout plans are stored using SQLite + SQLAlchemy.
6. **Admin Dashboard** – Admins can view users and their original and updated workout plans.
7. **Responsive User Interface** – HTML, CSS, and Jinja2 provide a clean and mobile-responsive interface.

---

## 📁 Project Structure

```text
├── app/
│   ├── main.py                  # FastAPI application entry point
│   ├── routes.py                # Route handlers (Home, Generate, Update, All Users)
│   ├── database.py              # SQLite & SQLAlchemy models (User, WorkoutPlan)
│   ├── gemini_generator.py      # Gemini 1.5 Pro 7-Day workout plan generation
│   ├── gemini_flash_generator.py# Gemini Flash goal-specific nutrition tip generation
│   └── updated_plan.py          # Gemini Pro feedback-driven plan updater
├── templates/
│   ├── index.html               # Home page with user details form
│   ├── result.html              # Generated plan view, Flash nutrition tip & feedback
│   └── all_users.html           # Admin dashboard showing all athletes and plans
├── static/
│   └── css/
│       └── style.css            # Responsive, modern fitness-themed stylesheet
├── requirements.txt             # Python dependencies
└── README.md                    # Project guide & instructions
```

---

## 🛠️ How to Run the Python FastAPI Application

### 1. Create and activate a Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Set your Google Gemini API Key
```bash
export GEMINI_API_KEY="your-gemini-api-key-here"
# On Windows PowerShell:
# $env:GEMINI_API_KEY="your-gemini-api-key-here"
```

### 4. Start the Server
```bash
uvicorn app.main:app --reload --port 8000
```

### 5. Access in Browser
- **Home Page**: [http://localhost:8000](http://localhost:8000)
- **Admin Dashboard (`all_users`)**: [http://localhost:8000/all_users](http://localhost:8000/all_users)
- **Interactive API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔮 Future Features & Strategic Roadmap

1. **AI Voice Assistant** – Users can interact with FitBuddy using voice commands.
2. **Wearable Device Integration** – Connect smartwatches and fitness bands to track steps, heart rate, calories, and activity.
3. **Real-Time Progress Tracking** – Show daily, weekly, and monthly fitness progress through charts and reports.
4. **Personalized Diet Planner** – Generate customized meal plans based on fitness goals and food preferences.
5. **Exercise Video Guidance** – Provide videos or animations showing the correct exercise techniques.
6. **Advanced AI Personalization** – Continuously improve workout plans based on the user’s progress and feedback.
7. **Reminder & Notification System** – Send reminders for workouts, meals, hydration, and recovery.
8. **Mobile Application** – Develop Android/iOS versions for easy access anywhere.
9. **Cloud Deployment** – Deploy FitBuddy online so users can access their plans from any device.
10. **Coach/Trainer Support** – Allow fitness coaches to monitor users and provide personalized guidance.

### 📌 Short PPT Version (for Presentations & Viva):
> *“In the future, FitBuddy can be enhanced with wearable integration, AI voice assistance, personalized diet planning, progress tracking, exercise videos, smart notifications, mobile apps, and advanced AI-based personalization.”*

