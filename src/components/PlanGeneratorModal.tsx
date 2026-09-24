import React, { useState } from 'react';
import { X, Sparkles, Loader2, Dumbbell, ShieldAlert, Cpu, CheckCircle2, Flame, Apple } from 'lucide-react';
import { FitnessPlan, UserProfile, WorkoutIntensity } from '../types.ts';

interface PlanGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onPlanGenerated: (newPlan: FitnessPlan) => void;
}

export const PlanGeneratorModal: React.FC<PlanGeneratorModalProps> = ({
  isOpen,
  onClose,
  profile,
  onPlanGenerated,
}) => {
  const [customNotes, setCustomNotes] = useState('');
  const [selectedIntensity, setSelectedIntensity] = useState<WorkoutIntensity>(
    profile.workoutIntensity || 'moderate'
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [progressStage, setProgressStage] = useState(0);

  if (!isOpen) return null;

  const STAGES = [
    'Analyzing personal parameters (Age, Weight, Goal, Intensity)...',
    'Synthesizing 7-Day structured training microcycle with Gemini AI...',
    'Generating targeted nutrition & muscular recovery tips with Gemini Flash...',
    'Calibrating warm-up mobility, eccentric tempo, and cool-down routines...',
    'Saving athlete and plan records to SQLite database (fitbuddy.sqlite)...',
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg(null);
    setProgressStage(0);

    const interval = setInterval(() => {
      setProgressStage((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 2400);

    try {
      const mergedProfile = {
        ...profile,
        workoutIntensity: selectedIntensity,
        daysPerWeek: 7,
        experienceNotes: customNotes
          ? `${profile.experienceNotes} | Custom Note: ${customNotes}`
          : profile.experienceNotes,
      };

      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mergedProfile),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const newPlan: FitnessPlan = await res.json();
      clearInterval(interval);
      onPlanGenerated(newPlan);
      onClose();
    } catch (err: any) {
      clearInterval(interval);
      setErrorMsg(err.message || 'Failed to generate fitness plan. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 text-neutral-950 font-bold shadow-sm shadow-lime-400/20">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Generate 7-Day AI Fitness Plan
              </h2>
              <p className="text-xs text-neutral-400">
                Calibrated by Google Gemini AI with Quick Nutrition & Recovery Tips
              </p>
            </div>
          </div>
          {!loading && (
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Athlete Configuration Summary */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Active Athlete Metrics:
              </span>
              <span className="text-xs font-semibold text-lime-400">{profile.name}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="rounded-lg bg-neutral-900 p-2 border border-neutral-800">
                <span className="block text-[10px] text-neutral-500">Age & Weight</span>
                <span className="font-semibold text-white">
                  {profile.age} yrs · {profile.weightKg} kg
                </span>
              </div>
              <div className="rounded-lg bg-neutral-900 p-2 border border-neutral-800">
                <span className="block text-[10px] text-neutral-500">Goal</span>
                <span className="font-semibold text-white capitalize truncate block">
                  {profile.primaryGoal.replace('_', ' ')}
                </span>
              </div>
              <div className="rounded-lg bg-neutral-900 p-2 border border-neutral-800">
                <span className="block text-[10px] text-neutral-500">Session Duration</span>
                <span className="font-semibold text-white">
                  {profile.availableTimeMinutes} mins
                </span>
              </div>
              <div className="rounded-lg bg-neutral-900 p-2 border border-neutral-800">
                <span className="block text-[10px] text-neutral-500">Schedule</span>
                <span className="font-semibold text-lime-400">7 Full Days</span>
              </div>
            </div>
          </div>

          {/* Workout Intensity Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
              <span>Select Workout Intensity:</span>
              <span className="text-[11px] text-lime-400 capitalize">{selectedIntensity} Intensity</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'moderate', 'high', 'extreme'] as WorkoutIntensity[]).map((level) => {
                const isSelected = selectedIntensity === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedIntensity(level)}
                    disabled={loading}
                    className={`py-2 px-1 rounded-xl text-xs font-bold capitalize transition-all border ${
                      isSelected
                        ? 'bg-lime-400 text-neutral-950 border-lime-400 shadow-sm'
                        : 'bg-neutral-800/80 text-neutral-300 border-neutral-700/60 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Focus / Specific Goal Directives */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Specific Directives or Extra Focus (Optional):
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              disabled={loading}
              placeholder="e.g. Focus on chest hypertrophy, include mobility drills for tight hips, emphasize Dumbbells over barbells..."
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800/90 p-3 text-xs text-white placeholder:text-neutral-500 focus:border-lime-400 focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Persistent Storage Notice */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-3 flex items-center gap-2.5 text-xs text-neutral-400">
            <Cpu className="w-4 h-4 text-lime-400 shrink-0" />
            <span>
              Plan and athlete metrics will be saved to the persistent <strong>SQLite database</strong> for history and admin tracking.
            </span>
          </div>

          {/* Progress / Loading Animation */}
          {loading && (
            <div className="rounded-xl border border-lime-500/30 bg-lime-950/20 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-lime-400 animate-spin shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-lime-300">
                    {STAGES[progressStage]}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Step {progressStage + 1} of {STAGES.length}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-lime-400 transition-all duration-700 rounded-full"
                  style={{ width: `${((progressStage + 1) / STAGES.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-3 text-xs text-red-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-800 px-6 py-4 bg-neutral-950/80">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-2.5 text-xs font-bold text-neutral-950 hover:bg-lime-300 transition-colors shadow-sm shadow-lime-400/20 disabled:opacity-40 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating 7-Day Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Generate Plan with Gemini</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
