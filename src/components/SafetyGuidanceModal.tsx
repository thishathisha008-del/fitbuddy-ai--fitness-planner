import React from 'react';
import { X, ShieldCheck, AlertTriangle, Activity, Heart, CheckCircle2 } from 'lucide-react';
import { SafetyGuideline } from '../types.ts';

interface SafetyGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  guidelines: SafetyGuideline[];
}

export const SafetyGuidanceModal: React.FC<SafetyGuidanceModalProps> = ({
  isOpen,
  onClose,
  guidelines,
}) => {
  if (!isOpen) return null;

  const RPE_CHART = [
    {
      rpe: '10',
      rir: '0 RIR',
      label: 'Max Effort',
      desc: 'No repetitions left in reserve. Reached true failure with maximum struggle.',
      color: 'text-red-400 bg-red-950/40 border-red-500/30',
    },
    {
      rpe: '9',
      rir: '1 RIR',
      label: 'Very Heavy',
      desc: 'Could perform exactly 1 more rep with proper technique before failure.',
      color: 'text-orange-400 bg-orange-950/40 border-orange-500/30',
    },
    {
      rpe: '8',
      rir: '2 RIR',
      label: 'Hypertrophy Sweet Spot',
      desc: 'Could perform 2 more clean reps. Ideal working set zone for muscle growth with safe joint stress.',
      color: 'text-lime-400 bg-lime-950/40 border-lime-500/30',
    },
    {
      rpe: '7',
      rir: '3 RIR',
      label: 'Moderate Heavy',
      desc: 'Bar moves with good velocity. Could perform 3 more reps without breakdown.',
      color: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
    },
    {
      rpe: '5-6',
      rir: '4-5 RIR',
      label: 'Warm-up / Light Technique',
      desc: 'Effortless control, focusing strictly on movement groove and neuromuscular firing.',
      color: 'text-neutral-400 bg-neutral-800/40 border-neutral-700/30',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-800 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Fitness Safety & Injury Prevention</h2>
              <p className="text-xs text-neutral-400">Biomechanics, RPE intensity guide, and joint longevity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-neutral-200">
          {/* Active Plan Safety Rules */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
              Plan-Specific Safety Precautions
            </h3>
            <div className="space-y-2.5">
              {guidelines.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{item.topic}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        item.importance === 'Injury Prevention'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                          : 'bg-lime-950/60 text-lime-300 border border-lime-500/30'
                      }`}
                    >
                      {item.importance}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed pt-1">
                    {item.guideline}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RPE & RIR Visual Explainer */}
          <div className="pt-4 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Rate of Perceived Exertion (RPE) & Reps in Reserve (RIR)
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mb-3">
              Training to failure on every set causes disproportionate central nervous system fatigue without added hypertrophy. Keep 1-2 reps in reserve for optimum long-term gains.
            </p>

            <div className="space-y-2">
              {RPE_CHART.map((level, lIdx) => (
                <div
                  key={lIdx}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${level.color}`}
                >
                  <div className="text-center shrink-0 w-12">
                    <span className="font-mono text-sm font-extrabold block">RPE {level.rpe}</span>
                    <span className="text-[10px] opacity-80 block">{level.rir}</span>
                  </div>
                  <div>
                    <p className="font-bold text-xs">{level.label}</p>
                    <p className="text-[11px] opacity-90 mt-0.5 leading-snug">{level.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Muscle Burn vs Joint Pain */}
          <div className="pt-4 border-t border-neutral-800">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Good Muscle Burn vs. Warning Pain (Red Flags)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-lime-950/20 border border-lime-500/30 p-3 space-y-1.5">
                <span className="font-bold text-lime-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Productive Muscle Fatigue
                </span>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Symmetrical dull ache across the meat of the muscle belly, feeling of tight blood flow ("the pump"), subsides shortly after ending the set.
                </p>
              </div>

              <div className="rounded-xl bg-red-950/20 border border-red-500/30 p-3 space-y-1.5">
                <span className="font-bold text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Red Flag Joint Warning
                </span>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  Sharp pinching inside shoulder, knee, or lower back, numbness or radiating tingling down limbs, asymmetric shooting pain. Stop immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-neutral-800 px-6 py-4 bg-neutral-950/80">
          <button
            onClick={onClose}
            className="rounded-xl bg-neutral-800 px-5 py-2 text-xs font-semibold text-white hover:bg-neutral-700 transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
