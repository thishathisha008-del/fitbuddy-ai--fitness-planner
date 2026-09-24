import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, Loader2, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { FitnessPlan, UserProfile } from '../types.ts';

interface FeedbackUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: FitnessPlan;
  profile: UserProfile;
  onPlanUpdated: (updatedPlan: FitnessPlan) => void;
}

const FEEDBACK_SUGGESTIONS = [
  'Add more cardio',
  'Include more rest days',
  'Add yoga',
  'Day 2 squats caused mild knee discomfort; please substitute with knee-friendly movements.',
  'Workouts feel slightly too long; reduce daily sessions to 35-40 minutes.',
  'Increase upper body push/chest volume and add an extra drop-set.',
  'Lower the workout intensity from High to Moderate for better recovery.',
];

export const FeedbackUpdateModal: React.FC<FeedbackUpdateModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  profile,
  onPlanUpdated,
}) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [satisfactionRating, setSatisfactionRating] = useState<number>(4);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyFeedback = async () => {
    if (!feedbackText.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/update-plan-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: currentPlan.id,
          userId: profile.id,
          feedbackText: feedbackText.trim(),
          currentPlan,
          userProfile: profile,
          rating: satisfactionRating,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with code ${res.status}`);
      }

      const updatedPlan: FitnessPlan = await res.json();
      onPlanUpdated(updatedPlan);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update plan. Please verify connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 text-neutral-950 font-bold shadow-sm shadow-lime-400/20">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Update 7-Day Plan via Feedback
              </h2>
              <p className="text-xs text-neutral-400">
                Gemini AI will refine your plan and create Version {(currentPlan.version || 1) + 1}
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

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Current plan context banner */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 flex items-center justify-between text-xs">
            <div>
              <span className="text-neutral-500">Active Program:</span>{' '}
              <span className="font-semibold text-white">{currentPlan.planTitle}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="rounded bg-neutral-800 px-2 py-0.5 font-bold text-lime-400">
                v{currentPlan.version || 1}
              </span>
              <span className="text-neutral-500">
                {currentPlan.isOriginal ? '(Original)' : '(Updated)'}
              </span>
            </div>
          </div>

          {/* Feedback Text Input */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              What would you like to adjust or improve in your 7-day routine?
            </label>
            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              disabled={loading}
              placeholder="e.g. Day 2 leg workout felt too taxing on my lower back, please substitute barbell squats with goblet squats. Also add more triceps work on Day 1..."
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800/90 p-3.5 text-xs text-white placeholder:text-neutral-500 focus:border-lime-400 focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Quick Click Suggestions */}
          <div>
            <span className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Common Feedback Adjustments:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {FEEDBACK_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFeedbackText(item)}
                  disabled={loading}
                  className="rounded-lg bg-neutral-800/80 border border-neutral-700/60 px-2.5 py-1.5 text-[11px] text-neutral-300 hover:text-white hover:border-lime-400/50 hover:bg-neutral-800 transition-colors text-left"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>

          {/* Satisfaction Rating */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
            <span className="font-medium text-neutral-400">Rate your current satisfaction (1-5):</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSatisfactionRating(star)}
                  className={`h-7 w-7 rounded-lg font-bold transition-all ${
                    satisfactionRating >= star
                      ? 'bg-lime-400 text-neutral-950 shadow-sm'
                      : 'bg-neutral-800 text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>

          {/* Loading status */}
          {loading && (
            <div className="rounded-xl border border-lime-500/30 bg-lime-950/20 p-4 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-lime-400 animate-spin shrink-0" />
              <div>
                <p className="text-xs font-semibold text-lime-300">
                  Google Gemini AI is regenerating your 7-day program...
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Recalibrating volume, updating exercises, and generating changelog.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-3 text-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
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
            onClick={handleApplyFeedback}
            disabled={!feedbackText.trim() || loading}
            className="flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-2.5 text-xs font-bold text-neutral-950 hover:bg-lime-300 transition-colors shadow-sm shadow-lime-400/20 disabled:opacity-40 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Applying Changes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Generate Updated Plan v{(currentPlan.version || 1) + 1}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
