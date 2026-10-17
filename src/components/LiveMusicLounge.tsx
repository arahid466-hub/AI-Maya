import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Radio, 
  Disc, 
  Music, 
  Sparkles, 
  Search, 
  ExternalLink 
} from 'lucide-react';
import type { LiveMusicStation } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stations: LiveMusicStation[];
  activeStation: LiveMusicStation | null;
  isPlaying: boolean;
  volume: number;
  onSelectStation: (station: LiveMusicStation) => void;
  onTogglePlay: () => void;
  onChangeVolume: (volume: number) => void;
  onPlayCustomSong: (songQuery: string) => void;
}

export const LiveMusicLounge: React.FC<Props> = ({
  isOpen,
  onClose,
  stations,
  activeStation,
  isPlaying,
  volume,
  onSelectStation,
  onTogglePlay,
  onChangeVolume,
  onPlayCustomSong
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'Bollywood' | 'Lo-Fi Chill' | 'Punjabi Hits' | '90s Retro'>('all');
  const [isMuted, setIsMuted] = useState(false);
  const visualizerCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Equalizer animation canvas
  useEffect(() => {
    const canvas = visualizerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    const bars = 32;
    const barWidth = canvas.width / bars;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < bars; i++) {
        const height = isPlaying 
          ? Math.random() * (canvas.height * 0.85) + 6
          : 4;
        const x = i * barWidth;
        const y = canvas.height - height;
        
        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#06b6d4'); // cyan-500
        grad.addColorStop(0.5, '#3b82f6'); // blue-500
        grad.addColorStop(1, '#a855f7'); // purple-500
        ctx.fillStyle = grad;
        ctx.fillRect(x + 1, y, barWidth - 2, height);
      }
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const filteredStations = stations.filter(st => {
    if (activeTab !== 'all' && st.genre !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return st.title.toLowerCase().includes(q) || 
             st.artistOrCurator.toLowerCase().includes(q) ||
             st.genre.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onPlayCustomSong(searchQuery.trim());
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      onChangeVolume(volume === 0 ? 0.7 : volume);
    } else {
      setIsMuted(true);
      onChangeVolume(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#141418] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-neutral-100 ring-1 ring-cyan-500/20">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-cyan-950/50">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-wide font-hud">
                  MAYA 24/7 LIVE MUSIC & RADIO
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  24/7 AUDIO
                </span>
              </div>
              <p className="text-xs text-neutral-400">Continuous live music audio streams • Zero interruptions</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* NOW PLAYING CARD */}
        {activeStation && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-950 via-cyan-950/20 to-neutral-950 border border-cyan-500/30 relative overflow-hidden space-y-3">
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img 
                  src={activeStation.artwork} 
                  alt={activeStation.title} 
                  className={`w-16 h-16 rounded-xl object-cover border border-cyan-500/40 shadow-md ${isPlaying ? 'ring-2 ring-cyan-500/60' : 'opacity-80'}`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-hud">
                      {activeStation.genre}
                    </span>
                    <span className="text-[10px] text-neutral-500">•</span>
                    <span className="text-[10px] text-emerald-400 font-mono">{activeStation.bitrate}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                    {activeStation.title}
                  </h4>
                  <p className="text-xs text-neutral-400 font-medium">{activeStation.artistOrCurator}</p>
                </div>
              </div>

              {/* Master Play / Pause Orb */}
              <button
                type="button"
                onClick={onTogglePlay}
                className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 hover:scale-105 active:scale-95 transition flex items-center justify-center text-white shadow-lg shadow-cyan-950/60 cursor-pointer shrink-0"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>
            </div>

            {/* Live Audio Visualizer Equalizer */}
            <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-3">
              <div className="flex-1 h-9 bg-neutral-900/80 rounded-xl overflow-hidden p-1 flex items-center">
                <canvas 
                  ref={visualizerCanvasRef} 
                  width={300} 
                  height={32} 
                  className="w-full h-full"
                />
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleToggleMute}
                  className="p-1.5 text-neutral-400 hover:text-white cursor-pointer"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                </button>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={e => {
                    setIsMuted(false);
                    onChangeVolume(parseFloat(e.target.value));
                  }}
                  className="w-20 accent-cyan-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

          </div>
        )}

        {/* SEARCH ANY SONG OR ARTIST */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search any song, artist or station (e.g. Arijit Singh, Lo-Fi, Diljit)..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-24 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/60"
          />
          {searchQuery.trim() && (
            <button
              type="submit"
              className="absolute right-2 px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold cursor-pointer"
            >
              Play Song
            </button>
          )}
        </form>

        {/* Genre Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {(['all', 'Bollywood', 'Lo-Fi Chill', 'Punjabi Hits', '90s Retro'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition cursor-pointer ${
                activeTab === tab
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Live Channels' : tab}
            </button>
          ))}
        </div>

        {/* LIVE STATIONS LIST */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block font-hud">
            SELECT STATION TO STREAM:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredStations.map(station => {
              const isCurrent = activeStation?.id === station.id;
              return (
                <div
                  key={station.id}
                  onClick={() => {
                    onSelectStation(station);
                    if (!isPlaying) onTogglePlay();
                  }}
                  className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer group ${
                    isCurrent
                      ? 'bg-cyan-500/10 border-cyan-500 ring-1 ring-cyan-500/40'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={station.artwork} 
                      alt={station.title}
                      className="w-11 h-11 rounded-xl object-cover shrink-0" 
                    />
                    <div>
                      <h5 className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                        {station.title}
                      </h5>
                      <span className="text-[10px] text-neutral-400 block mt-0.5">
                        {station.artistOrCurator}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isCurrent && isPlaying ? (
                      <span className="p-2 rounded-xl bg-cyan-500 text-black">
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      </span>
                    ) : (
                      <span className="p-2 rounded-xl bg-neutral-900 text-neutral-300 group-hover:bg-cyan-600 group-hover:text-white transition">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Third Party External Launch */}
        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>Stream via desktop apps:</span>
          <div className="flex items-center gap-2">
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 flex items-center gap-1 font-semibold"
            >
              Spotify <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://music.youtube.com"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 flex items-center gap-1 font-semibold"
            >
              YouTube Music <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
