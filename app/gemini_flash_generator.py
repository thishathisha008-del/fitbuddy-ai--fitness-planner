"""
AI Nutrition & Recovery Tip Generator using Gemini Flash.
Generates concise, goal-targeted nutritional and muscular recovery advice.
"""

import os
from google import genai
from google.genai import types

def get_client() -> genai.Client:
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY", "")
    return genai.Client(api_key=api_key)


def generate_nutrition_tip(fitness_goal: str, workout_intensity: str, weight: float) -> str:
    """
    Generates a concise (2-4 sentences) high-impact nutrition or recovery tip
    specifically calibrated for the user's fitness goal using Gemini Flash.
    """
    client = get_client()

    prompt = f"""
You are a sports nutritionist. Generate a punchy, scientific 2-3 sentence nutrition and muscular recovery tip
for an athlete with:
- Fitness Goal: {fitness_goal}
- Workout Intensity: {workout_intensity}
- Body Weight: {weight} kg

Include:
1. Specific macronutrient or hydration recommendation (e.g. protein target, carbohydrate timing, or electrolytes).
2. A recovery tactic (e.g., sleep, post-workout window, or anti-inflammatory foods).
Keep it direct, actionable, and under 60 words. No intro or outro.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.6,
                max_output_tokens=150,
            )
        )
        if response.text:
            return response.text.strip()
    except Exception as e:
        print("Gemini Flash nutrition generation error:", e)

    # Goal-based fallback
    goal_lower = fitness_goal.lower()
    if "loss" in goal_lower:
        return f"Maintain a slight 350-calorie deficit while keeping protein at 1.8g per kg of body weight ({round(weight * 1.8)}g) to spare lean mass. Drink 500ml water before meals and prioritize fibrous greens for satiety."
    elif "muscle" in goal_lower:
        return f"Target 2.0g protein per kg ({round(weight * 2.0)}g total) and consume 35g whey with fast-digesting carbohydrates within 45 minutes post-workout to trigger muscle protein synthesis. Ensure 8 hours of sleep for growth hormone release."
    elif "flex" in goal_lower:
        return f"Hydrate with 3+ liters of water infused with trace minerals (magnesium, potassium) to maintain soft tissue elasticity and prevent muscle cramps. Consume tart cherry juice or turmeric to soothe connective tissue."
    else:
        return f"Prioritize whole-food nutrient density: aim for 1.6g protein per kg ({round(weight * 1.6)}g), complex carbs (oats, sweet potatoes) around workouts, and 3 liters of water daily to sustain steady cellular energy."
