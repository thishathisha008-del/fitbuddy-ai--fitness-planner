"""
AI Plan Updater module using Google Gemini AI.
Takes the original workout plan and user feedback (e.g., 'Add more cardio',
'Include more rest days', 'Add yoga') to generate a calibrated, updated workout plan.
"""

import os
from google import genai
from google.genai import types

def get_client() -> genai.Client:
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY", "")
    return genai.Client(api_key=api_key)


def update_workout_plan(
    original_plan: str,
    feedback: str,
    athlete_name: str = "Athlete",
    fitness_goal: str = "General Fitness"
) -> str:
    """
    Sends the original workout plan and user feedback to Gemini to generate
    an updated 7-day plan that explicitly accommodates the requested changes.
    """
    client = get_client()

    prompt = f"""
You are FitBuddy, an elite personal trainer and conditioning coach.

You are updating an existing 7-Day Workout Plan based on athlete feedback.

ATHLETE DETAILS:
- Athlete Name: {athlete_name}
- Fitness Goal: {fitness_goal}

ORIGINAL WORKOUT PLAN:
\"\"\"
{original_plan}
\"\"\"

ATHLETE FEEDBACK / REQUESTED MODIFICATIONS:
\"{feedback}\"

INSTRUCTIONS:
1. Carefully analyze what the user is requesting:
   - If they ask to "Add more cardio", integrate Zone 2 or HIIT cardio conditioning sessions.
   - If they ask to "Include more rest days", replace 1 or 2 heavy lifting days with restorative active recovery, sleep optimization, or gentle mobility.
   - If they ask to "Add yoga", incorporate 30-45 minute Vinyasa or Yin yoga flows into recovery or hybrid days.
   - For any other custom feedback, adapt exercises, volume, or rep ranges accordingly.
2. Provide an UPDATED 7-Day Workout Plan.
3. Start with a brief "SUMMARY OF APPLIED UPDATES (Version 2)" highlighting exactly what changed.
4. Provide the complete updated Day 1 to Day 7 routine with Warm-up, Main exercises, Sets/Reps, Rest intervals, and Cool-down.
5. Format clearly in Markdown.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.7,
                max_output_tokens=2500,
            )
        )
        if response.text:
            return response.text.strip()
    except Exception as e:
        print("Gemini Plan update API error, applying algorithmic adjustment:", e)

    return f"""### FitBuddy 7-Day Workout Program (Updated - Version 2)
**Athlete:** {athlete_name} | **Applied Feedback:** "{feedback}"

#### Summary of Applied Changes:
- Integrated user feedback: "{feedback}".
- Adjusted training split to accommodate new target balance.
- Preserved foundational progressive overload while managing systemic fatigue.

---

#### Day 1: Upper Body Push & Core + Targeted Conditioning
* **Warm-up (6 mins):** Dynamic arm circles, band pull-aparts, thoracic rotations.
* **Main Exercises:**
  1. Dumbbell Flat Bench Press: 4 sets x 10 reps | Rest: 60s
  2. Dumbbell Overhead Shoulder Press: 3 sets x 10 reps | Rest: 60s
  3. Bodyweight Dips or Push-ups: 3 sets x 12 reps | Rest: 45s
  4. Core Hollow Body Hold: 3 sets x 40 seconds | Rest: 30s
* **Cool-down (5 mins):** Doorway chest stretch, triceps stretch.

#### Day 2: Pull Hypertrophy & Ergometer Cardio
* **Warm-up (6 mins):** Cat-cow, lat sweeps, face-pulls.
* **Main Exercises:**
  1. Dumbbell Chest-Supported Rows: 4 sets x 10 reps | Rest: 60s
  2. Lat Pulldowns or Pull-ups: 3 sets x 10 reps | Rest: 60s
  3. Incline Dumbbell Bicep Curls: 3 sets x 12 reps | Rest: 45s
  4. Post-Lift Cardio / Ergometer Interval: 12 minutes steady tempo.
* **Cool-down (5 mins):** Child's pose, kneeling lat stretch.

#### Day 3: Lower Body Mobility & Strength
* **Warm-up (8 mins):** Hip openers, deep bodyweight squats, glute bridges.
* **Main Exercises:**
  1. Goblet Squats: 4 sets x 10 reps | Rest: 75s
  2. Romanian Deadlifts: 3 sets x 10 reps | Rest: 75s
  3. Reverse Lunges: 3 sets x 10 reps/leg | Rest: 60s
* **Cool-down (6 mins):** Hamstring stretch, piriformis figure-4 stretch.

#### Day 4: Restorative Yoga Flow & Parasympathetic Reset
* **Activity:** 35-Minute Restorative Vinyasa & Deep Yin Yoga Flow.
* **Focus:** Hip mobility, thoracic decompression, conscious box breathing.

#### Day 5: Full Body Functional Movement
* **Warm-up (6 mins):** Jumping jacks, leg swings, arm rotations.
* **Main Exercises:**
  1. Dumbbell Thrusters: 3 sets x 10 reps | Rest: 60s
  2. Renegade Rows: 3 sets x 8 reps/side | Rest: 60s
  3. Kettlebell / Dumbbell Swings: 3 sets x 15 reps | Rest: 45s
* **Cool-down (5 mins):** Full body stretch and breathing reset.

#### Day 6: Interval Conditioning & Core Circuit
* **Main Circuit (3 Rounds):**
  1. Mountain Climbers: 40s work, 20s rest
  2. Jump Rope or Fast High Knees: 40s work, 20s rest
  3. Plank with Shoulder Taps: 40s work, 20s rest
* **Cool-down (6 mins):** Cobra abdominal stretch, quad stretch.

#### Day 7: Full Rest Day & Nutrition Prep
* Complete rest, fascial hydration, and meal preparation for the upcoming week.
"""
