import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Zap, 
  Bot, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Gauge, 
  RefreshCw 
} from 'lucide-react';
import type { AutoSystemSettings, ProviderConfig } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  autoSettings: AutoSystemSettings;
  onToggleAutoSetting: (key: keyof AutoSystemSettings) => void;
  activeEngine: string;
  onSelectEngine: (engine: any) => void;
  providers: ProviderConfig[];
  onTestProvider: (providerId: string) => void;
  benchmarkResult: { latencyMs: number; speedRating: string; testedAt: string } | null;
  onRunBenchmark: () => void;
  isBenchmarking: boolean;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  autoSettings,
  onToggleAutoSetting,
  activeEngine,
  onSelectEngine,
  providers,
  onTestProvider,
  benchmarkResult,
  onRunBenchmark,
  isBenchmarking
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#141418] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-neutral-100 ring-1 ring-cyan-500/20">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white font-hud">
                MAYA AI CONTROL & TELEMETRY
              </h3>
              <p className="text-xs text-neutral-400">Master switches, Free AI engines & latency benchmark</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LIVE SPEED BENCHMARK */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-hud">
              <Gauge className="w-4 h-4 text-cyan-400" /> Live Response Latency Meter
            </span>
            <button
              onClick={onRunBenchmark}
              disabled={isBenchmarking}
              className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBenchmarking ? 'animate-spin' : ''}`} />
              <span>{isBenchmarking ? 'Testing...' : 'Test Speed'}</span>
            </button>
          </div>
          {benchmarkResult && (
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400 block text-[10px]">Roundtrip Latency:</span>
                <strong className="text-cyan-400 text-base font-mono">{benchmarkResult.latencyMs} ms</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                <span className="text-neutral-400 block text-[10px]">Engine Speed Rating:</span>
                <strong className="text-white text-sm font-hud">{benchmarkResult.speedRating}</strong>
              </div>
            </div>
          )}
        </div>

        {/* BANK PROTECTION BADGE */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">Financial & Banking Apps: PERMANENTLY LOCKED</h4>
              <p className="text-[11px] text-emerald-300/80">Google Pay, PhonePe, Paytm, and net banking operations are strictly prohibited.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
            SAFE
          </span>
        </div>

        {/* MASTER ON/OFF SWITCHES */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-hud">
              <Zap className="w-4 h-4 text-cyan-400" /> Master Feature Toggles (ON / OFF)
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono">Real-time Sync</span>
          </div>

          <div className="space-y-2 pt-1">
            {[
              { key: 'smartHomeAutoSync' as const, label: 'Smart Home Automation Mesh', desc: 'Syncs lights, AC, TV, locks, and scene presets with voice' },
              { key: 'autoCallAnswer' as const, label: 'Auto Call Answer & Voice Screener', desc: 'Maya answers calls automatically and speaks natural Hindi' },
              { key: 'autoCallRecording' as const, label: 'Auto Call Audio Recording', desc: 'Captures caller notes into the encrypted vault' },
              { key: 'autoDeleteAfter48Hours' as const, label: '48-Hour Vault Auto-Purge Policy', desc: 'Deletes call recordings after 2 days to maintain device privacy' },
              { key: 'turboSpeedMode' as const, label: 'Turbo Zero-Lag Mode (<15ms)', desc: 'Ultra-fast response cache for instant device actions' },
              { key: 'autoWakeWord' as const, label: 'Wake Word ("Hey Maya" / "हे माया")', desc: 'Hands-free voice detection trigger' }
            ].map(item => {
              const isChecked = autoSettings[item.key];
              return (
                <div key={item.key} className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800/80 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.label}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${isChecked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                        {isChecked ? 'ON' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleAutoSetting(item.key)}
                    className={`w-12 h-6 rounded-full transition p-0.5 flex items-center cursor-pointer shrink-0 ${
                      isChecked ? 'bg-cyan-600 justify-end' : 'bg-neutral-800 justify-start'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center text-[9px] font-bold text-neutral-800">
                      {isChecked ? '✓' : '✕'}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACTIVE AI ENGINE SELECTION */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-hud">
            <Bot className="w-4 h-4 text-cyan-400" /> Active AI Reasoning Engine
          </h4>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {[
              { id: 'builtin', name: 'Maya Turbo Engine', desc: 'Offline, Zero-Lag, Smart Home & Math' },
              { id: 'gemini', name: 'Google Gemini 3.8 Flash', desc: 'Free Tier Cloud Reasoning & Q&A' },
              { id: 'groq', name: 'Groq Cloud Inference', desc: 'Ultra-Fast Llama 3.3 (500 T/s)' },
              { id: 'ollama', name: 'Ollama Local Qwen', desc: 'Local Termux Model' }
            ].map(engine => (
              <button
                key={engine.id}
                onClick={() => onSelectEngine(engine.id)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  activeEngine === engine.id
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/30'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-hud">{engine.name}</strong>
                  {activeEngine === engine.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
                <span className="text-[10px] text-neutral-500 block mt-0.5">{engine.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* PROVIDER STATUS & TESTING */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-hud">
              AI ENGINE CONNECTION STATUS
            </h4>
            <span className="text-[10px] text-cyan-400 font-mono">Free Tier Ready</span>
          </div>

          {providers.map(prov => (
            <div key={prov.id} className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-200">{prov.name}</span>
                
                {prov.status === 'testing' ? (
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-900 border border-cyan-500/40">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                    <span className="text-[10px] font-bold text-cyan-300">Testing...</span>
                  </div>
                ) : prov.status === 'connected' ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-[10px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Connected {prov.latencyMs ? `• ${prov.latencyMs}ms` : ''}
                  </span>
                ) : prov.status === 'error' ? (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 font-bold text-[10px]">
                    <AlertCircle className="w-3 h-3" />
                    Error
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                    Idle
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-neutral-500 truncate max-w-[70%]">{prov.statusMessage}</span>
                <button
                  onClick={() => onTestProvider(prov.id)}
                  disabled={prov.status === 'testing'}
                  className="px-3 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 font-semibold cursor-pointer shadow transition disabled:opacity-50"
                >
                  Ping Test
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg cursor-pointer"
        >
          Save & Apply Configuration
        </button>

      </div>
    </div>
  );
};
