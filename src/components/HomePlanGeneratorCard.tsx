import React, { useState } from 'react';
import { Sparkles, Dumbbell, Flame, User, Hash, Calendar, Weight, Target, Activity, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { FitnessPlan, UserProfile, FitnessGoal, WorkoutIntensity } from '../types.ts';

interface HomePlanGeneratorCardProps {
  currentProfile: UserProfile;
  onPlanGenerated: (newPlan: FitnessPlan, updatedProfile: UserProfile) => void;
}

export const HomePlanGeneratorCard: React.FC<HomePlanGeneratorCardProps> = ({
  currentProfile,
  onPlanGenerated,
}) => {
  const [name, setName] = useState(currentProfile.name || 'Alex Rivera');
  const [userId, setUserId] = useState(currentProfile.id || 'USR-101');
  const [age, setAge] = useState<number>(currentProfile.age || 27);
  const [weightKg, setWeightKg] = useState<number>(currentProfile.weightKg || 74);
  const [fitnessGoal, setFitnessGoal] = useState<string>('muscle_gain');
  const [workoutIntensity, setWorkoutIntensity] = useState<string>('moderate');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const updatedProfile: UserProfile = {
      ...currentProfile,
      id: userId.trim() || `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim() || 'Athlete',
      age: Number(age) || 27,
      weightKg: Number(weightKg) || 74,
      primaryGoal: fitnessGoal as FitnessGoal,
      workoutIntensity: workoutIntensity as WorkoutIntensity,
    };

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: updatedProfile }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with ${res.status}`);
      }

      const newPlan: FitnessPlan = await res.json();
      onPlanGenerated(newPlan, updatedProfile);
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setErrorMsg(err.message || 'Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-lime-400/30 bg-neutral-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Glow highlight */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Gemini AI Workout Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display">
              Generate Your Personalized 7-Day Fitness Plan
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Enter athlete details below. Gemini 1.5 Pro will engineer your custom 7-day microcycle with warm-ups, sets, reps, rest intervals, and cool-downs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-800 text-[11px] text-neutral-300 font-medium border border-neutral-700">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse" />
              Gemini Flash Nutrition
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-xs sm:text-sm text-red-300">
            {errorMsg}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* 1. Name */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-300">
                <User className="w-3.5 h-3.5 text-lime-400" />
                <span>Athlete Name</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-lime-400 focus:outline-none transition-colors"
              />
            </div>

            {/* 2. User ID */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-300">
                <Hash className="w-3.5 h-3.5 text-lime-400" />
                <span>User ID</span>
              </label>
              <input
                type="text"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. USR-101"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-lime-400 focus:outline-none transition-colors font-mono"
              />
            </div>

            {/* 3. Age */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-300">
                <Calendar className="w-3.5 h-3.5 text-lime-400" />
                <span>Age (Years)</span>
              </label>
              <input
                type="number"
                required
                min={14}
                max={95}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-lime-400 focus:outline-none transition-colors"
              />
            </div>

            {/* 4. Weight */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-300">
                <Weight className="w-3.5 h-3.5 text-lime-400" />
                <span>Weight (kg)</span>
              </label>
              <input
                type="number"
                required
                step="0.5"
                min={35}
                max={250}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-lime-400 focus:outline-none transition-colors"
              />
            </div>

            {/* 5. Fitness Goal */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-300">
                <Target className="w-3.5 h-3.5 text-lime-400" />
                <span>Fitness Goal</span>
              </label>
              <select
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-4 py-2.5 text-sm text-white focus:border-lime-400 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="weight_loss">Weight Loss (Fat Loss & EPOC Conditioning)</option>
                <option value="muscle_gain">Muscle Gain (Hypertrophy & Strength)</option>
                <option value="general_fitness">General Fitness (Endurance & Longevity)</option>
                <option value="flexibility_mobility">Flexibility (Mobility & Joint Health)</option>
              </select>
            </div>

            {/* 6. Workout Intensity */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-300">
                <Activity className="w-3.5 h-3.5 text-lime-400" />
                <span>Workout Intensity</span>
              </label>
              <select
                value={workoutIntensity}
                onChange={(e) => setWorkoutIntensity(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 px-4 py-2.5 text-sm text-white focus:border-lime-400 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="low">Low (Gentle Mobility & Active Recovery)</option>
                <option value="moderate">Medium / Moderate (Optimal Progressive Overload)</option>
                <option value="high">High (High Output Conditioning & Strength)</option>
              </select>
            </div>
          </div>

          {/* Quick Preset Buttons for Quick Demo */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-800/80">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mr-1">
              Quick Demos:
            </span>
            <button
              type="button"
              onClick={() => {
                setName('Alex Rivera');
                setUserId('USR-101');
                setAge(27);
                setWeightKg(74);
                setFitnessGoal('muscle_gain');
                setWorkoutIntensity('moderate');
              }}
              className="rounded-lg bg-neutral-800/80 border border-neutral-700/80 px-2.5 py-1 text-[11px] font-medium text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors"
            >
              Alex (Muscle Gain / Medium)
            </button>
            <button
              type="button"
              onClick={() => {
                setName('Maya Chen');
                setUserId('USR-202');
                setAge(25);
                setWeightKg(62);
                setFitnessGoal('weight_loss');
                setWorkoutIntensity('high');
              }}
              className="rounded-lg bg-neutral-800/80 border border-neutral-700/80 px-2.5 py-1 text-[11px] font-medium text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors"
            >
              Maya (Weight Loss / High)
            </button>
            <button
              type="button"
              onClick={() => {
                setName('Elena Rostova');
                setUserId('USR-303');
                setAge(31);
                setWeightKg(58);
                setFitnessGoal('flexibility_mobility');
                setWorkoutIntensity('low');
              }}
              className="rounded-lg bg-neutral-800/80 border border-neutral-700/80 px-2.5 py-1 text-[11px] font-medium text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors"
            >
              Elena (Flexibility / Low)
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-lime-400 py-3.5 px-6 font-bold text-neutral-950 shadow-lg shadow-lime-400/25 transition-all hover:bg-lime-300 hover:shadow-lime-400/40 disabled:opacity-50 text-sm sm:text-base font-display"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating 7-Day Plan with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Plan with Gemini</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
