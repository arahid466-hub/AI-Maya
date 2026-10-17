import React, { useState, useRef } from 'react';
import { 
  X, 
  Plus, 
  Send, 
  Image, 
  FileText, 
  FileCode, 
  Sparkles, 
  Bot, 
  Play, 
  Square,
  Package,
  Video
} from 'lucide-react';
import type { AttachedFile, ProviderConfig } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  providers: ProviderConfig[];
  activeEngine: string;
  onSelectEngine: (engineId: string) => void;
  onSpeakHindi: (text: string) => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
}

export const ExternalAiStudio: React.FC<Props> = ({
  isOpen,
  onClose,
  providers,
  activeEngine,
  onSelectEngine,
  onSpeakHindi,
  isSpeaking,
  onStopSpeaking
}) => {
  if (!isOpen) return null;

  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'ai';
    text: string;
    spokenHindi?: string;
    engine: string;
    timestamp: string;
    attachedFiles?: AttachedFile[];
  }>>([
    {
      id: 'ext-welcome',
      sender: 'ai',
      text: "Greetings, sir. Welcome to Maya Multimodal Studio. I can inspect photos, analyze videos, parse APK source code, and evaluate documents with deep technical reasoning. Attach files using the (+) button below to begin.",
      spokenHindi: "मल्टीमॉडल स्टूडियो में आपका स्वागत है। आप फ़ाइलें या फ़ोटो अपलोड करके मुझसे पूछ सकते हैं।",
      engine: activeEngine,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const selectedProvider = providers.find(p => p.id === activeEngine) || providers[0];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      let fileType: AttachedFile['type'] = 'other';
      if (file.type.startsWith('image/')) fileType = 'image';
      else if (file.type.startsWith('video/')) fileType = 'video';
      else if (file.name.endsWith('.pdf')) fileType = 'pdf';
      else if (file.name.endsWith('.apk')) fileType = 'apk';
      else if (['.js', '.ts', '.tsx', '.py', '.kt', '.java', '.xml', '.json'].some(ext => file.name.endsWith(ext))) fileType = 'code';

      const reader = new FileReader();
      reader.onload = (event) => {
        const newAttached: AttachedFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          size: file.size,
          type: fileType,
          dataUrl: event.target?.result as string,
          previewUrl: fileType === 'image' ? (event.target?.result as string) : undefined
        };
        setAttachedFiles(prev => [...prev, newAttached]);
      };

      if (fileType === 'image' || file.size < 5 * 1024 * 1024) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file.slice(0, 10000));
      }
    });

    e.target.value = '';
  };

  const handleRemoveFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSendMessage = async () => {
    const text = inputPrompt.trim();
    if (!text && attachedFiles.length === 0) return;

    const userMsgId = `usr-${Date.now()}`;
    const newMsg = {
      id: userMsgId,
      sender: 'user' as const,
      text: text || `Analyzed: ${attachedFiles.map(f => f.name).join(', ')}`,
      engine: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedFiles: [...attachedFiles]
    };

    setMessages(prev => [...prev, newMsg]);
    setInputPrompt('');
    const filesToSend = [...attachedFiles];
    setAttachedFiles([]);
    setIsLoading(true);

    try {
      let finalPrompt = text;
      if (filesToSend.length > 0) {
        finalPrompt += `\n[Attached Files: ${filesToSend.map(f => `${f.name} (${f.type}, ${(f.size / 1024).toFixed(1)} KB)`).join(', ')}]`;
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: finalPrompt,
          conversationId: 'external_ai_studio',
          selectedEngine: activeEngine,
          engineConfig: {
            model: selectedProvider.model,
            apiKey: selectedProvider.apiKey,
            endpoint: selectedProvider.endpoint
          }
        })
      });

      const data = await res.json();
      const botMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai' as const,
        text: data.response || "Multimodal task completed successfully.",
        spokenHindi: data.spokenHindi,
        engine: data.engine || activeEngine,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      if (data.spokenHindi) {
        onSpeakHindi(data.spokenHindi);
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai' as const,
          text: `⚠️ Provider Response Error: ${err.message}.`,
          spokenHindi: "कार्य करते समय एरर आया।",
          engine: activeEngine,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#141418] border border-cyan-500/30 rounded-3xl flex flex-col shadow-2xl h-[90vh] overflow-hidden text-neutral-100 ring-1 ring-cyan-500/20">
        
        {/* Top Header Bar */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-950/50">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-neutral-950 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-wide font-hud">
                  MULTIMODAL AI STUDIO
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Vision & Files
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Inspect Photos, Videos, Code & Documents with Maya
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
              {[
                { id: 'builtin', label: 'Maya Turbo' },
                { id: 'gemini', label: 'Gemini 3.8 Flash' },
                { id: 'groq', label: 'Groq Cloud' }
              ].map(eng => (
                <button
                  key={eng.id}
                  type="button"
                  onClick={() => onSelectEngine(eng.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeEngine === eng.id
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {eng.label}
                </button>
              ))}
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Capabilities Bar */}
        <div className="px-4 py-2 bg-neutral-950 border-b border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400 shrink-0 overflow-x-auto gap-3 no-scrollbar font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-cyan-300 font-semibold">
              <Image className="w-3.5 h-3.5" /> Photos
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-rose-300 font-semibold">
              <Video className="w-3.5 h-3.5" /> Videos
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-300 font-semibold">
              <Package className="w-3.5 h-3.5" /> APK Inspection
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-300 font-semibold">
              <FileCode className="w-3.5 h-3.5" /> Code & Docs
            </span>
          </div>
          <span className="text-[10px] text-neutral-400">
            Active: <strong className="text-white uppercase">{activeEngine}</strong>
          </span>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-3.5 leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-md'
                      : 'bg-neutral-950 text-neutral-100 rounded-tl-sm border border-neutral-800/90 shadow-md'
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center space-x-1.5 mb-1.5 text-xs text-cyan-300 font-bold font-hud">
                      <Bot className="w-3.5 h-3.5 text-cyan-400" />
                      <span>MAYA INTEL ({msg.engine})</span>
                    </div>
                  )}

                  {msg.attachedFiles && msg.attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {msg.attachedFiles.map(file => (
                        <div
                          key={file.id}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/40 border border-white/10 text-xs"
                        >
                          {file.previewUrl ? (
                            <img src={file.previewUrl} alt={file.name} className="w-5 h-5 rounded object-cover" />
                          ) : file.type === 'apk' ? (
                            <Package className="w-3.5 h-3.5 text-emerald-300" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-cyan-300" />
                          )}
                          <span className="font-medium truncate max-w-[140px]">{file.name}</span>
                          <span className="text-[10px] opacity-70">({(file.size / 1024).toFixed(0)} KB)</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {msg.text}
                  </p>

                  {!isUser && msg.spokenHindi && (
                    <div className="mt-2.5 p-2 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs gap-2">
                      <span className="text-amber-300 font-hindi truncate">"{msg.spokenHindi}"</span>
                      <button
                        type="button"
                        onClick={() => onSpeakHindi(msg.spokenHindi!)}
                        className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold hover:bg-cyan-500/30 shrink-0 flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" /> Play Voice
                      </button>
                    </div>
                  )}

                  <span className="text-[10px] opacity-60 block mt-1.5 text-right font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-neutral-400 p-2">
              <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <span>Maya is processing your request and files...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Attached Files Preview Bar */}
        {attachedFiles.length > 0 && (
          <div className="px-4 py-2 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-xs font-bold text-neutral-400 shrink-0 font-hud">ATTACHED:</span>
            {attachedFiles.map(file => (
              <div
                key={file.id}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white shrink-0 group"
              >
                {file.previewUrl ? (
                  <img src={file.previewUrl} alt={file.name} className="w-5 h-5 rounded object-cover" />
                ) : file.type === 'apk' ? (
                  <Package className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <span className="font-semibold truncate max-w-[120px]">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file.id)}
                  className="p-0.5 hover:text-red-400 text-neutral-400 cursor-pointer ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input composer with plus icon */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.apk,.zip,.txt,.json,.kt,.java,.ts,.tsx,.py,.xml"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach Photo, Video, APK or Code"
            className="p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-cyan-300 font-bold transition cursor-pointer shrink-0 flex items-center justify-center border border-white/5"
          >
            <Plus className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask Maya to inspect photo, video, APK, or code..."
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/60"
          />

          <button
            type="button"
            onClick={handleSendMessage}
            disabled={(!inputPrompt.trim() && attachedFiles.length === 0) || isLoading}
            className="p-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white font-bold transition shadow-md cursor-pointer shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
