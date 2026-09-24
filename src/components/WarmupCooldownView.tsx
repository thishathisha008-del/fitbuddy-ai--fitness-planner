import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame, Sparkles, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { RoutineStep } from '../types.ts';
import { playTimerBeep, playSuccessChime } from '../utils/audioBeep.ts';

interface WarmupCooldownViewProps {
  warmUpSteps: RoutineStep[];
  coolDownSteps: RoutineStep[];
}

export const WarmupCooldownView: React.FC<WarmupCooldownViewProps> = ({
  warmUpSteps,
  coolDownSteps,
}) => {
  const [activeTab, setActiveTab] = useState<'warmup' | 'cooldown'>('warmup');
  const [selectedDrillIndex, setSelectedDrillIndex] = useState(0);

  // Drill Timer
  const [drillSeconds, setDrillSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const currentSteps = activeTab === 'warmup' ? warmUpSteps : coolDownSteps;
  const currentStep = currentSteps[selectedDrillIndex] || currentSteps[0];

  useEffect(() => {
    // Reset timer when drill changes
    setDrillSeconds(60);
    setIsTimerRunning(false);
  }, [selectedDrillIndex, activeTab]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && drillSeconds > 0) {
      interval = setInterval(() => {
        setDrillSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            playSuccessChime();
            return 0;
          }
          if (prev <= 4 && prev >= 2) {
            playTimerBeep(600, 0.1);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, drillSeconds]);

  const formatSecs = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-lime-400 uppercase tracking-wider mb-1">
            <Flame className="w-3.5 h-3.5" />
            <span>Neuromuscular Preparation & Recovery</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Dynamic Warm-up & Static Cool-down
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Increase synovial joint lubrication, activate stabilizer muscles, and accelerate parasympathetic recovery post-training.
          </p>
        </div>

        {/* Segmented Tab */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          <button
            onClick={() => {
              setActiveTab('warmup');
              setSelectedDrillIndex(0);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'warmup'
                ? 'bg-lime-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Dynamic Warm-up ({warmUpSteps.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('cooldown');
              setSelectedDrillIndex(0);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'cooldown'
                ? 'bg-lime-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Cool-down & Stretches ({coolDownSteps.length})
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Timer + Drill List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Drill Spotlight */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-4">
            <div>
              <span className="text-xs font-medium text-lime-400 uppercase tracking-wider">
                Active Protocol · Step {selectedDrillIndex + 1} of {currentSteps.length}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-display mt-0.5">
                {currentStep.name}
              </h3>
            </div>
            <div className="text-xs font-medium text-neutral-400 bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700/60">
              Prescribed: {currentStep.duration}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {currentStep.description}
          </p>

          {/* Form Cues */}
          <div className="rounded-xl bg-neutral-950/60 border border-neutral-800 p-4 space-y-2">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Execution Instructions & Form Cues
            </h4>
            <div className="space-y-1.5 text-xs text-neutral-200">
              {currentStep.cues.map((cue, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-lime-400 font-bold">›</span>
                  <span>{cue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Drill Countdown Timer Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-neutral-950 border border-neutral-800 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-800 text-lime-400 font-mono text-xl font-bold tabular-nums">
                {formatSecs(drillSeconds)}
              </div>
              <div>
                <p className="text-xs font-bold text-white">Interactive Interval Clock</p>
                <p className="text-[11px] text-neutral-400">
                  {isTimerRunning ? 'Interval counting down...' : 'Paused / Ready'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDrillSeconds(60)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 text-neutral-400 hover:text-white"
                title="Reset to 60s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-lime-300 transition-colors shadow-sm shadow-lime-400/20"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Drill Clock</span>
                  </>
                )}
              </button>

              <button
                disabled={selectedDrillIndex === currentSteps.length - 1}
                onClick={() => setSelectedDrillIndex((prev) => Math.min(currentSteps.length - 1, prev + 1))}
                className="rounded-xl bg-neutral-800 border border-neutral-700 px-3 py-2 text-xs font-semibold text-neutral-200 hover:text-white disabled:opacity-40"
              >
                Next Step
              </button>
            </div>
          </div>
        </div>

        {/* Drill Sequence List */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            {activeTab === 'warmup' ? 'Dynamic Movement Sequence' : 'Cool-down Routine'}
          </h4>

          <div className="space-y-2">
            {currentSteps.map((step, idx) => {
              const isSelected = idx === selectedDrillIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDrillIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-neutral-800/90 border-lime-400/50 shadow-sm'
                      : 'bg-neutral-950/40 border-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{step.name}</span>
                    <span className="text-[11px] text-lime-400 font-mono">{step.duration}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-1 mt-1">
                    {step.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Never bounce into static stretches; breathe smoothly into the muscle belly.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
