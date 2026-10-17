import React, { useState } from 'react';
import { 
  X, 
  Home, 
  Lightbulb, 
  Thermometer, 
  Tv, 
  Lock, 
  Unlock, 
  Coffee, 
  Fan, 
  Sparkles, 
  Power, 
  Sliders, 
  Sun, 
  Moon, 
  Film, 
  Flame, 
  CheckCircle2,
  RefreshCw,
  Mic,
  Zap
} from 'lucide-react';
import type { SmartHomeDevice } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  devices: SmartHomeDevice[];
  onToggleDevice: (id: string, currentState: boolean) => void;
  onUpdateValue: (id: string, value: number) => void;
  onUpdateColor: (id: string, color: string) => void;
  onApplyScene: (sceneName: string) => void;
  onVoiceCommand: (command: string) => void;
}

export const SmartHomeHubModal: React.FC<Props> = ({
  isOpen,
  onClose,
  devices,
  onToggleDevice,
  onUpdateValue,
  onUpdateColor,
  onApplyScene,
  onVoiceCommand
}) => {
  if (!isOpen) return null;

  const [selectedRoom, setSelectedRoom] = useState<string>('All');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const rooms = ['All', 'Living Room', 'Bedroom', 'Entrance', 'Kitchen', 'Study'];

  const filteredDevices = selectedRoom === 'All' 
    ? devices 
    : devices.filter(d => d.room === selectedRoom);

  const activeCount = devices.filter(d => d.state).length;

  const handleSceneClick = (sceneName: string, desc: string) => {
    onApplyScene(sceneName);
    setFeedbackMsg(`Scene Applied: ${sceneName} - ${desc}`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const colorPalette = [
    { name: 'Warm Amber', hex: '#FDE047' },
    { name: 'Cool Cyan', hex: '#06B6D4' },
    { name: 'Rose Neon', hex: '#F43F5E' },
    { name: 'Emerald', hex: '#10B981' },
    { name: 'Violet', hex: '#A855F7' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#121216] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto text-neutral-100 ring-1 ring-cyan-500/20">
        
        {/* Header with JARVIS Telemetry */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-950/50">
              <Home className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-wide font-hud">
                  SMART HOME AUTOMATION MESH
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {activeCount} DEVICES ACTIVE
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                JARVIS Home Protocol • Real-time device control & scene triggers
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

        {/* Action feedback alert */}
        {feedbackMsg && (
          <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-xs text-cyan-200 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* QUICK SCENE PRESETS (JARVIS ONE-TAP PROTOCOLS) */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-hud">
            AUTONOMOUS SCENE PROTOCOLS:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => handleSceneClick('Movie Night', 'Lights dimmed to 20%, TV ON, ambient cyan glow')}
              className="p-3 rounded-2xl bg-neutral-900/90 border border-cyan-500/20 hover:border-cyan-500/60 hover:bg-cyan-950/20 text-left transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <Film className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                <span className="text-[10px] font-mono text-cyan-300">SCENE 01</span>
              </div>
              <strong className="text-xs text-white block">Movie Night</strong>
              <span className="text-[10px] text-neutral-400 block mt-0.5">Dim lights + TV on</span>
            </button>

            <button
              onClick={() => handleSceneClick('Good Morning', 'Brightened lights to 90% and started coffee maker')}
              className="p-3 rounded-2xl bg-neutral-900/90 border border-amber-500/20 hover:border-amber-500/60 hover:bg-amber-950/20 text-left transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <Sun className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
                <span className="text-[10px] font-mono text-amber-300">SCENE 02</span>
              </div>
              <strong className="text-xs text-white block">Good Morning</strong>
              <span className="text-[10px] text-neutral-400 block mt-0.5">Lights 90% + Coffee</span>
            </button>

            <button
              onClick={() => handleSceneClick('Night Sleep', 'All lights & TV OFF, doors locked, AC to 23°C')}
              className="p-3 rounded-2xl bg-neutral-900/90 border border-indigo-500/20 hover:border-indigo-500/60 hover:bg-indigo-950/20 text-left transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <Moon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition" />
                <span className="text-[10px] font-mono text-indigo-300">SCENE 03</span>
              </div>
              <strong className="text-xs text-white block">Sleep Mode</strong>
              <span className="text-[10px] text-neutral-400 block mt-0.5">Lock doors + AC 23°</span>
            </button>

            <button
              onClick={() => handleSceneClick('Turn off all lights', 'Switched off all smart lights')}
              className="p-3 rounded-2xl bg-neutral-900/90 border border-rose-500/20 hover:border-rose-500/60 hover:bg-rose-950/20 text-left transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <Power className="w-4 h-4 text-rose-400 group-hover:scale-110 transition" />
                <span className="text-[10px] font-mono text-rose-300">EMERGENCY</span>
              </div>
              <strong className="text-xs text-white block">All Off</strong>
              <span className="text-[10px] text-neutral-400 block mt-0.5">Shutdown lights</span>
            </button>
          </div>
        </div>

        {/* ROOM FILTER PILLS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {rooms.map(room => (
            <button
              key={room}
              onClick={() => setSelectedRoom(room)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition cursor-pointer ${
                selectedRoom === room
                  ? 'bg-cyan-500 text-black shadow-md font-bold'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {room}
            </button>
          ))}
        </div>

        {/* DEVICES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDevices.map(device => {
            const isLight = device.type === 'light';
            const isThermostat = device.type === 'thermostat';
            const isTV = device.type === 'tv';
            const isLock = device.type === 'lock';
            const isFan = device.type === 'fan';
            const isSocket = device.type === 'socket';

            return (
              <div 
                key={device.id}
                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                  device.state
                    ? 'bg-neutral-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/20'
                    : 'bg-neutral-950/80 border-neutral-800/80 text-neutral-400'
                }`}
              >
                {/* Device Title & State Toggle */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div 
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                        device.state
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
                          : 'bg-neutral-800 text-neutral-500'
                      }`}
                      style={isLight && device.state && device.color ? { backgroundColor: `${device.color}25`, borderColor: device.color, color: device.color } : {}}
                    >
                      {isLight && <Lightbulb className="w-5 h-5" />}
                      {isThermostat && <Thermometer className="w-5 h-5" />}
                      {isTV && <Tv className="w-5 h-5" />}
                      {isLock && (device.state ? <Lock className="w-5 h-5 text-emerald-400" /> : <Unlock className="w-5 h-5 text-amber-400" />)}
                      {isFan && <Fan className={`w-5 h-5 ${device.state ? 'animate-spin' : ''}`} />}
                      {isSocket && <Coffee className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {device.name}
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {device.room}
                      </span>
                    </div>
                  </div>

                  {/* On/Off Switch */}
                  <button
                    onClick={() => onToggleDevice(device.id, device.state)}
                    className={`w-12 h-6 rounded-full transition p-0.5 flex items-center cursor-pointer shrink-0 ${
                      device.state 
                        ? (isLock ? 'bg-emerald-600 justify-end' : 'bg-cyan-600 justify-end')
                        : 'bg-neutral-800 justify-start'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center text-[9px] font-bold text-neutral-900">
                      {device.state ? (isLock ? '🔒' : 'ON') : 'OFF'}
                    </span>
                  </button>
                </div>

                {/* Light Controls: Brightness Slider + Color Swatches */}
                {isLight && device.state && (
                  <div className="space-y-2 pt-1 border-t border-white/5">
                    <div className="flex items-center justify-between text-[11px] text-neutral-300">
                      <span>Brightness:</span>
                      <span className="font-mono font-bold text-cyan-300">{device.value || 80}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={device.value || 80}
                      onChange={e => onUpdateValue(device.id, parseInt(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-neutral-400">Color Aura:</span>
                      <div className="flex items-center space-x-1.5">
                        {colorPalette.map(c => (
                          <button
                            key={c.hex}
                            onClick={() => onUpdateColor(device.id, c.hex)}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                            className={`w-4 h-4 rounded-full transition cursor-pointer hover:scale-125 ${
                              device.color === c.hex ? 'ring-2 ring-white scale-110' : 'opacity-80'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Thermostat / AC Controls: Temperature Adjuster */}
                {isThermostat && device.state && (
                  <div className="space-y-2 pt-1 border-t border-white/5">
                    <div className="flex items-center justify-between text-[11px] text-neutral-300">
                      <span>Target Temperature:</span>
                      <span className="font-mono font-extrabold text-cyan-300 text-sm">{device.value || 23}°C</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateValue(device.id, Math.max(16, (device.value || 23) - 1))}
                        className="flex-1 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-cyan-300 cursor-pointer"
                      >
                        - 1°C Cool
                      </button>
                      <button
                        onClick={() => onUpdateValue(device.id, Math.min(30, (device.value || 23) + 1))}
                        className="flex-1 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-amber-300 cursor-pointer"
                      >
                        + 1°C Warm
                      </button>
                    </div>
                  </div>
                )}

                {/* Smart TV Controls */}
                {isTV && device.state && (
                  <div className="space-y-2 pt-1 border-t border-white/5">
                    <div className="flex items-center justify-between text-[11px] text-neutral-300">
                      <span>Audio Level:</span>
                      <span className="font-mono font-bold text-cyan-300">{device.value || 35}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={device.value || 35}
                      onChange={e => onUpdateValue(device.id, parseInt(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>
                )}

                {/* Lock Status */}
                {isLock && (
                  <div className="pt-1 border-t border-white/5 text-[11px] flex items-center justify-between">
                    <span className="text-neutral-400">Deadbolt State:</span>
                    <strong className={device.state ? 'text-emerald-400' : 'text-amber-400'}>
                      {device.state ? 'SECURELY LOCKED' : 'UNLOCKED'}
                    </strong>
                  </div>
                )}

                {/* Fan Speed */}
                {isFan && device.state && (
                  <div className="space-y-1.5 pt-1 border-t border-white/5">
                    <div className="flex items-center justify-between text-[11px] text-neutral-300">
                      <span>Airflow Speed:</span>
                      <span className="font-mono font-bold text-cyan-300">Level {device.value || 3}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(spd => (
                        <button
                          key={spd}
                          onClick={() => onUpdateValue(device.id, spd)}
                          className={`flex-1 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                            device.value === spd ? 'bg-cyan-600 text-white' : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {spd}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* VOICE COMMAND HINTS IN HINDI & ENGLISH */}
        <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5 text-xs text-neutral-400">
          <span className="font-bold text-cyan-300 flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            Natural Voice Commands You Can Speak to Maya:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-neutral-300">
            <span 
              onClick={() => { onVoiceCommand("Turn on living room lights"); onClose(); }}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-cyan-950/40 hover:text-cyan-300 cursor-pointer transition truncate"
            >
              • "Maya, turn on living room lights"
            </span>
            <span 
              onClick={() => { onVoiceCommand("Set bedroom AC to 22 degrees"); onClose(); }}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-cyan-950/40 hover:text-cyan-300 cursor-pointer transition truncate"
            >
              • "बेडरूम का एसी 22 डिग्री कर दो"
            </span>
            <span 
              onClick={() => { onVoiceCommand("Activate movie mode"); onClose(); }}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-cyan-950/40 hover:text-cyan-300 cursor-pointer transition truncate"
            >
              • "Activate Movie Mode"
            </span>
            <span 
              onClick={() => { onVoiceCommand("Lock the front door"); onClose(); }}
              className="p-1.5 rounded-lg bg-neutral-900 hover:bg-cyan-950/40 hover:text-cyan-300 cursor-pointer transition truncate"
            >
              • "दरवाज़ा लॉक कर दो"
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
