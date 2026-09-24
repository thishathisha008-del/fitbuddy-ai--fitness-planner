import React, { useState } from 'react';
import { X, User, Check, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import { UserProfile, FitnessGoal, FitnessLevel, WorkoutPreference, WorkoutIntensity } from '../types.ts';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
  onSaveAndRegenerate: (updated: UserProfile) => void;
}

const EQUIPMENT_OPTIONS = [
  'Dumbbells',
  'Barbell & Plates',
  'Bench (Flat/Incline)',
  'Pull-up Bar',
  'Kettlebell',
  'Resistance Bands',
  'Cable Machine',
  'Squat Rack',
  'Cardio Machine (Row/Bike)',
  'Bodyweight Only',
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  onSaveAndRegenerate,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  if (!isOpen) return null;

  const handleToggleEquipment = (eq: string) => {
    setFormData((prev) => {
      const exists = prev.equipment.includes(eq);
      if (exists) {
        return { ...prev, equipment: prev.equipment.filter((item) => item !== eq) };
      } else {
        return { ...prev, equipment: [...prev.equipment, eq] };
      }
    });
  };

  const handleToggleDay = (day: string) => {
    setFormData((prev) => {
      const exists = prev.preferredDays.includes(day);
      if (exists) {
        if (prev.preferredDays.length <= 1) return prev;
        return {
          ...prev,
          preferredDays: prev.preferredDays.filter((d) => d !== day),
        };
      } else {
        return {
          ...prev,
          preferredDays: [...prev.preferredDays, day],
        };
      }
    });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleSaveAndGenerate = () => {
    onSave(formData);
    onSaveAndRegenerate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-950/80">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-lime-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Athlete Profile & Physical Parameters
              </h2>
              <p className="text-xs text-neutral-400">
                Customized inputs calibrated by Gemini AI and saved to SQLite
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-neutral-200 text-sm">
          {/* Section: Basic Info */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
              Personal Metrics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-sm text-white focus:border-lime-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Age</label>
                <input
                  type="number"
                  min="14"
                  max="90"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) || 25 })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-sm text-white focus:border-lime-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  min="35"
                  max="250"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) || 70 })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-sm text-white focus:border-lime-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Height (cm)</label>
                <input
                  type="number"
                  min="120"
                  max="230"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) || 175 })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-sm text-white focus:border-lime-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Goal & Intensity */}
          <div className="pt-4 border-t border-neutral-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
              Goal & Workout Intensity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Primary Fitness Goal</label>
                <select
                  value={formData.primaryGoal}
                  onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value as FitnessGoal })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-sm text-white focus:border-lime-400 focus:outline-none"
                >
                  <option value="muscle_gain">Muscle Hypertrophy & Growth</option>
                  <option value="weight_loss">Fat Loss & Metabolic Conditioning</option>
                  <option value="strength">Absolute Power & Maximal Strength</option>
                  <option value="endurance">Cardiovascular Endurance & Stamina</option>
                  <option value="general_fitness">General Health & Longevity</option>
                  <option value="athletic_performance">Athletic Power & Agility</option>
                  <option value="flexibility_mobility">Mobility, Flexibility & Posture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Workout Intensity Level</label>
                <select
                  value={formData.workoutIntensity || 'moderate'}
                  onChange={(e) => setFormData({ ...formData, workoutIntensity: e.target.value as WorkoutIntensity })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-sm text-white focus:border-lime-400 focus:outline-none"
                >
                  <option value="low">Low Intensity (Recovery & Gentle Mobility)</option>
                  <option value="moderate">Moderate Intensity (Progressive & Sustainable)</option>
                  <option value="high">High Intensity (Push to Technical Failure)</option>
                  <option value="extreme">Extreme Intensity (Max Volume & Power Peak)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Fitness Experience Level</label>
                <select
                  value={formData.fitnessLevel}
                  onChange={(e) => setFormData({ ...formData, fitnessLevel: e.target.value as FitnessLevel })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-sm text-white focus:border-lime-400 focus:outline-none"
                >
                  <option value="beginner">Beginner (0-6 months training)</option>
                  <option value="intermediate">Intermediate (6 months - 2 years)</option>
                  <option value="advanced">Advanced (2+ years disciplined lifting)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Time Available Per Workout</label>
                <select
                  value={formData.availableTimeMinutes}
                  onChange={(e) => setFormData({ ...formData, availableTimeMinutes: Number(e.target.value) })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-sm text-white focus:border-lime-400 focus:outline-none"
                >
                  <option value={30}>30 Minutes (Quick & Intense)</option>
                  <option value={45}>45 Minutes (Balanced Optimal)</option>
                  <option value={60}>60 Minutes (Comprehensive)</option>
                  <option value={75}>75 Minutes (High Volume)</option>
                  <option value={90}>90 Minutes (Complete Powerhouse)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Equipment Access */}
          <div className="pt-4 border-t border-neutral-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Available Equipment
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EQUIPMENT_OPTIONS.map((item) => {
                const isChecked = formData.equipment.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleToggleEquipment(item)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-left border transition-all ${
                      isChecked
                        ? 'bg-lime-400/10 border-lime-400/50 text-lime-300'
                        : 'bg-neutral-800/50 border-neutral-700/60 text-neutral-400 hover:text-neutral-200 hover:border-neutral-600'
                    }`}
                  >
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        isChecked ? 'border-lime-400 bg-lime-400 text-neutral-950' : 'border-neutral-600'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Injuries & Restrictions */}
          <div className="pt-4 border-t border-neutral-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Injuries or Physical Restrictions</span>
            </div>
            <textarea
              rows={2}
              value={formData.injuriesOrRestrictions}
              onChange={(e) => setFormData({ ...formData, injuriesOrRestrictions: e.target.value })}
              placeholder="e.g. Mild lower back sensitivity on deadlifts, left shoulder impingement, avoid high-impact jumping..."
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-sm text-white focus:border-lime-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-800 px-6 py-4 bg-neutral-950/80">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-none rounded-xl bg-neutral-800 border border-neutral-700 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-700 transition-colors"
            >
              Save Profile
            </button>
            <button
              onClick={handleSaveAndGenerate}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-lime-400 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-lime-300 transition-colors shadow-sm shadow-lime-400/20"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Save & Generate Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
