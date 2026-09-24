import React, { useState, useEffect } from 'react';
import {
  Users,
  Database,
  Calendar,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
  Eye,
  FileText,
  Clock,
  Dumbbell,
  ShieldCheck,
  Star,
  Activity,
  Layers,
  ChevronRight,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { AdminUserData, FitnessPlan } from '../types.ts';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [intensityFilter, setIntensityFilter] = useState<string>('all');

  // Selected User for Deep Plan Inspection
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userPlans, setUserPlans] = useState<FitnessPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedPlanVersion, setSelectedPlanVersion] = useState<number>(1);

  // Active Admin Tab
  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'feedbacks'>('users');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, feedbacksRes] = await Promise.all([
        fetch('/api/admin/users').then((r) => r.json()).catch(() => []),
        fetch('/api/admin/feedbacks').then((r) => r.json()).catch(() => []),
      ]);
      setUsers(Array.isArray(usersRes) ? usersRes : []);
      setFeedbacks(Array.isArray(feedbacksRes) ? feedbacksRes : []);

      if (usersRes?.length > 0 && !selectedUserId) {
        setSelectedUserId(usersRes[0].id);
      }
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch plans when selected user changes
  useEffect(() => {
    if (!selectedUserId) return;
    setPlansLoading(true);
    fetch(`/api/admin/users/${selectedUserId}/plans`)
      .then((r) => r.json())
      .then((data) => {
        const plansList = Array.isArray(data) ? data : [];
        setUserPlans(plansList);
        if (plansList.length > 0) {
          // Default to latest version or version 1
          setSelectedPlanVersion(plansList[plansList.length - 1].version || 1);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setPlansLoading(false));
  }, [selectedUserId]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.fitnessGoal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIntensity =
      intensityFilter === 'all' || u.workoutIntensity?.toLowerCase() === intensityFilter.toLowerCase();
    return matchesSearch && matchesIntensity;
  });

  const selectedUser = users.find((u) => u.id === selectedUserId);
  const originalPlan = userPlans.find((p) => p.version === 1 || p.isOriginal);
  const currentViewingPlan =
    userPlans.find((p) => p.version === selectedPlanVersion) || userPlans[userPlans.length - 1];

  return (
    <div className="space-y-6">
      {/* Top Banner & SQLite Database Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-lime-400 uppercase tracking-wider mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>SQLite Database Administration Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Admin Overview: Athletes, Original & Updated Plans
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Inspect persistent SQLite records, compare original vs feedback-updated plans, and analyze athlete adaptation metrics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SQLite: <strong className="text-white">fitbuddy.sqlite</strong></span>
          </div>

          <a
            href="/all_users"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-2 text-xs font-semibold text-white hover:border-lime-400 hover:text-lime-400 transition-colors"
          >
            <span>all_users.html</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 rounded-xl bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs font-semibold text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Aggregate Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-1">
          <span className="text-xs text-neutral-400">Total Registered Athletes</span>
          <p className="text-2xl font-extrabold text-white font-display tabular-nums">
            {users.length}
          </p>
          <span className="text-[11px] text-lime-400 font-medium">Stored in SQLite users table</span>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-1">
          <span className="text-xs text-neutral-400">Total Plans Generated</span>
          <p className="text-2xl font-extrabold text-white font-display tabular-nums">
            {users.reduce((acc, u) => acc + (u.planCount || 0), 0) || users.length}
          </p>
          <span className="text-[11px] text-cyan-400 font-medium">7-Day Periodized Routines</span>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-1">
          <span className="text-xs text-neutral-400">Users with Plan Updates</span>
          <p className="text-2xl font-extrabold text-lime-400 font-display tabular-nums">
            {users.filter((u) => u.hasUpdates || u.planCount > 1).length}
          </p>
          <span className="text-[11px] text-neutral-400">Iterated via user feedback</span>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-1">
          <span className="text-xs text-neutral-400">Feedback Submissions</span>
          <p className="text-2xl font-extrabold text-violet-400 font-display tabular-nums">
            {feedbacks.length}
          </p>
          <span className="text-[11px] text-neutral-400">Logged in feedbacks table</span>
        </div>
      </div>

      {/* Sub Tabs: Users & Plans vs Feedbacks Log */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveAdminTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeAdminTab === 'users'
              ? 'bg-lime-400 text-neutral-950 shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Athletes & Plan Versions</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('feedbacks')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeAdminTab === 'feedbacks'
              ? 'bg-lime-400 text-neutral-950 shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Feedback Stream ({feedbacks.length})</span>
        </button>
      </div>

      {activeAdminTab === 'users' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: User Directory List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {/* Search & Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search by athlete name, goal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/90 pl-9 pr-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-lime-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-neutral-500 shrink-0">Intensity:</span>
                {['all', 'low', 'moderate', 'high', 'extreme'].map((int) => (
                  <button
                    key={int}
                    onClick={() => setIntensityFilter(int)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-colors ${
                      intensityFilter === int
                        ? 'bg-neutral-800 text-lime-400 font-bold border border-neutral-700'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {int}
                  </button>
                ))}
              </div>
            </div>

            {/* Users List Cards */}
            <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
              {filteredUsers.length === 0 ? (
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 text-center text-xs text-neutral-500">
                  No athletes found matching criteria.
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const isSelected = u.id === selectedUserId;
                  return (
                    <button
                      key={u.id}
                      onClick={() => setSelectedUserId(u.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all relative ${
                        isSelected
                          ? 'bg-neutral-900 border-lime-400/80 shadow-md ring-1 ring-lime-400/30'
                          : 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-white">{u.name}</h4>
                            {u.hasUpdates && (
                              <span className="rounded bg-lime-950/80 border border-lime-500/40 px-1.5 py-0.2 text-[9px] font-bold text-lime-400">
                                Updated v{u.latestPlanVersion}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            {u.age} yrs · {u.weightKg} kg · <span className="capitalize">{u.fitnessGoal?.replace('_', ' ')}</span>
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                            u.workoutIntensity === 'extreme'
                              ? 'bg-red-950/60 text-red-400 border border-red-500/30'
                              : u.workoutIntensity === 'high'
                              ? 'bg-orange-950/60 text-orange-400 border border-orange-500/30'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}>
                            {u.workoutIntensity || 'moderate'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-500">
                        <span>{u.planCount || 1} Plan Version{u.planCount > 1 ? 's' : ''}</span>
                        <span>{new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Plans Comparison & Inspection (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {selectedUser ? (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 sm:p-6 space-y-5">
                {/* User Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white font-display">{selectedUser.name}</h3>
                      <span className="text-xs text-neutral-400">({selectedUser.email || 'Athlete Profile'})</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 mt-1">
                      <span>Age: {selectedUser.age}</span>
                      <span aria-hidden="true">·</span>
                      <span>Weight: {selectedUser.weightKg} kg</span>
                      <span aria-hidden="true">·</span>
                      <span>Goal: <strong className="text-white capitalize">{selectedUser.fitnessGoal?.replace('_', ' ')}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Intensity: <strong className="text-lime-400 capitalize">{selectedUser.workoutIntensity}</strong></span>
                    </div>
                  </div>

                  {/* Version Selector Tabs */}
                  {userPlans.length > 0 && (
                    <div className="flex items-center gap-1.5 p-1 bg-neutral-950 border border-neutral-800 rounded-xl">
                      {userPlans.map((p) => {
                        const isSelectedVer = p.version === selectedPlanVersion;
                        return (
                          <button
                            key={p.version}
                            onClick={() => setSelectedPlanVersion(p.version)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              isSelectedVer
                                ? 'bg-lime-400 text-neutral-950 shadow-sm'
                                : 'text-neutral-400 hover:text-white'
                            }`}
                          >
                            v{p.version} {p.isOriginal ? '(Original)' : '(Updated)'}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {plansLoading ? (
                  <div className="py-12 text-center text-xs text-neutral-400">
                    Loading plans from SQLite database...
                  </div>
                ) : currentViewingPlan ? (
                  <div className="space-y-4">
                    {/* Plan Summary Card */}
                    <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-lime-400">
                            {currentViewingPlan.isOriginal ? 'Original 7-Day Plan' : `Updated Plan (Version ${currentViewingPlan.version})`}
                          </span>
                          <h4 className="text-base font-bold text-white font-display mt-0.5">
                            {currentViewingPlan.planTitle}
                          </h4>
                        </div>
                        <span className="text-[11px] text-neutral-500 shrink-0">
                          {new Date(currentViewingPlan.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {currentViewingPlan.planOverview}
                      </p>

                      {/* Quick nutrition tip by Gemini Flash */}
                      {currentViewingPlan.quickNutritionRecoveryTip && (
                        <div className="mt-2 pt-2 border-t border-neutral-800 flex items-start gap-2 text-xs text-cyan-300">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span><strong>Gemini Flash Recovery Tip:</strong> {currentViewingPlan.quickNutritionRecoveryTip}</span>
                        </div>
                      )}
                    </div>

                    {/* Feedback History & Applied Changes (If plan was updated) */}
                    {currentViewingPlan.feedbackHistory && currentViewingPlan.feedbackHistory.length > 0 && (
                      <div className="rounded-xl border border-lime-500/30 bg-lime-950/15 p-4 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-lime-400 uppercase tracking-wider">
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Applied Feedback & Plan Adjustments</span>
                        </div>
                        {currentViewingPlan.feedbackHistory.map((fb, idx) => (
                          <div key={idx} className="text-xs space-y-1">
                            <p className="text-neutral-300 italic">
                              Athlete Feedback: "{fb.feedbackText}"
                            </p>
                            <p className="text-lime-300 font-medium">
                              Changes Implemented: {fb.changesSummary}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 7-Day Breakdown Table / Cards */}
                    <div>
                      <h5 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2.5">
                        7-Day Training Schedule Breakdown ({currentViewingPlan.days?.length || 7} Days)
                      </h5>
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {(currentViewingPlan.days || []).map((day) => (
                          <div
                            key={day.dayNumber}
                            className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3 text-xs flex items-center justify-between gap-3"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">Day {day.dayNumber}: {day.title}</span>
                                {day.isRestDay && (
                                  <span className="rounded bg-neutral-800 px-1.5 py-0.2 text-[10px] text-cyan-400">
                                    Recovery
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-neutral-400">
                                {day.focusArea} · {day.estimatedDurationMinutes} mins · {day.exercises?.length || 0} movements
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <span className="text-[10px] font-semibold text-neutral-400">
                                {day.difficulty}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-neutral-400">
                    No plan generated yet for this athlete.
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center text-xs text-neutral-500">
                Select an athlete from the directory to inspect their original and updated plans.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Tab 2: Feedbacks Stream */
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              All User Feedback Submissions ({feedbacks.length})
            </h3>
            <span className="text-xs text-neutral-400">Persisted in SQLite feedbacks table</span>
          </div>

          {feedbacks.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              No feedbacks submitted yet. Athletes can submit feedback on their plan to update it!
            </div>
          ) : (
            <div className="space-y-3">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{fb.user_name || 'Athlete'}</span>
                      {fb.rating && (
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: fb.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-500">
                      {new Date(fb.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>

                  <p className="text-neutral-200 bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                    "{fb.feedback_text}"
                  </p>

                  {fb.changes_summary && (
                    <div className="text-lime-400 flex items-start gap-1.5 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{fb.changes_summary}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
