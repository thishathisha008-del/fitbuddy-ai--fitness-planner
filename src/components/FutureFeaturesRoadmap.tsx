import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Watch,
  TrendingUp,
  Utensils,
  Video,
  BrainCircuit,
  Bell,
  Smartphone,
  Cloud,
  Users,
  Copy,
  Check,
  Play,
  RotateCcw,
  Volume2,
  Calendar,
  Activity,
  Heart,
  Flame,
  ChevronRight,
  ShieldCheck,
  Presentation,
  Grid,
  Maximize2,
  Minimize2,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { FitnessPlan, UserProfile } from '../types.ts';

interface FutureFeaturesRoadmapProps {
  currentProfile?: UserProfile;
  currentPlan?: FitnessPlan;
  onNavigateTab?: (tab: string) => void;
}

export const FutureFeaturesRoadmap: React.FC<FutureFeaturesRoadmapProps> = ({
  currentProfile,
  currentPlan,
  onNavigateTab,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'slides'>('grid');
  const [activeSlide, setActiveSlide] = useState(0);
  const [copiedPPT, setCopiedPPT] = useState(false);
  const [copiedKeyFeatures, setCopiedKeyFeatures] = useState(false);

  // Key Features of Current System
  const KEY_FEATURES_LIST = [
    {
      num: 1,
      title: 'Personalized 7-Day Workout Plan',
      desc: 'Generates workouts based on age, weight, fitness goal, and intensity.',
      tag: 'Core Workout Engine',
      tech: '7-Day Microcycle',
      color: 'text-lime-400',
      border: 'border-lime-400/30',
      bg: 'bg-lime-400/10',
    },
    {
      num: 2,
      title: 'AI-Powered Workout Generation',
      desc: 'Uses Gemini 1.5 Pro to create structured workout plans with warm-ups, sets, reps, and cooldowns.',
      tag: 'Intelligence',
      tech: 'Gemini 1.5 Pro',
      color: 'text-cyan-400',
      border: 'border-cyan-400/30',
      bg: 'bg-cyan-400/10',
    },
    {
      num: 3,
      title: 'Nutrition & Recovery Tips',
      desc: 'Gemini Flash provides quick, goal-based nutrition and recovery suggestions.',
      tag: 'Fast Inference',
      tech: 'Gemini Flash',
      color: 'text-amber-400',
      border: 'border-amber-400/30',
      bg: 'bg-amber-400/10',
    },
    {
      num: 4,
      title: 'Feedback-Based Plan Updating',
      desc: 'Users can give feedback, and AI updates the workout plan accordingly.',
      tag: 'Adaptation',
      tech: 'Closed-Loop Gemini',
      color: 'text-rose-400',
      border: 'border-rose-400/30',
      bg: 'bg-rose-400/10',
    },
    {
      num: 5,
      title: 'User Data Storage',
      desc: 'User details and workout plans are stored using SQLite + SQLAlchemy.',
      tag: 'Persistence',
      tech: 'SQLite + SQLAlchemy',
      color: 'text-blue-400',
      border: 'border-blue-400/30',
      bg: 'bg-blue-400/10',
    },
    {
      num: 6,
      title: 'Admin Dashboard',
      desc: 'Admins can view users and their original and updated workout plans.',
      tag: 'Governance',
      tech: 'all_users.html',
      color: 'text-purple-400',
      border: 'border-purple-400/30',
      bg: 'bg-purple-400/10',
    },
    {
      num: 7,
      title: 'Responsive User Interface',
      desc: 'HTML, CSS, and Jinja2 provide a clean and mobile-responsive interface.',
      tag: 'Frontend',
      tech: 'Jinja2 + Tailwind / CSS',
      color: 'text-emerald-400',
      border: 'border-emerald-400/30',
      bg: 'bg-emerald-400/10',
    },
  ];

  const KEY_FEATURES_TEXT = `FitBuddy Key Features:
1. Personalized 7-Day Workout Plan – Generates workouts based on age, weight, fitness goal, and intensity.
2. AI-Powered Workout Generation – Uses Gemini 1.5 Pro to create structured workout plans.
3. Nutrition & Recovery Tips – Gemini Flash provides quick, goal-based nutrition and recovery suggestions.
4. Feedback-Based Plan Updating – Users can give feedback, and AI updates the workout plan accordingly.
5. User Data Storage – User details and workout plans are stored using SQLite + SQLAlchemy.
6. Admin Dashboard – Admins can view users and their original and updated workout plans.
7. Responsive User Interface – HTML, CSS, and Jinja2 provide a clean and mobile-responsive interface.`;

  const copyKeyFeatures = () => {
    navigator.clipboard.writeText(KEY_FEATURES_TEXT);
    setCopiedKeyFeatures(true);
    setTimeout(() => setCopiedKeyFeatures(false), 2500);
  };

  // 1. AI Voice Assistant State
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState('');
  const [voiceResponse, setVoiceResponse] = useState<string | null>(null);
  const [voiceHistory, setVoiceHistory] = useState<Array<{ q: string; a: string; time: string }>>([
    {
      q: "FitBuddy, start today's workout",
      a: "Starting Day 1: Upper Body Push & Core! Ready for your 5-minute dynamic warm-up?",
      time: "2 mins ago",
    },
  ]);

  // 2. Wearable Device State
  const [connectedDevice, setConnectedDevice] = useState<'apple' | 'garmin' | 'whoop' | 'fitbit'>('apple');
  const [heartRate, setHeartRate] = useState(72);
  const [dailySteps, setDailySteps] = useState(8420);
  const [activeCalories, setActiveCalories] = useState(540);
  const [isSyncingWearable, setIsSyncingWearable] = useState(false);

  // 3. Progress Tracking Range
  const [progressRange, setProgressRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // 4. Diet Planner State
  const [dietGoal, setDietGoal] = useState<'weight_loss' | 'muscle_gain' | 'general_fitness'>('muscle_gain');
  const [dietPref, setDietPref] = useState<'high_protein' | 'mediterranean' | 'vegetarian' | 'keto'>('high_protein');

  // 5. Exercise Video Guide Selection
  const [selectedExerciseVideo, setSelectedExerciseVideo] = useState<'squat' | 'deadlift' | 'bench' | 'pullup'>('squat');

  // 7. Notification Center State
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);
  const [reminderSettings, setReminderSettings] = useState({
    workout: true,
    hydration: true,
    meals: true,
    sleep: true,
  });

  const SHORT_PPT_SUMMARY =
    '“In the future, FitBuddy can be enhanced with wearable integration, AI voice assistance, personalized diet planning, progress tracking, exercise videos, smart notifications, mobile apps, and advanced AI-based personalization.”';

  const FULL_PRESENTATION_TEXT = `Future Features of FitBuddy:
1. AI Voice Assistant – Users can interact with FitBuddy using voice commands.
2. Wearable Device Integration – Connect smartwatches and fitness bands to track steps, heart rate, calories, and activity.
3. Real-Time Progress Tracking – Show daily, weekly, and monthly fitness progress through charts and reports.
4. Personalized Diet Planner – Generate customized meal plans based on fitness goals and food preferences.
5. Exercise Video Guidance – Provide videos or animations showing the correct exercise techniques.
6. Advanced AI Personalization – Continuously improve workout plans based on the user's progress and feedback.
7. Reminder & Notification System – Send reminders for workouts, meals, hydration, and recovery.
8. Mobile Application – Develop Android/iOS versions for easy access anywhere.
9. Cloud Deployment – Deploy FitBuddy online so users can access their plans from any device.
10. Coach/Trainer Support – Allow fitness coaches to monitor users and provide personalized guidance.

Short PPT Version:
${SHORT_PPT_SUMMARY}`;

  const copyPPT = () => {
    navigator.clipboard.writeText(FULL_PRESENTATION_TEXT);
    setCopiedPPT(true);
    setTimeout(() => setCopiedPPT(false), 2500);
  };

  // Simulate Wearable Live Pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.min(Math.max(prev + delta, 68), 135);
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Voice command triggers
  const handleVoiceCommand = (command: string) => {
    setVoiceQuery(command);
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      let reply = '';
      const cmd = command.toLowerCase();
      if (cmd.includes('workout') || cmd.includes('start')) {
        reply = "Day 1 routine loaded. 5 sets of bench press and dumbbell rows queued up. Let's conquer it!";
      } else if (cmd.includes('protein') || cmd.includes('diet') || cmd.includes('nutrition')) {
        reply = "Your daily protein target is 160 grams. You currently have 95g remaining for lunch & dinner.";
      } else if (cmd.includes('cardio') || cmd.includes('feedback')) {
        reply = "Added 15 minutes of Zone 2 steady cardio to Days 2, 4, and 6. Plan updated to Version 2!";
      } else if (cmd.includes('recovery') || cmd.includes('heart')) {
        reply = `Heart rate is currently ${heartRate} BPM. Resting HRV is optimal. You're ready for high intensity!`;
      } else {
        reply = `FitBuddy Voice Assistant received: "${command}". Adjusting your schedule accordingly!`;
      }
      setVoiceResponse(reply);
      setVoiceHistory((prev) => [{ q: command, a: reply, time: 'Just now' }, ...prev.slice(0, 4)]);

      // Speak back if synthesis is supported
      if ('speechSynthesis' in window) {
        try {
          const utterance = new SpeechSynthesisUtterance(reply);
          utterance.rate = 1.05;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        } catch (e) {}
      }
    }, 900);
  };

  const handleSimulateSpeechMic = () => {
    // Check if webkitSpeechRecognition is available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        setIsListening(true);
        recognition.onresult = (event: any) => {
          const speechResult = event.results[0][0].transcript;
          handleVoiceCommand(speechResult);
        };
        recognition.onerror = () => {
          setIsListening(false);
          handleVoiceCommand("FitBuddy, start today's workout");
        };
        recognition.onend = () => {
          setIsListening(false);
        };
        recognition.start();
        return;
      } catch (e) {}
    }
    // Fallback simulation
    handleVoiceCommand("FitBuddy, check my protein goal for today");
  };

  const syncWearable = () => {
    setIsSyncingWearable(true);
    setTimeout(() => {
      setDailySteps((prev) => prev + Math.floor(Math.random() * 250 + 50));
      setActiveCalories((prev) => prev + Math.floor(Math.random() * 30 + 10));
      setIsSyncingWearable(false);
    }, 1200);
  };

  const triggerTestNotification = () => {
    setNotificationStatus('Hydration Alert: Time to drink 250ml water to optimize muscular hydration! 💧');
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('FitBuddy Hydration Reminder', {
        body: 'Time to drink 250ml water to optimize muscular recovery!',
        icon: '/favicon.ico',
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    setTimeout(() => setNotificationStatus(null), 5000);
  };

  // Slides definition for Presentation Mode
  const SLIDES = [
    {
      title: 'FitBuddy Key Features',
      subtitle: '7 Core Pillars of the Implemented Architecture',
      badge: 'Core Features',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {KEY_FEATURES_LIST.map((feat) => (
              <div
                key={feat.num}
                className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5 transition-all hover:border-lime-400/40"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${feat.color}`}>
                    Feature {feat.num}
                  </span>
                  <span className="text-[10px] rounded px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">
                    {feat.tech}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">{feat.title}</h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs text-neutral-400">
            <span>Powered by <strong>Gemini 1.5 Pro</strong>, <strong>Gemini Flash</strong>, and <strong>SQLite + SQLAlchemy</strong>.</span>
            <button
              onClick={copyKeyFeatures}
              className="flex items-center gap-1.5 text-lime-400 hover:text-lime-300 font-bold"
            >
              {copiedKeyFeatures ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKeyFeatures ? 'Key Features Copied!' : 'Copy Key Features Text'}</span>
            </button>
          </div>
        </div>
      ),
    },
    {
      title: 'Executive Summary & Short PPT Version',
      subtitle: 'FitBuddy Vision & Strategic Next-Generation Roadmap',
      badge: 'Roadmap Overview',
      content: (
        <div className="space-y-6">
          <div className="rounded-2xl border border-lime-400/40 bg-lime-400/10 p-6 sm:p-8 backdrop-blur-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-400 block mb-2">
              Short PPT Version
            </span>
            <blockquote className="text-lg sm:text-2xl font-extrabold text-white leading-relaxed font-display">
              {SHORT_PPT_SUMMARY}
            </blockquote>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Voice AI', sub: 'Hands-Free Control' },
              { label: 'Wearables', sub: 'Live Sensor Telemetry' },
              { label: 'Diet Planner', sub: 'Goal-Aligned Macros' },
              { label: 'Form Videos', sub: 'Biomechanical Guides' },
              { label: 'Cloud & Mobile', sub: 'Everywhere Access' },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border border-neutral-800 bg-neutral-900/90 p-3 text-center">
                <div className="text-xs font-bold text-lime-400">{item.label}</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: '1. AI Voice Assistant & 2. Wearables',
      subtitle: 'Hands-Free Interaction & Real-Time Biometrics',
      badge: 'Hardware & Voice AI',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 space-y-3">
            <h4 className="text-sm font-bold text-lime-400 uppercase tracking-wider flex items-center gap-2">
              <Mic className="w-4 h-4" /> AI Voice Assistant
            </h4>
            <p className="text-xs text-neutral-300">
              Users can verbally command FitBuddy during intense training sessions without picking up their phone.
            </p>
            <ul className="text-xs text-neutral-400 space-y-1.5 list-disc list-inside">
              <li>"FitBuddy, start today's workout"</li>
              <li>"What is my next exercise and rest interval?"</li>
              <li>"Log 4 sets completed at 80kg"</li>
              <li>Real-time voice synthesis coaching cues during sets</li>
            </ul>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 space-y-3">
            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Watch className="w-4 h-4" /> Wearable Device Integration
            </h4>
            <p className="text-xs text-neutral-300">
              Direct connection with Apple Watch, Garmin, Fitbit, and Whoop for automatic telemetry logging.
            </p>
            <ul className="text-xs text-neutral-400 space-y-1.5 list-disc list-inside">
              <li>Continuous optical heart rate & HRV recovery tracking</li>
              <li>Step count and active calorie expenditure (EPOC)</li>
              <li>Sleep duration & readiness scores feeding into AI workout volume</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: '3. Progress Tracking & 4. Diet Planner',
      subtitle: 'Data-Driven Growth & Fueling Strategies',
      badge: 'Analytics & Nutrition',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 space-y-3">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Real-Time Progress Tracking
            </h4>
            <p className="text-xs text-neutral-300">
              Visual dashboards detailing daily, weekly, and monthly performance benchmarks.
            </p>
            <ul className="text-xs text-neutral-400 space-y-1.5 list-disc list-inside">
              <li>Total tonnage / volume load lifted per muscle group</li>
              <li>EPOC cardio burn, VO2 max estimation, and active minutes</li>
              <li>Body weight progression & body composition tracking</li>
            </ul>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 space-y-3">
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Utensils className="w-4 h-4" /> Personalized Diet Planner
            </h4>
            <p className="text-xs text-neutral-300">
              Automated nutrition plans tailored to athletic goals and dietary preferences.
            </p>
            <ul className="text-xs text-neutral-400 space-y-1.5 list-disc list-inside">
              <li>Exact caloric targets & protein/carb/fat macro distributions</li>
              <li>Custom meals for High Protein, Mediterranean, Vegan, Keto</li>
              <li>Nutrient timing around workout windows</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: '5. Exercise Videos & 6. AI Personalization',
      subtitle: 'Technique Perfection & Closed-Loop Adaptation',
      badge: 'Movement & Intelligence',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 space-y-3">
            <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Video className="w-4 h-4" /> Exercise Video Guidance
            </h4>
            <p className="text-xs text-neutral-300">
              High-definition movement tutorials and animated 3D biomechanics for injury prevention.
            </p>
            <ul className="text-xs text-neutral-400 space-y-1.5 list-disc list-inside">
              <li>Correct joint angles, bar paths, and posture cues</li>
              <li>Common movement faults and corrective drills</li>
              <li>Beginner regressions and advanced progressions</li>
            </ul>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 space-y-3">
            <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" /> Advanced AI Personalization
            </h4>
            <p className="text-xs text-neutral-300">
              Self-calibrating fitness models that adapt weekly plans based on fatigue and performance.
            </p>
            <ul className="text-xs text-neutral-400 space-y-1.5 list-disc list-inside">
              <li>RPE (Rate of Perceived Exertion) autotuning</li>
              <li>Joint discomfort detection and automatic exercise substitutions</li>
              <li>Auto-deload microcycles when fatigue threshold is reached</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: '7. Notifications, 8. Mobile, 9. Cloud & 10. Coach',
      subtitle: 'Multi-Device Ecosystem & Human Coaching Support',
      badge: 'Ecosystem & Cloud',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 space-y-2">
            <h5 className="text-xs font-bold text-lime-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" /> 7. Smart Alerts
            </h5>
            <p className="text-[11px] text-neutral-400">
              Hydration pings, meal timings, scheduled workout countdowns, and sleep recovery prompts.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 space-y-2">
            <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" /> 8. Mobile Apps
            </h5>
            <p className="text-[11px] text-neutral-400">
              Native Android & iOS apps with offline gym caching, Apple HealthKit & Google Health Connect sync.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 space-y-2">
            <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5" /> 9. Cloud Deploy
            </h5>
            <p className="text-[11px] text-neutral-400">
              Global low-latency Cloud Run hosting with SQLite / Postgres replication and device sync.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 space-y-2">
            <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> 10. Coach Support
            </h5>
            <p className="text-[11px] text-neutral-400">
              Certified human personal trainers can review Gemini logs, leave feedback, and guide athletes.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-lime-400 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Future Roadmap & Next-Gen Innovations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Future Features & Enhancements
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Explore upcoming capabilities: AI Voice Assistant, Wearable Integration, Real-Time Progress, Personalized Diet, Exercise Videos, and Coach Support.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={copyKeyFeatures}
            className="flex items-center gap-1.5 rounded-xl border border-lime-400/50 bg-lime-400/10 px-3.5 py-2 text-xs font-bold text-lime-400 hover:bg-lime-400/20 transition-all shadow-sm"
          >
            {copiedKeyFeatures ? (
              <>
                <Check className="w-4 h-4 text-lime-400" />
                <span>Key Features Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Key Features</span>
              </>
            )}
          </button>

          <button
            onClick={copyPPT}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white hover:border-lime-400 hover:text-lime-400 transition-all shadow-sm"
          >
            {copiedPPT ? (
              <>
                <Check className="w-4 h-4 text-lime-400" />
                <span className="text-lime-400">PPT Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy PPT Text</span>
              </>
            )}
          </button>

          <div className="flex rounded-xl bg-neutral-900 p-1 border border-neutral-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'grid'
                  ? 'bg-neutral-800 text-lime-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Interactive</span>
            </button>
            <button
              onClick={() => setViewMode('slides')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'slides'
                  ? 'bg-lime-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Slide Deck</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Callout: Short PPT Version */}
      <div className="relative overflow-hidden rounded-2xl border border-lime-400/40 bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-lime-950/30 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-lime-400/10 blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-lime-400/20 text-lime-400">
                <Presentation className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-lime-400">
                Official Short PPT Version for Presentations
              </span>
            </div>
            <p className="text-base sm:text-lg lg:text-xl font-bold text-white leading-relaxed font-display">
              {SHORT_PPT_SUMMARY}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-neutral-400">
              <span className="rounded-md bg-neutral-800/80 px-2 py-0.5 border border-neutral-700/60 text-neutral-300">
                10 Core Future Modules
              </span>
              <span>•</span>
              <span>Ready for Viva / College PPT Slide / Project Report</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={copyKeyFeatures}
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-xs font-bold text-neutral-200 hover:border-lime-400 hover:text-lime-400 transition-colors"
            >
              {copiedKeyFeatures ? <Check className="w-4 h-4 text-lime-400" /> : <Copy className="w-4 h-4" />}
              <span>Copy Key Features</span>
            </button>
            <button
              onClick={copyPPT}
              className="flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-xs font-black text-neutral-950 hover:bg-lime-300 transition-colors shadow-lg shadow-lime-400/20"
            >
              {copiedPPT ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>Copy Short PPT</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Mode: Presentation Slide Deck */}
      {viewMode === 'slides' && (
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-lime-400 bg-lime-400/10 px-2.5 py-1 rounded-lg border border-lime-400/20">
                Slide {activeSlide + 1} of {SLIDES.length}
              </span>
              <span className="text-xs text-neutral-400">{SLIDES[activeSlide].badge}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={activeSlide === 0}
                onClick={() => setActiveSlide((prev) => Math.max(prev - 1, 0))}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 text-xs font-bold text-white hover:bg-neutral-700 disabled:opacity-30"
              >
                Previous
              </button>
              <button
                disabled={activeSlide === SLIDES.length - 1}
                onClick={() => setActiveSlide((prev) => Math.min(prev + 1, SLIDES.length - 1))}
                className="px-3 py-1.5 rounded-lg bg-lime-400 text-xs font-bold text-neutral-950 hover:bg-lime-300 disabled:opacity-30"
              >
                Next Slide →
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              {SLIDES[activeSlide].title}
            </h2>
            <p className="text-sm text-neutral-400 mt-1">{SLIDES[activeSlide].subtitle}</p>
          </div>

          <div className="pt-2">{SLIDES[activeSlide].content}</div>

          {/* Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  activeSlide === idx ? 'w-8 bg-lime-400' : 'w-2 bg-neutral-700 hover:bg-neutral-600'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* View Mode: Interactive Showcase of 10 Features */}
      {viewMode === 'grid' && (
        <div className="space-y-8">
          {/* FitBuddy Key Features (7 Core Implemented Capabilities) */}
          <div className="rounded-2xl border border-lime-400/40 bg-gradient-to-br from-neutral-900 via-neutral-900 to-lime-950/20 p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded border border-lime-400/30">
                    System Architecture
                  </span>
                  <span className="text-xs text-neutral-400">7 Core Pillars</span>
                </div>
                <h3 className="text-xl font-black text-white font-display mt-1">
                  FitBuddy Key Features
                </h3>
              </div>
              <button
                onClick={copyKeyFeatures}
                className="self-start sm:self-auto flex items-center gap-2 rounded-xl border border-lime-400/40 bg-neutral-950 px-3.5 py-2 text-xs font-bold text-lime-400 hover:bg-lime-400/10 transition-colors"
              >
                {copiedKeyFeatures ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKeyFeatures ? 'Key Features Copied!' : 'Copy Key Features List'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {KEY_FEATURES_LIST.map((feat) => (
                <div
                  key={feat.num}
                  className="rounded-xl border border-neutral-800/80 bg-neutral-950/80 p-4 space-y-2 hover:border-lime-400/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${feat.color}`}>
                      Key Feature {feat.num}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono">
                      {feat.tech}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">{feat.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Feature 1: AI Voice Assistant (Interactive Simulator) */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-lime-400">Feature 1</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-lime-400/20 text-lime-300">
                      Interactive Prototype
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display">
                    AI Voice Assistant – Voice Commands for FitBuddy
                  </h3>
                </div>
              </div>
              <p className="text-xs text-neutral-400 max-w-sm">
                Hands-free voice interaction for gym sessions: query workouts, log sets, check macro targets, and hear real-time audio guidance.
              </p>
            </div>

            {/* Voice Assistant Interactive Demo Box */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 rounded-xl bg-neutral-950 p-5 border border-neutral-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Voice Console
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isListening ? 'bg-red-500 animate-ping' : 'bg-lime-400'
                      }`}
                    />
                    {isListening ? 'Listening / Processing...' : 'Ready for Voice Commands'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleSimulateSpeechMic}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition-all ${
                      isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-lime-400 text-neutral-950 hover:bg-lime-300'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    <span>{isListening ? 'Listening...' : 'Speak Command (or Test)'}</span>
                  </button>

                  <div className="w-full flex-1 relative">
                    <input
                      type="text"
                      value={voiceQuery}
                      onChange={(e) => setVoiceQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleVoiceCommand(voiceQuery)}
                      placeholder='e.g. "FitBuddy, what is my protein goal today?"'
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-lime-400 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleVoiceCommand(voiceQuery || "FitBuddy, start today's workout")}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors"
                  >
                    Send
                  </button>
                </div>

                {/* Preset Voice Chips */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-neutral-500">Quick Voice Prompts to Try:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "FitBuddy, start today's workout",
                      "What's my protein goal for today?",
                      "Add more cardio to Day 4",
                      "How is my recovery heart rate?",
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleVoiceCommand(prompt)}
                        className="rounded-lg bg-neutral-900 hover:bg-lime-400 hover:text-neutral-950 border border-neutral-800 px-2.5 py-1 text-[11px] text-neutral-300 transition-colors"
                      >
                        "{prompt}"
                      </button>
                    ))}
                  </div>
                </div>

                {voiceResponse && (
                  <div className="rounded-xl border border-lime-400/30 bg-lime-400/10 p-4 space-y-1.5 animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs font-bold text-lime-400">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>FitBuddy Voice Response:</span>
                    </div>
                    <p className="text-xs text-neutral-200 font-medium">{voiceResponse}</p>
                  </div>
                )}
              </div>

              {/* Voice History Log */}
              <div className="rounded-xl bg-neutral-950 p-4 border border-neutral-800/80 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                  Recent Voice Transcripts
                </span>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {voiceHistory.map((item, i) => (
                    <div key={i} className="rounded-lg bg-neutral-900/80 p-2.5 text-[11px] space-y-1 border border-neutral-800/60">
                      <div className="flex items-center justify-between text-neutral-400">
                        <span className="font-semibold text-lime-400">"{item.q}"</span>
                        <span className="text-[9px]">{item.time}</span>
                      </div>
                      <p className="text-neutral-300 text-[10px]">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Wearable Device Integration (Interactive Live Telemetry) */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  <Watch className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Feature 2</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-400/20 text-cyan-300">
                      Live Biometrics Hub
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Wearable Device Integration – Smartwatches & Fitness Bands
                  </h3>
                </div>
              </div>
              <button
                onClick={syncWearable}
                disabled={isSyncingWearable}
                className="flex items-center gap-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 px-3.5 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 transition-colors"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isSyncingWearable ? 'animate-spin' : ''}`} />
                <span>{isSyncingWearable ? 'Syncing...' : 'Sync Wearable Stream'}</span>
              </button>
            </div>

            {/* Device Switcher */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-neutral-400 font-semibold mr-1">Select Active Device:</span>
              {[
                { id: 'apple', name: 'Apple Watch Ultra 2' },
                { id: 'garmin', name: 'Garmin Forerunner 965' },
                { id: 'whoop', name: 'Whoop 4.0 Strap' },
                { id: 'fitbit', name: 'Fitbit Charge 6' },
              ].map((dev) => (
                <button
                  key={dev.id}
                  onClick={() => setConnectedDevice(dev.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    connectedDevice === dev.id
                      ? 'bg-cyan-500/20 border border-cyan-400 text-white font-bold'
                      : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {dev.name}
                </button>
              ))}
            </div>

            {/* Live Wearable Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Heart Rate</span>
                  <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                </div>
                <div className="text-2xl font-black text-white tabular-nums font-display">
                  {heartRate} <span className="text-xs font-normal text-neutral-400">BPM</span>
                </div>
                <p className="text-[10px] text-emerald-400 font-medium">Zone 2 Aerobic Base</p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Daily Steps</span>
                  <Activity className="w-4 h-4 text-lime-400" />
                </div>
                <div className="text-2xl font-black text-white tabular-nums font-display">
                  {dailySteps.toLocaleString()}
                </div>
                <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-lime-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((dailySteps / 10000) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-neutral-400">Goal: 10,000 steps</p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Burn</span>
                  <Flame className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-2xl font-black text-white tabular-nums font-display">
                  {activeCalories} <span className="text-xs font-normal text-neutral-400">kcal</span>
                </div>
                <p className="text-[10px] text-neutral-400">Workout + EPOC burn</p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Recovery Score</span>
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-cyan-400 tabular-nums font-display">
                  88<span className="text-xs font-normal text-neutral-400">/100</span>
                </div>
                <p className="text-[10px] text-cyan-300 font-medium">HRV 62ms · Prime for Lifting</p>
              </div>
            </div>
          </div>

          {/* Feature 3: Real-Time Progress Tracking */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Feature 3</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300">
                      Charts & Reports
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Real-Time Progress Tracking – Daily, Weekly & Monthly Charts
                  </h3>
                </div>
              </div>

              {/* Range Toggle */}
              <div className="flex rounded-xl bg-neutral-950 p-1 border border-neutral-800">
                {(['daily', 'weekly', 'monthly'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setProgressRange(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      progressRange === r
                        ? 'bg-amber-400 text-neutral-950'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Simulated Chart Bars */}
            <div className="rounded-xl bg-neutral-950 p-5 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white uppercase tracking-wider">
                  {progressRange === 'daily'
                    ? 'Hourly Activity & Caloric Burn'
                    : progressRange === 'weekly'
                    ? '7-Day Microcycle Volume Load (kg lifted)'
                    : 'Monthly Strength & Consistency Trends'}
                </span>
                <span className="text-neutral-400">+14.2% vs last period</span>
              </div>

              <div className="grid grid-cols-7 gap-2 h-40 items-end pt-4 pb-2 border-b border-neutral-800">
                {[
                  { label: 'Mon', val: 78, load: '4,200kg' },
                  { label: 'Tue', val: 92, load: '5,100kg' },
                  { label: 'Wed', val: 45, load: 'Active Rec.' },
                  { label: 'Thu', val: 85, load: '4,800kg' },
                  { label: 'Fri', val: 100, load: '5,600kg' },
                  { label: 'Sat', val: 65, load: '3,200kg' },
                  { label: 'Sun', val: 30, load: 'Rest' },
                ].map((col, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {col.load}
                    </span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-amber-500 to-lime-400 transition-all duration-300 group-hover:brightness-125"
                      style={{ height: `${col.val}%` }}
                    />
                    <span className="text-[11px] font-bold text-neutral-400">{col.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-2">
                <span>Total Weekly Tonnage: <strong className="text-white">22,900 kg</strong></span>
                <span>Consistency Rate: <strong className="text-lime-400">94%</strong></span>
                <span>Workouts Completed: <strong className="text-white">5 / 7 Days</strong></span>
              </div>
            </div>
          </div>

          {/* Feature 4: Personalized Diet Planner */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Feature 4</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-400/20 text-emerald-300">
                      Nutritional AI Engine
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Personalized Diet Planner – Customized Meal Plans & Macros
                  </h3>
                </div>
              </div>
              <p className="text-xs text-neutral-400 max-w-sm">
                Generates complete 24-hour nutrition itineraries aligned with athlete metabolism, training goal, and dietary preference.
              </p>
            </div>

            {/* Filter Switches */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-neutral-400">Goal:</span>
                <select
                  value={dietGoal}
                  onChange={(e) => setDietGoal(e.target.value as any)}
                  className="rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-xs text-white"
                >
                  <option value="muscle_gain">Muscle Gain (Hypertrophy)</option>
                  <option value="weight_loss">Weight Loss (Fat Loss Deficit)</option>
                  <option value="general_fitness">General Fitness (Maintenance)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-neutral-400">Dietary Preference:</span>
                <select
                  value={dietPref}
                  onChange={(e) => setDietPref(e.target.value as any)}
                  className="rounded-lg bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-xs text-white"
                >
                  <option value="high_protein">High Protein (Clean Bulk)</option>
                  <option value="mediterranean">Mediterranean Diet</option>
                  <option value="vegetarian">Plant-Based / Vegetarian</option>
                  <option value="keto">Ketogenic / Low-Carb</option>
                </select>
              </div>
            </div>

            {/* Generated Meal Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  meal: 'Breakfast (08:00)',
                  name: dietPref === 'vegetarian' ? 'Tofu Scramble & Oatmeal' : 'Egg White Omelet & Avocado Toast',
                  cals: '520 kcal',
                  protein: '38g P',
                },
                {
                  meal: 'Pre-Workout Lunch (12:30)',
                  name: dietPref === 'vegetarian' ? 'Lentil Quinoa Bowl & Greens' : 'Grilled Chicken Breast, Brown Rice & Broccoli',
                  cals: '680 kcal',
                  protein: '52g P',
                },
                {
                  meal: 'Post-Workout Fuel (17:30)',
                  name: 'Whey / Plant Isolate Shake with Banana & Honey',
                  cals: '340 kcal',
                  protein: '32g P',
                },
                {
                  meal: 'Dinner (20:00)',
                  name: dietPref === 'vegetarian' ? 'Tempeh Stir Fry with Asparagus' : 'Wild Salmon Fillet, Sweet Potato & Asparagus',
                  cals: '610 kcal',
                  protein: '45g P',
                },
              ].map((item, idx) => (
                <div key={idx} className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      {item.meal}
                    </span>
                    <span className="text-[11px] font-bold text-white">{item.cals}</span>
                  </div>
                  <h5 className="text-xs font-bold text-neutral-200">{item.name}</h5>
                  <div className="inline-block rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    {item.protein}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 5: Exercise Video Guidance */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">Feature 5</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-400/20 text-purple-300">
                      Biomechanical Form Engine
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Exercise Video Guidance – Correct Movement Technique
                  </h3>
                </div>
              </div>
              <p className="text-xs text-neutral-400 max-w-sm">
                Prevents lifting injuries by delivering animated biomechanical cues, joint alignment checks, and bar-path illustrations.
              </p>
            </div>

            {/* Exercise Selector Chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'squat', name: 'Barbell Back Squat' },
                { id: 'deadlift', name: 'Romanian Deadlift' },
                { id: 'bench', name: 'Dumbbell Incline Bench' },
                { id: 'pullup', name: 'Strict Bodyweight Pull-Up' },
              ].map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExerciseVideo(ex.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedExerciseVideo === ex.id
                      ? 'bg-purple-500/20 border border-purple-400 text-purple-300'
                      : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {ex.name}
                </button>
              ))}
            </div>

            {/* Simulated Video Player / Movement Anatomy Card */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="relative aspect-video rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center p-4 text-center overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/40 via-neutral-900 to-lime-950/20" />
                <div className="relative z-10 space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 mx-auto border border-purple-400/30 group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                  <span className="text-xs font-bold text-white block">
                    {selectedExerciseVideo === 'squat' && 'Barbell Back Squat Form'}
                    {selectedExerciseVideo === 'deadlift' && 'Romanian Deadlift Hip Hinge'}
                    {selectedExerciseVideo === 'bench' && 'Incline DB Press Angle (30°)'}
                    {selectedExerciseVideo === 'pullup' && 'Scapular Depression & Retraction'}
                  </span>
                  <span className="text-[10px] text-neutral-400">1080p 60FPS Biomechanics Guide</span>
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <h4 className="text-sm font-bold text-white">Technique Coaching Cues</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-neutral-900 p-3 border border-neutral-800">
                    <span className="text-lime-400 font-bold block mb-1">✓ Setup & Footing:</span>
                    <p className="text-neutral-300 text-[11px]">
                      Shoulder-width stance, screw feet into the floor creating external hip torque. Core braced via Valsalva maneuver.
                    </p>
                  </div>
                  <div className="rounded-lg bg-neutral-900 p-3 border border-neutral-800">
                    <span className="text-red-400 font-bold block mb-1">✗ Mistake to Avoid:</span>
                    <p className="text-neutral-300 text-[11px]">
                      Do not let knees cave inward (valgus collapse) or allow lumbar rounding at bottom depth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 6: Advanced AI Personalization */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-400/10 text-rose-400">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">Feature 6</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-400/20 text-rose-300">
                      Closed-Loop Machine Learning
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Advanced AI Personalization – Continuous Adaptation & Auto-Deload
                  </h3>
                </div>
              </div>
              <p className="text-xs text-neutral-400 max-w-sm">
                FitBuddy continuously refines weekly workout volume and intensity based on logged RPE, perceived fatigue, and soreness.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Step 1: Session Feedback
                </span>
                <p className="text-xs text-neutral-300">
                  Athlete completes sets and inputs RPE (e.g. "Squats felt like RPE 9.5; mild knee stiffness").
                </p>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Step 2: Gemini Re-Evaluation
                </span>
                <p className="text-xs text-neutral-300">
                  AI flags quad fatigue and automatically substitutes heavy barbell squats with knee-friendly Spanish squats or leg press.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                <span className="text-xs font-bold text-lime-400 uppercase tracking-wider">
                  Step 3: New Microcycle
                </span>
                <p className="text-xs text-neutral-300">
                  Version 2 plan is immediately generated and stored in SQLite database with zero downtime.
                </p>
              </div>
            </div>
          </div>

          {/* Feature 7: Reminder & Notification System */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-lime-400">Feature 7</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-lime-400/20 text-lime-300">
                      Smart Scheduler
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Reminder & Notification System – Workouts, Meals, Hydration & Recovery
                  </h3>
                </div>
              </div>

              <button
                onClick={triggerTestNotification}
                className="flex items-center gap-1.5 rounded-xl bg-lime-400 px-3.5 py-1.5 text-xs font-bold text-neutral-950 hover:bg-lime-300 transition-colors shadow-sm"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Test Smart Alert</span>
              </button>
            </div>

            {notificationStatus && (
              <div className="rounded-xl border border-lime-400/40 bg-lime-400/15 p-4 text-xs font-bold text-lime-300 animate-fadeIn">
                {notificationStatus}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Workout Reminder', time: '07:00 AM', desc: 'Day 1 Upper Push scheduled in 30 mins' },
                { title: 'Hydration Ping', time: 'Every 2 Hours', desc: 'Drink 250ml water for cellular hydration' },
                { title: 'Pre/Post Meal Fuel', time: '12:30 PM & 18:00', desc: 'Consume 40g protein + complex carbohydrates' },
                { title: 'Sleep & Recovery', time: '10:30 PM', desc: 'Melatonin optimization & wind-down mobility' },
              ].map((notif, idx) => (
                <div key={idx} className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{notif.title}</span>
                    <span className="text-[10px] font-mono text-lime-400 font-semibold">{notif.time}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">{notif.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features 8, 9, 10: Mobile, Cloud & Coach Ecosystem */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feature 8: Mobile Application */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Feature 8</span>
                  <h4 className="text-base font-bold text-white font-display">Mobile Application (iOS / Android)</h4>
                </div>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Native React Native / Kotlin & Swift applications with offline workout logging inside gym basements, haptic rep counters, and home screen widgets.
              </p>
              <div className="rounded-xl bg-neutral-950 p-3 text-[11px] text-neutral-300 border border-neutral-800 font-mono">
                ✓ Offline Local SQLite Cache<br />
                ✓ iOS HealthKit & Android Health Connect<br />
                ✓ WatchOS companion app
              </div>
            </div>

            {/* Feature 9: Cloud Deployment */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400/10 text-blue-400">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Feature 9</span>
                  <h4 className="text-base font-bold text-white font-display">Cloud Deployment & Sync</h4>
                </div>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Containerized deployment on Google Cloud Run with automatic scaling to zero, low latency edge delivery, and secure multi-device synchronization.
              </p>
              <div className="rounded-xl bg-neutral-950 p-3 text-[11px] text-neutral-300 border border-neutral-800 font-mono">
                ✓ Docker + Cloud Run Scalability<br />
                ✓ Fast multi-region replication<br />
                ✓ 99.99% service uptime
              </div>
            </div>

            {/* Feature 10: Coach/Trainer Support */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Feature 10</span>
                  <h4 className="text-base font-bold text-white font-display">Coach / Trainer Support</h4>
                </div>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Certified human coaches can supervise athlete profiles, leave comments on logged sets, override workout volume, and track client adherence.
              </p>
              <div className="rounded-xl bg-neutral-950 p-3 text-[11px] text-neutral-300 border border-neutral-800 font-mono">
                ✓ Trainer-to-Athlete Dashboard<br />
                ✓ Exercise video review & feedback<br />
                ✓ Adherence & wellness score alerts
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
