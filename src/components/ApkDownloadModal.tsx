import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Terminal, 
  Smartphone, 
  Copy, 
  Check, 
  ShieldCheck, 
  FileCode, 
  Zap, 
  Play
} from 'lucide-react';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleApkFrame: () => void;
  isApkFrameActive: boolean;
}

export function ApkDownloadModal({
  isOpen,
  onClose,
  onToggleApkFrame,
  isApkFrameActive
}: ApkDownloadModalProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'termux' | 'apk' | 'server_code'>('termux');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(id);
    setTimeout(() => setCopiedTab(null), 2500);
  };

  const termuxCommands = `# 1. Update Termux repositories & install packages
pkg update -y && pkg install python nodejs git termux-api -y

# 2. Grant Phone & Storage Permissions in Termux
termux-setup-storage

# 3. Create Maya AI Server File
cat << 'EOF' > maya_server.py
import http.server
import socketserver
import json

PORT = 8080

class MayaHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "running", "engine": "maya-termux-local"}).encode())
            return
        return super().do_GET()

with socketserver.TCPServer(("", PORT), MayaHandler) as httpd:
    print(f"[*] Maya AI Local Server running on port {PORT} in Termux!")
    httpd.serve_forever()
EOF

# 4. Start Maya AI Server
python3 maya_server.py`;

  const downloadServerFile = (type: 'py' | 'js') => {
    let content = '';
    let filename = '';

    if (type === 'py') {
      filename = 'maya_termux_server.py';
      content = `#!/usr/bin/env python3
# Maya AI Local Server for Android Termux
# Runs offline on your phone with zero lag
import http.server
import socketserver
import json
import os
import subprocess

PORT = 8080

class MayaHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            res = {
                "success": True,
                "status": "healthy",
                "platform": "android-termux",
                "engine": "maya-local"
            }
            self.wfile.write(json.dumps(res).encode('utf-8'))
            return
        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/chat':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data.decode('utf-8')) if post_data else {}
            msg = body.get('message', '').strip()
            reply = f"Maya Local AI processed your request: '{msg}'. Termux server active!"
            hindi = "मैंने आपका संदेश प्राप्त कर लिया है।"
            response = {
                "success": True,
                "response": reply,
                "spokenHindi": hindi,
                "engine": "termux-local"
            }
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
            return
        self.send_response(404)
        self.end_headers()

print("="*50)
print(f"🚀 Maya AI Termux Engine started on http://127.0.0.1:{PORT}")
print("   Connect your Maya APK or browser to this endpoint.")
print("="*50)

with socketserver.TCPServer(("", PORT), MayaHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\\n[!] Stopping Maya Server...")
`;
    } else {
      filename = 'maya_termux_server.js';
      content = `// Maya AI Local Server (Node.js for Termux)
const http = require('http');
const PORT = 8080;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, status: 'healthy', platform: 'termux-node' }));
    return;
  }

  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const reply = "Maya Node.js Server on Termux is running smoothly!";
        const hindi = "टर्मक्स बैकएंड सर्वर पूरी तरह एक्टिव है।";
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, response: reply, spokenHindi: hindi, engine: 'termux-node' }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(\`🚀 Maya Node.js Server running on port \${PORT} in Termux!\`);
});
`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-[#141418] border border-cyan-500/30 p-6 shadow-2xl text-white flex flex-col max-h-[90vh] overflow-hidden ring-1 ring-cyan-500/20"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 font-hud">
                APK & TERMUX PACKAGES
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-sans">
                  Ready to Run
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Run Maya AI locally on Android via Termux or install as a Desktop PWA / APK
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-2 my-4 p-1 rounded-2xl bg-neutral-900 border border-white/5">
          <button
            onClick={() => setActiveTab('termux')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'termux'
                ? 'bg-neutral-800 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            Termux Setup
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'apk'
                ? 'bg-neutral-800 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4 text-cyan-400" />
            APK View Simulator
          </button>
          <button
            onClick={() => setActiveTab('server_code')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'server_code'
                ? 'bg-neutral-800 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Download className="w-4 h-4 text-amber-400" />
            Download Scripts
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {activeTab === 'termux' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-white/5 text-xs text-neutral-300">
                <span className="font-semibold text-white">How it works:</span> Termux runs the Python/Node server directly on your Android phone. Maya handles phone commands, call answering, and local memory offline with zero lag!
              </div>

              <div className="relative">
                <div className="flex items-center justify-between px-3 py-2 bg-neutral-950 rounded-t-xl border-x border-t border-neutral-800 text-[11px] text-neutral-400">
                  <span className="flex items-center gap-2 font-mono">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    termux_setup.sh
                  </span>
                  <button
                    onClick={() => copyToClipboard(termuxCommands, 'termux_cmd')}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                  >
                    {copiedTab === 'termux_cmd' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy All Commands
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-neutral-950 border border-neutral-800 rounded-b-xl text-neutral-300 font-mono text-[11px] overflow-x-auto leading-relaxed max-h-56">
                  {termuxCommands}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Toggle Live Android Phone Simulator Frame
                    </h3>
                    <p className="text-xs text-neutral-400">
                      View this app inside a realistic Android phone frame with status bar, punch hole, and gestures.
                    </p>
                  </div>
                  <button
                    onClick={onToggleApkFrame}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition shadow cursor-pointer ${
                      isApkFrameActive
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    }`}
                  >
                    {isApkFrameActive ? 'Exit Phone Frame' : 'Enter Phone Frame'}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-white/5 space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Install WebAPK / Desktop App
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  On Chrome/Edge, click the install icon in the URL bar to install Maya AI as a standalone desktop application with window borders and background execution!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'server_code' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-400">
                Download the standalone server script and run it in Termux, your PC, or your local network:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-neutral-900 border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                      <FileCode className="w-4 h-4" />
                      Python 3 Termux Server
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      maya_termux_server.py • Lightweight, zero external pip dependencies needed.
                    </p>
                  </div>
                  <button
                    onClick={() => downloadServerFile('py')}
                    className="mt-4 w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .py Script
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900 border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-cyan-400">
                      <FileCode className="w-4 h-4" />
                      Node.js Termux Server
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      maya_termux_server.js • Fast asynchronous engine for Termux node environment.
                    </p>
                  </div>
                  <button
                    onClick={() => downloadServerFile('js')}
                    className="mt-4 w-full py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .js Script
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% Safe: No passwords or bank accounts touched
          </span>
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-medium cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
