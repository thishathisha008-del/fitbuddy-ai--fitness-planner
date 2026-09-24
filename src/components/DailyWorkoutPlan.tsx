import React, { useState } from 'react';
import {
  Play,
  Clock,
  Flame,
  Dumbbell,
  ShieldAlert,
  ChevronRight,
  RefreshCw,
  Info,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Apple,
  MessageSquarePlus,
  Layers,
  HeartPulse,
} from 'lucide-react';
import { FitnessPlan, WorkoutDay, ExerciseItem } from '../types.ts';
import strengthImg from '../assets/images/workout_strength_dumbbells_1790240010402.jpg';

interface DailyWorkoutPlanProps {
  plan: FitnessPlan;
  selectedDayIndex: number;
  onSelectDayIndex: (index: number) => void;
  onStartWorkout: (day: WorkoutDay) => void;
  onAskCoachAboutExercise: (exerciseName: string) => void;
  onOpenSafety: () => void;
  onOpenFeedbackModal?: () => void;
}

export const DailyWorkoutPlan: React.FC<DailyWorkoutPlanProps> = ({
  plan,
  selectedDayIndex,
  onSelectDayIndex,
  onStartWorkout,
  onAskCoachAboutExercise,
  onOpenSafety,
  onOpenFeedbackModal,
}) => {
  const [activeExerciseSub, setActiveExerciseSub] = useState<string | null>(null);
  const currentDay = plan.days[selectedDayIndex] || plan.days[0];

  if (!currentDay) {
    return (
      <div className="p-8 text-center text-neutral-400">
        <p>No workout days available in this plan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Section Header & Day Selector */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1.5 text-lime-400">
              <Dumbbell className="w-3.5 h-3.5" />
              7-Day Structured Program
            </span>
            <span className="text-neutral-600">·</span>
            <span className="rounded bg-neutral-800 px-2 py-0.5 text-lime-400 font-bold text-[10px]">
              Version {plan.version || 1} {plan.isOriginal ? '(Original)' : '(Updated via Feedback)'}
            </span>
            <span className="rounded bg-neutral-800/80 px-2 py-0.5 text-neutral-300 font-bold text-[10px] capitalize">
              {plan.workoutIntensity || 'moderate'} Intensity
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            {plan.planTitle}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            {plan.tagline}
          </p>
        </div>

        {/* Action Buttons: Launch Player & Update via Feedback */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onOpenFeedbackModal && (
            <button
              onClick={onOpenFeedbackModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 border border-neutral-700/80 px-4 py-3 text-xs sm:text-sm font-semibold text-neutral-200 hover:text-white hover:bg-neutral-800 active:scale-95 transition-all whitespace-nowrap"
            >
              <RefreshCw className="w-4 h-4 text-lime-400" />
              <span>Update Plan</span>
            </button>
          )}

          <button
            onClick={() => onStartWorkout(currentDay)}
            className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-lime-400 px-5 py-3 text-xs sm:text-sm font-bold text-neutral-950 shadow-md shadow-lime-400/20 hover:bg-lime-300 active:scale-95 transition-all whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Day {currentDay.dayNumber} Player</span>
          </button>
        </div>
      </div>

      {/* Quick Nutrition & Recovery Tip (Powered by Gemini Flash) */}
      {plan.quickNutritionRecoveryTip && (
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Nutrition & Recovery Tip
                </span>
                <span className="rounded bg-cyan-950/80 px-1.5 py-0.5 text-[9px] text-cyan-300 font-bold border border-cyan-800">
                  Gemini Flash
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 mt-1 leading-relaxed">
                {plan.quickNutritionRecoveryTip}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Feedback Bar with requested presets: Add more cardio, Include more rest days, Add yoga */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-lime-400/20 text-lime-400">
              <RefreshCw className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Feedback & Plan Adaptation
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Submit feedback to refine this plan with Gemini Pro and generate Version {(plan.version || 1) + 1}.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1.5">
            {['Add more cardio', 'Include more rest days', 'Add yoga'].map((chip) => (
              <button
                key={chip}
                onClick={onOpenFeedbackModal}
                className="rounded-lg bg-neutral-800 hover:bg-lime-400 hover:text-neutral-950 border border-neutral-700/80 px-3 py-1 text-xs font-medium text-neutral-300 transition-colors"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {onOpenFeedbackModal && (
          <button
            onClick={onOpenFeedbackModal}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:border-lime-400 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:text-lime-400 transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4 text-lime-400" />
            <span>Customize Feedback</span>
          </button>
        )}
      </div>

      {/* 7-Day Selector Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Select Training Day (7-Day Microcycle)
          </span>
          <span className="text-[11px] text-neutral-500">
            {plan.days.length} Total Days Scheduled
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {plan.days.map((day, idx) => {
            const isSelected = idx === selectedDayIndex;
            return (
              <button
                key={day.dayNumber}
                onClick={() => {
                  onSelectDayIndex(idx);
                  setActiveExerciseSub(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-neutral-800 text-lime-400 border border-neutral-700 shadow-sm'
                    : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 border border-neutral-800/70'
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    isSelected ? 'bg-lime-400 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {day.dayNumber}
                </span>
                <span>Day {day.dayNumber}</span>
                {day.isRestDay && (
                  <span className="text-[9px] font-bold uppercase rounded bg-neutral-950 px-1 py-0.2 text-cyan-400 border border-cyan-800/40">
                    Rest
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Meta Card with Visual Image */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 sm:p-6 overflow-hidden relative">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
            <span className="font-semibold text-lime-400">Day {currentDay.dayNumber}</span>
            <span aria-hidden="true">·</span>
            <span>{currentDay.focusArea}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-neutral-300">
              <Clock className="w-3 h-3 text-cyan-400" />
              {currentDay.estimatedDurationMinutes} minutes
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400 font-medium">{currentDay.difficulty}</span>
            {currentDay.isRestDay && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-cyan-400 font-semibold">Active Recovery</span>
              </>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
            {currentDay.title}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Targeting key adaptations across {currentDay.focusArea}. Follow the recommended eccentric tempo (e.g. 3-0-1-0) to maximize muscular tension while keeping joint stress minimal.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-800/70 px-3 py-1.5 rounded-lg border border-neutral-700/60">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>{currentDay.exercises.length} Movements</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-800/70 px-3 py-1.5 rounded-lg border border-neutral-700/60">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentDay.warmUp?.length || 2} Dynamic Warm-ups</span>
            </div>
          </div>
        </div>

        {/* Visual Gym Thumbnail */}
        <div className="relative rounded-xl overflow-hidden border border-neutral-800 h-40 lg:h-auto min-h-[140px]">
          <img
            src={strengthImg}
            alt="Gym dumbbells and conditioning equipment"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-90 hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-[11px] text-neutral-300 font-medium flex items-center justify-between">
            <span>Equipment Calibrated</span>
            <span className="text-lime-400 font-semibold">{currentDay.exercises[0]?.equipment || 'Dumbbells / Bodyweight'}</span>
          </div>
        </div>
      </div>

      {/* Exercises Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">
            Exercises & Prescriptions ({currentDay.exercises.length})
          </h4>
          <span className="text-xs text-neutral-400">Tap substitute for joint-safe alternatives</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {currentDay.exercises.map((exercise, index) => {
            const isSubOpen = activeExerciseSub === exercise.id;

            return (
              <div
                key={exercise.id || index}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 transition-colors hover:border-neutral-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-xs font-bold text-lime-400 tabular-nums border border-neutral-700">
                      {index + 1}
                    </span>
                    <div>
                      <h5 className="text-base font-bold text-white tracking-tight">
                        {exercise.name}
                      </h5>
                      {/* Unboxed Metadata with Typographic Separators */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-400 mt-1">
                        <span>{exercise.equipment}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-neutral-300">{exercise.targetMuscles.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sets, Reps, Rest Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div className="rounded-lg bg-neutral-800/80 px-2.5 py-1 text-neutral-200 font-medium border border-neutral-700/60">
                      <span className="text-neutral-400">Sets:</span>{' '}
                      <span className="font-bold text-lime-400">{exercise.sets}</span>
                    </div>
                    <div className="rounded-lg bg-neutral-800/80 px-2.5 py-1 text-neutral-200 font-medium border border-neutral-700/60">
                      <span className="text-neutral-400">Reps:</span>{' '}
                      <span className="font-bold text-white">{exercise.reps}</span>
                    </div>
                    <div className="rounded-lg bg-neutral-800/80 px-2.5 py-1 text-neutral-200 font-medium border border-neutral-700/60">
                      <span className="text-neutral-400">Rest:</span>{' '}
                      <span className="font-bold text-cyan-400">{exercise.restSeconds}s</span>
                    </div>
                    {exercise.tempo && (
                      <div className="rounded-lg bg-neutral-800/80 px-2.5 py-1 text-neutral-200 font-medium border border-neutral-700/60">
                        <span className="text-neutral-400">Tempo:</span>{' '}
                        <span className="font-bold text-amber-400">{exercise.tempo}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Cues */}
                <div className="mt-4 rounded-xl border border-neutral-800/90 bg-neutral-950/50 p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Biomechanics & Form Execution:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-neutral-400 pl-1">
                    {exercise.formCues.map((cue, cIdx) => (
                      <li key={cIdx} className="leading-relaxed">
                        {cue}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Safety Warning if present */}
                {exercise.safetyWarning && (
                  <div className="mt-3 flex items-start gap-2 text-xs text-amber-300/90 bg-amber-950/20 border border-amber-500/20 rounded-xl p-3">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                    <span>{exercise.safetyWarning}</span>
                  </div>
                )}

                {/* Bottom Action Strip */}
                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setActiveExerciseSub(isSubOpen ? null : exercise.id)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg text-neutral-300 hover:text-white px-2.5 py-1.5 hover:bg-neutral-800 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{isSubOpen ? 'Hide Alternatives' : 'View Alternatives'}</span>
                    </button>

                    <button
                      onClick={() => onAskCoachAboutExercise(exercise.name)}
                      className="inline-flex items-center gap-1.5 rounded-lg text-lime-400 hover:text-lime-300 px-2.5 py-1.5 hover:bg-lime-950/30 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ask AI Coach</span>
                    </button>
                  </div>

                  <button
                    onClick={onOpenSafety}
                    className="text-neutral-500 hover:text-neutral-300 text-[11px] underline underline-offset-2"
                  >
                    View RPE / Safety Guidelines
                  </button>
                </div>

                {/* Exercise Alternatives Drawer */}
                {isSubOpen && (
                  <div className="mt-3 pt-3 border-t border-neutral-800/60 rounded-xl bg-neutral-950/70 p-3.5 space-y-2">
                    <div className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Joint-Friendly Substitutions:</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {exercise.substitutions.map((sub, sIdx) => (
                        <div
                          key={sIdx}
                          className="rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-700 transition-colors"
                        >
                          <span className="font-medium text-white">{sub}</span>
                        </div>
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
