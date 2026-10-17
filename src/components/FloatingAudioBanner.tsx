import React, { useState, useEffect } from 'react';
import { Play, Pause, X, Volume2 } from 'lucide-react';

interface FloatingAudioBannerProps {
  isVisible: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
  currentText?: string;
  voiceName?: string;
}

export function FloatingAudioBanner({
  isVisible,
  isPlaying,
  onTogglePlay,
  onClose,
  currentText = '',
  voiceName = 'Maya'
}: FloatingAudioBannerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      if (!isVisible) {
        setSeconds(0);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isVisible]);

  useEffect(() => {
    if (isVisible && isPlaying) {
      setSeconds(0);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const formattedTime = `00:${seconds < 10 ? '0' : ''}${seconds}`;

  // 24 waveform bar heights for realistic animated audio visualizer
  const barHeights = [
    6, 14, 22, 10, 18, 26, 16, 28, 20, 14, 24, 18, 
    22, 12, 26, 18, 14, 20, 28, 16, 22, 12, 18, 8
  ];

  return (
    <div className="w-full flex justify-center px-2 mb-2 animate-in slide-in-from-top-2 duration-200">
      <div className="w-full max-w-md bg-[#1a1a24] border border-cyan-500/40 text-white rounded-full px-4 py-2 shadow-2xl flex items-center justify-between space-x-3 ring-1 ring-cyan-500/20">
        
        {/* Play/Pause Button */}
        <button
          onClick={onTogglePlay}
          className="w-8 h-8 rounded-full bg-cyan-400 text-black flex items-center justify-center hover:bg-cyan-300 active:scale-95 transition shrink-0 cursor-pointer shadow font-bold"
          title={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-black" />
          ) : (
            <Play className="w-4 h-4 fill-black ml-0.5" />
          )}
        </button>

        {/* Elapsed Timer & Voice Badge */}
        <div className="flex items-center space-x-1.5 shrink-0">
          <span className="text-xs font-mono font-bold text-cyan-300 tracking-wider">
            {formattedTime}
          </span>
          <span className="text-[10px] text-neutral-400 hidden sm:inline">
            ({voiceName})
          </span>
        </div>

        {/* Dynamic Waveform Visualizer */}
        <div className="flex-1 flex items-center justify-center space-x-0.5 sm:space-x-1 h-6 overflow-hidden px-1">
          {barHeights.map((h, i) => {
            const dynamicScale = isPlaying ? 0.35 + Math.sin((seconds * 4 + i) * 0.75) * 0.65 : 0.25;
            const barH = Math.max(4, Math.min(24, Math.round(h * (isPlaying ? Math.abs(dynamicScale) : 0.3))));
            return (
              <span
                key={i}
                style={{ height: `${barH}px` }}
                className={`w-0.5 sm:w-1 rounded-full transition-all duration-150 ${
                  isPlaying ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50' : 'bg-neutral-600'
                }`}
              />
            );
          })}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition shrink-0 cursor-pointer"
          title="Dismiss voice player"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
