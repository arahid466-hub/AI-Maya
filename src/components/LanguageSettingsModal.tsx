import React from 'react';
import { 
  X, 
  Languages, 
  Volume2, 
  Check, 
  Sparkles, 
  Globe, 
  Sliders, 
  Play, 
  CheckCircle2, 
  Square 
} from 'lucide-react';
import type { LanguageSettings } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: LanguageSettings;
  onSave: (newSettings: LanguageSettings) => void;
  onTestVoice: (text: string, lang: string) => void;
  isSpeaking: boolean;
  onStopVoice: () => void;
}

export const LanguageSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onTestVoice,
  isSpeaking,
  onStopVoice
}) => {
  if (!isOpen) return null;

  const [current, setCurrent] = React.useState<LanguageSettings>({ ...settings });

  const textLanguages = [
    { code: 'en' as const, label: 'English (UK / US)', native: 'English', recommended: true, desc: 'Crisp, structured & readable' },
    { code: 'hi' as const, label: 'Hindi (हिंदी)', native: 'हिंदी', desc: 'Devanagari script' },
    { code: 'hinglish' as const, label: 'Hinglish', native: 'Hinglish', desc: 'Hindi in Roman letters' }
  ];

  const audioLanguages = [
    { code: 'hi' as const, label: 'Hindi Voice (हिंदी आवाज़)', native: 'हिंदी', recommended: true, sample: 'नमस्ते! मैं माया हूँ, आपकी पर्सनल असिस्टेंट।' },
    { code: 'en' as const, label: 'English (Indian Accent)', native: 'Indian English', sample: 'Hello! I am Maya, your personal AI assistant.' },
    { code: 'hinglish' as const, label: 'Hinglish Audio', native: 'हिंग्लिश', sample: 'Haanji! Maya ready hai, bataiye kya help karoon?' }
  ];

  const handleApply = () => {
    onSave(current);
    onClose();
  };

  const handleTestCurrentVoice = () => {
    const selectedVoice = audioLanguages.find(a => a.code === current.audioLanguage) || audioLanguages[0];
    onTestVoice(selectedVoice.sample, current.audioLanguage === 'hi' ? 'hi-IN' : current.audioLanguage === 'en' ? 'en-IN' : 'hi-IN');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#141418] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto ring-1 ring-cyan-500/20 text-neutral-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 font-hud">
                LANGUAGE & VOICE PROTOCOL
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-sans">
                  Dual-Engine
                </span>
              </h3>
              <p className="text-xs text-neutral-400">Written text in English/Hindi • Spoken voice in sweet Hindi</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Rule Banner */}
        <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <strong className="text-white block font-semibold">Bilingual Intelligence:</strong>
            <p className="text-neutral-300 leading-relaxed">
              <span className="text-cyan-300 font-bold">Text:</span> High knowledge & structured • <span className="text-amber-300 font-bold">Voice:</span> Natural sweet Hindi voice.
            </p>
          </div>
        </div>

        {/* 1. Written Text Language */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5 font-hud">
            <Globe className="w-3.5 h-3.5 text-cyan-400" /> 1. Written Response Language
          </label>
          <div className="grid grid-cols-3 gap-2">
            {textLanguages.map(item => {
              const isSelected = current.textLanguage === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setCurrent(prev => ({ ...prev, textLanguage: item.code }))}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-500/40'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold">{item.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <div className="flex items-center justify-between w-full mt-1">
                    <span className="text-[10px] text-neutral-400">{item.native}</span>
                    {item.recommended && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                        Default
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Spoken Audio Voice Language */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5 font-hud">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" /> 2. Audio Speech Output Language
          </label>
          <div className="grid grid-cols-1 gap-2">
            {audioLanguages.map(item => {
              const isSelected = current.audioLanguage === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setCurrent(prev => ({ ...prev, audioLanguage: item.code }))}
                  className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 text-white ring-1 ring-amber-500/40'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold">{item.label}</span>
                      {item.recommended && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                          Hindi Audio (Recommended)
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-400 block mt-0.5 font-hindi">
                      "{item.sample}"
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Audio Voice Controls & Test Button */}
        <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5 font-hud">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Voice Speed & Auto-Speak
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">
              Speed: {current.audioSpeed}x • Pitch: {current.audioPitch}x
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[11px] text-neutral-400 block mb-1">Playback Speed:</span>
              <div className="flex items-center gap-1">
                {[0.8, 1.0, 1.2].map(speed => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => setCurrent(p => ({ ...p, audioSpeed: speed }))}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      current.audioSpeed === speed
                        ? 'bg-cyan-600 text-white'
                        : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-neutral-400 block mb-1">Auto-Speak Audio:</span>
              <button
                type="button"
                onClick={() => setCurrent(p => ({ ...p, autoSpeakAudio: !p.autoSpeakAudio }))}
                className={`w-full py-1 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  current.autoSpeakAudio
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {current.autoSpeakAudio ? 'Enabled (Auto)' : 'Manual Tap Only'}
              </button>
            </div>
          </div>

          {/* Test Voice Button */}
          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400">Audition voice sample:</span>
            {isSpeaking ? (
              <button
                type="button"
                onClick={onStopVoice}
                className="px-3 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600/40 text-red-300 text-xs font-bold flex items-center gap-1.5 border border-red-500/40 cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-current" /> Stop Audio
              </button>
            ) : (
              <button
                type="button"
                onClick={handleTestCurrentVoice}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-cyan-300 text-xs font-bold flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Test Hindi Voice
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-950/40 cursor-pointer"
          >
            Save Language Settings
          </button>
        </div>

      </div>
    </div>
  );
};
