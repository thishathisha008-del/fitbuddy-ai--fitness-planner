"""
AI Workout Plan Generator using Google Gemini AI.
Generates comprehensive 7-Day personalized workout plans with warm-ups,
main exercises, sets/reps, rest intervals, and cool-downs.
"""

import os
from google import genai
from google.genai import types

def get_client() -> genai.Client:
    """Instantiates the modern Google GenAI Client using GEMINI_API_KEY."""
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY", "")
    return genai.Client(api_key=api_key)


def generate_workout_plan(
    name: str,
    user_id: str,
    age: int,
    weight: float,
    fitness_goal: str,
    workout_intensity: str
) -> str:
    """
    Calls Google Gemini AI to generate a detailed 7-Day Workout Plan.
    Each day features:
      - Warm-up (mobility & dynamic activation)
      - Main exercises (exercise names, muscle targets)
      - Sets and repetitions or duration
      - Rest intervals (in seconds)
      - Cool-down & recovery routines
    """
    client = get_client()

    prompt = f"""
You are FitBuddy, an elite certified strength & conditioning specialist (CSCS) and biomechanics coach.

Create a highly structured, motivating, and personalized 7-Day Workout Plan for:
- Athlete Name: {name}
- Athlete ID: {user_id}
- Age: {age} years old
- Current Weight: {weight} kg
- Primary Fitness Goal: {fitness_goal} (e.g., Weight Loss, Muscle Gain, General Fitness, Flexibility)
- Workout Intensity: {workout_intensity} (Low, Medium, High)

FORMATTING REQUIREMENTS:
1. Provide a catchy, motivational Plan Title and Brief Overview tailored to the athlete's age ({age}) and goal ({fitness_goal}).
2. Detail all 7 Days (Day 1 through Day 7):
   For each day, provide:
   - Day Title & Focus (e.g., Day 1: Upper Body Push & Core)
   - Warm-up (5-8 minutes of specific dynamic mobility & activation drills)
   - Main Exercises (3 to 5 compound and isolation movements):
       * Exercise Name
       * Target Muscles
       * Sets x Reps (or duration for timed intervals)
       * Rest interval between sets (e.g., 60-90 seconds)
       * Key Form Cue
   - Cool-down (5-7 minutes of specific static stretching and joint decompression)
3. Ensure the volume and recovery match the specified Workout Intensity: {workout_intensity}.
4. Present the output in clean, readable Markdown format with bold headings and bullet points.
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
        print("Gemini API call failed, using high quality structured fallback:", e)

    # Reliable fallback if API key is not yet configured or offline
    return f"""### FitBuddy 7-Day {fitness_goal.title()} Program
**Athlete:** {name} (ID: {user_id}) | **Age:** {age} | **Weight:** {weight}kg | **Intensity:** {workout_intensity}

---

#### Day 1: Chest, Shoulders & Triceps (Push Focus)
* **Warm-up (6 mins):** Dynamic arm circles (60s), Band pull-aparts (2x15), Scapular push-ups (2x10).
* **Main Exercises:**
  1. Flat Dumbbell Bench Press: 4 sets x 8-10 reps | Rest: 75s | *Cue: Tuck elbows 45 degrees, squeeze chest at top.*
  2. Incline Dumbbell Press: 3 sets x 10-12 reps | Rest: 60s | *Cue: Controlled 3-second descent.*
  3. Overhead Dumbbell Shoulder Press: 3 sets x 10 reps | Rest: 60s | *Cue: Keep core braced, ribs down.*
  4. Tricep Rope Cable or Overhead DB Extensions: 3 sets x 12-15 reps | Rest: 45s | *Cue: Lock elbows in place.*
* **Cool-down (5 mins):** Doorway pectoral stretch (60s/side), Overhead tricep stretch (45s/side).

---

#### Day 2: Back & Biceps (Pull Focus)
* **Warm-up (6 mins):** Cat-Cow spine flow (60s), Band face-pulls (2x15), Lat sweep stretches.
* **Main Exercises:**
  1. Chest-Supported Dumbbell Rows: 4 sets x 8-10 reps | Rest: 75s | *Cue: Drive elbows toward hip pockets.*
  2. Lat Pulldown or Assisted Pull-ups: 3 sets x 10-12 reps | Rest: 60s | *Cue: Depress shoulder blades first.*
  3. Dumbbell Incline Bicep Curls: 3 sets x 12 reps | Rest: 45s | *Cue: Full supination at top.*
  4. Face Pulls: 3 sets x 15 reps | Rest: 45s | *Cue: External rotation at ear level.*
