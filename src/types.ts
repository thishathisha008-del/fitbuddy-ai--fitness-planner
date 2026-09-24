export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type WorkoutIntensity = 'low' | 'moderate' | 'high' | 'extreme';

export type FitnessGoal =
  | 'weight_loss'
  | 'muscle_gain'
  | 'strength'
  | 'endurance'
  | 'general_fitness'
  | 'athletic_performance'
  | 'flexibility_mobility';

export type WorkoutPreference =
  | 'strength_hypertrophy'
  | 'hiit'
  | 'calisthenics'
  | 'functional_fitness'
  | 'cross_training'
  | 'pilates_mobility';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  age: number;
  gender: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';
  weightKg: number;
  heightCm: number;
  fitnessLevel: FitnessLevel;
  primaryGoal: FitnessGoal;
  workoutIntensity: WorkoutIntensity; // Low, Moderate, High, Extreme
  availableTimeMinutes: number; // e.g. 30, 45, 60, 75, 90
  workoutPreference: WorkoutPreference;
  equipment: string[];
  daysPerWeek: number; // 7 for a 7-day program
  preferredDays: string[];
  injuriesOrRestrictions: string;
  experienceNotes: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  targetMuscles: string[];
  sets: number;
  reps: string; // e.g. "8-12" or "45s"
  restSeconds: number;
  tempo?: string; // e.g. "3-0-1-0"
  equipment: string;
  formCues: string[];
  substitutions: string[];
  safetyWarning?: string;
  loggedSets?: { setNumber: number; weightKg?: number; repsCompleted?: number; done: boolean }[];
}

export interface RoutineStep {
  name: string;
  duration: string;
  description: string;
  cues: string[];
}

export interface WorkoutDay {
  dayNumber: number; // 1 to 7
  dayName: string; // "Day 1 - Push / Upper Body"
  title: string;
  focusArea: string;
  estimatedDurationMinutes: number;
  difficulty: 'Beginner' | 'Moderate' | 'Challenging' | 'High Intensity';
  isRestDay?: boolean;
  exercises: ExerciseItem[];
  warmUp: RoutineStep[];
  coolDown: RoutineStep[];
  completed?: boolean;
  completedAt?: string;
}

export interface MacroBreakdown {
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
}

export interface SampleMeal {
  mealType: string;
  name: string;
  calories: number;
  proteinGrams: number;
  description: string;
  keyIngredients: string[];
}

export interface NutritionPlan {
  dailyCalorieTarget: number;
  calorieGoalType: 'Surplus (+300 kcal)' | 'Deficit (-400 kcal)' | 'Maintenance';
  macroBreakdown: MacroBreakdown;
  hydrationLiters: number;
  preWorkoutAdvice: string;
  postWorkoutAdvice: string;
  sampleMeals: SampleMeal[];
  hydrationTips: string[];
}

export interface SafetyGuideline {
  topic: string;
  guideline: string;
  importance: 'Essential' | 'Form Priority' | 'Injury Prevention';
}

export interface FitnessPlan {
  id: string;
  userId?: string;
  version: number; // 1 = original, 2+ = updated from feedback
  isOriginal: boolean;
  parentPlanId?: string; // Links updated plan to original
  createdAt: string;
  updatedAt?: string;
  planTitle: string;
  tagline: string;
  planOverview: string;
  weeklyFocus: string;
  workoutIntensity: WorkoutIntensity;
  quickNutritionRecoveryTip: string; // Generated with Gemini Flash
  feedbackHistory?: {
    feedbackText: string;
    submittedAt: string;
    changesSummary: string;
  }[];
  userProfileSnapshot: Partial<UserProfile>;
  days: WorkoutDay[]; // 7 full days
  generalWarmUp: RoutineStep[];
  generalCoolDown: RoutineStep[];
  nutritionPlan: NutritionPlan;
  safetyGuidelines: SafetyGuideline[];
}

export interface WorkoutHistoryLog {
  id: string;
  planId: string;
  dayNumber: number;
  dayTitle: string;
  date: string; // ISO string
  durationMinutes: number;
  exercisesCompleted: {
    exerciseName: string;
    sets: { setNumber: number; weightKg: number; repsCompleted: number }[];
  }[];
  rpeRating: number; // 1-10 Rate of Perceived Exertion
  energyLevel: 'Low' | 'Moderate' | 'Great' | 'Peak';
  notes: string;
}

export interface WeightLogEntry {
  id: string;
  date: string;
  weightKg: number;
  notes?: string;
}

export interface AssistantChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  actionSuggestions?: string[];
}

export interface PlanFeedbackSubmission {
  planId: string;
  userId: string;
  feedbackText: string;
  satisfactionRating?: number; // 1 to 5
}

export interface AdminUserData {
  id: string;
  name: string;
  email?: string;
  age: number;
  weightKg: number;
  fitnessGoal: string;
  workoutIntensity: string;
  createdAt: string;
  planCount: number;
  latestPlanTitle?: string;
  latestPlanVersion?: number;
  hasUpdates?: boolean;
}
