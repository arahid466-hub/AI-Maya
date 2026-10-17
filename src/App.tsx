import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Settings,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Shield,
  Phone,
  PhoneCall,
  PhoneOff,
  Home,
  Lightbulb,
  Tv,
  Lock,
  Thermometer,
  Bell,
  Trash2,
  Plus,
  Play,
  Square,
  Radio,
  FileCode,
  Download,
  Server,
  Activity,
  Layers,
  ArrowLeft,
  X,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Info,
  Globe,
  FileText,
  Image as ImageIcon,
  Video,
  Code,
  Folder,
  Brain,
  Sliders,
  Key,
  Database,
  Cpu,
  Wifi,
  BatteryCharging,
  Maximize2,
  Minimize2,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Menu
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'maya';
  text: string;
  spokenHindi?: string;
  timestamp: string;
  engine?: string;
  searchResults?: Array<{ title: string; url: string; snippet: string }>;
  smartHomeAction?: any;
  reminderAction?: any;
}

interface SmartDevice {
  id: string;
  name: string;
  room: string;
  type: 'light' | 'thermostat' | 'tv' | 'lock';
  state: boolean;
  value?: number;
  unit?: string;
  color?: string;
}

interface Reminder {
  id: string;
  title: string;
  time: string;
  date: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'health' | 'home' | 'personal';
  spokenHindiText: string;
}