* **Cool-down (5 mins):** Child's pose with lat reach (90s), Cross-body posterior shoulder stretch.

---

#### Day 3: Lower Body Strength & Core
* **Warm-up (8 mins):** World's Greatest Stretch (90s/side), Bodyweight air squats (2x12), Glute bridges (2x15).
* **Main Exercises:**
  1. Goblet Squats or Barbell Back Squats: 4 sets x 8-10 reps | Rest: 90s | *Cue: Spread floor with feet, knees track over toes.*
  2. Romanian Deadlifts (RDL): 3 sets x 10-12 reps | Rest: 75s | *Cue: Hinge back through hips, flat spine.*
  3. Walking Dumbbell Lunges: 3 sets x 10 reps per leg | Rest: 60s | *Cue: 90 degree angles on both knees.*
  4. Hanging Knee Raises or Planks: 3 sets x 12-15 reps (or 45s hold) | Rest: 45s | *Cue: Posterior pelvic tilt.*
* **Cool-down (6 mins):** Standing quadricep stretch (60s/side), Seated hamstring fold, Figure-4 piriformis stretch.

---

#### Day 4: Active Recovery & Kinetic Mobility
* **Warm-up (5 mins):** Cat-cow, gentle neck rolls, ankle circles.
* **Main Exercises (Low Impact):**
  1. Zone-2 Brisk Incline Walk or Light Cycling: 25-30 minutes at conversational pace.
  2. Cat-Cow to Downward Dog Transition: 3 sets x 8 smooth transitions.
  3. Thoracic Spine Thread-the-Needle: 2 sets x 10 reps per side.
* **Cool-down (5 mins):** Deep diaphragmatic box breathing (4s in, 4s hold, 4s out, 4s hold).

---

#### Day 5: Full Body Functional Hypertrophy
* **Warm-up (6 mins):** Dynamic leg swings, torso twists, jumping jacks.
* **Main Exercises:**
  1. Dumbbell Clean to Push Press: 4 sets x 8 reps | Rest: 75s | *Cue: Explosive hip drive transfers force to shoulders.*
  2. Bulgarian Split Squats: 3 sets x 8-10 reps/leg | Rest: 60s | *Cue: Lean slightly forward to load glutes.*
  3. Push-up to Renegade Row: 3 sets x 6-8 reps/side | Rest: 60s | *Cue: Anti-rotational core stability.*
  4. Farmers Walks: 3 sets x 40 meters | Rest: 60s | *Cue: Upright tall posture, shoulder blades locked back.*
* **Cool-down (5 mins):** Standing calf stretch, Butterfly groin stretch.

---

#### Day 6: Metabolic Conditioning & Core Blast
* **Warm-up (6 mins):** High knees, butt kicks, arm sweeps.
* **Main Exercises (Circuits):**
  1. Kettlebell / Dumbbell Swings: 4 sets x 15 reps | Rest: 45s | *Cue: Crisp hip snap, no squatting.*
  2. Mountain Climbers: 4 sets x 30 seconds | Rest: 30s | *Cue: Rapid pacing with stable neutral spine.*
  3. Dumbbell Thrusters: 3 sets x 10 reps | Rest: 60s | *Cue: Sink into squat and press overhead continuously.*
  4. Russian Twists or Hollow Body Hold: 3 sets x 20 total reps | Rest: 45s | *Cue: Controlled rotation.*
* **Cool-down (6 mins):** Cobra stretch for abdominals, Kneeling hip flexor stretch.

---

#### Day 7: Rest, Restorative Yoga & Decompression
* **Focus:** Central Nervous System down-regulation and muscular recovery.
* **Activities:** 20-30 minutes of gentle restorative yoga flow (Child's Pose, Pigeon Pose, Sphinx Pose).
* **Cool-down:** Full body foam rolling and 10 minutes of deep meditation or sleep preparation.
"""
