import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bell, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles,
  AlertCircle,
  Volume2
} from 'lucide-react';
import type { ReminderItem, ActiveTimer } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reminders: ReminderItem[];
  timers: ActiveTimer[];
  onAddReminder: (title: string, time: string, priority: 'low' | 'medium' | 'high', category: 'work' | 'health' | 'home' | 'personal') => void;
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  onAddTimer: (label: string, seconds: number) => void;
  onDeleteTimer: (id: string) => void;
  onSpeakHindi: (text: string) => void;
}

export const RemindersManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  reminders,
  timers,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder,
  onAddTimer,
  onDeleteTimer,
  onSpeakHindi
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'reminders' | 'timers'>('reminders');
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('06:00 PM');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('high');
  const [newCategory, setNewCategory] = useState<'work' | 'health' | 'home' | 'personal'>('personal');

  // Interactive Live Countdown Timer
  const [localSeconds, setLocalSeconds] = useState<number>(300); // 5 min default
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerLabel, setTimerLabel] = useState<string>('Quick Tea / Coffee Timer');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && localSeconds > 0) {
      interval = setInterval(() => {
        setLocalSeconds(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            onSpeakHindi("समय पूरा हो गया है! आपका टाइमर समाप्त हो गया है।");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, localSeconds, onSpeakHindi]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddReminder(newTitle.trim(), newTime, newPriority, newCategory);
    setNewTitle('');
  };

  const handleStartPreset = (sec: number, label: string) => {
    setLocalSeconds(sec);
    setTimerLabel(label);
    setIsTimerRunning(true);
    onSpeakHindi(`${label} का टाइमर शुरू कर दिया गया है।`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#141418] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto text-neutral-100 ring-1 ring-cyan-500/20">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-950/50">
              <Bell className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-wide font-hud">
                  REMINDERS & TIMERS HUB
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {reminders.filter(r => !r.completed).length} PENDING
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                JARVIS Schedule Manager • Voice notifications in Hindi
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 p-1 rounded-2xl bg-neutral-900 border border-white/5">
          <button
            onClick={() => setActiveTab('reminders')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'reminders'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            Active Reminders ({reminders.length})
          </button>
          <button
            onClick={() => setActiveTab('timers')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'timers'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            Countdown Timers
          </button>
        </div>

        {/* TAB 1: REMINDERS */}
        {activeTab === 'reminders' && (
          <div className="space-y-4">
            
            {/* Create Reminder Form */}
            <form onSubmit={handleCreateReminder} className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-hud">
                <Plus className="w-3.5 h-3.5 text-cyan-400" /> Add New Directive / Reminder
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Task description (e.g. Drink water, Call Rahul)..."
                  className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/60"
                />
                <input
                  type="text"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  placeholder="Time (e.g. In 20 minutes, 05:00 PM)..."
                  className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/60"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[11px] text-neutral-400">Category:</span>
                  {(['personal', 'work', 'health', 'home'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition cursor-pointer ${
                        newCategory === cat
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-neutral-900 text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white text-xs font-bold transition shadow cursor-pointer"
                >
                  Save Reminder
                </button>
              </div>
            </form>

            {/* Reminders List */}
            <div className="space-y-2">
              {reminders.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-xs">
                  No reminders active. Speak "Maya remind me to..." or add one above!
                </div>
              ) : (
                reminders.map(rem => (
                  <div
                    key={rem.id}
                    className={`p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                      rem.completed
                        ? 'bg-neutral-950/40 border-neutral-900 opacity-60'
                        : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onToggleReminder(rem.id)}
                        className="cursor-pointer text-neutral-400 hover:text-cyan-400 transition"
                      >
                        {rem.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                      <div>
                        <h4 className={`text-xs font-bold ${rem.completed ? 'line-through text-neutral-500' : 'text-white'}`}>
                          {rem.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-[10px] text-neutral-400 mt-0.5">
                          <span className="flex items-center gap-1 font-mono text-cyan-300">
                            <Clock className="w-3 h-3" /> {rem.time}
                          </span>
                          <span>•</span>
                          <span className="uppercase font-semibold text-neutral-500">{rem.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {rem.spokenHindiText && (
                        <button
                          onClick={() => onSpeakHindi(rem.spokenHindiText!)}
                          title="Speak reminder in Hindi"
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-cyan-400 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteReminder(rem.id)}
                        title="Delete reminder"
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-500 hover:text-red-400 cursor-pointer transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* TAB 2: LIVE COUNTDOWN TIMERS */}
        {activeTab === 'timers' && (
          <div className="space-y-4">
            
            {/* Big Visual Timer Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-cyan-500/30 text-center space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-cyan-400 font-hud">
                {timerLabel}
              </span>

              {/* Glowing Digit Display */}
              <div className="text-6xl sm:text-7xl font-black text-white font-mono tracking-wider drop-shadow-md py-2">
                {formatTimer(localSeconds)}
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => setIsTimerRunning(prev => !prev)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white transition shadow-lg cursor-pointer ${
                    isTimerRunning
                      ? 'bg-amber-600 hover:bg-amber-500'
                      : 'bg-gradient-to-tr from-cyan-600 to-blue-600 hover:scale-105'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setLocalSeconds(300);
                  }}
                  title="Reset to 5m"
                  className="w-12 h-12 rounded-2xl bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition cursor-pointer"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Timer Presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-hud">
                QUICK PRESET TIMERS:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: '1 Minute Quick', sec: 60 },
                  { label: '5 Minutes Break', sec: 300 },
                  { label: '15 Minutes Sprint', sec: 900 },
                  { label: '25m Pomodoro', sec: 1500 }
                ].map(p => (
                  <button
                    key={p.sec}
                    onClick={() => handleStartPreset(p.sec, p.label)}
                    className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-left transition cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 block">
                      {p.label}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">
                      {formatTimer(p.sec)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
