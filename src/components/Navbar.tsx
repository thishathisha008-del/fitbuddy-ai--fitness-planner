import React from 'react';
import {
  Dumbbell,
  Sparkles,
  Calendar,
  Utensils,
  TrendingUp,
  MessageSquare,
  User,
  ShieldCheck,
  Play,
  Flame,
  Database,
  Terminal,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenGenerator: () => void;
  onOpenProfile: () => void;
  onOpenSafety: () => void;
  onStartActiveWorkout: () => void;
  hasActiveWorkout: boolean;
  streakCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenGenerator,
  onOpenProfile,
  onOpenSafety,
  onStartActiveWorkout,
  hasActiveWorkout,
  streakCount,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Dumbbell },
    { id: 'plan', label: '7-Day Plan', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'assistant', label: 'AI Coach', icon: MessageSquare },
    { id: 'admin', label: 'All Users (Admin)', icon: Database },
    { id: 'python_project', label: 'FastAPI Code', icon: Terminal },
    { id: 'roadmap', label: 'Future Features', icon: Sparkles },
  ];

  return (
    <>
      {/* Top Bar Desktop & Tablet */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Wordmark & Streak */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 text-left focus:outline-none"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 font-extrabold text-neutral-950 shadow-sm shadow-lime-400/20">
                FB
              </span>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                FitBuddy<span className="text-lime-400">.</span>
              </span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 ml-3 pl-3 border-l border-neutral-800 text-xs text-neutral-400">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="font-semibold text-neutral-200 tabular-nums">{streakCount}d</span> streak
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const isSpecial = item.id === 'admin';
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs lg:text-sm font-medium transition-colors whitespace-nowrap rounded-lg ${
                    isActive
                      ? 'bg-neutral-800 text-lime-400 font-semibold'
                      : isSpecial
                      ? 'text-neutral-300 hover:text-white hover:bg-neutral-900 border border-neutral-800/80'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                  }`}
                >
                  {isSpecial && <Database className="w-3.5 h-3.5 text-lime-400" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenSafety}
              title="Fitness Safety & RPE Guide"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Safety</span>
            </button>

            <button
              onClick={onOpenProfile}
              title="Athlete Profile"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
            >
              <User className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenGenerator}
              className="flex items-center gap-2 rounded-lg bg-lime-400 px-3.5 py-2 text-xs font-bold text-neutral-950 shadow-sm transition-all hover:bg-lime-300 hover:shadow-lime-400/20 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Generate 7-Day Plan</span>
              <span className="sm:hidden">7D Plan</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-800/80 bg-neutral-950/95 backdrop-blur-lg pb-safe">
        <div className="grid grid-cols-6 items-center h-16 max-w-md mx-auto px-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
              activeTab === 'dashboard' ? 'text-lime-400' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span className="text-[9px] font-medium tracking-tight mt-1">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('plan')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
              activeTab === 'plan' ? 'text-lime-400' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Play className="w-4 h-4" />
            <span className="text-[9px] font-medium tracking-tight mt-1">7D Plan</span>
          </button>

          <button
            onClick={onOpenGenerator}
            className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] -mt-4"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-400 text-neutral-950 shadow-lg shadow-lime-400/30 active:scale-90 transition-transform">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <span className="text-[8px] font-bold text-lime-400 tracking-tight mt-0.5">AI Gen</span>
          </button>

          <button
            onClick={() => setActiveTab('nutrition')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
              activeTab === 'nutrition' ? 'text-lime-400' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span className="text-[9px] font-medium tracking-tight mt-1">Diet</span>
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
              activeTab === 'assistant' ? 'text-lime-400' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-[9px] font-medium tracking-tight mt-1">Coach</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
              activeTab === 'admin' ? 'text-lime-400' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span className="text-[9px] font-medium tracking-tight mt-1">Admin</span>
          </button>
        </div>
      </div>
    </>
  );
};
