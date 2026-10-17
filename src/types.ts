export interface ChatMessage {
  id: string;
  sender: 'user' | 'maya';
  text: string;               // Text in English or formatted response
  spokenHindi?: string;       // Audio voice spoken in Hindi
  timestamp: string;
  engine?: string;
  isStreaming?: boolean;
  phoneAction?: PhoneAction;
  smartHomeAction?: SmartHomeAction;
  reminderAction?: ReminderAction;
  searchResults?: SearchResult[];
  feedback?: 'like' | 'dislike' | null;
}

export interface SmartHomeDevice {
  id: string;
  name: string;
  room: string;
  type: 'light' | 'thermostat' | 'tv' | 'lock' | 'socket' | 'curtain' | 'fan';
  state: boolean;
  value?: number; // brightness (0-100), temp (16-30), volume (0-100)
  unit?: string;  // '%', '°C', etc.
  color?: string; // hex color for RGB lights
  icon?: string;
}

export interface SmartHomeAction {
  action: 'toggle' | 'set_value' | 'set_color' | 'apply_scene' | 'query';
  deviceId?: string;
  deviceName?: string;
  room?: string;
  state?: boolean;
  value?: number;
  color?: string;
  sceneName?: string;
  description: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  time: string;
  date: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'health' | 'home' | 'personal';
  spokenHindiText?: string;
}

export interface ReminderAction {
  action: 'create' | 'delete' | 'complete' | 'list';
  reminder?: ReminderItem;
  description: string;
}

export interface ActiveTimer {
  id: string;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  createdAt: number;
}

export interface PhoneAction {
  type: 
    | 'phone_call'
    | 'answer_call'
    | 'record_call'
    | 'send_sms'
    | 'whatsapp_message'
    | 'open_app'
    | 'search_contacts'
    | 'toggle_torch'
    | 'adjust_volume'
    | 'open_camera'
    | 'set_alarm'
    | 'launch_email'
    | 'open_instagram'
    | 'play_music'
    | 'permission_denied'
    | 'blocked_security';
  action: string;
  target?: string;
  recipient?: string;
  message?: string;
  appName?: string;
  query?: string;
  time?: string;
  state?: boolean;
  permissionKey?: string;
  requiresConfirmation: boolean;
  description: string;
}

export interface SearchResult {
  title: string;
  url: string;
  source: string;
  snippet: string;
}

export interface CallRecording {
  id: string;
  callerName: string;
  callerNumber: string;
  timestamp: string;
  createdAt?: number;
  expiresAt?: number; // 48-hour auto-purge policy
  autoDeleteHours?: number;
  duration: string;
  durationSeconds: number;
  transcript: {
    speaker: 'caller' | 'maya';
    text: string;
    spokenHindi?: string;
    time: string;
  }[];
  summary: string;
  intent: 'urgent' | 'work' | 'personal' | 'telemarketer' | 'unknown';
  audioRecorded: boolean;
}

export interface AutoSystemSettings {
  autoCallAnswer: boolean;
  autoAnswerDelaySeconds: number;
  autoAnswerFilter: 'all' | 'unknown' | 'contacts';
  autoCallRecording: boolean;
  autoDeleteAfter48Hours: boolean;
  recordingRetentionHours: number; // 48 hours
  autoSmsReader: boolean;
  autoSmartReply: boolean;
  autoReplyMessage: string;
  autoWakeWord: boolean;
  autoNightMode: boolean;
  autoBatteryGuard: boolean;
  turboSpeedMode: boolean;
  smartHomeAutoSync: boolean;
}

export interface PhonePermissions {
  answerCalls: boolean;
  callPhone: boolean;
  recordAudio: boolean;
  readSms: boolean;
  sendSms: boolean;
  contacts: boolean;
  camera: boolean;
  torch: boolean;
  notifications: boolean;
  floatingOverlay: boolean;
  smartHomeControl: boolean;
  bankAccess: false; // Permanently locked & forbidden
}

export interface ServerStatusData {
  success: boolean;
  server: {
    status: string;
    port: number;
    uptime: number;
    authTokenConfigured: boolean;
    turboCacheEnabled?: boolean;
    activeEngine?: string;
    jarvisMode?: boolean;
  };
  system: {
    platform: string;
    arch: string;
    cpuCount: number;
    totalMemoryMB: number;
    usedMemoryMB: number;
    freeMemoryMB: number;
  };
  localAi: {
    available: boolean;
    endpoint: string;
    activeModel: string;
    installedModels: string[];
    avgLatencyMs?: number;
  };
}

export interface ProviderConfig {
  id: string;
  name: string;
  enabled: boolean;
  apiKey: string;
  model: string;
  endpoint?: string;
  status: 'idle' | 'testing' | 'connected' | 'error';
  statusMessage?: string;
  latencyMs?: number;
}

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: 'image' | 'video' | 'pdf' | 'apk' | 'code' | 'other';
  dataUrl?: string;
  previewUrl?: string;
}

export interface AgentTask {
  id: string;
  title: string;
  command: string;
  status: 'pending_permission' | 'running' | 'completed' | 'failed';
  permissionPrompt?: string;
  requiresPermission: boolean;
  steps: {
    id: string;
    name: string;
    status: 'pending' | 'running' | 'done' | 'failed';
    log?: string;
  }[];
  progress: number;
  resultSummary?: string;
  resultDownloadUrl?: string;
  startedAt: string;
  completedAt?: string;
}

export interface LanguageSettings {
  textLanguage: 'en' | 'hi' | 'hinglish';
  audioLanguage: 'hi' | 'en' | 'hinglish';
  audioSpeed: number;
  audioPitch: number;
  voiceGender: 'female' | 'male';
  selectedVoice?: 'Maya' | 'Leher' | 'Neer' | 'Kavya' | 'Aarav';
  autoSpeakAudio: boolean;
}

export interface LiveMusicStation {
  id: string;
  title: string;
  artistOrCurator: string;
  genre: 'Bollywood' | 'Lo-Fi Chill' | 'Punjabi Hits' | '90s Retro' | 'Acoustic' | 'EDM';
  streamUrl: string;
  artwork: string;
  isLive: boolean;
  bitrate: string;
}

export interface LiveMatchData {
  id: string;
  sport: 'Cricket' | 'Football';
  tournament: string;
  teamA: {
    name: string;
    short: string;
    flag: string;
    score: string;
    overs?: string;
  };
  teamB: {
    name: string;
    short: string;
    flag: string;
    score: string;
    overs?: string;
  };
  statusText: string;
  matchPhase: 'Live' | 'Innings Break' | 'Match Finished';
  runRate: string;
  reqRunRate?: string;
  striker?: { name: string; runs: number; balls: number; fours: number; sixes: number };
  nonStriker?: { name: string; runs: number; balls: number };
  currentBowler?: { name: string; overs: string; wickets: number; runs: number; econ: string };
  recentBalls: string[];
  commentaryEnglish: string;
  commentaryHindi: string;
  venue: string;
  liveAudioBroadcast: boolean;
}
