import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Trash2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { AssistantChatMessage, FitnessPlan, UserProfile } from '../types.ts';

interface AiAssistantChatProps {
  profile: UserProfile;
  activePlan: FitnessPlan;
  initialQuestion?: string;
  onClearInitialQuestion?: () => void;
}

const QUICK_PROMPTS = [
  'How do I fix knee cave during heavy squats?',
  'Substitute Romanian Deadlift with dumbbells or bands',
  'I only have 25 minutes today, how can I modify Day 1?',
  'My lower back is tight after yesterday, what recovery drills help?',
  'What should I eat 45 minutes before lifting for maximum energy?',
];

export const AiAssistantChat: React.FC<AiAssistantChatProps> = ({
  profile,
  activePlan,
  initialQuestion,
  onClearInitialQuestion,
}) => {
  const [messages, setMessages] = useState<AssistantChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: `Hey ${profile.name}! I'm your FitBuddy AI Coach powered by Gemini 3.8. I'm tuned to your active "${activePlan.planTitle}" program and your ${profile.fitnessLevel} level. 

Ask me anything about exercise technique, joint-friendly substitutions, pre/post workout nutrition, or adapting workouts on busy days!`,
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialQuestion) {
      sendMessage(initialQuestion);
      if (onClearInitialQuestion) onClearInitialQuestion();
    }
  }, [initialQuestion]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMsg: AssistantChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.content,
          })),
          profile,
          activePlan,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const botMsg: AssistantChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: data.reply || 'Here are some tips to optimize your training.',
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: AssistantChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: 'I had trouble connecting to the Gemini engine. Please check your network or try asking again.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: `Chat cleared! What training question or exercise modification can I help you with today?`,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[750px] max-h-[80vh] rounded-2xl border border-neutral-800 bg-neutral-900/80 shadow-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-neutral-950 font-bold shadow-sm shadow-lime-400/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-display">FitBuddy AI Coach</h3>
              <span className="flex items-center gap-1 rounded-md bg-lime-950/60 border border-lime-500/30 px-2 py-0.5 text-[10px] font-semibold text-lime-400">
                <Sparkles className="w-3 h-3 fill-current" />
                Gemini 3.8
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Personalized form cues, workout adaptations & nutrition coaching
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                  isUser
                    ? 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                    : 'bg-lime-400 text-neutral-950'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-1.5 ${
                  isUser
                    ? 'bg-lime-400 text-neutral-950 font-medium'
                    : 'bg-neutral-950/80 border border-neutral-800 text-neutral-200 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[10px] text-right ${
                    isUser ? 'text-neutral-800' : 'text-neutral-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-lime-400 text-neutral-950 font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl bg-neutral-950/80 border border-neutral-800 p-4 text-xs text-neutral-400 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-lime-400" />
              <span>Coach is formulating biomechanical advice...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="px-4 py-2 bg-neutral-950/60 border-t border-neutral-800/80 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[11px] font-semibold text-neutral-500 shrink-0">Quick ask:</span>
        {QUICK_PROMPTS.map((prompt, pIdx) => (
          <button
            key={pIdx}
            onClick={() => sendMessage(prompt)}
            disabled={loading}
            className="shrink-0 px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:text-white hover:border-lime-400/50 hover:bg-neutral-800 transition-colors whitespace-nowrap disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-4 bg-neutral-950 border-t border-neutral-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputPrompt);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={loading}
            placeholder="Ask about exercise form, substitutions, recovery, or adjustments..."
            className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:border-lime-400 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || loading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime-400 text-neutral-950 font-bold hover:bg-lime-300 transition-colors shadow-sm shadow-lime-400/20 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
