import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, Check, Sparkles } from 'lucide-react';
import type { LanguageSettings } from '../types';

interface VoiceOption {
  id: 'Maya' | 'Leher' | 'Neer' | 'Kavya' | 'Aarav';
  name: string;
  description: string;
  gender: 'female' | 'male';
  sampleHindi: string;
  pitch: number;
  rate: number;
}

const VOICE_OPTIONS: VoiceOption[] = [
  {
    id: 'Maya',
    name: 'Maya (Recommended)',
    description: 'Sweet, natural Hindi female voice • Friendly JARVIS persona',
    gender: 'female',
    sampleHindi: 'नमस्ते! मैं माया हूँ। मैं आपकी पर्सनल असिस्टेंट और स्मार्ट होम कंपेनियन हूँ।',
    pitch: 1.15,
    rate: 1.0
  },
  {
    id: 'Leher',
    name: 'Leher',
    description: 'Soft & polite Hindi female voice',
    gender: 'female',
    sampleHindi: 'नमस्ते! आपका दिन शुभ हो, मैं लेहर आपकी सेवा में उपस्थित हूँ।',
    pitch: 1.1,
    rate: 1.02
  },
  {
    id: 'Neer',
    name: 'Neer',
    description: 'Confident & calm Hindi male voice',
    gender: 'male',
    sampleHindi: 'हेलो सर, नीर यहाँ है। सभी सिस्टम्स और स्मार्ट डिवाइसेस एक्टिव हैं।',
    pitch: 0.9,
    rate: 0.98
  },
  {
    id: 'Kavya',
    name: 'Kavya',
    description: 'Energetic bilingual Hindi & English female',
    gender: 'female',
    sampleHindi: 'हेलो! काव्या यहाँ है, चलिए आपका काम शुरू करते हैं।',
    pitch: 1.05,
    rate: 1.05
  }
];

interface VoiceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  languageSettings: LanguageSettings;
  onSaveSettings: (settings: LanguageSettings) => void;
  onPreviewVoice?: (sample: string, voiceId: string) => void;
}

export function VoiceSelectorModal({
  isOpen,
  onClose,
  languageSettings,
  onSaveSettings,
  onPreviewVoice
}: VoiceSelectorModalProps) {
  const currentVoiceId = (languageSettings.selectedVoice as VoiceOption['id']) || 'Maya';
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption['id']>(currentVoiceId);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedVoice((languageSettings.selectedVoice as VoiceOption['id']) || 'Maya');
    }
  }, [isOpen, languageSettings]);

  // Animated Swirling Smoky Orb (matching ChatGPT Voice Sphere in screenshot)
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    let t = 0;

    const render = () => {
      t += isPlayingPreview ? 0.04 : 0.015;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const radius = width * 0.44;

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      // Background inside sphere
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(0.7, '#0284c7');
      bgGrad.addColorStop(1, '#082f49');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Swirling smoke / cloud layers with cyan glow
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const angleOffset = (i * Math.PI) / 2 + t * (i % 2 === 0 ? 0.8 : -0.7);
        const waveR = radius * (0.7 + Math.sin(t * 1.5 + i) * 0.15);
        const grad = ctx.createRadialGradient(
          cx + Math.cos(angleOffset) * (radius * 0.35),
          cy + Math.sin(angleOffset) * (radius * 0.35),
          10,
          cx,
          cy,
          waveR
        );
        const alpha = isPlayingPreview ? 0.85 : 0.55;
        grad.addColorStop(0, `rgba(6, 182, 212, ${alpha})`);
        grad.addColorStop(0.4, `rgba(56, 189, 248, ${alpha * 0.7})`);
        grad.addColorStop(0.8, 'rgba(14, 116, 144, 0.2)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dynamic rim glow
      const rimGrad = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius);
      rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      rimGrad.addColorStop(0.9, isPlayingPreview ? 'rgba(6, 182, 212, 0.7)' : 'rgba(56, 189, 248, 0.3)');
      rimGrad.addColorStop(1, 'rgba(6, 182, 212, 0.9)');
      ctx.fillStyle = rimGrad;
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isOpen, isPlayingPreview]);

  if (!isOpen) return null;

  const handleSelect = (voice: VoiceOption) => {
    setSelectedVoice(voice.id);
    if (onPreviewVoice) {
      setIsPlayingPreview(true);
      onPreviewVoice(voice.sampleHindi, voice.id);
      setTimeout(() => setIsPlayingPreview(false), 3800);
    }
  };

  const handleConfirmSwitch = () => {
    const chosen = VOICE_OPTIONS.find(v => v.id === selectedVoice) || VOICE_OPTIONS[0];
    onSaveSettings({
      ...languageSettings,
      selectedVoice: chosen.id,
      voiceGender: chosen.gender,
      audioPitch: chosen.pitch,
      audioSpeed: chosen.rate
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-[420px] rounded-[32px] bg-[#1a1a20] border border-cyan-500/30 p-6 shadow-2xl text-white flex flex-col items-center ring-1 ring-cyan-500/20"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-3">
          <div className="w-8" />
          <h2 className="text-lg font-bold tracking-tight text-neutral-100 font-hud">
            CHOOSE YOUR VOICE
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Central Animated Smoky Orb */}
        <div className="relative my-3 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={200}
            height={200}
            className="rounded-full shadow-2xl cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => {
              const voice = VOICE_OPTIONS.find(v => v.id === selectedVoice);
              if (voice && onPreviewVoice) {
                setIsPlayingPreview(true);
                onPreviewVoice(voice.sampleHindi, voice.id);
                setTimeout(() => setIsPlayingPreview(false), 3800);
              }
            }}
          />
          {isPlayingPreview && (
            <div className="absolute inset-0 rounded-full ring-4 ring-cyan-400/40 animate-ping pointer-events-none" />
          )}
        </div>

        {/* Voice Selection Cards */}
        <div className="w-full space-y-2.5 mt-2 mb-5">
          {VOICE_OPTIONS.map((voice) => {
            const isSelected = selectedVoice === voice.id;
            return (
              <button
                key={voice.id}
                onClick={() => handleSelect(voice)}
                className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/60 ring-2 ring-cyan-400 border border-cyan-500/50 shadow-lg'
                    : 'bg-neutral-900/80 border border-neutral-800 hover:bg-neutral-800 text-neutral-300'
                }`}
              >
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    {voice.name}
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    {voice.description}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <div className="p-2 rounded-full bg-neutral-800/80 text-cyan-300 hover:text-white transition">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow font-bold">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Big Switch Button */}
        <button
          onClick={handleConfirmSwitch}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-sm shadow-lg shadow-cyan-950/50 hover:brightness-110 active:scale-[0.99] transition cursor-pointer"
        >
          Select {selectedVoice} Voice
        </button>
      </div>
    </div>
  );
}