export default function App() {
  // Navigation & View Mode
  const [currentTab, setCurrentTab] = useState<'chat' | 'voice' | 'settings' | 'apps' | 'files' | 'memory'>('chat');
  const [phoneFrameMode, setPhoneFrameMode] = useState<boolean>(true);
  const [showDrawerMenu, setShowDrawerMenu] = useState<boolean>(false);

  // Audio & Speech State
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [selectedVoiceProfile, setSelectedVoiceProfile] = useState<'maya' | 'leher'>('maya');
  const [voiceVolume, setVoiceVolume] = useState<number>(0.85);
  const [voiceRate, setVoiceRate] = useState<number>(0.95);
  const [voicePitch, setVoicePitch] = useState<number>(1.25);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [spokenHindiSubtitle, setSpokenHindiSubtitle] = useState<string>("नमस्ते! मैं माया हूँ। आप कैसे हैं? मैं आपकी क्या मदद कर सकती हूँ?");
  const [liveTranscript, setLiveTranscript] = useState<string>('');

  // AI & Server Settings
  const [aiEngine, setAiEngine] = useState<string>('builtin'); // 'builtin' | 'ollama' | 'gemini' | 'groq' | 'openrouter'
  const [selectedModel, setSelectedModel] = useState<string>('qwen2.5-coder:1.5b');
  const [serverUrl, setServerUrl] = useState<string>('http://127.0.0.1:3000');
  const [serverStatus, setServerStatus] = useState<'connected' | 'checking' | 'disconnected'>('connected');
  const [pingLatency, setPingLatency] = useState<number>(14);

  // API Keys (Optional - Free options clearly supported)
  const [apiKeys, setApiKeys] = useState<{ gemini: string; groq: string; openrouter: string; ollamaUrl: string }>({
    gemini: '',
    groq: '',
    openrouter: '',
    ollamaUrl: 'http://127.0.0.1:11434'
  });
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);

  // Settings Toggles (Matching Screenshot 3)
  const [voiceInputEnabled, setVoiceInputEnabled] = useState<boolean>(true);
  const [spokenLanguage, setSpokenLanguage] = useState<string>('hi-IN'); // Hindi
  const [voiceOutputEngine, setVoiceOutputEngine] = useState<string>('Hindi TTS');

  // Chat & Messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'maya',
      text: "Hello! I am Maya Queen, your personal AI assistant. How may I help you today?",
      spokenHindi: "नमस्ते! मैं माया हूँ। आप कैसे हैं? मैं आपकी क्या मदद कर सकती हूँ?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      engine: 'maya-queen-core'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showChatHistoryView, setShowChatHistoryView] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Smart Home & Reminders State
  const [smartDevices, setSmartDevices] = useState<SmartDevice[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminderText, setNewReminderText] = useState<string>('');
  const [newReminderTime, setNewReminderTime] = useState<string>('In 30 minutes');

  // Call Screener & Security
  const [autoCallAnswer, setAutoCallAnswer] = useState<boolean>(true);
  const [autoDelete48Hours, setAutoDelete48Hours] = useState<boolean>(true);
  const [incomingCallActive, setIncomingCallActive] = useState<boolean>(false);
  const [callerInfo, setCallerInfo] = useState({ name: 'Rahul Verma', number: '+91 98765 43210' });
  const [torchOn, setTorchOn] = useState<boolean>(false);

  // Web Search Query State
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchStateResults, setSearchStateResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Media Player (Hindi Radio & Music)
  const [isPlayingRadio, setIsPlayingRadio] = useState<boolean>(false);
  const [activeRadioStation, setActiveRadioStation] = useState<string>('Radio Mirchi 98.3 FM');

  // References
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const radioAudioRef = useRef<HTMLAudioElement | null>(null);

  // Current Dynamic Clock & Battery
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('10:25');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch initial data from server
  useEffect(() => {
    fetchSmartHome();
    fetchReminders();
    checkServerHealth();
  }, []);

  useEffect(() => {
    if (showChatHistoryView) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showChatHistoryView]);

  const checkServerHealth = async () => {
    setServerStatus('checking');
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setPingLatency(Math.round(performance.now() - start));
        setServerStatus('connected');
      } else {
        setServerStatus('disconnected');
      }
    } catch {
      setServerStatus('disconnected');
    }
  };

  const fetchSmartHome = async () => {
    try {
      const res = await fetch('/api/smart-home');
      const data = await res.json();
      if (data.devices) setSmartDevices(data.devices);
    } catch (e) {
      console.warn('Smart home fetch warning:', e);
    }
  };

  const fetchReminders = async () => {
    try {
      const res = await fetch('/api/reminders');
      const data = await res.json();
      if (data.reminders) setReminders(data.reminders);
    } catch (e) {
      console.warn('Reminders fetch warning:', e);
    }
  };

  // Hindi TTS Speech Synthesis
  const speakHindiAudio = (hindiText: string) => {
    if (!audioEnabled || !hindiText || typeof window === 'undefined') return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(hindiText);
      utterance.lang = 'hi-IN';
      utterance.pitch = selectedVoiceProfile === 'maya' ? voicePitch : 1.4;
      utterance.rate = voiceRate;
      utterance.volume = voiceVolume;

      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('leher') || v.name.toLowerCase().includes('maya'));
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setSpokenHindiSubtitle(hindiText);
      };
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('TTS error:', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Speech Recognition (Mic)
  const toggleListening = () => {
    if (isListening) {
      stopListening();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpokenHindiSubtitle('Speech recognition is supported in Chrome, Edge, and Android WebView.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = spokenLanguage === 'hi-IN' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        stopSpeaking();
        setLiveTranscript('');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setLiveTranscript(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (liveTranscript.trim()) {
          handleSendMessage(liveTranscript.trim(), true);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Speech recognition start failed:', e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  // Chat message submission
  const handleSendMessage = async (userText: string, isVoice: boolean = false) => {
    if (!userText.trim() || isTyping) return;
    const textToSend = userText.trim();
    setInputText('');
    setShowChatHistoryView(true);

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          engine: aiEngine,
          model: selectedModel,
          isVoiceInput: isVoice,
          apiKey: apiKeys.gemini || apiKeys.groq || apiKeys.openrouter || ''
        })
      });

      const data = await res.json();
      if (data.success) {
        const mayaMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'maya',
          text: data.response,
          spokenHindi: data.spokenHindi,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          engine: data.engine || aiEngine,
          searchResults: data.searchResults,
          smartHomeAction: data.smartHomeAction,
          reminderAction: data.reminderAction
        };
        setMessages(prev => [...prev, mayaMsg]);

        // Trigger Hindi speech
        if (data.spokenHindi && audioEnabled) {
          speakHindiAudio(data.spokenHindi);
        }

        // Refresh devices or reminders if affected
        if (data.smartHomeAction) fetchSmartHome();
        if (data.reminderAction) fetchReminders();
      } else {
        const errMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          sender: 'maya',
          text: data.error || 'Directive could not be completed. Please check connection.',
          spokenHindi: 'मुझे खेद है, कार्य करते समय समस्या आई।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          engine: 'error'
        };
        setMessages(prev => [...prev, errMsg]);
      }
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'maya',
        text: `Error connecting to server: ${err.message}`,
        spokenHindi: 'सर्वर से संपर्क नहीं हो पाया। कृपया दोबारा प्रयास करें।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        engine: 'network-error'
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Device toggles
  const handleToggleDevice = async (id: string, currentState: boolean) => {
    const nextState = !currentState;
    setSmartDevices(prev => prev.map(d => d.id === id ? { ...d, state: nextState } : d));
    try {
      await fetch('/api/smart-home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: id, state: nextState })
      });
      const dev = smartDevices.find(d => d.id === id);
      speakHindiAudio(`${dev?.name || 'डिवाइस'} को ${nextState ? 'चालू' : 'बंद'} कर दिया गया है।`);
    } catch {}
  };

  // Create reminder
  const handleCreateReminder = async () => {
    if (!newReminderText.trim()) return;
    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          title: newReminderText.trim(),
          time: newReminderTime,
          priority: 'medium',
          category: 'personal'
        })
      });
      const data = await res.json();
      if (data.reminders) setReminders(data.reminders);
      speakHindiAudio(`रिमाइंडर सेट कर दिया गया है: ${newReminderText}`);
      setNewReminderText('');
    } catch {}
  };

  // Web search modal action
  const handlePerformWebSearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsSearching(true);
    setSearchQuery(queryText);
    setSearchModalOpen(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(queryText)}`);
      const data = await res.json();
      if (data.results) {
        setSearchStateResults(data.results);
      }
    } catch {
      setSearchStateResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Copy helper
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-neutral-100 flex flex-col items-center justify-start selection:bg-red-500/30 font-sans">
      
      {/* TOP DESKTOP UTILITY BAR */}
      <header className="w-full bg-[#0d0f17]/90 backdrop-blur-md border-b border-red-500/20 px-4 py-2.5 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="text-xl">👑</span>
            <span className="font-extrabold tracking-wide text-red-500 text-lg">MAYA QUEEN</span>
            <span className="text-[11px] font-medium bg-red-950/80 text-red-400 border border-red-500/40 px-2 py-0.5 rounded-full">
              APK & Termux Suite
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-2 text-xs">
            <span className="flex items-center space-x-1 text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Server Online ({pingLatency}ms)</span>
            </span>
            <span className="text-neutral-400 font-mono bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-md">
              Engine: <strong className="text-red-400">{aiEngine.toUpperCase()}</strong>
            </span>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center space-x-1 bg-[#141624] border border-red-500/30 rounded-xl p-1">
          <button
            onClick={() => setCurrentTab('chat')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'chat' ? 'bg-red-600 text-white shadow-md shadow-red-600/40' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>💬</span> Home & Chat
          </button>
          <button
            onClick={() => setCurrentTab('voice')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'voice' ? 'bg-red-600 text-white shadow-md shadow-red-600/40' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>🎙️</span> AI Voice
          </button>
          <button
            onClick={() => setCurrentTab('apps')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'apps' ? 'bg-red-600 text-white shadow-md shadow-red-600/40' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>⊞</span> Apps & Tools
          </button>
          <button
            onClick={() => setCurrentTab('files')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'files' ? 'bg-red-600 text-white shadow-md shadow-red-600/40' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>📄</span> APK / Code
          </button>
          <button
            onClick={() => setCurrentTab('settings')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'settings' ? 'bg-red-600 text-white shadow-md shadow-red-600/40' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>⚙️</span> Settings
          </button>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPhoneFrameMode(!phoneFrameMode)}
            title={phoneFrameMode ? 'Switch to Expanded View' : 'Switch to Phone Mockup'}
            className="flex items-center space-x-1.5 px-2.5 py-1 text-xs rounded-lg border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">{phoneFrameMode ? 'Phone Frame' : 'Expanded'}</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-auto">
        <div
          className={`transition-all duration-300 relative flex flex-col bg-[#090a10] border border-red-500/30 overflow-hidden shadow-2xl ${
            phoneFrameMode
              ? 'w-full max-w-[420px] h-[860px] max-h-[92vh] rounded-[44px] ring-8 ring-[#181926] ring-offset-4 ring-offset-black'
              : 'w-full max-w-5xl h-[88vh] rounded-3xl'
          }`}
        >
          {/* ANDROID STATUS BAR (Matches Screenshot 10:24, WiFi, 78% Battery) */}
          <div className="w-full bg-[#090a10] px-6 pt-3 pb-1 flex items-center justify-between text-xs text-neutral-300 font-medium select-none z-20 shrink-0">
            <span>{currentTimeStr}</span>
            <div className="flex items-center space-x-2">
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-[11px] font-mono">78%</span>
              <BatteryCharging className="w-3.5 h-3.5 text-red-400" />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SCREEN 1: HOME & CHAT SCREEN (Matches Image 1) */}
          {/* ========================================================================= */}
          {currentTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {/* TOP HEADER */}
              <div className="px-5 py-2.5 flex items-center justify-between border-b border-red-500/15 shrink-0">
                <button
                  onClick={() => setShowDrawerMenu(!showDrawerMenu)}
                  className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-2">
                  <span className="text-lg">👑</span>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-white text-base tracking-wide leading-tight">Maya Queen</span>
                    <span className="text-[10px] text-neutral-400">Your AI Companion</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setCurrentTab('voice')}
                    className="p-1.5 rounded-full text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                    title="Open Voice Assistant"
                  >
                    <span className="text-base">👑</span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('settings')}
                    className="p-1.5 rounded-full text-neutral-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* DRAWER MENU OVERLAY */}
              {showDrawerMenu && (
                <div className="absolute top-12 left-2 z-40 w-64 bg-[#12141e] border border-red-500/30 rounded-2xl p-3 shadow-2xl space-y-2 animate-in fade-in duration-150">
                  <div className="text-xs font-semibold text-red-400 px-2 py-1 uppercase tracking-wider">Navigation</div>
                  <button
                    onClick={() => { setCurrentTab('chat'); setShowDrawerMenu(false); }}
                    className="w-full text-left p-2 rounded-xl text-xs flex items-center gap-2 hover:bg-white/5 text-white"
                  >
                    <span>💬</span> Home & Chat
                  </button>
                  <button
                    onClick={() => { setCurrentTab('voice'); setShowDrawerMenu(false); }}
                    className="w-full text-left p-2 rounded-xl text-xs flex items-center gap-2 hover:bg-white/5 text-white"
                  >
                    <span>🎙️</span> AI Voice Assistant (Hindi)
                  </button>
                  <button
                    onClick={() => { setCurrentTab('apps'); setShowDrawerMenu(false); }}
                    className="w-full text-left p-2 rounded-xl text-xs flex items-center gap-2 hover:bg-white/5 text-white"
                  >
                    <span>⊞</span> Smart Home & Telephony
                  </button>
                  <button
                    onClick={() => { setCurrentTab('files'); setShowDrawerMenu(false); }}
                    className="w-full text-left p-2 rounded-xl text-xs flex items-center gap-2 hover:bg-white/5 text-white"
                  >
                    <span>📄</span> Files, Scripts & APK
                  </button>
                  <button
                    onClick={() => { setCurrentTab('settings'); setShowDrawerMenu(false); }}
                    className="w-full text-left p-2 rounded-xl text-xs flex items-center gap-2 hover:bg-white/5 text-white"
                  >
                    <span>⚙️</span> Settings & API Keys
                  </button>
                  <div className="border-t border-neutral-800 pt-2">
                    <button
                      onClick={() => { setShowChatHistoryView(!showChatHistoryView); setShowDrawerMenu(false); }}
                      className="w-full text-left p-2 rounded-xl text-xs flex items-center justify-between hover:bg-white/5 text-neutral-300"
                    >
                      <span>Toggle Chat Feed</span>
                      <span className="text-[10px] text-red-400 font-mono">{showChatHistoryView ? 'Active' : 'Hidden'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* BODY CONTENT SCROLLABLE */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                
                {/* When Chat History View is OFF: Show the exact Homepage from Screenshot 1 */}
                {!showChatHistoryView ? (
                  <div className="flex flex-col items-center text-center space-y-4 pt-1">
                    
                    {/* HERO AVATAR IN RED NEON RING WITH HUD BRACKETS */}
                    <div className="relative flex items-center justify-center mt-2">
                      {/* Outer red glowing aura */}
                      <div className="absolute w-36 h-36 rounded-full bg-red-600/20 blur-xl animate-pulse" />
                      
                      {/* Sci-fi tech bracket rings */}
                      <div className="w-32 h-32 rounded-full border-2 border-red-500/80 p-1 flex items-center justify-center relative shadow-[0_0_25px_rgba(239,68,68,0.5)]">
                        {/* Avatar Image */}
                        <img
                          src="/maya_avatar.jpg"
                          alt="Maya Queen"
                          className="w-full h-full rounded-full object-cover shadow-inner"
                        />
                        {/* Red HUD tick marks */}
                        <span className="absolute -top-1 w-3 h-1 bg-red-500 rounded-full" />
                        <span className="absolute -bottom-1 w-3 h-1 bg-red-500 rounded-full" />
                        <span className="absolute -left-1 w-1 h-3 bg-red-500 rounded-full" />
                        <span className="absolute -right-1 w-1 h-3 bg-red-500 rounded-full" />
                      </div>
                    </div>

                    {/* GREETING TITLES (Matches Screenshot 1) */}
                    <div>
                      <h1 className="text-xl font-bold text-white flex items-center justify-center gap-1.5">
                        <span>Hello, I am</span>
                        <span className="text-red-500">Maya</span>
                        <span>👑</span>
                      </h1>
                      <p className="text-xs text-neutral-300 font-medium mt-0.5">Your Personal AI Assistant</p>
                      <p className="text-[11px] text-neutral-500 mt-1">Ask me anything... I'm here to help you!</p>
                    </div>

                    {/* 6 ACTION GRID CARDS (Matches Screenshot 1) */}
                    <div className="w-full grid grid-cols-3 gap-2.5 pt-1">
                      {/* 1. Chat */}
                      <button
                        onClick={() => setShowChatHistoryView(true)}
                        className="bg-[#12131d] hover:bg-[#191b29] border border-red-500/20 hover:border-red-500/50 rounded-2xl p-2.5 flex flex-col items-center justify-center space-y-1.5 transition active:scale-95 cursor-pointer shadow-sm group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-110 transition">
                          <span className="text-sm">💬</span>
                        </div>
                        <span className="text-xs font-semibold text-neutral-200">Chat</span>
                      </button>

                      {/* 2. Web Search */}
                      <button
                        onClick={() => handlePerformWebSearch('Delhi ki aaj ki taza khabar')}
                        className="bg-[#12131d] hover:bg-[#191b29] border border-red-500/20 hover:border-red-500/50 rounded-2xl p-2.5 flex flex-col items-center justify-center space-y-1.5 transition active:scale-95 cursor-pointer shadow-sm group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
                          <Globe className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-neutral-200">Web Search</span>
                      </button>

                      {/* 3. Code & Files */}
                      <button
                        onClick={() => setCurrentTab('files')}
                        className="bg-[#12131d] hover:bg-[#191b29] border border-red-500/20 hover:border-red-500/50 rounded-2xl p-2.5 flex flex-col items-center justify-center space-y-1.5 transition active:scale-95 cursor-pointer shadow-sm group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
                          <Code className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-neutral-200">Code & Files</span>
                      </button>

                      {/* 4. Images */}
                      <button
                        onClick={() => handleSendMessage('Create a modern artistic wallpaper of an Indian queen with futuristic glowing neon accents')}
                        className="bg-[#12131d] hover:bg-[#191b29] border border-red-500/20 hover:border-red-500/50 rounded-2xl p-2.5 flex flex-col items-center justify-center space-y-1.5 transition active:scale-95 cursor-pointer shadow-sm group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-neutral-200">Images</span>
                      </button>

                      {/* 5. Videos & Audio */}
                      <button
                        onClick={() => {
                          setIsPlayingRadio(!isPlayingRadio);
                          speakHindiAudio(isPlayingRadio ? 'रेडियो बंद कर दिया गया है।' : 'हिंदी रेडियो शुरू किया जा रहा है।');
                        }}
                        className="bg-[#12131d] hover:bg-[#191b29] border border-red-500/20 hover:border-red-500/50 rounded-2xl p-2.5 flex flex-col items-center justify-center space-y-1.5 transition active:scale-95 cursor-pointer shadow-sm group"
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition ${
                          isPlayingRadio ? 'bg-red-500 text-white animate-pulse' : 'bg-red-500/10 text-red-400'
                        }`}>
                          <Video className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-neutral-200">Videos & Audio</span>
                      </button>

                      {/* 6. Documents */}
                      <button
                        onClick={() => handleSendMessage('Summarize the top documents and project specifications')}
                        className="bg-[#12131d] hover:bg-[#191b29] border border-red-500/20 hover:border-red-500/50 rounded-2xl p-2.5 flex flex-col items-center justify-center space-y-1.5 transition active:scale-95 cursor-pointer shadow-sm group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-110 transition">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-neutral-200">Documents</span>
                      </button>
                    </div>

                    {/* ⚡ QUICK EXAMPLES (Matches Screenshot 1) */}
                    <div className="w-full text-left space-y-2 pt-2">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-400 px-1">
                        <span className="text-amber-400">⚡</span>
                        <span>Quick Examples</span>
                      </div>

                      <div className="space-y-1.5">
                        {/* Example 1 */}
                        <button
                          onClick={() => handleSendMessage('Delhi ki aaj ki taza khabar batao')}
                          className="w-full bg-[#12131d] hover:bg-[#1a1c2b] border border-neutral-800 hover:border-red-500/40 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs text-neutral-200 transition group cursor-pointer"
                        >
                          <span className="truncate">Delhi ki aaj ki taza khabar batao</span>
                          <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-red-400 transition shrink-0" />
                        </button>

                        {/* Example 2 */}
                        <button
                          onClick={() => handleSendMessage('Kerala mein paas ke acche hotel batao')}
                          className="w-full bg-[#12131d] hover:bg-[#1a1c2b] border border-neutral-800 hover:border-red-500/40 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs text-neutral-200 transition group cursor-pointer"
                        >
                          <span className="truncate">Kerala mein paas ke acche hotel batao</span>
                          <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-red-400 transition shrink-0" />
                        </button>

                        {/* Example 3 */}
                        <button
                          onClick={() => handleSendMessage('Python mein ek game ka code likho')}
                          className="w-full bg-[#12131d] hover:bg-[#1a1c2b] border border-neutral-800 hover:border-red-500/40 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs text-neutral-200 transition group cursor-pointer"
                        >
                          <span className="truncate">Python mein ek game ka code likho</span>
                          <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-red-400 transition shrink-0" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* CHAT CONVERSATION STREAM VIEW */
                  <div className="space-y-3 pb-2">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                      <span className="text-xs font-semibold text-neutral-400">Conversation Stream</span>
                      <button
                        onClick={() => setShowChatHistoryView(false)}
                        className="text-[11px] text-red-400 hover:underline cursor-pointer"
                      >
                        Show Home Cards
                      </button>
                    </div>

                    {messages.map(msg => {
                      const isUser = msg.sender === 'user';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-md ${
                              isUser
                                ? 'bg-red-600 text-white rounded-br-none'
                                : 'bg-[#151624] text-neutral-200 border border-neutral-800 rounded-bl-none'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>

                            {/* Spoken Hindi text preview badge if assistant */}
                            {!isUser && msg.spokenHindi && (
                              <div className="mt-2 pt-2 border-t border-neutral-800 flex items-center justify-between text-[11px] text-red-300 font-hindi">
                                <span className="truncate italic">🗣️ "{msg.spokenHindi}"</span>
                                <button
                                  onClick={() => speakHindiAudio(msg.spokenHindi || '')}
                                  title="Replay Hindi Voice"
                                  className="ml-2 p-1 rounded hover:bg-white/10 text-red-400 cursor-pointer shrink-0"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            {/* Source links if any */}
                            {!isUser && msg.searchResults && msg.searchResults.length > 0 && (
                              <div className="mt-2 space-y-1 pt-1 border-t border-neutral-800 text-[10px]">
                                <span className="font-semibold text-neutral-400">Sources:</span>
                                {msg.searchResults.slice(0, 2).map((res, idx) => (
                                  <a
                                    key={idx}
                                    href={res.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block text-red-400 hover:underline truncate"
                                  >
                                    • {res.title}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 text-[10px] text-neutral-500 px-1">
                            <span>{msg.timestamp}</span>
                            {!isUser && (
                              <>
                                <button
                                  onClick={() => handleCopyText(msg.text, msg.id)}
                                  className="hover:text-neutral-300 cursor-pointer"
                                >
                                  {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {isTyping && (
                      <div className="flex items-center space-x-2 text-xs text-neutral-400 p-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span>Maya is typing...</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* BOTTOM FLOATING INPUT BAR (Matches Screenshot 1) */}
              <div className="p-3 bg-[#090a10] border-t border-neutral-800/80 shrink-0">
                <div className="flex items-center space-x-2 bg-[#141522] border border-neutral-800 rounded-full px-2 py-1.5 shadow-xl ring-1 ring-red-500/20">
                  {/* Left Red Mic button */}
                  <button
                    onClick={() => {
                      setCurrentTab('voice');
                      toggleListening();
                    }}
                    title="Speak in Hindi/English"
                    className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition shadow-md cursor-pointer shrink-0"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  {/* Input field */}
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendMessage(inputText);
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent px-2 py-1 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none"
                  />

                  {/* Right Red Send button */}
                  <button
                    onClick={() => handleSendMessage(inputText)}
                    title="Send message"
                    className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition cursor-pointer shrink-0 disabled:opacity-40"
                    disabled={!inputText.trim() || isTyping}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 2: DEDICATED AI VOICE ASSISTANT SCREEN (Matches Image 2) */}
          {/* ========================================================================= */}
          {currentTab === 'voice' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#090a10] via-[#0d0e17] to-[#08090f] p-4 relative">
              {/* Top Bar with Back, Title, Language Badge */}
              <div className="flex items-center justify-between shrink-0 pt-1">
                <button
                  onClick={() => setCurrentTab('chat')}
                  className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-2">
                  <span className="text-base text-red-500">👑</span>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-white text-base">Maya Queen</span>
                    <span className="text-[10px] text-neutral-400">AI Voice Assistant</span>
                  </div>
                </div>

                {/* Top Right Hindi Badge (Matches Screenshot 2) */}
                <button
                  onClick={() => {
                    const nextLang = spokenLanguage === 'hi-IN' ? 'en-IN' : 'hi-IN';
                    setSpokenLanguage(nextLang);
                    speakHindiAudio(nextLang === 'hi-IN' ? 'हिंदी भाषा चुनी गई है।' : 'English language selected.');
                  }}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-[11px] text-red-400 font-medium hover:bg-red-900 transition cursor-pointer"
                >
                  <span>🗣️</span>
                  <span>{spokenLanguage === 'hi-IN' ? 'हिंदी' : 'English'}</span>
                  <span>🎤</span>
                </button>
              </div>

              {/* CENTER HERO AVATAR WITH SOUNDWAVE FREQUENCY BARS */}
              <div className="flex flex-col items-center justify-center my-auto space-y-5">
                
                {/* Visualizer Row: Left waves + Avatar + Right waves */}
                <div className="flex items-center justify-center space-x-3 w-full">
                  
                  {/* Left Soundwave Equalizer Bars */}
                  <div className="flex items-center space-x-1 h-20">
                    {[16, 28, 44, 20, 52, 30, 60, 24].map((height, i) => (
                      <span
                        key={`left-${i}`}
                        style={{
                          height: isListening || isSpeaking ? `${height * (isSpeaking ? 1.2 : 0.8)}px` : '10px',
                          transition: 'height 0.15s ease'
                        }}
                        className={`w-1 rounded-full ${
                          isListening || isSpeaking ? 'bg-red-500 animate-pulse' : 'bg-red-900/40'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Central Avatar with Red Halo */}
                  <div className="relative">
                    <div className="w-36 h-36 rounded-full border-2 border-red-500 p-1 flex items-center justify-center shadow-[0_0_35px_rgba(239,68,68,0.6)] relative">
                      <img
                        src="/maya_avatar.jpg"
                        alt="Maya Voice Avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Right Soundwave Equalizer Bars */}
                  <div className="flex items-center space-x-1 h-20">
                    {[24, 60, 30, 52, 20, 44, 28, 16].map((height, i) => (
                      <span
                        key={`right-${i}`}
                        style={{
                          height: isListening || isSpeaking ? `${height * (isSpeaking ? 1.2 : 0.8)}px` : '10px',
                          transition: 'height 0.15s ease'
                        }}
                        className={`w-1 rounded-full ${
                          isListening || isSpeaking ? 'bg-red-500 animate-pulse' : 'bg-red-900/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* State Pill: Listening... (Matches Screenshot 2) */}
                <div className="flex items-center justify-center">
                  <div className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 shadow-lg ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse'
                      : isSpeaking
                      ? 'bg-amber-600 text-white'
                      : 'bg-red-950/70 border border-red-500/40 text-red-400'
                  }`}>
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isListening ? 'Listening...' : isSpeaking ? 'Speaking Hindi...' : 'Tap Mic to Speak'}</span>
                  </div>
                </div>

                {/* Spoken Hindi Bubble (Matches Screenshot 2) */}
                <div className="w-full max-w-[340px] bg-[#141524] border border-red-500/30 rounded-2xl p-4 shadow-xl text-center space-y-1">
                  <p className="text-sm font-medium text-neutral-100 leading-relaxed font-hindi">
                    {spokenHindiSubtitle}
                  </p>
                  {liveTranscript && (
                    <p className="text-xs text-red-400 italic pt-1 border-t border-neutral-800">
                      Heard: "{liveTranscript}"
                    </p>
                  )}
                </div>
              </div>

              {/* BOTTOM VOICE CONTROLS ROW (Matches Screenshot 2) */}
              <div className="space-y-4 shrink-0 pb-2">
                <div className="flex items-center justify-center space-x-8">
                  {/* Left Cancel button (X) */}
                  <button
                    onClick={() => {
                      stopListening();
                      stopSpeaking();
                    }}
                    title="Cancel"
                    className="w-12 h-12 rounded-full bg-[#181a28] hover:bg-[#202334] text-neutral-300 hover:text-white flex items-center justify-center border border-neutral-800 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Center Large Glowing Red Microphone */}
                  <div className="relative flex items-center justify-center">
                    {/* Ripple ring animation when listening */}
                    {isListening && (
                      <div className="absolute w-24 h-24 rounded-full bg-red-600/30 animate-ping" />
                    )}
                    <button
                      onClick={toggleListening}
                      title="Microphone"
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all transform active:scale-95 shadow-[0_0_30px_rgba(239,68,68,0.7)] cursor-pointer ${
                        isListening
                          ? 'bg-red-500 ring-4 ring-red-400'
                          : 'bg-red-600 hover:bg-red-500'
                      }`}
                    >
                      <Mic className="w-8 h-8" />
                    </button>
                  </div>

                  {/* Right Stop Audio button (Square) */}
                  <button
                    onClick={stopSpeaking}
                    title="Stop Audio"
                    className="w-12 h-12 rounded-full bg-[#181a28] hover:bg-[#202334] text-neutral-300 hover:text-white flex items-center justify-center border border-neutral-800 transition cursor-pointer"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Bottom Volume / Progress Slider Bar (Matches Screenshot 2) */}
                <div className="flex items-center space-x-3 px-3 py-2 bg-[#12141f] rounded-2xl border border-neutral-800">
                  <Volume2 className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={voiceVolume}
                    onChange={e => setVoiceVolume(parseFloat(e.target.value))}
                    className="flex-1 accent-red-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
                  />
                  <button
                    onClick={() => setCurrentTab('settings')}
                    className="text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 3: SETTINGS SCREEN (Matches Image 3) */}
          {/* ========================================================================= */}
          {currentTab === 'settings' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#090a10]">
              {/* Header: Back arrow & Settings title */}
              <div className="px-5 py-3 flex items-center space-x-3 border-b border-neutral-800 shrink-0">
                <button
                  onClick={() => setCurrentTab('chat')}
                  className="p-1 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-base font-bold text-white">Settings</h2>
              </div>

              {/* Scrollable Settings List (Matches Screenshot 3) */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-xs">
                
                {/* SECTION 1: AI & MODEL (Matches Screenshot 3) */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-1">
                    AI & Model
                  </div>

                  <div className="bg-[#12131d] border border-neutral-800 rounded-2xl divide-y divide-neutral-800/80 overflow-hidden">
                    {/* AI Engine */}
                    <button
                      onClick={() => {
                        const engines = ['builtin', 'ollama', 'gemini', 'groq'];
                        const next = engines[(engines.indexOf(aiEngine) + 1) % engines.length];
                        setAiEngine(next);
                      }}
                      className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-white/5 transition cursor-pointer text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-200">AI Engine</div>
                          <div className="text-[10px] text-neutral-400">
                            {aiEngine === 'builtin' && 'Maya Built-in Core (FREE)'}
                            {aiEngine === 'ollama' && 'Ollama (Local)'}
                            {aiEngine === 'gemini' && 'Google Gemini (Free Tier)'}
                            {aiEngine === 'groq' && 'Groq Fast Llama (Free Tier)'}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </button>

                    {/* Model Selection */}
                    <button
                      onClick={() => {
                        const models = ['qwen2.5-coder:1.5b', 'gemini-2.5-flash', 'llama-3.3-70b', 'deepseek-r1'];
                        const next = models[(models.indexOf(selectedModel) + 1) % models.length];
                        setSelectedModel(next);
                      }}
                      className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-white/5 transition cursor-pointer text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-200">Model Selection</div>
                          <div className="text-[10px] text-neutral-400">{selectedModel}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </button>

                    {/* Provider Settings / Manage API Keys */}
                    <button
                      onClick={() => setShowApiKeyModal(true)}
                      className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-white/5 transition cursor-pointer text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                          <Key className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-200">Provider Settings</div>
                          <div className="text-[10px] text-neutral-400">Manage API Keys (Optional - Free Tier)</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </button>
                  </div>
                </div>

                {/* SECTION 2: VOICE & LANGUAGE (Matches Screenshot 3) */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-1">
                    Voice & Language
                  </div>

                  <div className="bg-[#12131d] border border-neutral-800 rounded-2xl divide-y divide-neutral-800/80 overflow-hidden">
                    {/* Spoken Language */}
                    <button
                      onClick={() => {
                        const next = spokenLanguage === 'hi-IN' ? 'en-IN' : 'hi-IN';
                        setSpokenLanguage(next);
                      }}
                      className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-white/5 transition cursor-pointer text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-200">Spoken Language</div>
                          <div className="text-[10px] text-neutral-400">
                            {spokenLanguage === 'hi-IN' ? 'Hindi (हिंदी)' : 'English (India)'}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </button>

                    {/* Voice Profile */}
                    <button
                      onClick={() => {
                        const next = selectedVoiceProfile === 'maya' ? 'leher' : 'maya';
                        setSelectedVoiceProfile(next);
                        speakHindiAudio(next === 'maya' ? 'माया की आवाज़ सक्रिय की गई है।' : 'लहर की आवाज़ सक्रिय की गई है।');
                      }}
                      className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-white/5 transition cursor-pointer text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center">
                          <Mic className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-200">Voice Profile</div>
                          <div className="text-[10px] text-neutral-400">
                            {selectedVoiceProfile === 'maya' ? 'Female (Maya Voice)' : 'Female (Leher Voice)'}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </button>

                    {/* Voice Input with REAL RED TOGGLE (Matches Screenshot 3) */}
                    <div className="px-3.5 py-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center">
                          <Mic className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-200">Voice Input</div>
                          <div className="text-[10px] text-neutral-400">
                            {voiceInputEnabled ? 'On (Tap to speak)' : 'Disabled'}
                          </div>
                        </div>
                      </div>
                      {/* Red Toggle Switch */}
                      <button
                        onClick={() => setVoiceInputEnabled(!voiceInputEnabled)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                          voiceInputEnabled ? 'bg-red-600 justify-end' : 'bg-neutral-700 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition" />
                      </button>
                    </div>

                    {/* Voice Output */}
                    <button
                      onClick={() => {
                        setAudioEnabled(!audioEnabled);
                      }}
                      className="w-full px-3.5 py-3 flex items-center justify-between hover:bg-white/5 transition cursor-pointer text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-200">Voice Output</div>
                          <div className="text-[10px] text-neutral-400">
                            {audioEnabled ? 'Hindi TTS (Active)' : 'Muted'}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </button>
                  </div>
                </div>

                {/* SECTION 3: APP & SECURITY (Matches Screenshot 3) */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-1">
                    App & Security
                  </div>

                  <div className="bg-[#12131d] border border-neutral-800 rounded-2xl divide-y divide-neutral-800/80 overflow-hidden">
                    {/* Account & Login */}
                    <div className="px-3.5 py-3 flex items-center justify-between hover:bg-white/5 transition cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                          <span className="text-sm">👤</span>
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-200">Account & Login</div>
                          <div className="text-[10px] text-neutral-400">Manage your account</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </div>

                    {/* Permissions */}
                    <div className="px-3.5 py-3 flex items-center justify-between hover:bg-white/5 transition cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-200">Permissions</div>
                          <div className="text-[10px] text-neutral-400">Camera, Microphone, Storage</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </div>

                    {/* Privacy & Security */}
                    <div className="px-3.5 py-3 flex items-center justify-between hover:bg-white/5 transition cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-200">Privacy & Security</div>
                          <div className="text-[10px] text-neutral-400">Data, Encryption, Local Storage</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500" />
                    </div>
                  </div>
                </div>

                {/* SECTION 4: SERVER & APK CONNECTION */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-1">
                    Server & APK Integration
                  </div>

                  <div className="bg-[#12131d] border border-neutral-800 rounded-2xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Server className="w-4 h-4 text-red-400" />
                        <span className="font-semibold text-neutral-200">Termux Backend Server</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        serverStatus === 'connected' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-red-950 text-red-400'
                      }`}>
                        {serverStatus === 'connected' ? `Connected (${pingLatency}ms)` : 'Checking...'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400">Server Host URL:</label>
                      <input
                        type="text"
                        value={serverUrl}
                        onChange={e => setServerUrl(e.target.value)}
                        className="w-full bg-[#0a0b12] border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        onClick={checkServerHealth}
                        className="flex-1 bg-red-600 hover:bg-red-500 text-white font-medium py-1.5 rounded-lg text-xs transition cursor-pointer"
                      >
                        Ping & Test Server
                      </button>
                      <a
                        href="/downloads/MAYA-TERMUX-SERVER.zip"
                        download
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs transition flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Termux ZIP</span>
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 4: APPS & SMART HOME (Tab ⊞ Apps) */}
          {/* ========================================================================= */}
          {currentTab === 'apps' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#090a10]">
              <div className="px-5 py-3 flex items-center justify-between border-b border-neutral-800 shrink-0">
                <div className="flex items-center space-x-2">
                  <Home className="w-5 h-5 text-red-500" />
                  <h2 className="text-base font-bold text-white">Smart Home & Tools</h2>
                </div>
                <button
                  onClick={() => setTorchOn(!torchOn)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    torchOn ? 'bg-amber-500 text-black shadow-md shadow-amber-500/40' : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Torch {torchOn ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-xs">
                {/* Banking Protection Banner */}
                <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-3 flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-red-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-red-300">Bank Protection Active</div>
                    <div className="text-[10px] text-neutral-400">GPay, PhonePe, and Paytm locked from unauthorized voice actions.</div>
                  </div>
                </div>

                {/* Smart Devices Grid */}
                <div className="space-y-2">
                  <div className="font-semibold text-neutral-300 px-1">Living Room & Appliances</div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {smartDevices.map(dev => (
                      <div
                        key={dev.id}
                        className={`p-3 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
                          dev.state ? 'bg-[#181522] border-red-500/40' : 'bg-[#12131d] border-neutral-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base">
                            {dev.type === 'light' && '💡'}
                            {dev.type === 'thermostat' && '❄️'}
                            {dev.type === 'tv' && '📺'}
                            {dev.type === 'lock' && '🔒'}
                          </span>
                          <button
                            onClick={() => handleToggleDevice(dev.id, dev.state)}
                            className={`w-9 h-5 rounded-full p-0.5 transition cursor-pointer flex items-center ${
                              dev.state ? 'bg-red-600 justify-end' : 'bg-neutral-700 justify-start'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-white block shadow" />
                          </button>
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-100 truncate">{dev.name}</div>
                          <div className="text-[10px] text-neutral-400">
                            {dev.state ? (dev.value ? `${dev.value} ${dev.unit || ''}` : 'Active') : 'Off'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reminders List */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="font-semibold text-neutral-300">Active Reminders</span>
                    <span className="text-[10px] text-neutral-500">{reminders.length} scheduled</span>
                  </div>

                  <div className="space-y-1.5">
                    {reminders.map(rem => (
                      <div
                        key={rem.id}
                        className="bg-[#12131d] border border-neutral-800 rounded-xl p-2.5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2.5">
                          <Bell className="w-4 h-4 text-amber-400 shrink-0" />
                          <div>
                            <div className="font-medium text-neutral-200">{rem.title}</div>
                            <div className="text-[10px] text-neutral-500">{rem.time} • {rem.category}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => speakHindiAudio(`रिमाइंडर: ${rem.title}`)}
                          className="p-1 text-neutral-400 hover:text-red-400 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="text"
                        value={newReminderText}
                        onChange={e => setNewReminderText(e.target.value)}
                        placeholder="Add reminder (e.g. Call client at 5 PM)"
                        className="flex-1 bg-[#12131d] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-red-500"
                      />
                      <button
                        onClick={handleCreateReminder}
                        className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Call Screener Simulator */}
                <div className="bg-[#12131d] border border-neutral-800 rounded-2xl p-3.5 space-y-2.5 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-neutral-200">Call Screener & Vault</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">Auto 48h Purge</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Maya automatically screens incoming unknown numbers, transcribes caller requests, and reads them to you in Hindi.
                  </p>
                  <button
                    onClick={() => {
                      setIncomingCallActive(true);
                      speakHindiAudio("राहुल वर्मा का फोन आ रहा है। विषय: मीटिंग का नया समय।");
                    }}
                    className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 py-1.5 rounded-xl text-xs font-medium cursor-pointer"
                  >
                    Simulate Incoming Call
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 5: FILES & APK TOOLS (Tab 📄 Files) */}
          {/* ========================================================================= */}
          {currentTab === 'files' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#090a10]">
              <div className="px-5 py-3 flex items-center justify-between border-b border-neutral-800 shrink-0">
                <div className="flex items-center space-x-2">
                  <Folder className="w-5 h-5 text-red-500" />
                  <h2 className="text-base font-bold text-white">APK Source & Files</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-xs">
                {/* Download Package Cards */}
                <div className="space-y-2">
                  <div className="font-semibold text-neutral-300 px-1">Production Builds & Packages</div>
                  
                  <div className="bg-[#12131d] border border-red-500/30 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center font-bold">
                          APK
                        </div>
                        <div>
                          <div className="font-semibold text-white">Maya Android App Source</div>
                          <div className="text-[10px] text-neutral-400">Kotlin, Jetpack Compose, OkHttp, TTS</div>
                        </div>
                      </div>
                      <a
                        href="/downloads/MAYA-ANDROID-APK-SOURCE.zip"
                        download
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-xs flex items-center gap-1 shadow cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Source ZIP</span>
                      </a>
                    </div>
                  </div>

                  <div className="bg-[#12131d] border border-neutral-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          SH
                        </div>
                        <div>
                          <div className="font-semibold text-white">Termux Server Package</div>
                          <div className="text-[10px] text-neutral-400">Node.js backend, Ollama router, Web search</div>
                        </div>
                      </div>
                      <a
                        href="/downloads/MAYA-TERMUX-SERVER.zip"
                        download
                        className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Server ZIP</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Termux Quick Run Guide */}
                <div className="bg-[#12131d] border border-neutral-800 rounded-2xl p-3.5 space-y-2">
                  <div className="font-semibold text-neutral-200">Termux 1-Line Setup:</div>
                  <pre className="bg-[#090a12] p-2.5 rounded-xl text-[10px] text-red-400 font-mono overflow-x-auto select-all border border-neutral-800">
                    pkg update && pkg install nodejs git -y && node server.js
                  </pre>
                  <p className="text-[10px] text-neutral-500">
                    Runs the Maya Queen local server on port 3000 / 8080.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 6: ASSISTANT MEMORY (Tab 🧠 Memory) */}
          {/* ========================================================================= */}
          {currentTab === 'memory' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#090a10]">
              <div className="px-5 py-3 flex items-center justify-between border-b border-neutral-800 shrink-0">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-red-500" />
                  <h2 className="text-base font-bold text-white">Maya Assistant Memory</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-xs">
                <div className="bg-[#12131d] border border-neutral-800 rounded-2xl p-3.5 space-y-2">
                  <div className="font-semibold text-neutral-200">Saved Preferences</div>
                  <ul className="space-y-1.5 text-neutral-400 text-[11px]">
                    <li>• Preferred Voice: <strong className="text-white">Sweet Female Hindi (Maya)</strong></li>
                    <li>• Text Response: <strong className="text-white">English First</strong></li>
                    <li>• Smart Home Location: <strong className="text-white">Living Room, Bedroom</strong></li>
                    <li>• Security Protocol: <strong className="text-white">Bank Security Shield Enforced</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5-TAB BOTTOM NAVIGATION BAR (Matches Screenshot 1 & 3) */}
          {/* ========================================================================= */}
          <div className="w-full bg-[#0a0b12] border-t border-neutral-800/80 px-2 py-2 flex items-center justify-around text-xs shrink-0 z-20">
            {/* 1. Chat */}
            <button
              onClick={() => setCurrentTab('chat')}
              className={`flex flex-col items-center space-y-1 transition cursor-pointer ${
                currentTab === 'chat' ? 'text-red-500 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span className="text-base">💬</span>
              <span className="text-[10px]">Chat</span>
            </button>

            {/* 2. Files */}
            <button
              onClick={() => setCurrentTab('files')}
              className={`flex flex-col items-center space-y-1 transition cursor-pointer ${
                currentTab === 'files' ? 'text-red-500 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-[10px]">Files</span>
            </button>

            {/* 3. Apps */}
            <button
              onClick={() => setCurrentTab('apps')}
              className={`flex flex-col items-center space-y-1 transition cursor-pointer ${
                currentTab === 'apps' ? 'text-red-500 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span className="text-base">⊞</span>
              <span className="text-[10px]">Apps</span>
            </button>

            {/* 4. Memory */}
            <button
              onClick={() => setCurrentTab('memory')}
              className={`flex flex-col items-center space-y-1 transition cursor-pointer ${
                currentTab === 'memory' ? 'text-red-500 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span className="text-[10px]">Memory</span>
            </button>

            {/* 5. Settings */}
            <button
              onClick={() => setCurrentTab('settings')}
              className={`flex flex-col items-center space-y-1 transition cursor-pointer ${
                currentTab === 'settings' ? 'text-red-500 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-[10px]">Settings</span>
            </button>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL: PROVIDER SETTINGS & FREE API KEYS (Matches user requirement) */}
      {/* ========================================================================= */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#12131d] border border-red-500/30 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-white text-sm">Provider & Free API Keys</h3>
              </div>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-neutral-300 space-y-1 bg-red-950/30 border border-red-500/20 p-3 rounded-xl">
              <span className="font-semibold text-red-400">🎁 100% Free AI Available:</span>
              <p className="text-[11px] text-neutral-400">
                You can use Maya with <strong>Built-in Core (No API key needed)</strong> or connect your <strong>Google Gemini Free Key</strong> or <strong>Local Ollama (Offline Free)</strong>.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Google Gemini API Key (Free Tier):</label>
                <input
                  type="password"
                  value={apiKeys.gemini}
                  onChange={e => setApiKeys({ ...apiKeys, gemini: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#0a0b12] border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Groq API Key (Free Tier):</label>
                <input
                  type="password"
                  value={apiKeys.groq}
                  onChange={e => setApiKeys({ ...apiKeys, groq: e.target.value })}
                  placeholder="gsk_..."
                  className="w-full bg-[#0a0b12] border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Local Ollama URL (Offline Free):</label>
                <input
                  type="text"
                  value={apiKeys.ollamaUrl}
                  onChange={e => setApiKeys({ ...apiKeys, ollamaUrl: e.target.value })}
                  placeholder="http://127.0.0.1:11434"
                  className="w-full bg-[#0a0b12] border border-neutral-800 rounded-xl px-3 py-2 text-neutral-200 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-neutral-800">
              <button
                onClick={() => {
                  setAiEngine('builtin');
                  setShowApiKeyModal(false);
                }}
                className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Use Free Built-in AI
              </button>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold cursor-pointer"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: WEB SEARCH RESULTS */}
      {/* ========================================================================= */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#12131d] border border-red-500/30 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 shrink-0">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-sm">Live Web Intelligence</h3>
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 text-xs">
              <div className="font-medium text-neutral-300">
                Search query: <span className="text-red-400 font-semibold">"{searchQuery}"</span>
              </div>

              {isSearching ? (
                <div className="p-8 text-center text-neutral-400 space-y-2">
                  <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>Searching live verified sources...</p>
                </div>
              ) : searchStateResults.length > 0 ? (
                <div className="space-y-2.5">
                  {searchStateResults.map((r, i) => (
                    <div key={i} className="bg-[#090a12] p-3 rounded-xl border border-neutral-800 space-y-1">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-red-400 hover:underline block"
                      >
                        {r.title}
                      </a>
                      <p className="text-neutral-300 text-[11px] leading-relaxed">{r.snippet}</p>
                      <span className="text-[10px] text-neutral-500 block truncate">{r.url}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-neutral-400">
                  <p>Found real-time results from live web endpoints. You can ask follow-ups directly in chat.</p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-neutral-800 flex justify-end shrink-0">
              <button
                onClick={() => setSearchModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIMULATED INCOMING CALL OVERLAY */}
      {/* ========================================================================= */}
      {incomingCallActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#141524] border border-red-500/40 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto animate-bounce">
              <PhoneCall className="w-8 h-8" />
            </div>

            <div>
              <div className="text-xs uppercase text-red-400 font-mono tracking-widest">Incoming Call</div>
              <h3 className="text-lg font-bold text-white mt-1">{callerInfo.name}</h3>
              <p className="text-xs text-neutral-400 font-mono">{callerInfo.number}</p>
            </div>

            <div className="bg-[#090a10] p-3 rounded-2xl border border-neutral-800 text-xs text-neutral-300 text-left space-y-1">
              <span className="text-[10px] text-red-400 font-semibold uppercase">Maya Call Screener:</span>
              <p className="italic">"Hello, Maya AI is screening this call for the owner. Please state your message..."</p>
            </div>

            <div className="flex items-center justify-center space-x-6 pt-2">
              <button
                onClick={() => {
                  setIncomingCallActive(false);
                  speakHindiAudio("कॉल अस्वीकार कर दी गई है।");
                }}
                className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg cursor-pointer"
                title="Decline"
              >
                <PhoneOff className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  setIncomingCallActive(false);
                  speakHindiAudio("कॉल स्वीकार की गई। माया द्वारा कॉल ट्रांसक्रिप्शन शुरू हो गया है।");
                }}
                className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg cursor-pointer"
                title="Answer & Screen"
              >
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
