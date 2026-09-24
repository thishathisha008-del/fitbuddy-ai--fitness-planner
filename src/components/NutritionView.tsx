import React, { useState } from 'react';
import {
  Utensils,
  Droplets,
  Flame,
  Apple,
  Sparkles,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  Beef,
  Wheat,
  Activity,
} from 'lucide-react';
import { NutritionPlan } from '../types.ts';
import mealImg from '../assets/images/nutrition_clean_bowl_1790240026486.jpg';

interface NutritionViewProps {
  nutrition: NutritionPlan;
}

export const NutritionView: React.FC<NutritionViewProps> = ({ nutrition }) => {
  // Interactive water intake logger (glasses of 250ml)
  const [glassesDrunk, setGlassesDrunk] = useState(4);
  const targetGlasses = Math.round((nutrition.hydrationLiters || 3.0) * 4);

  const totalProteinCal = nutrition.macroBreakdown.proteinGrams * 4;
  const totalCarbsCal = nutrition.macroBreakdown.carbsGrams * 4;
  const totalFatsCal = nutrition.macroBreakdown.fatsGrams * 9;
  const calculatedTotal = totalProteinCal + totalCarbsCal + totalFatsCal || nutrition.dailyCalorieTarget;

  const proteinPct = Math.round((totalProteinCal / calculatedTotal) * 100);
  const carbsPct = Math.round((totalCarbsCal / calculatedTotal) * 100);
  const fatsPct = Math.round((totalFatsCal / calculatedTotal) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-lime-400 uppercase tracking-wider mb-1">
            <Utensils className="w-3.5 h-3.5" />
            <span>Sports Nutrition & Anabolic Recovery</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Personalized Fuel & Macronutrient Blueprint
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Calibrated to support muscle synthesis, glycogen supercompensation, and optimal joint recovery.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-xl text-xs">
          <span className="text-neutral-400">Strategy:</span>
          <span className="font-bold text-lime-400">{nutrition.calorieGoalType}</span>
        </div>
      </div>

      {/* Top Nutrition Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Calories Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Daily Calorie Target</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-3xl font-extrabold text-white font-display tabular-nums">
            {nutrition.dailyCalorieTarget}{' '}
            <span className="text-xs font-normal text-neutral-400">kcal</span>
          </p>
          <p className="text-xs text-neutral-400">
            Optimal metabolic baseline for your current body composition and training volume.
          </p>
        </div>

        {/* Protein Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Daily Protein</span>
            <Beef className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-extrabold text-rose-400 font-display tabular-nums">
            {nutrition.macroBreakdown.proteinGrams}{' '}
            <span className="text-xs font-normal text-neutral-400">grams ({proteinPct}%)</span>
          </p>
          <p className="text-xs text-neutral-400">
            ~2.0-2.2g per kg bodyweight to maximize muscle protein synthesis and prevent catabolism.
          </p>
        </div>

        {/* Carbs Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Carbohydrates</span>
            <Wheat className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400 font-display tabular-nums">
            {nutrition.macroBreakdown.carbsGrams}{' '}
            <span className="text-xs font-normal text-neutral-400">grams ({carbsPct}%)</span>
          </p>
          <p className="text-xs text-neutral-400">
            Primary fuel for anaerobic glycolytic pathways and intense lifting output.
          </p>
        </div>

        {/* Healthy Fats Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Healthy Fats</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-cyan-400 font-display tabular-nums">
            {nutrition.macroBreakdown.fatsGrams}{' '}
            <span className="text-xs font-normal text-neutral-400">grams ({fatsPct}%)</span>
          </p>
          <p className="text-xs text-neutral-400">
            Essential for endocrine hormone production, joint synovial fluid, and nutrient absorption.
          </p>
        </div>
      </div>

      {/* Visual Macro Distribution Ratio Bar */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-300">
          <span>Macronutrient Ratio Breakdown</span>
          <span>{calculatedTotal} Total Calculated kcal</span>
        </div>

        <div className="h-4 w-full rounded-full bg-neutral-800 overflow-hidden flex">
          <div
            style={{ width: `${proteinPct}%` }}
            className="bg-rose-500 hover:opacity-90 transition-all"
            title={`Protein: ${proteinPct}%`}
          />
          <div
            style={{ width: `${carbsPct}%` }}
            className="bg-amber-400 hover:opacity-90 transition-all"
            title={`Carbs: ${carbsPct}%`}
          />
          <div
            style={{ width: `${fatsPct}%` }}
            className="bg-cyan-400 hover:opacity-90 transition-all"
            title={`Fats: ${fatsPct}%`}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span>Protein ({proteinPct}%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span>Carbohydrates ({carbsPct}%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            <span>Healthy Fats ({fatsPct}%)</span>
          </span>
        </div>
      </div>

      {/* Nutrient Timing & Hydration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pre & Post Workout Timing */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Pre-Workout Nutrient Timing (60-90 min prior)</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
              {nutrition.preWorkoutAdvice}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-lime-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Post-Workout Anabolic Window (within 45 min)</span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
              {nutrition.postWorkoutAdvice}
            </p>
          </div>
        </div>

        {/* Interactive Hydration Tracker */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Droplets className="w-4 h-4" />
              <span>Hydration Protocol</span>
            </div>
            <span className="text-xs text-neutral-400 tabular-nums">
              Target: {nutrition.hydrationLiters} L / day
            </span>
          </div>

          <div className="text-center py-2">
            <p className="text-3xl font-extrabold text-white font-display tabular-nums">
              {(glassesDrunk * 0.25).toFixed(2)}{' '}
              <span className="text-xs font-normal text-neutral-400">/ {nutrition.hydrationLiters} L</span>
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              {glassesDrunk} of {targetGlasses} glasses (250ml) logged today
            </p>
          </div>

          {/* Interactive +/- Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setGlassesDrunk((prev) => Math.max(0, prev - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>

            <button
              onClick={() => setGlassesDrunk((prev) => prev + 1)}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-cyan-400 transition-colors shadow-sm shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Drink 1 Glass</span>
            </button>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-neutral-800/80 text-xs text-neutral-400">
            {nutrition.hydrationTips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold">›</span>
                <span className="text-[11px]">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Healthy Sample Meals Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
            Goal-Calibrated Sample Meals & Recipes
          </h3>
          <span className="text-xs text-neutral-400">Balanced macronutrient profiles</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nutrition.sampleMeals.map((meal, index) => {
            const isFeatured = index === 0;

            return (
              <div
                key={index}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3 relative overflow-hidden"
              >
                {/* Visual Thumbnail for the top featured bowl */}
                {isFeatured && (
                  <div className="h-36 -mx-5 -mt-5 mb-3 relative overflow-hidden border-b border-neutral-800">
                    <img
                      src={mealImg}
                      alt="Nutritious fitness meal prep bowl"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center brightness-90 hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                    <div className="absolute bottom-2 left-4 text-xs font-bold text-lime-400">
                      Chef & Dietitian Recommended
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-lime-400 uppercase tracking-wider">
                      {meal.mealType}
                    </span>
                    <h4 className="text-base font-bold text-white tracking-tight mt-0.5">
                      {meal.name}
                    </h4>
                  </div>
                  <div className="flex flex-col items-end text-xs shrink-0">
                    <span className="font-bold text-white tabular-nums">{meal.calories} kcal</span>
                    <span className="text-rose-400 font-semibold tabular-nums">{meal.proteinGrams}g Protein</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {meal.description}
                </p>

                {meal.keyIngredients && meal.keyIngredients.length > 0 && (
                  <div className="pt-2 border-t border-neutral-800/80">
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                      Key Ingredients:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {meal.keyIngredients.map((ing, iIdx) => (
                        <span
                          key={iIdx}
                          className="rounded-lg bg-neutral-800/80 border border-neutral-700/60 px-2 py-0.5 text-[11px] text-neutral-300"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
