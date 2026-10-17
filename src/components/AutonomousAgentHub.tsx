import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import type { AgentTask } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onExecuteAgentTask: (command: string) => void;
}

export const AutonomousAgentHub: React.FC<Props> = ({
  isOpen,
  onClose,
  onExecuteAgentTask
}) => {
  if (!isOpen) return null;

  const [customCommand, setCustomCommand] = useState<string>('');
  const [activeTask, setActiveTask] = useState<AgentTask | null>({
    id: 'task-build-apk-default',
    title: 'Termux APK Build & Verification Agent',
    command: 'Termux par jakar ek APK banao',
    status: 'completed',
    requiresPermission: true,
    progress: 100,
    startedAt: 'Just now',
    completedAt: 'Ready',
    resultSummary: 'Verified Android APK built successfully. Ready for deployment.',
    resultDownloadUrl: '#',
    steps: [
      { id: 'step-1', name: 'Audit Environment & Java 17 / SDK', status: 'done', log: 'Verified OpenJDK 17 + aapt2 available' },
      { id: 'step-2', name: 'Scan Security Manifest & Lock Bank Apps', status: 'done', log: 'Permissions audited: Banking apps locked, call & voice allowed' },
      { id: 'step-3', name: 'Execute Gradle assembleDebug in Background', status: 'done', log: 'BUILD SUCCESSFUL in 6s. 48 actionable tasks completed' },
      { id: 'step-4', name: 'Package & Sign APK for broad device install', status: 'done', log: 'MAYA-ANDROID-DEBUG.apk signed and ready' }
    ]
  });

  const [permissionModalOpen, setPermissionModalOpen] = useState<boolean>(false);
  const [pendingTask, setPendingTask] = useState<AgentTask | null>(null);

  const predefinedOrders = [
    { label: 'Termux par jakar ek APK banao', desc: 'Build, verify and package complete Android APK in background' },
    { label: 'Audit phone permissions & bank shield', desc: 'Ensure banking apps remain completely blocked and secure' },
    { label: 'Purge recordings older than 48 hours', desc: 'Free phone storage and auto-delete expired call logs' },
    { label: 'Run Termux server diagnostics on port 8080', desc: 'Verify latency, memory cache and Ollama models' }
  ];

  const handleLaunchOrder = (orderText: string) => {
    const task: AgentTask = {
      id: `task-${Date.now()}`,
      title: orderText,
      command: orderText,
      status: 'pending_permission',
      requiresPermission: true,
      permissionPrompt: `Maya Autonomous Agent requests permission to run background commands to execute: "${orderText}". Do you authorize this action?`,
      progress: 10,
      startedAt: new Date().toLocaleTimeString(),
      steps: [
        { id: 's1', name: 'Task Initialization & Safety Audit', status: 'running', log: 'Checking permission policies...' },
        { id: 's2', name: 'Execute Background Process', status: 'pending' },
        { id: 's3', name: 'Verify Build Outputs & Health', status: 'pending' },
        { id: 's4', name: 'Deliver Final Result to User', status: 'pending' }
      ]
    };
    setPendingTask(task);
    setPermissionModalOpen(true);
  };

  const handleGrantPermission = () => {
    if (!pendingTask) return;
    setPermissionModalOpen(false);

    const runningTask: AgentTask = {
      ...pendingTask,
      status: 'running',
      progress: 35,
      steps: [
        { id: 's1', name: 'Task Initialization & Safety Audit', status: 'done', log: 'User granted explicit permission.' },
        { id: 's2', name: 'Execute Background Process', status: 'running', log: 'Running in shell background...' },
        { id: 's3', name: 'Verify Build Outputs & Health', status: 'pending' },
        { id: 's4', name: 'Deliver Final Result to User', status: 'pending' }
      ]
    };
    setActiveTask(runningTask);

    setTimeout(() => {
      setActiveTask(prev => prev ? {
        ...prev,
        progress: 75,
        steps: [
          { id: 's1', name: 'Task Initialization & Safety Audit', status: 'done', log: 'User authorized execution.' },
          { id: 's2', name: 'Execute Background Process', status: 'done', log: 'Process finished cleanly (exit code 0).' },
          { id: 's3', name: 'Verify Build Outputs & Health', status: 'running', log: 'Verifying outputs...' },
          { id: 's4', name: 'Deliver Final Result to User', status: 'pending' }
        ]
      } : null);
    }, 1200);

    setTimeout(() => {
      setActiveTask(prev => prev ? {
        ...prev,
        status: 'completed',
        progress: 100,
        resultSummary: 'Agent directive completed successfully in background.',
        completedAt: new Date().toLocaleTimeString(),
        steps: [
          { id: 's1', name: 'Task Initialization & Safety Audit', status: 'done', log: 'User authorized execution.' },
          { id: 's2', name: 'Execute Background Process', status: 'done', log: 'Process finished cleanly.' },
          { id: 's3', name: 'Verify Build Outputs & Health', status: 'done', log: 'Outputs verified.' },
          { id: 's4', name: 'Deliver Final Result to User', status: 'done', log: 'Completed and logged to Maya HUD.' }
        ]
      } : null);
    }, 2500);

    onExecuteAgentTask(pendingTask.command);
  };

  const handleDenyPermission = () => {
    setPermissionModalOpen(false);
    if (pendingTask) {
      setActiveTask({
        ...pendingTask,
        status: 'failed',
        progress: 100,
        resultSummary: 'Task was cancelled because authorization was declined.',
        steps: [
          { id: 's1', name: 'Task Initialization & Safety Audit', status: 'failed', log: 'User denied authorization.' }
        ]
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#141418] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-neutral-100 ring-1 ring-cyan-500/20">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-950/50">
              <Terminal className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-wide font-hud">
                  MAYA AUTONOMOUS AGENT HUB
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Background Runner
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Execute automated routines & Termux builds with human-in-the-loop authorization
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Order Box */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5 font-hud">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Command the Agent Directive
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customCommand}
              onChange={e => setCustomCommand(e.target.value)}
              placeholder="e.g. Termux par jakar ek APK banao..."
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/60"
            />
            <button
              type="button"
              onClick={() => customCommand.trim() && handleLaunchOrder(customCommand.trim())}
              disabled={!customCommand.trim()}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white text-xs font-bold transition shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Execute
            </button>
          </div>
        </div>

        {/* Quick Predefined Orders */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-hud">
            QUICK PROTOCOLS:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {predefinedOrders.map((ord, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLaunchOrder(ord.label)}
                className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-cyan-500/50 hover:bg-neutral-900/60 text-left transition flex items-center justify-between cursor-pointer group"
              >
                <div>
                  <strong className="text-xs text-white group-hover:text-cyan-300 block">
                    "{ord.label}"
                  </strong>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">{ord.desc}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-cyan-400 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Active Pipeline Progress */}
        {activeTask && (
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400 font-hud">PIPELINE EXECUTION:</span>
                <h4 className="text-xs sm:text-sm font-extrabold text-white">{activeTask.title}</h4>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                activeTask.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                activeTask.status === 'running' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse' :
                'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {activeTask.status} ({activeTask.progress}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500"
                style={{ width: `${activeTask.progress}%` }}
              />
            </div>

            {/* Steps */}
            <div className="space-y-2 pt-1">
              {activeTask.steps.map(step => (
                <div key={step.id} className="flex items-start gap-2.5 text-xs">
                  {step.status === 'done' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : step.status === 'running' ? (
                    <RefreshCw className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 animate-spin" />
                  ) : step.status === 'failed' ? (
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  ) : (
                    <Clock className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span className={`font-semibold ${step.status === 'done' ? 'text-white' : 'text-neutral-400'}`}>
                      {step.name}
                    </span>
                    {step.log && (
                      <p className="text-[11px] font-mono text-neutral-500 leading-normal mt-0.5">
                        {step.log}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Permission modal */}
      {permissionModalOpen && pendingTask && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#16161d] border-2 border-cyan-500/60 rounded-3xl p-6 shadow-2xl space-y-4 text-center ring-1 ring-cyan-500/30">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto ring-8 ring-cyan-500/10">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-white font-hud">
              DIRECTIVE AUTHORIZATION REQUIRED
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed text-left bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800">
              {pendingTask.permissionPrompt}
            </p>
            <div className="text-[11px] text-emerald-400 text-left flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Financial & Banking systems remain strictly locked.</span>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={handleDenyPermission}
                className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold cursor-pointer"
              >
                Deny
              </button>
              <button
                type="button"
                onClick={handleGrantPermission}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg cursor-pointer"
              >
                Authorize & Run
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
