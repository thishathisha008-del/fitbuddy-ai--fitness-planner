import React from 'react';
import { Play, Sparkles, Flame, Shield, ArrowRight, Clock, Target, CalendarDays, RefreshCw, Apple } from 'lucide-react';
import { FitnessPlan, UserProfile } from '../types.ts';
import heroAthleteImg from '../assets/images/hero_workout_athlete_1790239990375.jpg';

interface HeroBannerProps {
  plan: FitnessPlan;
  profile: UserProfile;
  onStartTodayWorkout: () => void;
  onOpenGenerator: () => void;
  onOpenSafety: () => void;
  onOpenFeedbackModal?: () => void;
  streakCount: number;
  totalWorkoutsCompleted: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  plan,
  profile,
  onStartTodayWorkout,
  onOpenGenerator,
  onOpenSafety,
  onOpenFeedbackModal,
  streakCount,
  totalWorkoutsCompleted,
}) => {
  const currentDay = plan.days[0] || null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/60 shadow-xl">
      {/* Background Image with Scrim Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroAthleteImg}
          alt="Athlete training with focus in modern fitness facility"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-30 mix-blend-luminosity brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12">
        <div className="max-w-3xl">
          {/* Metadata line (unboxed, clean typographic separators) */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-400 mb-3">
            <span className="text-lime-400 font-semibold">{profile.name}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{profile.fitnessLevel}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{profile.primaryGoal.replace('_', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span className="rounded bg-neutral-800 px-2 py-0.5 text-lime-400 font-bold text-[10px]">
              v{plan.version || 1} {plan.isOriginal ? 'Original' : 'Updated'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="capitalize text-neutral-300 font-semibold">
              {plan.workoutIntensity || 'moderate'} Intensity
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display text-balance leading-tight">
            {plan.planTitle}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl font-normal">
            {plan.planOverview}
          </p>

          {/* Gemini Flash Nutrition & Recovery Highlight */}
          {plan.quickNutritionRecoveryTip && (
            <div className="mt-4 rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-3.5 flex items-start gap-2.5 text-xs text-cyan-200 max-w-2xl">
              <Apple className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-cyan-300 uppercase tracking-wide text-[10px] block mb-0.5">
                  Gemini Flash Nutrition & Recovery Tip
                </span>
                <span>{plan.quickNutritionRecoveryTip}</span>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-400 border-l-2 border-lime-400/80 pl-3">
            <div>
              <span className="text-neutral-500">Weekly Focus:</span>{' '}
              <span className="text-neutral-200 font-medium">{plan.weeklyFocus}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onStartTodayWorkout}
              className="inline-flex items-center gap-2.5 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-neutral-950 shadow-md shadow-lime-400/20 transition-all hover:bg-lime-300 active:scale-95 whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Day 1: {currentDay ? currentDay.title : 'Workout'}</span>
            </button>

            {onOpenFeedbackModal && (
              <button
                onClick={onOpenFeedbackModal}
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 border border-neutral-700/80 px-4 py-3 text-xs sm:text-sm font-semibold text-neutral-200 hover:text-white hover:bg-neutral-800 transition-all active:scale-95 whitespace-nowrap"
              >
                <RefreshCw className="w-4 h-4 text-lime-400" />
                <span>Give Feedback & Update</span>
              </button>
            )}

            <button
              onClick={onOpenGenerator}
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-800/90 border border-neutral-700/80 px-4 py-3 text-xs sm:text-sm font-semibold text-neutral-200 hover:text-white hover:bg-neutral-800 hover:border-neutral-600 transition-all active:scale-95 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-lime-400" />
              <span>Regenerate with Gemini AI</span>
            </button>

            <button
              onClick={onOpenSafety}
              className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-3 text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Safety Rules</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-8 pt-6 border-t border-neutral-800/70 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Streak</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">
              {streakCount} <span className="text-xs text-neutral-400 font-normal">days</span>
            </p>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Target className="w-3.5 h-3.5 text-lime-400" />
              <span>Completed</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">
              {totalWorkoutsCompleted} <span className="text-xs text-neutral-400 font-normal">sessions</span>
            </p>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Duration</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">
              {profile.availableTimeMinutes} <span className="text-xs text-neutral-400 font-normal">min / day</span>
            </p>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <CalendarDays className="w-3.5 h-3.5 text-violet-400" />
              <span>Schedule</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">
              {plan.days.length} <span className="text-xs text-neutral-400 font-normal">days / wk</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
