import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  saveUserToDb,
  savePlanToDb,
  saveFeedbackToDb,
  getAllUsersFromDb,
  getUserPlansFromDb,
  getAllPlansFromDb,
  getFeedbacksFromDb,
} from './src/db/sqlite.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client according to AI Studio guidelines
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper: Generate Quick Nutrition & Recovery Tip using Gemini Flash
async function generateQuickNutritionTip(
  goal: string,
  intensity: string,
  weightKg: number
): Promise<string> {
  try {
    const prompt = `Generate a concise, science-backed 2-sentence nutrition and muscular recovery tip for an athlete:
Goal: ${goal}
Workout Intensity: ${intensity}
Body Weight: ${weightKg}kg
Focus on immediate post-workout glycogen replenishment, electrolyte balancing, or nighttime protein synthesis.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return (
      response.text?.trim() ||
      'Consume 30-40g high-quality protein with complex carbohydrates within 45 minutes of training, and ensure 3L+ hydration with essential electrolytes.'
    );
  } catch (err) {
    return 'Consume 30-40g high-quality protein with complex carbohydrates within 45 minutes of training, and maintain adequate hydration.';
  }
}

// Endpoint 1: Generate Full 7-Day AI Fitness Plan
app.post('/api/generate-plan', async (req: Request, res: Response) => {
  try {
    const profile = req.body;
    if (!profile) {
      return res.status(400).json({ error: 'User profile is required.' });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const userId = profile.id || `usr-${Date.now()}`;
    profile.id = userId;
    const planId = `plan-${Date.now()}`;
    const intensity = profile.workoutIntensity || 'moderate';

    // 1. Generate quick nutrition/recovery tip with Gemini Flash
    const quickNutritionRecoveryTip = await generateQuickNutritionTip(
      profile.primaryGoal || 'fitness',
      intensity,
      profile.weightKg || 70
    );

    // 2. Generate 7-Day Workout Plan using Gemini
    const prompt = `
You are FitBuddy's elite exercise scientist and head strength coach.
Create a personalized, periodized 7-DAY workout plan based on the user's metrics:

User Parameters:
- Name: ${profile.name || 'Athlete'}
- Age: ${profile.age || 26} years old
- Current Weight: ${profile.weightKg || 70} kg
- Fitness Goal: ${profile.primaryGoal || 'muscle_gain'}
- Workout Intensity: ${intensity.toUpperCase()} (Low, Moderate, High, or Extreme)
- Fitness Level: ${profile.fitnessLevel || 'intermediate'}
- Available Time: ${profile.availableTimeMinutes || 45} minutes per session
- Available Equipment: ${Array.isArray(profile.equipment) ? profile.equipment.join(', ') : profile.equipment || 'dumbbells, bench, pull-up bar'}
- Injuries / Restrictions: ${profile.injuriesOrRestrictions || 'None'}
- Custom Notes: ${profile.experienceNotes || 'None'}

Requirements:
1. Generate EXACTLY 7 DAYS (Day 1 through Day 7). 
   - Balance training days with active recovery or mobility days based on the ${intensity} intensity level (e.g. for high/extreme: 5 training days + 2 active recovery days; for moderate: 4 training days + 3 recovery/mobility days; for low: 3 training days + 4 recovery/mobility days).
   - For training days: provide 4 specific exercises with sets (3-4), reps (e.g. "8-12" or "10-15"), restSeconds (45-90s), tempo (e.g. "3-0-1-0"), equipment, formCues, substitutions, and safetyWarning.
   - For recovery days: provide light mobility / recovery drills (e.g. foam rolling, dynamic hip openers, core stability).
2. For each day include: dayNumber (1-7), dayName (e.g. "Day 1 - Push Hypertrophy" or "Day 4 - Active Recovery & Mobility"), title, focusArea, estimatedDurationMinutes (${profile.availableTimeMinutes || 45}), difficulty, isRestDay (boolean).
3. Include general warm-up (3-4 drills) and cool-down routines (3-4 stretches).
4. Provide structured Nutrition Plan:
   - dailyCalorieTarget, calorieGoalType ('Surplus (+300 kcal)', 'Deficit (-400 kcal)', or 'Maintenance')
   - macroBreakdown (proteinGrams, carbsGrams, fatsGrams)
   - hydrationLiters
   - preWorkoutAdvice & postWorkoutAdvice
   - 4 sampleMeals with name, calories, proteinGrams, description, keyIngredients
   - 3 hydrationTips
5. Provide 4 Safety Guidelines tailored to ${profile.injuriesOrRestrictions || 'general safety'}.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planTitle: { type: Type.STRING },
            tagline: { type: Type.STRING },
            planOverview: { type: Type.STRING },
            weeklyFocus: { type: Type.STRING },
            generalWarmUp: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  description: { type: Type.STRING },
                  cues: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['name', 'duration', 'description', 'cues'],
              },
            },
            generalCoolDown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  description: { type: Type.STRING },
                  cues: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['name', 'duration', 'description', 'cues'],
              },
            },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  dayName: { type: Type.STRING },
                  title: { type: Type.STRING },
                  focusArea: { type: Type.STRING },
                  estimatedDurationMinutes: { type: Type.INTEGER },
                  difficulty: { type: Type.STRING },
                  isRestDay: { type: Type.BOOLEAN },
                  warmUp: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        duration: { type: Type.STRING },
                        description: { type: Type.STRING },
                        cues: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['name', 'duration', 'description', 'cues'],
                    },
                  },
                  coolDown: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        duration: { type: Type.STRING },
                        description: { type: Type.STRING },
                        cues: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['name', 'duration', 'description', 'cues'],
                    },
                  },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        targetMuscles: { type: Type.ARRAY, items: { type: Type.STRING } },
                        sets: { type: Type.INTEGER },
                        reps: { type: Type.STRING },
                        restSeconds: { type: Type.INTEGER },
                        tempo: { type: Type.STRING },
                        equipment: { type: Type.STRING },
                        formCues: { type: Type.ARRAY, items: { type: Type.STRING } },
                        substitutions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        safetyWarning: { type: Type.STRING },
                      },
                      required: ['name', 'targetMuscles', 'sets', 'reps', 'restSeconds', 'equipment', 'formCues'],
                    },
                  },
                },
                required: ['dayNumber', 'dayName', 'title', 'focusArea', 'estimatedDurationMinutes', 'difficulty', 'exercises'],
              },
            },
            nutritionPlan: {
              type: Type.OBJECT,
              properties: {
                dailyCalorieTarget: { type: Type.INTEGER },
                calorieGoalType: { type: Type.STRING },
                macroBreakdown: {
                  type: Type.OBJECT,
                  properties: {
                    proteinGrams: { type: Type.INTEGER },
                    carbsGrams: { type: Type.INTEGER },
                    fatsGrams: { type: Type.INTEGER },
                  },
                  required: ['proteinGrams', 'carbsGrams', 'fatsGrams'],
                },
                hydrationLiters: { type: Type.NUMBER },
                preWorkoutAdvice: { type: Type.STRING },
                postWorkoutAdvice: { type: Type.STRING },
                sampleMeals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      mealType: { type: Type.STRING },
                      name: { type: Type.STRING },
                      calories: { type: Type.INTEGER },
                      proteinGrams: { type: Type.INTEGER },
                      description: { type: Type.STRING },
                      keyIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['mealType', 'name', 'calories', 'proteinGrams', 'description'],
                  },
                },
                hydrationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['dailyCalorieTarget', 'calorieGoalType', 'macroBreakdown', 'hydrationLiters', 'preWorkoutAdvice', 'postWorkoutAdvice', 'sampleMeals'],
            },
            safetyGuidelines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  guideline: { type: Type.STRING },
                  importance: { type: Type.STRING },
                },
                required: ['topic', 'guideline', 'importance'],
              },
            },
          },
          required: ['planTitle', 'tagline', 'planOverview', 'weeklyFocus', 'days', 'nutritionPlan', 'safetyGuidelines'],
        },
      },
    });

    const rawText = response.text || '{}';
    const planData = JSON.parse(rawText);

    // Assign IDs to exercises
    if (planData.days) {
      planData.days.forEach((day: any, dIdx: number) => {
        if (!day.warmUp) day.warmUp = planData.generalWarmUp || [];
        if (!day.coolDown) day.coolDown = planData.generalCoolDown || [];
        if (day.exercises) {
          day.exercises.forEach((ex: any, eIdx: number) => {
            if (!ex.id) ex.id = `ex-${dIdx + 1}-${eIdx + 1}-${Date.now().toString(36)}`;
          });
        }
      });
    }

    const fullPlan = {
      id: planId,
      userId: userId,
      version: 1,
      isOriginal: true,
      createdAt: new Date().toISOString(),
      workoutIntensity: intensity,
      quickNutritionRecoveryTip,
      userProfileSnapshot: profile,
      ...planData,
    };

    // Store in SQLite database
    try {
      await saveUserToDb({
        id: userId,
        name: profile.name || 'Athlete',
        email: profile.email || '',
        age: profile.age || 26,
        weightKg: profile.weightKg || 70,
        fitnessGoal: profile.primaryGoal || 'fitness',
        workoutIntensity: intensity,
        fitnessLevel: profile.fitnessLevel || 'intermediate',
        profileJson: JSON.stringify(profile),
      });

      await savePlanToDb({
        id: planId,
        userId: userId,
        version: 1,
        isOriginal: true,
        planTitle: fullPlan.planTitle,
        workoutIntensity: intensity,
        quickNutritionRecoveryTip,
        planJson: JSON.stringify(fullPlan),
      });
    } catch (dbErr) {
      console.warn('SQLite write notice:', dbErr);
    }

    res.json(fullPlan);
  } catch (error: any) {
    console.error('Error in /api/generate-plan:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate fitness plan with Gemini AI.',
    });
  }
});

