import React, { useState } from 'react';
import {
  Code,
  FileText,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Layers,
  Database,
  Sparkles,
  Server,
  Download,
} from 'lucide-react';

const PYTHON_FILES: { [key: string]: { label: string; language: string; description: string; path: string } } = {
  'app/main.py': {
    label: 'main.py',
    language: 'python',
    description: 'FastAPI application initialization, static files mounting, SQLite DB bootstrap, and router setup.',
    path: 'app/main.py',
  },
  'app/routes.py': {
    label: 'routes.py',
    language: 'python',
    description: 'FastAPI route handlers for Home form, 7-Day Plan Generation, Gemini Flash tips, Feedback updates, and Admin Dashboard.',
    path: 'app/routes.py',
  },
  'app/database.py': {
    label: 'database.py',
    language: 'python',
    description: 'SQLite configuration with SQLAlchemy models: User and WorkoutPlan (storing original_plan & updated_plan).',
    path: 'app/database.py',
  },
  'app/gemini_generator.py': {
    label: 'gemini_generator.py',
    language: 'python',
    description: 'Google Gemini AI generator for 7-Day workout plans with warm-ups, exercises, sets/reps, rest, and cool-downs.',
    path: 'app/gemini_generator.py',
  },
  'app/gemini_flash_generator.py': {
    label: 'gemini_flash_generator.py',
    language: 'python',
    description: 'Gemini Flash engine generating concise, goal-targeted nutrition and muscular recovery tips.',
    path: 'app/gemini_flash_generator.py',
  },
  'app/updated_plan.py': {
    label: 'updated_plan.py',
    language: 'python',
    description: 'Gemini Pro plan updater accepting original plan + user feedback (e.g. "Add more cardio", "Add yoga").',
    path: 'app/updated_plan.py',
  },
  'templates/index.html': {
    label: 'index.html',
    language: 'html',
    description: 'Jinja2 template for Home Page with user parameter form (Name, User ID, Age, Weight, Goal, Intensity).',
    path: 'templates/index.html',
  },
  'templates/result.html': {
    label: 'result.html',
    language: 'html',
    description: 'Jinja2 template rendering 7-day plan, Gemini Flash nutrition tip, and feedback plan updater with preset chips.',
    path: 'templates/result.html',
  },
  'templates/all_users.html': {
    label: 'all_users.html',
    language: 'html',
    description: 'Admin dashboard page displaying users, age, weight, fitness goal, intensity, original plan, and updated plan.',
    path: 'templates/all_users.html',
  },
  'requirements.txt': {
    label: 'requirements.txt',
    language: 'text',
    description: 'Python project dependencies: fastapi, uvicorn, sqlalchemy, google-genai, jinja2, etc.',
    path: 'requirements.txt',
  },
  'README.md': {
    label: 'README.md',
    language: 'markdown',
    description: 'Complete documentation, setup instructions, architecture, future roadmap, and Short PPT version.',
    path: 'README.md',
  },
};

export const PythonProjectViewer: React.FC = () => {
  const [selectedFileKey, setSelectedFileKey] = useState<string>('app/main.py');
  const [copied, setCopied] = useState(false);
  const [fileContents, setFileContents] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const activeFile = PYTHON_FILES[selectedFileKey];

  const loadFile = async (key: string) => {
    if (fileContents[key]) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/file-content?path=${encodeURIComponent(key)}`);
      if (res.ok) {
        const data = await res.json();
        setFileContents((prev) => ({ ...prev, [key]: data.content }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadFile(selectedFileKey);
  }, [selectedFileKey]);

  const handleCopy = () => {
    const text = fileContents[selectedFileKey] || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-lime-400 uppercase tracking-wider mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>Python FastAPI & Gemini Models Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Python Project Structure & Codebase
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Modular, college-project-ready implementation with FastAPI, SQLAlchemy, SQLite, Gemini 1.5 Pro, and Gemini Flash.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/all_users"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white hover:border-lime-400 transition-colors font-medium"
          >
            <span>Open all_users.html View</span>
            <ExternalLink className="w-3.5 h-3.5 text-lime-400" />
          </a>
        </div>
      </div>

      {/* Quick Launch Guide */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-400">
          <Terminal className="w-4 h-4" />
          <span>How to Run the Python Project Locally</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="rounded-xl bg-neutral-950 p-3 border border-neutral-800">
            <span className="text-neutral-500 block mb-1"># 1. Install dependencies</span>
            <code className="text-lime-300">pip install -r requirements.txt</code>
          </div>
          <div className="rounded-xl bg-neutral-950 p-3 border border-neutral-800">
            <span className="text-neutral-500 block mb-1"># 2. Set Gemini API Key</span>
            <code className="text-lime-300">export GEMINI_API_KEY="..."</code>
          </div>
          <div className="rounded-xl bg-neutral-950 p-3 border border-neutral-800">
            <span className="text-neutral-500 block mb-1"># 3. Start FastAPI server</span>
            <code className="text-lime-300">uvicorn app.main:app --reload</code>
          </div>
        </div>
      </div>

      {/* File Explorer & Code Viewer */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden shadow-2xl">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-neutral-800 bg-neutral-950/90 p-2 scrollbar-none">
          {Object.entries(PYTHON_FILES).map(([key, file]) => {
            const isSelected = selectedFileKey === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedFileKey(key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-neutral-800 text-lime-400 border border-neutral-700 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{file.label}</span>
              </button>
            );
          })}
        </div>

        {/* File Description Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 bg-neutral-900 px-5 py-3 text-xs">
          <div>
            <span className="font-mono text-lime-400 font-semibold">{activeFile.path}</span>
            <p className="text-neutral-400 mt-0.5">{activeFile.description}</p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-lime-400" />
                <span className="text-lime-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-neutral-950 max-h-[600px] overflow-y-auto font-mono text-xs text-neutral-300 leading-relaxed">
          {loading && !fileContents[selectedFileKey] ? (
            <div className="p-8 text-center text-neutral-500">Loading code...</div>
          ) : (
            <pre className="whitespace-pre-wrap">{fileContents[selectedFileKey] || '// File content empty or loading'}</pre>
          )}
        </div>
      </div>
    </div>
  );
};
