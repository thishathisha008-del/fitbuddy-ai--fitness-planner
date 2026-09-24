import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Play,
  Flame,
  Clock,
  Sparkles,
  Dumbbell,
  ShieldCheck,
} from 'lucide-react';
import { FitnessPlan, WorkoutDay, WorkoutHistoryLog } from '../types.ts';

interface WorkoutCalendarProps {
  plan: FitnessPlan;
  workoutLogs: WorkoutHistoryLog[];
  onStartWorkout: (day: WorkoutDay) => void;
}

export const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({
  plan,
  workoutLogs,
  onStartWorkout,
}) => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [selectedDayObj, setSelectedDayObj] = useState<{
    date: Date;
    workoutDay: WorkoutDay | null;
    log: WorkoutHistoryLog | null;
  } | null>(null);

  // Generate 7 days for the current displayed week
  const today = new Date();
  const startOfWeek = new Date(today);
  const currentDayOfWeek = (today.getDay() + 6) % 7; // Monday = 0, Sunday = 6
  startOfWeek.setDate(today.getDate() - currentDayOfWeek + currentWeekOffset * 7);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });

    // Match with plan days (either by preferred day name e.g. "Monday" or modulo)
    const matchingWorkoutDay =
      plan.days.find(
        (wd) =>
          wd.dayName.toLowerCase().includes(dayName.toLowerCase()) ||
          (plan.userProfileSnapshot?.preferredDays || []).some(
            (pd) => pd.toLowerCase() === dayName.toLowerCase() && wd.dayNumber === (i % plan.days.length) + 1
          )
      ) || (plan.days[i % plan.days.length] && (plan.userProfileSnapshot?.preferredDays || []).includes(dayName) ? plan.days[i % plan.days.length] : null);

    // Match with logged history
    const dStr = d.toISOString().split('T')[0];
    const matchingLog = workoutLogs.find((l) => l.date.startsWith(dStr)) || null;

    return {
      date: d,
      dayName,
      shortDay: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      isToday: d.toDateString() === today.toDateString(),
      workoutDay: matchingWorkoutDay,
      log: matchingLog,
    };
  });

  const activeSelected = selectedDayObj || {
    date: today,
    workoutDay: weekDays.find((wd) => wd.isToday)?.workoutDay || plan.days[0],
    log: weekDays.find((wd) => wd.isToday)?.log || null,
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-lime-400 uppercase tracking-wider mb-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Weekly Training Periodization</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Interactive Workout Calendar
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Track planned training splits, active rest days, and completed session history across the week.
          </p>
        </div>

        {/* Week Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentWeekOffset(0)}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            {currentWeekOffset === 0 ? 'Current Week' : 'Jump to Today'}
          </button>

          <button
            onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {weekDays.map((item, idx) => {
          const isSelected = activeSelected.date.toDateString() === item.date.toDateString();
          const hasWorkout = Boolean(item.workoutDay);
          const isCompleted = Boolean(item.log);

          return (
            <button
              key={idx}
              onClick={() =>
                setSelectedDayObj({
                  date: item.date,
                  workoutDay: item.workoutDay,
                  log: item.log,
                })
              }
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[120px] ${
                isSelected
                  ? 'border-lime-400 bg-neutral-900 shadow-md shadow-lime-400/10 ring-1 ring-lime-400/40'
                  : 'border-neutral-800/80 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-900/80'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400">{item.shortDay}</span>
                <span
                  className={`text-sm font-extrabold tabular-nums rounded-md px-1.5 py-0.5 ${
                    item.isToday
                      ? 'bg-lime-400 text-neutral-950'
                      : 'text-neutral-200'
                  }`}
                >
                  {item.dayNumber}
                </span>
              </div>

              {/* Status Indicator */}
              <div className="mt-2 space-y-1">
                {isCompleted ? (
                  <div className="flex items-center gap-1.5 text-xs text-lime-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="truncate">Done</span>
                  </div>
                ) : hasWorkout ? (
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[11px] text-lime-400 font-bold truncate">
                      <Dumbbell className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.workoutDay?.dayName.split('-')[0].trim()}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 line-clamp-1">
                      {item.workoutDay?.focusArea}
                    </p>
                  </div>
                ) : (
                  <div className="text-[11px] text-neutral-500 font-medium">
                    Active Recovery
                  </div>
                )}
              </div>

              {/* Bottom Dot */}
              <div className="mt-2 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px]">
                {hasWorkout ? (
                  <span className="text-neutral-400 font-medium">
                    {item.workoutDay?.estimatedDurationMinutes}m
                  </span>
                ) : (
                  <span className="text-neutral-500">Rest</span>
                )}
                {isCompleted && (
                  <span className="text-lime-400 font-bold">Logged</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Detailed Drawer / Spotlight */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
          <div>
            <span className="text-xs text-lime-400 font-semibold uppercase tracking-wider">
              {activeSelected.date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <h3 className="text-xl font-bold text-white font-display mt-0.5">
              {activeSelected.workoutDay
                ? activeSelected.workoutDay.title
                : 'Active Recovery & Mobility Day'}
            </h3>
          </div>

          {activeSelected.workoutDay && (
            <button
              onClick={() => onStartWorkout(activeSelected.workoutDay!)}
              className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-2.5 text-xs font-bold text-neutral-950 hover:bg-lime-300 transition-colors shadow-sm shadow-lime-400/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Day {activeSelected.workoutDay.dayNumber} Session</span>
            </button>
          )}
        </div>

        {activeSelected.log ? (
          <div className="rounded-xl border border-lime-500/30 bg-lime-950/20 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-lime-400 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Session Completed & Recorded in History</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-neutral-400">Duration:</span>{' '}
                <span className="text-white font-bold">{activeSelected.log.durationMinutes} mins</span>
              </div>
              <div>
                <span className="text-neutral-400">Exertion:</span>{' '}
                <span className="text-lime-400 font-bold">RPE {activeSelected.log.rpeRating}/10</span>
              </div>
              <div>
                <span className="text-neutral-400">Energy:</span>{' '}
                <span className="text-white font-bold">{activeSelected.log.energyLevel}</span>
              </div>
              <div>
                <span className="text-neutral-400">Exercises:</span>{' '}
                <span className="text-white font-bold">{activeSelected.log.exercisesCompleted.length} movements</span>
              </div>
            </div>
            {activeSelected.log.notes && (
              <p className="text-xs text-neutral-300 italic border-l-2 border-lime-400 pl-2">
                "{activeSelected.log.notes}"
              </p>
            )}
          </div>
        ) : activeSelected.workoutDay ? (
          <div className="space-y-3">
            <p className="text-xs sm:text-sm text-neutral-300">
              Focus Area: <strong className="text-white">{activeSelected.workoutDay.focusArea}</strong> ·{' '}
              {activeSelected.workoutDay.estimatedDurationMinutes} minutes · Difficulty:{' '}
              <strong className="text-amber-400">{activeSelected.workoutDay.difficulty}</strong>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
              {activeSelected.workoutDay.exercises.map((ex, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-neutral-950/60 border border-neutral-800/80 p-3 text-xs space-y-1"
                >
                  <p className="font-bold text-white truncate">{ex.name}</p>
                  <p className="text-neutral-400 text-[11px]">
                    {ex.sets} sets × {ex.reps} · {ex.restSeconds}s rest
                  </p>
                  <p className="text-[10px] text-lime-400">{ex.equipment}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-neutral-950/60 border border-neutral-800 p-5 space-y-2 text-xs text-neutral-300">
            <p className="font-semibold text-white">Recommended Active Recovery Protocol:</p>
            <p className="leading-relaxed">
              Take a brisk 30-45 minute outdoor walk, perform 15 minutes of light foam rolling and hip mobility stretches, drink 3+ liters of water with electrolytes, and prioritize 8 hours of restorative sleep.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