// Endpoint 2: Update Workout Plan Based on User Feedback
app.post('/api/update-plan-feedback', async (req: Request, res: Response) => {
  try {
    const { planId, userId, feedbackText, currentPlan, userProfile, rating } = req.body;

    if (!feedbackText || !currentPlan) {
      return res.status(400).json({ error: 'feedbackText and currentPlan are required.' });
    }

    const newVersion = (currentPlan.version || 1) + 1;
    const newPlanId = `plan-v${newVersion}-${Date.now()}`;
    const user = userProfile || currentPlan.userProfileSnapshot || {};

    const prompt = `
You are FitBuddy's master trainer. An athlete has submitted feedback on their current 7-day workout plan:

Feedback from athlete:
"${feedbackText}"

Current Plan Context:
- Title: ${currentPlan.planTitle}
- Version: ${currentPlan.version}
- Goal: ${user.primaryGoal || 'fitness'}
- Intensity: ${user.workoutIntensity || currentPlan.workoutIntensity || 'moderate'}
- Weight: ${user.weightKg || 70}kg, Age: ${user.age || 26}
- Current Days count: ${currentPlan.days?.length || 7}

Instructions:
1. Update and refine the 7-day workout plan strictly following the user's feedback (e.g. adjust exercise selection, scale back or ramp up intensity, modify duration, change rest times, or substitute knee/shoulder-taxing exercises).
2. Generate an array of 2-4 bullet points in "changesSummary" highlighting exactly what was changed in response to the user's feedback.
3. Keep all 7 days structured with warm-ups, exercises, and cool-downs.
4. Update or refine nutrition and recovery guidance if requested or relevant.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planTitle: { type: Type.STRING },
            tagline: { type: Type.STRING },
            planOverview: { type: Type.STRING },
            weeklyFocus: { type: Type.STRING },
            changesSummary: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Clear bullet points of what was changed based on user feedback',
            },
            generalWarmUp: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  description: { type: Type.STRING },
                  cues: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['name', 'duration', 'description', 'cues'],
              },
            },
            generalCoolDown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  description: { type: Type.STRING },
                  cues: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['name', 'duration', 'description', 'cues'],
              },
            },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  dayName: { type: Type.STRING },
                  title: { type: Type.STRING },
                  focusArea: { type: Type.STRING },
                  estimatedDurationMinutes: { type: Type.INTEGER },
                  difficulty: { type: Type.STRING },
                  isRestDay: { type: Type.BOOLEAN },
                  warmUp: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        duration: { type: Type.STRING },
                        description: { type: Type.STRING },
                        cues: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['name', 'duration', 'description', 'cues'],
                    },
                  },
                  coolDown: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        duration: { type: Type.STRING },
                        description: { type: Type.STRING },
                        cues: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['name', 'duration', 'description', 'cues'],
                    },
                  },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        targetMuscles: { type: Type.ARRAY, items: { type: Type.STRING } },
                        sets: { type: Type.INTEGER },
                        reps: { type: Type.STRING },
                        restSeconds: { type: Type.INTEGER },
                        tempo: { type: Type.STRING },
                        equipment: { type: Type.STRING },
                        formCues: { type: Type.ARRAY, items: { type: Type.STRING } },
                        substitutions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        safetyWarning: { type: Type.STRING },
                      },
                      required: ['name', 'targetMuscles', 'sets', 'reps', 'restSeconds', 'equipment', 'formCues'],
                    },
                  },
                },
                required: ['dayNumber', 'dayName', 'title', 'focusArea', 'estimatedDurationMinutes', 'difficulty', 'exercises'],
              },
            },
            nutritionPlan: {
              type: Type.OBJECT,
              properties: {
                dailyCalorieTarget: { type: Type.INTEGER },
                calorieGoalType: { type: Type.STRING },
                macroBreakdown: {
                  type: Type.OBJECT,
                  properties: {
                    proteinGrams: { type: Type.INTEGER },
                    carbsGrams: { type: Type.INTEGER },
                    fatsGrams: { type: Type.INTEGER },
                  },
                  required: ['proteinGrams', 'carbsGrams', 'fatsGrams'],
                },
                hydrationLiters: { type: Type.NUMBER },
                preWorkoutAdvice: { type: Type.STRING },
                postWorkoutAdvice: { type: Type.STRING },
                sampleMeals: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      mealType: { type: Type.STRING },
                      name: { type: Type.STRING },
                      calories: { type: Type.INTEGER },
                      proteinGrams: { type: Type.INTEGER },
                      description: { type: Type.STRING },
                      keyIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['mealType', 'name', 'calories', 'proteinGrams', 'description'],
                  },
                },
                hydrationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['dailyCalorieTarget', 'calorieGoalType', 'macroBreakdown', 'hydrationLiters', 'preWorkoutAdvice', 'postWorkoutAdvice', 'sampleMeals'],
            },
            safetyGuidelines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  guideline: { type: Type.STRING },
                  importance: { type: Type.STRING },
                },
                required: ['topic', 'guideline', 'importance'],
              },
            },
          },
          required: ['planTitle', 'tagline', 'planOverview', 'weeklyFocus', 'changesSummary', 'days', 'nutritionPlan', 'safetyGuidelines'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    // New nutrition tip tailored to updated feedback with Gemini Flash
    const updatedNutritionTip = await generateQuickNutritionTip(
      user.primaryGoal || 'fitness',
      user.workoutIntensity || 'moderate',
      user.weightKg || 70
    );

    const updatedPlan = {
      id: newPlanId,
      userId: userId || currentPlan.userId || 'usr-default',
      version: newVersion,
      isOriginal: false,
      parentPlanId: currentPlan.id,
      createdAt: currentPlan.createdAt,
      updatedAt: new Date().toISOString(),
      workoutIntensity: user.workoutIntensity || currentPlan.workoutIntensity || 'moderate',
      quickNutritionRecoveryTip: updatedNutritionTip,
      feedbackHistory: [
        ...(currentPlan.feedbackHistory || []),
        {
          feedbackText,
          submittedAt: new Date().toISOString(),
          changesSummary: (parsed.changesSummary || []).join('; '),
        },
      ],
      userProfileSnapshot: user,
      ...parsed,
    };

    // Save to SQLite
    try {
      await savePlanToDb({
        id: newPlanId,
        userId: updatedPlan.userId,
        version: newVersion,
        isOriginal: false,
        parentPlanId: currentPlan.id,
        planTitle: updatedPlan.planTitle,
        workoutIntensity: updatedPlan.workoutIntensity,
        quickNutritionRecoveryTip: updatedNutritionTip,
        planJson: JSON.stringify(updatedPlan),
      });

      await saveFeedbackToDb({
        id: `fb-${Date.now()}`,
        planId: currentPlan.id,
        userId: updatedPlan.userId,
        feedbackText,
        rating: rating || 5,
        changesSummary: (parsed.changesSummary || []).join('; '),
      });
    } catch (dbErr) {
      console.warn('SQLite write notice:', dbErr);
    }

    res.json(updatedPlan);
  } catch (error: any) {
    console.error('Error in /api/update-plan-feedback:', error);
    res.status(500).json({ error: error.message || 'Failed to update plan from feedback.' });
  }
});

// Endpoint 3: Quick Nutrition/Recovery Tip (Gemini Flash)
app.post('/api/quick-nutrition-tip', async (req: Request, res: Response) => {
  try {
    const { goal, intensity, weightKg } = req.body;
    const tip = await generateQuickNutritionTip(goal || 'muscle_gain', intensity || 'moderate', weightKg || 70);
    res.json({ tip });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate nutrition tip.' });
  }
});

// Admin Endpoint 1: Get all users from SQLite
app.get('/api/admin/users', async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsersFromDb();
    res.json(users);
  } catch (error: any) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch users.' });
  }
});

// Admin Endpoint 2: Get plans for a specific user (original and updated)
app.get(['/api/admin/users/:userId/plans', '/api/admin/user/:userId/plans'], async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const plans = await getUserPlansFromDb(userId);
    res.json(plans);
  } catch (error: any) {
    console.error('Admin user plans error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch user plans.' });
  }
});

// Admin Endpoint 3: Get all plans from SQLite
app.get('/api/admin/plans', async (_req: Request, res: Response) => {
  try {
    const plans = await getAllPlansFromDb();
    res.json(plans);
  } catch (error: any) {
    console.error('Admin all plans error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch plans.' });
  }
});

// Admin Endpoint 4: Get all feedback submissions
app.get('/api/admin/feedbacks', async (_req: Request, res: Response) => {
  try {
    const feedbacks = await getFeedbacksFromDb();
    res.json(feedbacks);
  } catch (error: any) {
    console.error('Admin feedbacks error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch feedbacks.' });
  }
});

// Existing Chat & Substitute Endpoints
app.post('/api/assistant-chat', async (req: Request, res: Response) => {
  try {
    const { message, profile, activePlan } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const contextSnippet = `
User Context:
- Name: ${profile?.name || 'Athlete'}
- Goal: ${profile?.primaryGoal || 'fitness'}
- Intensity: ${profile?.workoutIntensity || 'moderate'}
- Weight: ${profile?.weightKg || 70}kg, Age: ${profile?.age || 26}
- Active Plan: ${activePlan?.planTitle || 'Custom FitBuddy Routine'} (v${activePlan?.version || 1})
- Restrictions: ${profile?.injuriesOrRestrictions || 'None'}
`;

    const systemInstruction = `You are FitBuddy Coach, an elite fitness mentor powered by Google Gemini.
Offer exact, biomechanically sound cues, modification advice, warmup/recovery tips, and positive motivation.
Context:
${contextSnippet}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nUser Question: ${message}` }],
        },
      ],
    });

    const reply = response.text || 'I am ready to help you optimize your training!';
    res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/assistant-chat:', error);
    res.status(500).json({ error: error.message || 'Failed to get response.' });
  }
});

app.post('/api/substitute-exercise', async (req: Request, res: Response) => {
  try {
    const { exerciseName, targetMuscles, reason, equipment } = req.body;
    const prompt = `Provide 3 smart exercise alternatives for "${exerciseName}" (targeting: ${targetMuscles?.join(', ') || 'same muscle group'}).
Reason for replacement: "${reason || 'preference or pain'}".
Available equipment: "${equipment || 'dumbbells or bodyweight'}".
Return JSON with an array of objects: name, reasonWhyItWorks, equipment, and keyFormCue.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              reasonWhyItWorks: { type: Type.STRING },
              equipment: { type: Type.STRING },
              keyFormCue: { type: Type.STRING },
            },
            required: ['name', 'reasonWhyItWorks', 'equipment', 'keyFormCue'],
          },
        },
      },
    });

    const raw = response.text || '[]';
    res.json(JSON.parse(raw));
  } catch (error: any) {
    console.error('Error in /api/substitute-exercise:', error);
    res.status(500).json({ error: error.message || 'Failed to generate substitutions.' });
  }
});

