import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
  Volume2,
  VolumeX,
  X,
  Trophy,
  Dumbbell,
  Timer,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { WorkoutDay, ExerciseItem, WorkoutHistoryLog } from '../types.ts';
import { playTimerBeep, playSuccessChime } from '../utils/audioBeep.ts';

interface ActiveWorkoutPlayerProps {
  workoutDay: WorkoutDay;
  planId: string;
  onFinishWorkout: (log: WorkoutHistoryLog) => void;
  onClose: () => void;
}

interface SetLog {
  weightKg: number;
  reps: number;
  completed: boolean;
}

export const ActiveWorkoutPlayer: React.FC<ActiveWorkoutPlayerProps> = ({
  workoutDay,
  planId,
  onFinishWorkout,
  onClose,
}) => {
  // Workout Stopwatch
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Exercise Navigation
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // Rest Timer
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number | null>(null);
  const [isRestActive, setIsRestActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Per-exercise set logs: exerciseId -> array of SetLog
  const [logs, setLogs] = useState<{ [exId: string]: SetLog[] }>(() => {
    const initial: { [exId: string]: SetLog[] } = {};
    workoutDay.exercises.forEach((ex) => {
      // default 3-4 sets with default reps parsed
      const repCount = parseInt(ex.reps) || 10;
      initial[ex.id] = Array.from({ length: ex.sets }, () => ({
        weightKg: 20,
        reps: repCount,
        completed: false,
      }));
    });
    return initial;
  });

  // Finish Workout Modal State
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [rpeRating, setRpeRating] = useState(8);
  const [energyLevel, setEnergyLevel] = useState<'Low' | 'Moderate' | 'Great' | 'Peak'>('Great');
  const [workoutNotes, setWorkoutNotes] = useState('');

  // Main Workout Stopwatch Effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Rest Countdown Timer Effect
  useEffect(() => {
    let restInterval: any = null;
    if (isRestActive && restSecondsRemaining !== null && restSecondsRemaining > 0) {
      restInterval = setInterval(() => {
        setRestSecondsRemaining((prev) => {
          if (prev === null || prev <= 1) {
            setIsRestActive(false);
            if (soundEnabled) {
              playSuccessChime();
            }
            return 0;
          }
          if (soundEnabled && prev <= 4 && prev >= 2) {
            playTimerBeep(520, 0.1);
          } else if (soundEnabled && prev === 1) {
            playTimerBeep(880, 0.25);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restInterval);
  }, [isRestActive, restSecondsRemaining, soundEnabled]);

  const currentExercise: ExerciseItem =
    workoutDay.exercises[currentExerciseIndex] || workoutDay.exercises[0];
  const currentSets = logs[currentExercise.id] || [];

  const handleToggleSetComplete = (setIdx: number) => {
    setLogs((prev) => {
      const exSets = [...(prev[currentExercise.id] || [])];
      const isNowCompleted = !exSets[setIdx].completed;
      exSets[setIdx] = {
        ...exSets[setIdx],
        completed: isNowCompleted,
      };

      // Trigger Rest timer if set was completed
      if (isNowCompleted) {
        if (soundEnabled) playTimerBeep(650, 0.15);
        setRestSecondsRemaining(currentExercise.restSeconds || 60);
        setIsRestActive(true);
      }

      return { ...prev, [currentExercise.id]: exSets };
    });
  };

  const handleUpdateSetWeight = (setIdx: number, weightKg: number) => {
    setLogs((prev) => {
      const exSets = [...(prev[currentExercise.id] || [])];
      exSets[setIdx] = { ...exSets[setIdx], weightKg: Math.max(0, weightKg) };
      return { ...prev, [currentExercise.id]: exSets };
    });
  };

  const handleUpdateSetReps = (setIdx: number, reps: number) => {
    setLogs((prev) => {
      const exSets = [...(prev[currentExercise.id] || [])];
      exSets[setIdx] = { ...exSets[setIdx], reps: Math.max(1, reps) };
      return { ...prev, [currentExercise.id]: exSets };
    });
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateTotalVolume = () => {
    let volume = 0;
    Object.values(logs).forEach((sets) => {
      sets.forEach((s) => {
        if (s.completed) {
          volume += s.weightKg * s.reps;
        }
      });
    });
    return volume;
  };

  const handleCompleteWorkout = () => {
    const historyLog: WorkoutHistoryLog = {
      id: `log-${Date.now()}`,
      planId,
      dayNumber: workoutDay.dayNumber,
      dayTitle: workoutDay.title,
      date: new Date().toISOString(),
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      exercisesCompleted: workoutDay.exercises.map((ex) => ({
        exerciseName: ex.name,
        sets: (logs[ex.id] || []).map((s, idx) => ({
          setNumber: idx + 1,
          weightKg: s.weightKg,
          repsCompleted: s.reps,
        })),
      })),
      rpeRating,
      energyLevel,
      notes: workoutNotes || 'Great consistency and solid mind-muscle connection.',
    };

    if (soundEnabled) playSuccessChime();
    onFinishWorkout(historyLog);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950 text-white overflow-y-auto">
      {/* Top Player Sticky Header */}
      <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-neutral-800 bg-neutral-950/90 px-4 sm:px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-lime-400 font-semibold uppercase tracking-wider">
              <span>Day {workoutDay.dayNumber} Live Session</span>
              <span className="hidden sm:inline text-neutral-600">|</span>
              <span className="hidden sm:inline text-neutral-400">{workoutDay.focusArea}</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-[200px] sm:max-w-md">
              {workoutDay.title}
            </h2>
          </div>
        </div>

        {/* Workout Stopwatch & Rest Status */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title={soundEnabled ? 'Mute Audio Beeps' : 'Enable Audio Beeps'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-lime-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2 rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-1.5">
            <Timer className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-sm sm:text-base font-bold tabular-nums">
              {formatTimer(elapsedSeconds)}
            </span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="text-neutral-400 hover:text-white ml-1"
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>
          </div>

          <button
            onClick={() => setShowFinishModal(true)}
            className="rounded-xl bg-lime-400 px-3.5 sm:px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-lime-300 transition-colors shadow-sm"
          >
            Finish Workout
          </button>
        </div>
      </div>

      {/* Rest Timer Floating Bar (When active) */}
      {isRestActive && restSecondsRemaining !== null && (
        <div className="sticky top-16 z-20 flex items-center justify-between bg-cyan-950/90 border-b border-cyan-500/40 px-4 sm:px-8 py-2.5 backdrop-blur-md animate-pulse">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-cyan-400" />
            <span className="text-xs sm:text-sm font-semibold text-cyan-200">
              Rest Recovery Interval:
            </span>
            <span className="font-mono text-base sm:text-lg font-bold text-cyan-300 tabular-nums">
              {formatTimer(restSecondsRemaining)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRestSecondsRemaining((prev) => (prev ? prev + 30 : 30))}
              className="rounded-lg bg-cyan-900/60 px-2 py-1 text-xs font-medium text-cyan-300 hover:bg-cyan-800"
            >
              +30s
            </button>
            <button
              onClick={() => {
                setIsRestActive(false);
                setRestSecondsRemaining(0);
              }}
              className="rounded-lg bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-300 hover:text-white"
            >
              Skip Rest
            </button>
          </div>
        </div>
      )}

      {/* Main Workout Content Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Exercise Carousel Navigation */}
        <div className="flex items-center justify-between rounded-xl bg-neutral-900/60 border border-neutral-800 p-2 text-xs">
          <button
            disabled={currentExerciseIndex === 0}
            onClick={() => setCurrentExerciseIndex((prev) => Math.max(0, prev - 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-neutral-300 hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <span className="font-semibold text-neutral-400">
            Exercise <span className="text-lime-400">{currentExerciseIndex + 1}</span> of{' '}
            {workoutDay.exercises.length}
          </span>

          <button
            disabled={currentExerciseIndex === workoutDay.exercises.length - 1}
            onClick={() =>
              setCurrentExerciseIndex((prev) => Math.min(workoutDay.exercises.length - 1, prev + 1))
            }
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-neutral-300 hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Current Active Exercise Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-5 sm:p-7 space-y-6 shadow-xl">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 mb-2">
              <span className="font-semibold text-lime-400">{currentExercise.equipment}</span>
              <span aria-hidden="true">·</span>
              <span>{currentExercise.targetMuscles.join(', ')}</span>
              {currentExercise.tempo && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-neutral-300">Tempo: {currentExercise.tempo}</span>
                </>
              )}
            </div>

            <h3 className="text-xl sm:text-3xl font-extrabold text-white font-display">
              {currentExercise.name}
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-neutral-300">
              Prescription: <strong className="text-white">{currentExercise.sets} Sets</strong> of{' '}
              <strong className="text-white">{currentExercise.reps}</strong> · {currentExercise.restSeconds}s rest
            </p>
          </div>

          {/* Form Cues Callout */}
          <div className="rounded-xl bg-neutral-950/70 border border-neutral-800/80 p-4 space-y-2">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Technique & Biomechanical Cues
            </h4>
            <div className="space-y-1.5 text-xs text-neutral-200">
              {currentExercise.formCues.map((cue, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-lime-400 font-bold">›</span>
                  <span>{cue}</span>
                </div>
              ))}
            </div>

            {currentExercise.safetyWarning && (
              <div className="mt-2 pt-2 border-t border-neutral-800 flex items-start gap-2 text-xs text-amber-400">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{currentExercise.safetyWarning}</span>
              </div>
            )}
          </div>

          {/* Sets Logger Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider px-2">
              <span>Set</span>
              <span>Weight (kg)</span>
              <span>Reps</span>
              <span>Done</span>
            </div>

            <div className="space-y-2">
              {currentSets.map((set, sIdx) => {
                return (
                  <div
                    key={sIdx}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                      set.completed
                        ? 'bg-lime-950/20 border-lime-500/40'
                        : 'bg-neutral-950/50 border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800 text-xs font-bold text-neutral-200">
                        {sIdx + 1}
                      </span>
                    </div>

                    {/* Weight Input */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={set.weightKg}
                        onChange={(e) => handleUpdateSetWeight(sIdx, parseFloat(e.target.value) || 0)}
                        className="w-16 rounded-lg border border-neutral-700 bg-neutral-800 px-2 py-1 text-center text-sm font-bold text-white focus:border-lime-400 focus:outline-none"
                      />
                      <span className="text-xs text-neutral-400">kg</span>
                    </div>

                    {/* Reps Input */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        value={set.reps}
                        onChange={(e) => handleUpdateSetReps(sIdx, parseInt(e.target.value) || 1)}
                        className="w-16 rounded-lg border border-neutral-700 bg-neutral-800 px-2 py-1 text-center text-sm font-bold text-white focus:border-lime-400 focus:outline-none"
                      />
                      <span className="text-xs text-neutral-400">reps</span>
                    </div>

                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleSetComplete(sIdx)}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                        set.completed
                          ? 'bg-lime-400 text-neutral-950 border-lime-400 shadow-sm shadow-lime-400/30'
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:border-lime-400 hover:text-white'
                      }`}
                    >
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Step Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
            <button
              onClick={() => {
                if (currentExerciseIndex < workoutDay.exercises.length - 1) {
                  setCurrentExerciseIndex((prev) => prev + 1);
                } else {
                  setShowFinishModal(true);
                }
              }}
              className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3 text-xs font-bold text-neutral-950 hover:bg-lime-300 transition-colors shadow-sm"
            >
              <span>
                {currentExerciseIndex < workoutDay.exercises.length - 1
                  ? 'Proceed to Next Exercise'
                  : 'Review & Complete Workout'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/20 text-lime-400">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                Workout Session Complete!
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400">
                Outstanding work conquering Day {workoutDay.dayNumber}: {workoutDay.title}
              </p>
            </div>

            {/* Metrics summary */}
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-neutral-800 bg-neutral-950/70 p-4 text-center">
              <div>
                <p className="text-xs text-neutral-500 font-medium">Duration</p>
                <p className="text-lg font-bold text-white tabular-nums">
                  {Math.round(elapsedSeconds / 60)} mins
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">Estimated Volume</p>
                <p className="text-lg font-bold text-lime-400 tabular-nums">
                  {calculateTotalVolume().toLocaleString()} kg
                </p>
              </div>
            </div>

            {/* RPE Exertion Selector */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="font-semibold text-neutral-300">Rate of Perceived Exertion (RPE):</label>
                <span className="font-bold text-lime-400">{rpeRating} / 10</span>
              </div>
              <input
                type="range"
                min="5"
                max="10"
                step="0.5"
                value={rpeRating}
                onChange={(e) => setRpeRating(parseFloat(e.target.value))}
                className="w-full accent-lime-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                <span>RPE 5 (Light warmup)</span>
                <span>RPE 8 (2 reps reserve)</span>
                <span>RPE 10 (Max failure)</span>
              </div>
            </div>

            {/* Energy Level */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Overall Energy Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Low', 'Moderate', 'Great', 'Peak'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEnergyLevel(lvl)}
                    className={`py-2 rounded-lg text-xs font-medium border transition-colors ${
                      energyLevel === lvl
                        ? 'bg-lime-400 text-neutral-950 border-lime-400 font-bold'
                        : 'bg-neutral-800/80 text-neutral-400 border-neutral-700 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Workout Reflection Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                placeholder="e.g. Great shoulder stability, felt strong on bench press..."
                className="w-full rounded-xl border border-neutral-700 bg-neutral-800/80 p-3 text-xs text-white focus:border-lime-400 focus:outline-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setShowFinishModal(false)}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white"
              >
                Back to Player
              </button>
              <button
                onClick={handleCompleteWorkout}
                className="flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-2.5 text-xs font-bold text-neutral-950 hover:bg-lime-300 shadow-md shadow-lime-400/20"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save to History & Log Streak</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
