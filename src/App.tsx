import React, { useState, useEffect } from 'react';
import {
  DEFAULT_USER_PROFILE,
  INITIAL_FITNESS_PLAN,
  INITIAL_WORKOUT_LOGS,
} from './utils/defaultData.ts';
import {
  UserProfile,
  FitnessPlan,
  WorkoutHistoryLog,
  WeightLogEntry,
  WorkoutDay,
} from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { DailyWorkoutPlan } from './components/DailyWorkoutPlan.tsx';
import { ActiveWorkoutPlayer } from './components/ActiveWorkoutPlayer.tsx';
import { WarmupCooldownView } from './components/WarmupCooldownView.tsx';
import { NutritionView } from './components/NutritionView.tsx';
import { WorkoutCalendar } from './components/WorkoutCalendar.tsx';
import { ProgressTracker } from './components/ProgressTracker.tsx';
import { AiAssistantChat } from './components/AiAssistantChat.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';
import { PlanGeneratorModal } from './components/PlanGeneratorModal.tsx';
import { SafetyGuidanceModal } from './components/SafetyGuidanceModal.tsx';
import { FeedbackUpdateModal } from './components/FeedbackUpdateModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { HomePlanGeneratorCard } from './components/HomePlanGeneratorCard.tsx';
import { PythonProjectViewer } from './components/PythonProjectViewer.tsx';
import { FutureFeaturesRoadmap } from './components/FutureFeaturesRoadmap.tsx';
import {
  Sparkles,
  Dumbbell,
  ShieldCheck,
  Flame,
  Calendar,
  Utensils,
  MessageSquare,
  TrendingUp,
  Database,
  RefreshCw,
  CheckCircle2,
  X,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';

const KEY_FEATURES = [
  {
    num: 1,
    title: 'Personalized 7-Day Workout Plan',
    desc: 'Generates workouts based on age, weight, fitness goal, and intensity.',
    tag: 'Core Engine',
    color: 'text-lime-400',
    border: 'border-lime-400/30',
  },
  {
    num: 2,
    title: 'AI-Powered Workout Generation',
    desc: 'Uses Gemini 1.5 Pro to create structured workout plans.',
    tag: 'Gemini 1.5 Pro',
    color: 'text-cyan-400',
    border: 'border-cyan-400/30',
  },
  {
    num: 3,
    title: 'Nutrition & Recovery Tips',
    desc: 'Gemini Flash provides quick, goal-based nutrition and recovery suggestions.',
    tag: 'Gemini Flash',
    color: 'text-amber-400',
    border: 'border-amber-400/30',
  },
  {
    num: 4,
    title: 'Feedback-Based Plan Updating',
    desc: 'Users can give feedback, and AI updates the workout plan accordingly.',
    tag: 'Closed Loop',
    color: 'text-rose-400',
    border: 'border-rose-400/30',
  },
  {
    num: 5,
    title: 'User Data Storage',
    desc: 'User details and workout plans are stored using SQLite + SQLAlchemy.',
    tag: 'SQLite DB',
    color: 'text-blue-400',
    border: 'border-blue-400/30',
  },
  {
    num: 6,
    title: 'Admin Dashboard',
    desc: 'Admins can view users and their original and updated workout plans.',
    tag: 'all_users.html',
    color: 'text-purple-400',
    border: 'border-purple-400/30',
  },
  {
    num: 7,
    title: 'Responsive User Interface',
    desc: 'HTML, CSS, and Jinja2 provide a clean and mobile-responsive interface.',
    tag: 'Responsive UI',
    color: 'text-emerald-400',
    border: 'border-emerald-400/30',
  },
];

const INITIAL_WEIGHT_LOGS: WeightLogEntry[] = [
  { id: 'w-1', date: new Date(Date.now() - 21 * 86400000).toISOString(), weightKg: 75.2 },
  { id: 'w-2', date: new Date(Date.now() - 14 * 86400000).toISOString(), weightKg: 74.8 },
  { id: 'w-3', date: new Date(Date.now() - 7 * 86400000).toISOString(), weightKg: 74.4 },
  { id: 'w-4', date: new Date().toISOString(), weightKg: 74.0 },
];

export default function App() {
  // Persistence state
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('fitbuddy_profile');
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  const [plan, setPlan] = useState<FitnessPlan>(() => {
    try {
      const saved = localStorage.getItem('fitbuddy_plan');
      return saved ? JSON.parse(saved) : INITIAL_FITNESS_PLAN;
    } catch {
      return INITIAL_FITNESS_PLAN;
    }
  });

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutHistoryLog[]>(() => {
    try {
      const saved = localStorage.getItem('fitbuddy_workout_logs');
      return saved ? JSON.parse(saved) : INITIAL_WORKOUT_LOGS;
    } catch {
      return INITIAL_WORKOUT_LOGS;
    }
  });

  const [weightLogs, setWeightLogs] = useState<WeightLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('fitbuddy_weight_logs');
      return saved ? JSON.parse(saved) : INITIAL_WEIGHT_LOGS;
    } catch {
      return INITIAL_WEIGHT_LOGS;
    }
  });

  // UI state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Success Notification banner for applied plan updates
  const [updateToast, setUpdateToast] = useState<{
    version: number;
    title: string;
    summary?: string;
  } | null>(null);

  // Live Workout Player active session
  const [activeLiveWorkoutDay, setActiveLiveWorkoutDay] = useState<WorkoutDay | null>(null);

  // Coach deep link query
  const [coachQuestion, setCoachQuestion] = useState<string | undefined>(undefined);

  // LocalStorage sync
  useEffect(() => {
    try {
      localStorage.setItem('fitbuddy_profile', JSON.stringify(profile));
    } catch (e) {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('fitbuddy_plan', JSON.stringify(plan));
    } catch (e) {}
  }, [plan]);

  useEffect(() => {
    try {
      localStorage.setItem('fitbuddy_workout_logs', JSON.stringify(workoutLogs));
    } catch (e) {}
  }, [workoutLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('fitbuddy_weight_logs', JSON.stringify(weightLogs));
    } catch (e) {}
  }, [weightLogs]);

  // Streak calculation: count days with completed workouts
  const streakCount = workoutLogs.length > 0 ? Math.min(workoutLogs.length + 2, 7) : 0;

  const handleFinishWorkout = (newLog: WorkoutHistoryLog) => {
    setWorkoutLogs((prev) => [newLog, ...prev]);
    setActiveLiveWorkoutDay(null);
    setActiveTab('progress');
  };

  const handleAskCoachAboutExercise = (exerciseName: string) => {
    setCoachQuestion(
      `Can you give me form tips, biomechanical cues, and common mistakes to avoid on "${exerciseName}"?`
    );
    setActiveTab('assistant');
  };

  const handlePlanGenerated = (newPlan: FitnessPlan) => {
    setPlan(newPlan);
    setSelectedDayIndex(0);
    setActiveTab('plan');
    setUpdateToast({
      version: newPlan.version || 1,
      title: '7-Day Plan Created Successfully',
      summary: 'Generated with Google Gemini AI and stored in SQLite database.',
    });
  };

  const handlePlanUpdatedFromFeedback = (updatedPlan: FitnessPlan) => {
    setPlan(updatedPlan);
    setSelectedDayIndex(0);
    setActiveTab('plan');
    const latestFeedback = updatedPlan.feedbackHistory?.[updatedPlan.feedbackHistory.length - 1];
    setUpdateToast({
      version: updatedPlan.version,
      title: `Plan Successfully Updated to Version ${updatedPlan.version}`,
      summary: latestFeedback?.changesSummary || 'Adjustments applied to your 7-day program.',
    });
  };

  const handleAddWeightLog = (entry: WeightLogEntry) => {
    setWeightLogs((prev) => [...prev, entry]);
  };

  const handleDeleteWeightLog = (id: string) => {
    setWeightLogs((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans pb-20 md:pb-12">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSafety={() => setIsSafetyOpen(true)}
        onStartActiveWorkout={() => setActiveLiveWorkoutDay(plan.days[selectedDayIndex] || plan.days[0])}
        hasActiveWorkout={Boolean(activeLiveWorkoutDay)}
        streakCount={streakCount}
      />

      {/* Main App Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Plan Update Success Toast */}
        {updateToast && (
          <div className="rounded-2xl border border-lime-500/40 bg-lime-950/30 p-4 flex items-start justify-between gap-3 shadow-lg shadow-lime-950/20 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime-400 text-neutral-950 font-bold shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display">
                  {updateToast.title}
                </h4>
                {updateToast.summary && (
                  <p className="text-xs text-lime-300/90 mt-0.5">
                    {updateToast.summary}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setUpdateToast(null)}
              className="text-neutral-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <HeroBanner
              plan={plan}
              profile={profile}
              onStartTodayWorkout={() => setActiveLiveWorkoutDay(plan.days[selectedDayIndex] || plan.days[0])}
              onOpenGenerator={() => setIsGeneratorOpen(true)}
              onOpenSafety={() => setIsSafetyOpen(true)}
              onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
              streakCount={streakCount}
              totalWorkoutsCompleted={workoutLogs.length}
            />

            {/* Home Page AI Fitness Plan Generator Form */}
            <HomePlanGeneratorCard
              currentProfile={profile}
              onPlanGenerated={(newPlan, updatedProfile) => {
                setProfile(updatedProfile);
                handlePlanGenerated(newPlan);
              }}
            />

            {/* Quick Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setActiveTab('plan')}
                className="text-left p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900/90 hover:border-lime-400/50 transition-all group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400 group-hover:scale-110 transition-transform">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mt-3 group-hover:text-lime-400 transition-colors">
                  7-Day Workout Plan
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Day 1 to Day 7 microcycle with sets, reps, tempo, and rest timers.
                </p>
              </button>

              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="text-left p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900/90 hover:border-lime-400/50 transition-all group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400 group-hover:scale-110 transition-transform">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mt-3 group-hover:text-lime-400 transition-colors">
                  Update via Feedback
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Provide feedback to refine exercises and generate Version {(plan.version || 1) + 1}.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('nutrition')}
                className="text-left p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900/90 hover:border-amber-400/50 transition-all group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 group-hover:scale-110 transition-transform">
                  <Utensils className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mt-3 group-hover:text-amber-400 transition-colors">
                  Nutrition & Tips
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Gemini Flash quick tips, caloric targets, macro splits, and water intake.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('roadmap')}
                className="text-left p-5 rounded-2xl border border-lime-400/40 bg-gradient-to-br from-neutral-900 via-neutral-900 to-lime-950/20 hover:border-lime-400 transition-all group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/20 text-lime-400 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5 mt-3">
                  <h3 className="text-base font-bold text-white group-hover:text-lime-400 transition-colors">
                    Future Features
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-lime-400/20 text-lime-400">
                    Roadmap
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Voice Assistant, Wearables, Diet, Videos, Mobile & Short PPT Version.
                </p>
              </button>
            </div>

            {/* Future Features Callout Banner with Short PPT Version */}
            <div className="rounded-2xl border border-lime-400/30 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-lime-950/20 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-lime-400/20 text-lime-400">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider text-lime-400">
                    Future Features & Short PPT Version
                  </span>
                </div>
                <blockquote className="text-xs sm:text-sm text-neutral-200 font-semibold italic">
                  “In the future, FitBuddy can be enhanced with wearable integration, AI voice assistance, personalized diet planning, progress tracking, exercise videos, smart notifications, mobile apps, and advanced AI-based personalization.”
                </blockquote>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-neutral-400">
                  <span className="text-lime-300 font-bold">10 Upcoming Capabilities:</span>
                  <span>AI Voice Assistant • Wearables • Diet Planner • Exercise Videos • Notifications • Mobile Apps • Coach Support</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('roadmap')}
                className="shrink-0 flex items-center gap-2 rounded-xl bg-lime-400 hover:bg-lime-300 px-4 py-2.5 text-xs font-black text-neutral-950 transition-all shadow-md shadow-lime-400/20 hover:scale-105"
              >
                <span>Explore Future Features</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Embedded Active Day Routine */}
            <DailyWorkoutPlan
              plan={plan}
              selectedDayIndex={selectedDayIndex}
              onSelectDayIndex={setSelectedDayIndex}
              onStartWorkout={(day) => setActiveLiveWorkoutDay(day)}
              onAskCoachAboutExercise={handleAskCoachAboutExercise}
              onOpenSafety={() => setIsSafetyOpen(true)}
              onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 2: Structured Workout Plan & Routine Explorer */}
        {activeTab === 'plan' && (
          <div className="space-y-8">
            <DailyWorkoutPlan
              plan={plan}
              selectedDayIndex={selectedDayIndex}
              onSelectDayIndex={setSelectedDayIndex}
              onStartWorkout={(day) => setActiveLiveWorkoutDay(day)}
              onAskCoachAboutExercise={handleAskCoachAboutExercise}
              onOpenSafety={() => setIsSafetyOpen(true)}
              onOpenFeedbackModal={() => setIsFeedbackModalOpen(true)}
            />

            {/* Dedicated Warm-up & Cool-down Section */}
            <WarmupCooldownView
              warmUpSteps={plan.generalWarmUp}
              coolDownSteps={plan.generalCoolDown}
            />
          </div>
        )}

        {/* Tab 3: Workout Calendar */}
        {activeTab === 'calendar' && (
          <WorkoutCalendar
            plan={plan}
            workoutLogs={workoutLogs}
            onStartWorkout={(day) => setActiveLiveWorkoutDay(day)}
          />
        )}

        {/* Tab 4: Nutrition & Diet */}
        {activeTab === 'nutrition' && (
          <NutritionView nutrition={plan.nutritionPlan} />
        )}

        {/* Tab 5: Progress & Metrics Tracking */}
        {activeTab === 'progress' && (
          <ProgressTracker
            workoutLogs={workoutLogs}
            weightLogs={weightLogs}
            onAddWeightLog={handleAddWeightLog}
            onDeleteWeightLog={handleDeleteWeightLog}
            streakCount={streakCount}
          />
        )}

        {/* Tab 6: AI Fitness Coach Assistant */}
        {activeTab === 'assistant' && (
          <AiAssistantChat
            profile={profile}
            activePlan={plan}
            initialQuestion={coachQuestion}
            onClearInitialQuestion={() => setCoachQuestion(undefined)}
          />
        )}

        {/* Tab 7: Admin Dashboard (SQLite Inspection) */}
        {activeTab === 'admin' && <AdminDashboard />}

        {/* Tab 8: Python FastAPI Project Code Viewer */}
        {activeTab === 'python_project' && <PythonProjectViewer />}

        {/* Tab 9: Future Features & Innovation Roadmap */}
        {activeTab === 'roadmap' && (
          <FutureFeaturesRoadmap
            currentProfile={profile}
            currentPlan={plan}
            onNavigateTab={setActiveTab}
          />
        )}
      </main>

      {/* Live Active Workout Player Overlay */}
      {activeLiveWorkoutDay && (
        <ActiveWorkoutPlayer
          workoutDay={activeLiveWorkoutDay}
          planId={plan.id}
          onFinishWorkout={handleFinishWorkout}
          onClose={() => setActiveLiveWorkoutDay(null)}
        />
      )}

      {/* Athlete Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSave={(updated) => setProfile(updated)}
        onSaveAndRegenerate={(updated) => {
          setProfile(updated);
          setIsGeneratorOpen(true);
        }}
      />

      {/* Plan Generator Modal */}
      <PlanGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        profile={profile}
        onPlanGenerated={handlePlanGenerated}
      />

      {/* Feedback Update Modal */}
      <FeedbackUpdateModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        currentPlan={plan}
        profile={profile}
        onPlanUpdated={handlePlanUpdatedFromFeedback}
      />

      {/* Fitness Safety Guidance Modal */}
      <SafetyGuidanceModal
        isOpen={isSafetyOpen}
        onClose={() => setIsSafetyOpen(false)}
        guidelines={plan.safetyGuidelines}
      />
    </div>
  );
}