// Endpoint 5: Get Python/Project File Content
app.get('/api/file-content', async (req: Request, res: Response) => {
  try {
    const filePathParam = req.query.path as string;
    if (!filePathParam) {
      return res.status(400).json({ error: 'path is required' });
    }

    const allowedPrefixes = ['app/', 'templates/', 'static/', 'requirements.txt', 'README.md'];
    const isAllowed = allowedPrefixes.some((prefix) => filePathParam.startsWith(prefix) || filePathParam === prefix);
    if (!isAllowed) {
      return res.status(403).json({ error: 'Access denied to this path' });
    }

    const fullPath = path.resolve(__dirname, filePathParam);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    res.json({ path: filePathParam, content });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to read file' });
  }
});

// Endpoint 6: Serve static files in /static
app.use('/static', express.static(path.resolve(__dirname, 'static')));

// Endpoint 7: /all_users HTML Page (Admin Dashboard)
app.get(['/all_users', '/all_users.html', '/admin-dashboard.html'], async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsersFromDb();
    const plans = await getAllPlansFromDb();

    // Group plans by user_id
    const userPlansMap: { [key: string]: any[] } = {};
    for (const p of plans) {
      const uId = (p as any).user_id || (p as any).userId;
      if (uId) {
        if (!userPlansMap[uId]) userPlansMap[uId] = [];
        userPlansMap[uId].push(p);
      }
    }

    const rowsHtml = users.map((u) => {
      const uPlans = userPlansMap[u.id] || [];
      const origPlan = uPlans.find((p) => p.version === 1 || p.is_original) || uPlans[0];
      const updatedPlan = uPlans.find((p) => p.version > 1 || !p.is_original);

      const intensityBadge = (u.workoutIntensity || '').toLowerCase() === 'high'
        ? '<span class="badge-intensity badge-high">High</span>'
        : (u.workoutIntensity || '').toLowerCase() === 'low'
        ? '<span class="badge-intensity badge-low">Low</span>'
        : '<span class="badge-intensity badge-medium">Medium</span>';

      const origStatus = origPlan
        ? '<span style="color: #4ade80; font-weight: 600; font-size: 0.8125rem;">✓ Available (v1)</span>'
        : '<span style="color: #6b7280;">—</span>';

      const updatedStatus = updatedPlan
        ? `<span style="color: #06b6d4; font-weight: 600; font-size: 0.8125rem;">✓ Updated (v${updatedPlan.version || 2})</span>`
        : '<span style="color: #9ca3af; font-size: 0.8125rem;">Pending Feedback</span>';

      const origTextSafe = origPlan ? (origPlan.plan_title + '\n\n' + (origPlan.quick_nutrition_recovery_tip || '')).replace(/"/g, '&quot;') : '';
      const updatedTextSafe = updatedPlan ? (updatedPlan.plan_title + '\n\n' + (updatedPlan.quick_nutrition_recovery_tip || '')).replace(/"/g, '&quot;') : '';

      return `<tr>
        <td><strong style="color: var(--accent-lime); font-family: monospace;">${u.id}</strong></td>
        <td style="font-weight: 700; color: #fff;">${u.name}</td>
        <td>${u.age} yrs</td>
        <td>${u.weightKg} kg</td>
        <td><span style="background: #1f1f27; padding: 0.2rem 0.5rem; border-radius: 0.375rem; font-size: 0.75rem; color: #d1d5db;">${u.fitnessGoal}</span></td>
        <td>${intensityBadge}</td>
        <td>${origStatus}</td>
        <td>${updatedStatus}</td>
        <td>
          <button class="btn-view" onclick="alert('Athlete: ${u.name}\\nUser ID: ${u.id}\\nOriginal Plan: ${origPlan ? origPlan.plan_title : 'None'}\\nUpdated Plan: ${updatedPlan ? updatedPlan.plan_title : 'Pending feedback'}')">Inspect Plan</button>
        </td>
      </tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard (all_users) – FitBuddy</title>
  <link rel="stylesheet" href="/static/css/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <header class="site-header">
    <div class="container nav-bar">
      <a href="/" class="brand">
        <span class="brand-badge">FB</span>
        <span>FitBuddy<span style="color: var(--accent-lime);">.</span></span>
      </a>
      <nav class="nav-links">
        <a href="/" class="nav-btn">Home App</a>
        <a href="/all_users" class="nav-btn primary">Admin Dashboard (all_users)</a>
      </nav>
    </div>
  </header>

  <main class="container" style="padding-top: 2rem;">
    <div style="display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 1rem; margin-bottom: 2rem;">
      <div>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
          <span style="background: rgba(163, 230, 53, 0.15); color: var(--accent-lime); padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700;">
            SQLite Database: fitbuddy.sqlite
          </span>
          <span style="color: #9ca3af; font-size: 0.8125rem;">Total Athletes: <strong>${users.length}</strong></span>
        </div>
        <h1 style="font-size: 1.75rem; font-weight: 800; color: #fff;">
          All Users Administration Dashboard (all_users.html)
        </h1>
        <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.25rem;">
          Displaying users, age, weight, fitness goal, workout intensity, original plan, and updated plan from SQLite.
        </p>
      </div>
      <a href="/" class="btn-submit" style="width: auto; padding: 0.6rem 1.25rem; font-size: 0.875rem;">
        ← Back to FitBuddy
      </a>
    </div>

    <div class="card" style="padding: 0; overflow: hidden;">
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Weight</th>
              <th>Fitness Goal</th>
              <th>Intensity</th>
              <th>Original Plan</th>
              <th>Updated Plan</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="9" style="text-align:center; padding: 2rem;">No users in SQLite database yet.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Future Features & Strategic Roadmap Section -->
    <div class="card" style="margin-top: 2.5rem; border-color: rgba(163, 230, 53, 0.4); background: linear-gradient(145deg, #141418, #181c14);">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 1rem; margin-bottom: 1.5rem;">
        <div>
          <span style="background: rgba(163, 230, 53, 0.15); color: var(--accent-lime); padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">
            Strategic Roadmap
          </span>
          <h2 style="font-size: 1.35rem; font-weight: 800; color: #fff; margin-top: 0.4rem;">
            FitBuddy Future Features & Innovations
          </h2>
        </div>
        <button onclick="navigator.clipboard.writeText('“In the future, FitBuddy can be enhanced with wearable integration, AI voice assistance, personalized diet planning, progress tracking, exercise videos, smart notifications, mobile apps, and advanced AI-based personalization.”'); alert('Copied Short PPT Version to clipboard!');" class="btn-view" style="padding: 0.5rem 1rem; font-size: 0.8125rem;">
          📋 Copy Short PPT Version
        </button>
      </div>

      <!-- Short PPT Callout -->
      <div style="background: rgba(163, 230, 53, 0.08); border-left: 4px solid var(--accent-lime); padding: 1.25rem 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
        <span style="font-size: 0.75rem; font-weight: 800; color: var(--accent-lime); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.35rem;">
          Short PPT Version (for Presentations & Reports)
        </span>
        <blockquote style="font-size: 1.05rem; font-weight: 700; color: #ffffff; line-height: 1.5; margin: 0; font-style: italic;">
          “In the future, FitBuddy can be enhanced with wearable integration, AI voice assistance, personalized diet planning, progress tracking, exercise videos, smart notifications, mobile apps, and advanced AI-based personalization.”
        </blockquote>
      </div>

      <!-- 10 Feature Bullets Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
        <div style="background: #111115; border: 1px solid #23232b; border-radius: 0.625rem; padding: 1rem;">
          <strong style="color: var(--accent-lime); font-size: 0.875rem; display: block; margin-bottom: 0.25rem;">1. AI Voice Assistant</strong>
          <p style="color: #9ca3af; font-size: 0.8125rem; margin: 0;">Users can interact with FitBuddy hands-free using voice commands.</p>
        </div>
        <div style="background: #111115; border: 1px solid #23232b; border-radius: 0.625rem; padding: 1rem;">
          <strong style="color: var(--accent-cyan); font-size: 0.875rem; display: block; margin-bottom: 0.25rem;">2. Wearable Device Integration</strong>
          <p style="color: #9ca3af; font-size: 0.8125rem; margin: 0;">Connect smartwatches & fitness bands to track steps, heart rate, calories, and activity.</p>
        </div>
        <div style="background: #111115; border: 1px solid #23232b; border-radius: 0.625rem; padding: 1rem;">
          <strong style="color: #fbbf24; font-size: 0.875rem; display: block; margin-bottom: 0.25rem;">3. Real-Time Progress Tracking</strong>
          <p style="color: #9ca3af; font-size: 0.8125rem; margin: 0;">Show daily, weekly, and monthly fitness progress through charts and reports.</p>
        </div>
        <div style="background: #111115; border: 1px solid #23232b; border-radius: 0.625rem; padding: 1rem;">
          <strong style="color: #34d399; font-size: 0.875rem; display: block; margin-bottom: 0.25rem;">4. Personalized Diet Planner</strong>
          <p style="color: #9ca3af; font-size: 0.8125rem; margin: 0;">Generate customized meal plans based on fitness goals and food preferences.</p>
        </div>
        <div style="background: #111115; border: 1px solid #23232b; border-radius: 0.625rem; padding: 1rem;">
          <strong style="color: #c084fc; font-size: 0.875rem; display: block; margin-bottom: 0.25rem;">5. Exercise Video Guidance</strong>
          <p style="color: #9ca3af; font-size: 0.8125rem; margin: 0;">Provide videos or animations showing the correct exercise techniques.</p>
        </div>
        <div style="background: #111115; border: 1px solid #23232b; border-radius: 0.625rem; padding: 1rem;">
          <strong style="color: #f43f5e; font-size: 0.875rem; display: block; margin-bottom: 0.25rem;">6. Advanced AI Personalization</strong>
          <p style="color: #9ca3af; font-size: 0.8125rem; margin: 0;">Continuously improve workout plans based on the user's progress and feedback.</p>
        </div>
        <div style="background: #111115; border: 1px solid #23232b; border-radius: 0.625rem; padding: 1rem;">
          <strong style="color: var(--accent-lime); font-size: 0.875rem; display: block; margin-bottom: 0.25rem;">7. Reminder & Notification System</strong>
          <p style="color: #9ca3af; font-size: 0.8125rem; margin: 0;">Send reminders for workouts, meals, hydration, and recovery.</p>
        </div>
        <div style="background: #111115; border: 1px solid #23232b; border-radius: 0.625rem; padding: 1rem;">
          <strong style="color: var(--accent-cyan); font-size: 0.875rem; display: block; margin-bottom: 0.25rem;">8. Mobile Application</strong>
          <p style="color: #9ca3af; font-size: 0.8125rem; margin: 0;">Develop Android/iOS versions for easy access anywhere.</p>
        </div>
        <div style="background: #111115; border: 1px solid #23232b; border-radius: 0.625rem; padding: 1rem;">
          <strong style="color: #60a5fa; font-size: 0.875rem; display: block; margin-bottom: 0.25rem;">9. Cloud Deployment</strong>
          <p style="color: #9ca3af; font-size: 0.8125rem; margin: 0;">Deploy FitBuddy online so users can access their plans from any device.</p>
        </div>
        <div style="background: #111115; border: 1px solid #23232b; border-radius: 0.625rem; padding: 1rem;">
          <strong style="color: #10b981; font-size: 0.875rem; display: block; margin-bottom: 0.25rem;">10. Coach/Trainer Support</strong>
          <p style="color: #9ca3af; font-size: 0.8125rem; margin: 0;">Allow fitness coaches to monitor users and provide personalized guidance.</p>
        </div>
      </div>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>FitBuddy – AI Fitness Plan Generator using Gemini Models · SQLite Persistence · FastAPI / Express</p>
    </div>
  </footer>
</body>
</html>`;

    res.send(html);
  } catch (error: any) {
    res.status(500).send('Error rendering all_users: ' + error.message);
  }
});

// Production / Dev Static & Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FitBuddy server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
