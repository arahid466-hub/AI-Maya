import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Home, 
  Bell, 
  Radio, 
  MessageSquare, 
  Smartphone, 
  Settings, 
  Activity, 
  ShieldCheck,
  Crown
} from 'lucide-react';

interface Props {
  viewMode: 'voice' | 'chat';
  onSetViewMode: (mode: 'voice' | 'chat') => void;
  activeVoiceName: string;
  activeSmartDeviceCount: number;
  pendingRemindersCount: number;
  onOpenSmartHome: () => void;
  onOpenReminders: () => void;
  onOpenMusic: () => void;
  onOpenVoiceSelector: () => void;
  onOpenApkModal: () => void;
  onOpenSettings: () => void;
  isApkFrameActive: boolean;
  onToggleApkFrame: () => void;
}

export const JarvisHudHeader: React.FC<Props> = ({
  viewMode,
  onSetViewMode,
  activeVoiceName,
  activeSmartDeviceCount,
  pendingRemindersCount,
  onOpenSmartHome,
  onOpenReminders,
  onOpenMusic,
  onOpenVoiceSelector,
  onOpenApkModal,
  onOpenSettings,
  isApkFrameActive,
  onToggleApkFrame
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-rose-900/30 bg-[#07070b]/95 backdrop-blur-xl flex items-center justify-between px-3 sm:px-6 z-30 shrink-0">
      
      {/* Brand Identity: Maya Queen */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          {/* Maya Queen Core Avatar Badge with Gold Crown */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/60 ring-1 ring-amber-400/40">
            <Crown className="w-5 h-5 text-amber-200" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-neutral-950 animate-ping" />
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-sm sm:text-base tracking-wider text-white font-hud flex items-center gap-1.5">
              MAYA <span className="bg-gradient-to-r from-rose-400 to-amber-300 bg-clip-text text-transparent">QUEEN</span>
            </span>
            <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold hidden sm:inline">
              AI ASSISTANT
            </span>
          </div>

          <p className="text-[10px] text-neutral-400 flex items-center gap-1.5 font-mono">
            <span className="text-amber-300 font-medium">Voice: {activeVoiceName} (Hindi)</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-0.5">
              <ShieldCheck className="w-3 h-3" /> Bank Protected
            </span>
            <span className="hidden md:inline text-neutral-500">•</span>
            <span className="hidden md:inline text-neutral-300">{timeStr}</span>
          </p>
        </div>
      </div>

      {/* Center View Mode Switcher: Voice Orb vs Chat */}
      <div className="hidden md:flex items-center bg-[#101018] p-1 rounded-2xl border border-rose-900/30 shadow-inner">
        <button
          onClick={() => onSetViewMode('voice')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer ${
            viewMode === 'voice'
              ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-950/50'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-rose-300" />
          <span>Voice Screen</span>
        </button>
        <button
          onClick={() => onSetViewMode('chat')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer ${
            viewMode === 'chat'
              ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md shadow-rose-950/50'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-rose-300" />
          <span>English Chat</span>
        </button>
      </div>

      {/* Right Action Tools: Smart Home, Reminders, Music, APK/Termux, Voice, Settings */}
      <div className="flex items-center space-x-1.5 sm:space-x-2">
        
        {/* Smart Home Hub */}
        <button
          onClick={onOpenSmartHome}
          className="relative px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-rose-500/50 text-neutral-200 hover:text-white text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-sm"
          title="Smart Home Devices (Lights, AC, TV, Locks)"
        >
          <Home className="w-4 h-4 text-rose-400" />
          <span className="hidden lg:inline">Smart Home</span>
          {activeSmartDeviceCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
              {activeSmartDeviceCount}
            </span>
          )}
        </button>

        {/* Reminders & Timers */}
        <button
          onClick={onOpenReminders}
          className="relative px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 text-neutral-200 hover:text-white text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-sm"
          title="Reminders & Timers Hub"
        >
          <Bell className="w-4 h-4 text-amber-400" />
          <span className="hidden lg:inline">Reminders</span>
          {pendingRemindersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-black flex items-center justify-center">
              {pendingRemindersCount}
            </span>
          )}
        </button>

        {/* 24/7 Live Radio & Music */}
        <button
          onClick={onOpenMusic}
          className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-rose-400 hover:border-neutral-700 shadow-sm cursor-pointer"
          title="24/7 Live Radio Streams"
        >
          <Radio className="w-4 h-4 text-rose-400" />
        </button>

        {/* APK / Simulator Toggle */}
        <button
          onClick={onToggleApkFrame}
          className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer shadow-sm ${
            isApkFrameActive
              ? 'bg-rose-600 border-rose-500 text-white'
              : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
          }`}
          title="Toggle Android Phone Simulator Frame"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">{isApkFrameActive ? 'Exit Phone' : 'APK View'}</span>
        </button>

        {/* Voice Selector */}
        <button
          onClick={onOpenVoiceSelector}
          className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 shadow-sm cursor-pointer"
          title="Select Female Hindi Voice Profile"
        >
          <Activity className="w-4 h-4 text-rose-400" />
        </button>

        {/* Settings & Telemetry */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 shadow-sm cursor-pointer"
          title="AI Engines, Providers & System Settings"
        >
          <Settings className="w-4 h-4 text-neutral-400" />
        </button>

      </div>
    </header>
  );
};
