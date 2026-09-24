import React, { useState } from 'react';
import {
  TrendingUp,
  Flame,
  Award,
  Calendar,
  Clock,
  Dumbbell,
  Plus,
  Trash2,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { WorkoutHistoryLog, WeightLogEntry } from '../types.ts';

interface ProgressTrackerProps {
  workoutLogs: WorkoutHistoryLog[];
  weightLogs: WeightLogEntry[];
  onAddWeightLog: (entry: WeightLogEntry) => void;
  onDeleteWeightLog: (id: string) => void;
  streakCount: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  workoutLogs,
  weightLogs,
  onAddWeightLog,
  onDeleteWeightLog,
  streakCount,
}) => {
  // New Weight Input Form
  const [newWeight, setNewWeight] = useState<number>(74.0);
  const [weightNote, setWeightNote] = useState('');

  // Calculate Cumulative Metrics
  const totalWorkouts = workoutLogs.length;
  const totalMinutesTrained = workoutLogs.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

  let totalVolumeKg = 0;
  workoutLogs.forEach((log) => {
    log.exercisesCompleted.forEach((ex) => {
      ex.sets.forEach((s) => {
        totalVolumeKg += (s.weightKg || 0) * (s.repsCompleted || 0);
      });
    });
  });

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight || newWeight <= 0) return;

    const entry: WeightLogEntry = {
      id: `w-${Date.now()}`,
      date: new Date().toISOString(),
      weightKg: parseFloat(newWeight.toFixed(1)),
      notes: weightNote || undefined,
    };

    onAddWeightLog(entry);
    setWeightNote('');
  };

  // Prepare Weight Chart Coordinates (SVG)
  const sortedWeights = [...weightLogs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const minWeight = sortedWeights.length
    ? Math.min(...sortedWeights.map((w) => w.weightKg)) - 1
    : 65;
  const maxWeight = sortedWeights.length
    ? Math.max(...sortedWeights.map((w) => w.weightKg)) + 1
    : 80;

  const chartWidth = 500;
  const chartHeight = 160;

  const points = sortedWeights.map((w, idx) => {
    const x =
      sortedWeights.length > 1
        ? (idx / (sortedWeights.length - 1)) * (chartWidth - 40) + 20
        : chartWidth / 2;
    const yRatio = (w.weightKg - minWeight) / (maxWeight - minWeight || 1);
    const y = chartHeight - 25 - yRatio * (chartHeight - 50);
    return { x, y, weight: w.weightKg, date: w.date };
  });

  const pathD = points.length > 1
    ? points.reduce((acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '')
    : '';

  // Trend determination
  const firstWeight = sortedWeights[0]?.weightKg || 74;
  const latestWeight = sortedWeights[sortedWeights.length - 1]?.weightKg || 74;
  const weightDelta = parseFloat((latestWeight - firstWeight).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-lime-400 uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Biometric Analytics & Training Volume</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Athletic Progress & Consistency
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Monitor mechanical load progression, workout frequency streaks, and body composition changes.
          </p>
        </div>
      </div>

      {/* Top 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Active Streak</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-display tabular-nums">
            {streakCount} <span className="text-xs text-neutral-400 font-normal">days</span>
          </p>
          <p className="text-[11px] text-neutral-400">Consistent habit discipline</p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Workouts Done</span>
            <CheckCircle2 className="w-4 h-4 text-lime-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-lime-400 font-display tabular-nums">
            {totalWorkouts} <span className="text-xs text-neutral-400 font-normal">sessions</span>
          </p>
          <p className="text-[11px] text-neutral-400">All periodized routines</p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Total Volume Lifted</span>
            <Dumbbell className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-display tabular-nums">
            {totalVolumeKg.toLocaleString()} <span className="text-xs text-neutral-400 font-normal">kg</span>
          </p>
          <p className="text-[11px] text-neutral-400">Cumulative load tracked</p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Time Under Tension</span>
            <Clock className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-display tabular-nums">
            {totalMinutesTrained} <span className="text-xs text-neutral-400 font-normal">mins</span>
          </p>
          <p className="text-[11px] text-neutral-400">Active training duration</p>
        </div>
      </div>

      {/* Body Weight Tracking & Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Line Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
                Body Weight Trajectory
              </h3>
              <p className="text-xs text-neutral-400">
                Current:{' '}
                <strong className="text-white tabular-nums">{latestWeight} kg</strong>
                {sortedWeights.length > 1 && (
                  <span className={`ml-2 text-xs font-semibold ${weightDelta >= 0 ? 'text-lime-400' : 'text-cyan-400'}`}>
                    ({weightDelta >= 0 ? `+${weightDelta}` : weightDelta} kg overall)
                  </span>
                )}
              </p>
            </div>

            <div className="text-xs text-neutral-400">
              Range: {minWeight.toFixed(1)} - {maxWeight.toFixed(1)} kg
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full bg-neutral-950/70 border border-neutral-800/80 rounded-xl p-4 overflow-hidden">
            {points.length > 0 ? (
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-44 overflow-visible"
              >
                {/* Horizontal reference grid lines */}
                <line x1="20" y1="30" x2={chartWidth - 20} y2="30" stroke="#262626" strokeDasharray="3 3" />
                <line x1="20" y1={chartHeight / 2} x2={chartWidth - 20} y2={chartHeight / 2} stroke="#262626" strokeDasharray="3 3" />
                <line x1="20" y1={chartHeight - 30} x2={chartWidth - 20} y2={chartHeight - 30} stroke="#262626" strokeDasharray="3 3" />

                {/* Connecting Line */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#a3e635"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points */}
                {points.map((pt, pIdx) => (
                  <g key={pIdx}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4.5"
                      className="fill-neutral-950 stroke-lime-400 stroke-[2.5]"
                    />
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      className="fill-neutral-300 text-[10px] font-mono tabular-nums font-bold"
                    >
                      {pt.weight}
                    </text>
                  </g>
                ))}
              </svg>
            ) : (
              <div className="py-12 text-center text-xs text-neutral-500">
                Log your body weight to reveal trend trajectory.
              </div>
            )}
          </div>
        </div>

        {/* Log Weight Entry Form */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-lime-400 uppercase tracking-wider">
            <Plus className="w-4 h-4" />
            <span>Log Biometric Entry</span>
          </div>

          <form onSubmit={handleSaveWeight} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Body Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="35"
                max="250"
                value={newWeight}
                onChange={(e) => setNewWeight(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm font-bold text-white focus:border-lime-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Notes (Optional)
              </label>
              <input
                type="text"
                value={weightNote}
                onChange={(e) => setWeightNote(e.target.value)}
                placeholder="e.g. Fasted morning check-in"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 text-xs text-white focus:border-lime-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-lime-400 py-2.5 text-xs font-bold text-neutral-950 hover:bg-lime-300 transition-colors shadow-sm shadow-lime-400/20"
            >
              Add Weight Check-in
            </button>
          </form>

          {/* Recent Weight Entries */}
          <div className="pt-2 border-t border-neutral-800 space-y-2">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Recent Logs
            </p>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {sortedWeights.slice(-5).reverse().map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-neutral-950/50 border border-neutral-800/80"
                >
                  <div>
                    <span className="font-bold text-white tabular-nums">{entry.weightKg} kg</span>
                    <span className="text-[10px] text-neutral-500 ml-2">
                      {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteWeightLog(entry.id)}
                    className="text-neutral-500 hover:text-red-400 p-1"
                    title="Delete log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Workout Session History Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300">
            Workout Session Log History ({workoutLogs.length})
          </h3>
          <span className="text-xs text-neutral-400">Recorded sets and exertion</span>
        </div>

        {workoutLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500">
            No completed workouts logged yet. Start Day 1 to record your first workout session!
          </div>
        ) : (
          <div className="space-y-3">
            {workoutLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/70 pb-2">
                  <div>
                    <span className="text-xs font-semibold text-lime-400">
                      Day {log.dayNumber} · {log.dayTitle}
                    </span>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Completed {new Date(log.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-lg bg-neutral-800 px-2.5 py-1 text-white font-medium">
                      {log.durationMinutes} min
                    </span>
                    <span className="rounded-lg bg-neutral-800 px-2.5 py-1 text-lime-400 font-bold">
                      RPE {log.rpeRating}/10
                    </span>
                    <span className="rounded-lg bg-neutral-800 px-2.5 py-1 text-cyan-400 font-medium">
                      {log.energyLevel} Energy
                    </span>
                  </div>
                </div>

                {/* Exercises summary chips */}
                <div className="text-xs text-neutral-300 flex flex-wrap gap-2 pt-1">
                  {log.exercisesCompleted.map((ex, exIdx) => (
                    <span
                      key={exIdx}
                      className="rounded-md bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[11px] text-neutral-300"
                    >
                      {ex.exerciseName} ({ex.sets.length} sets)
                    </span>
                  ))}
                </div>

                {log.notes && (
                  <p className="text-xs text-neutral-400 italic pt-1">
                    "{log.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
