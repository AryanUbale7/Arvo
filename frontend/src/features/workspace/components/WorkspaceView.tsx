import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Terminal as TermIcon,
  ArrowLeft,
  RefreshCw,
  Code,
  Laptop,
  Globe,
  Copy,
  Check,
  Zap,
  Bot,
  CircleDot,
  X,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  FileCode,
  FileJson,
  FileType2,
  Search,
  GitBranch,
  Package,
  Settings,
  Play,
  Square,
  Maximize2,
  Minus,
  Plus,
  Sparkles,
  AlertCircle,
  Info,
  LayoutPanelLeft,
  PanelBottomOpen,
  PanelBottomClose,
  WifiOff,
  Wifi
} from 'lucide-react';
import { toast } from 'sonner';
import { mockDb, SandboxProject } from '@/utils/mockDb';
import { useAuthStore } from '@/store/useAuthStore';
import {
  SaaSBillingCalculator,
  VisionOSKanbanBoard,
  AISupportBot
} from './SandboxApps';

// ── Syntax highlight helper (simple token colouring) ──────────────────────────
const SyntaxLine: React.FC<{ line: string; num: number }> = ({ line, num }) => {
  const colorize = (text: string) => {
    // Tokenise the line and apply colours
    return text
      .replace(/(\/\/.*$)/g, '<span style="color:#6A737D">$1</span>')
      .replace(/\b(import|export|const|let|var|return|await|from|async|if|else|for|of|in|new|default|function|class|extends|type|interface|enum)\b/g, '<span style="color:#F97583">$1</span>')
      .replace(/\b(React|useState|useEffect|useRef|FC)\b/g, '<span style="color:#79B8FF">$1</span>')
      .replace(/'([^']+)'/g, '<span style="color:#9ECBFF">\'$1\'</span>')
      .replace(/"([^"]+)"/g, '<span style="color:#9ECBFF">"$1"</span>')
      .replace(/`([^`]+)`/g, '<span style="color:#9ECBFF">`$1`</span>')
      .replace(/\b(\d+)\b/g, '<span style="color:#F8C555">$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, '<span style="color:#FFAB70">$1</span>');
  };

  return (
    <div className="flex group hover:bg-white/[0.03] transition-colors">
      <span className="select-none w-10 shrink-0 pr-4 text-right text-zinc-700 group-hover:text-zinc-600 text-[11px] leading-[20px] font-mono tabular-nums">
        {num}
      </span>
      <span
        className="text-zinc-400 text-[11px] leading-[20px] font-mono flex-1 pr-4 whitespace-pre"
        dangerouslySetInnerHTML={{ __html: colorize(line) }}
      />
    </div>
  );
};

// ── File tree node ────────────────────────────────────────────────────────────
const FileNode: React.FC<{ name: string; type: 'file' | 'folder'; depth?: number; active?: boolean; onClick?: () => void }> = ({
  name, type, depth = 0, active, onClick
}) => {
  const [open, setOpen] = useState(type === 'folder' && depth < 2);
  const ext = name.split('.').pop() || '';
  const fileIcon = ext === 'tsx' || ext === 'ts' ? <FileCode className="h-3 w-3 text-blue-400" />
    : ext === 'json' ? <FileJson className="h-3 w-3 text-yellow-400" />
    : ext === 'css' ? <FileType2 className="h-3 w-3 text-sky-400" />
    : <FileCode className="h-3 w-3 text-zinc-500" />;

  if (type === 'folder') {
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 w-full text-left px-2 py-0.5 hover:bg-white/[0.04] transition-colors rounded text-zinc-400 hover:text-zinc-200"
          style={{ paddingLeft: `${8 + depth * 12}px` }}
        >
          {open ? <ChevronDown className="h-3 w-3 shrink-0" /> : <ChevronRight className="h-3 w-3 shrink-0" />}
          <FolderOpen className="h-3 w-3 text-yellow-500/80 shrink-0" />
          <span className="text-[11px] font-medium truncate">{name}</span>
        </button>
        {open && <div>{/* children rendered by parent */}</div>}
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 w-full text-left py-0.5 hover:bg-white/[0.04] transition-colors rounded text-[11px] truncate ${active ? 'bg-white/[0.06] text-white' : 'text-zinc-500 hover:text-zinc-200'}`}
      style={{ paddingLeft: `${20 + depth * 12}px` }}
    >
      {fileIcon}
      <span className="truncate">{name}</span>
    </button>
  );
};

export const WorkspaceView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [project, setProject] = useState<SandboxProject | null>(null);
  const [messages, setMessages] = useState<SandboxProject['conversations']>([]);
  const [newPrompt, setNewPrompt] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [showTerminal, setShowTerminal] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeActivity, setActiveActivity] = useState<'chat' | 'files' | 'search'>('chat');
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeFile, setActiveFile] = useState('SandboxComponent.tsx');
  const [terminalInput, setTerminalInput] = useState('');
  const [problemsCount] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const syncWorkspace = () => {
    if (!projectId) return;
    const data = mockDb.getProject(projectId);
    if (!data) {
      toast.error('Workspace path invalid');
      navigate('/');
      return;
    }
    setProject(data);
    setMessages(data.conversations);
    const logs: string[] = [];
    data.conversations.forEach(c => {
      if (c.terminalLogs) logs.push(...c.terminalLogs);
    });
    setTerminalLogs(logs);
  };

  useEffect(() => { syncWorkspace(); }, [projectId]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isCompiling]);
  useEffect(() => { terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [terminalLogs]);

  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrompt.trim() || !projectId || isCompiling) return;
    const userMsg = newPrompt;
    setNewPrompt('');
    setIsCompiling(true);
    mockDb.addMessageToProject(projectId, 'user', userMsg);
    syncWorkspace();

    const steps = [
      `arvo: parsing prompt instruction: "${userMsg}"`,
      'arvo: initializing workspace node v20.11.0',
      'arvo: resolving template modules...',
      'arvo: package.json verified successfully',
      'arvo: compiling tailwindcss classes...',
      'arvo: bundling source assets via vite',
      'arvo: sandbox preview server listening on http://localhost:5173/',
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 180 + Math.random() * 180));
      setTerminalLogs(prev => [...prev, steps[i]]);
    }

    const responseText = `Understood! I have processed the updates for: **"${userMsg}"**. The code compiler completed successfully and the sandbox has been hot-reloaded with the new state parameters.`;
    mockDb.addMessageToProject(projectId, 'assistant', responseText, steps);
    setIsCompiling(false);
    toast.success('Compilation complete! Sandbox reloaded.');
    syncWorkspace();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeMock());
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTerminalCmd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && terminalInput.trim()) {
      setTerminalLogs(prev => [...prev, `$ ${terminalInput}`]);
      const cmd = terminalInput.trim().toLowerCase();
      if (cmd === 'clear') {
        setTerminalLogs([]);
      } else if (cmd.startsWith('npm')) {
        setTerminalLogs(prev => [...prev, 'arvo: running npm command...', `arvo: ${cmd} completed successfully.`]);
      } else {
        setTerminalLogs(prev => [...prev, `arvo: command not found: ${terminalInput}`]);
      }
      setTerminalInput('');
    }
  };

  if (!project) return null;

  const renderSandbox = () => {
    if (project.appTemplate === 'calculator') return <SaaSBillingCalculator />;
    if (project.appTemplate === 'kanban') return <VisionOSKanbanBoard />;
    return <AISupportBot />;
  };

  const getCodeMock = (): string => {
    if (project.appTemplate === 'calculator') return `import React, { useState } from 'react';\nimport { DollarSign, Users } from 'lucide-react';\n\nexport const SaaSBillingCalculator = () => {\n  const [seats, setSeats] = useState(5);\n  const [tier, setTier] = useState('standard');\n  const [yearly, setYearly] = useState(true);\n\n  const calculatePrice = () => {\n    const base = tier === 'standard' ? 12 : 36;\n    const discount = yearly ? 0.8 : 1.0;\n    return Math.round((seats * base) * discount);\n  };\n\n  return (\n    <div className="p-6 bg-slate-950 rounded-2xl">\n      <h3>ARVO Scale Billing</h3>\n      {/* Sliders & Pricing Output */}\n    </div>\n  );\n};`;
    if (project.appTemplate === 'kanban') return `import React, { useState } from 'react';\nimport { Layers } from 'lucide-react';\n\nexport const VisionOSKanbanBoard = () => {\n  const [tasks, setTasks] = useState([\n    { id: 1, title: 'Calibrate Eye-Tracking sync', status: 'IN_PROGRESS' }\n  ]);\n\n  return (\n    <div className="p-6 bg-slate-950 rounded-2xl">\n      <h3>VisionOS Spatial Tasks</h3>\n      {/* 3D Glassy Column Cards */}\n    </div>\n  );\n};`;
    return `import React, { useState } from 'react';\nimport { Brain, Send } from 'lucide-react';\n\nexport const AISupportBot = () => {\n  const [messages, setMessages] = useState([\n    { sender: 'bot', text: 'Hello! I am your ARVO customer bot.' }\n  ]);\n\n  return (\n    <div className="p-6 bg-slate-950 rounded-2xl flex flex-col h-[350px]">\n      <h3>ARVO Core Companion</h3>\n      {/* Message Chat Feed */}\n    </div>\n  );\n};`;
  };

  const codeLines = getCodeMock().split('\n');

  // File tree data
  const fileTree = [
    { name: 'src', type: 'folder' as const, depth: 0 },
    { name: 'components', type: 'folder' as const, depth: 1 },
    { name: 'SandboxComponent.tsx', type: 'file' as const, depth: 2 },
    { name: 'index.tsx', type: 'file' as const, depth: 2 },
    { name: 'App.tsx', type: 'file' as const, depth: 1 },
    { name: 'main.tsx', type: 'file' as const, depth: 1 },
    { name: 'index.css', type: 'file' as const, depth: 1 },
    { name: 'public', type: 'folder' as const, depth: 0 },
    { name: 'vite.svg', type: 'file' as const, depth: 1 },
    { name: 'package.json', type: 'file' as const, depth: 0 },
    { name: 'tsconfig.json', type: 'file' as const, depth: 0 },
    { name: 'vite.config.ts', type: 'file' as const, depth: 0 },
  ];

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-zinc-950 text-txt-primary select-none font-sans text-[12px]">

      {/* ── Activity Bar (far left) ─────────────────────────────────────── */}
      <div className="w-12 flex-shrink-0 border-r border-zinc-800 bg-zinc-900 flex flex-col items-center py-3 gap-1 z-30">
        {/* Logo back button */}
        <button
          onClick={() => navigate('/')}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-all mb-3 cursor-pointer"
          title="Back to Home"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </button>

        <div className="w-6 border-t border-zinc-800 mb-2" />

        {/* Chat */}
        <button
          onClick={() => { setActiveActivity('chat'); setShowSidebar(true); }}
          title="AI Assistant"
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${activeActivity === 'chat' && showSidebar ? 'bg-white/[0.08] text-white border border-white/[0.08]' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04]'}`}
        >
          <Sparkles className="h-3.5 w-3.5" />
        </button>

        {/* Files */}
        <button
          onClick={() => { setActiveActivity('files'); setShowSidebar(true); }}
          title="File Explorer"
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${activeActivity === 'files' && showSidebar ? 'bg-white/[0.08] text-white border border-white/[0.08]' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04]'}`}
        >
          <LayoutPanelLeft className="h-3.5 w-3.5" />
        </button>

        {/* Search */}
        <button
          onClick={() => { setActiveActivity('search'); setShowSidebar(true); }}
          title="Search"
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${activeActivity === 'search' && showSidebar ? 'bg-white/[0.08] text-white border border-white/[0.08]' : 'text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04]'}`}
        >
          <Search className="h-3.5 w-3.5" />
        </button>

        {/* Git */}
        <button title="Source Control" className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04] transition-all cursor-pointer">
          <GitBranch className="h-3.5 w-3.5" />
        </button>

        {/* Extensions */}
        <button title="Extensions" className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04] transition-all cursor-pointer">
          <Package className="h-3.5 w-3.5" />
        </button>

        <div className="flex-1" />

        {/* Settings */}
        <button title="Settings" className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04] transition-all cursor-pointer">
          <Settings className="h-3.5 w-3.5" />
        </button>
        {/* User avatar */}
        <div
          className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center font-bold text-[10px] text-white border border-white/10 shadow-md mt-1 cursor-pointer"
          title={user?.name || 'Aryan'}
        >
          {user?.name?.charAt(0).toUpperCase() || 'A'}
        </div>
      </div>

      {/* ── Primary Sidebar (Chat / Files / Search) ────────────────────── */}
      <AnimatePresence initial={false}>
        {showSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 border-r border-zinc-800 bg-zinc-900 flex flex-col z-20 relative"
          >
            {/* Panel Header */}
            <div className="flex h-10 items-center justify-between px-3 border-b border-zinc-800 shrink-0">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                {activeActivity === 'chat' ? 'ARVO AI Assistant' : activeActivity === 'files' ? 'Explorer' : 'Search'}
              </span>
              <button onClick={() => setShowSidebar(false)} className="text-zinc-700 hover:text-zinc-400 cursor-pointer transition-colors">
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* ── Chat Panel ── */}
            {activeActivity === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Project badge */}
                <div className="px-3 py-2 border-b border-zinc-800 shrink-0">
                  <div className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-2.5 py-1.5 border border-zinc-700">
                    <div className="h-5 w-5 rounded-md bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shrink-0">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white truncate">{project.name}</p>
                      <p className="text-[9px] text-txt-secondary">Live Agent Consensus Mode</p>
                    </div>
                    <CircleDot className="h-3 w-3 text-emerald-400 shrink-0 ml-auto" />
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin">
                  {messages.map((m) => (
                    <div key={m.id} className="flex flex-col gap-1.5">
                      {m.sender === 'user' ? (
                        <div className="flex items-start gap-2 flex-row-reverse">
                          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-[8px] font-bold text-white shrink-0 mt-0.5 border border-white/10">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                          </div>
                          <div className="max-w-[85%] bg-white/[0.05] border border-white/[0.06] rounded-xl rounded-tr-sm px-3 py-2 text-right">
                            <p className="text-[11px] font-medium text-txt-primary leading-relaxed">{m.text}</p>
                            <span className="text-[8px] text-txt-secondary/50 mt-0.5 block">
                              {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                            <Bot className="h-3 w-3 text-txt-secondary" />
                          </div>
                          <div className="max-w-[85%]">
                            <span className="text-[8px] text-txt-secondary font-bold uppercase tracking-widest block mb-1">ARVO Co-pilot</span>
                            <div className="bg-white/[0.03] border border-white/[0.04] rounded-xl rounded-tl-sm px-3 py-2">
                              <p className="text-[11px] text-txt-primary leading-relaxed">{m.text}</p>
                            </div>
                            <span className="text-[8px] text-txt-secondary/50 mt-0.5 block pl-1">
                              {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {isCompiling && (
                    <div className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="h-3 w-3 text-txt-secondary" />
                      </div>
                      <div className="bg-white/[0.03] border border-white/[0.04] rounded-xl rounded-tl-sm px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-3 border-t border-zinc-800 shrink-0">
                  <form onSubmit={handleSendPrompt}>
                    <div className="relative flex items-end gap-2 bg-zinc-950 border border-zinc-700 rounded-xl focus-within:border-zinc-500 transition-colors shadow-inner">
                      <textarea
                        rows={2}
                        value={newPrompt}
                        onChange={(e) => setNewPrompt(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendPrompt(e as any); } }}
                        disabled={isCompiling}
                        placeholder="Refine interface or ask follow-up..."
                        className="flex-1 bg-transparent py-2.5 pl-3 pr-2 text-[11px] text-txt-primary placeholder-txt-secondary/40 focus:outline-none font-medium resize-none leading-relaxed"
                      />
                      <button
                        type="submit"
                        disabled={isCompiling || !newPrompt.trim()}
                        className="mb-2 mr-2 h-7 w-7 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center text-white transition-all cursor-pointer shrink-0"
                      >
                        <Send className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-[9px] text-txt-secondary/50 mt-1.5 px-1">Enter to send · Shift+Enter for new line</p>
                  </form>
                </div>
              </div>
            )}

            {/* ── File Explorer Panel ── */}
            {activeActivity === 'files' && (
              <div className="flex-1 overflow-y-auto py-1 scrollbar-thin">
                <div className="px-3 py-1.5 flex items-center justify-between shrink-0">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-txt-secondary">{project.name}</span>
                </div>
                <div className="px-1 space-y-0.5">
                  {fileTree.map((node, i) => (
                    <FileNode
                      key={i}
                      name={node.name}
                      type={node.type}
                      depth={node.depth}
                      active={activeFile === node.name}
                      onClick={() => {
                        if (node.type === 'file') {
                          setActiveFile(node.name);
                          setActiveTab('code');
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Search Panel ── */}
            {activeActivity === 'search' && (
              <div className="flex-1 p-3 space-y-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-600" />
                  <input
                    type="text"
                    placeholder="Search in files..."
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg py-2 pl-7 pr-3 text-[11px] text-txt-primary placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors shadow-inner"
                  />
                </div>
                <p className="text-[10px] text-txt-secondary/60 px-1">Type to search across all workspace files.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Editor + Preview Area ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 bg-black">

        {/* ── Tab bar ── */}
        <div className="flex h-10 items-center border-b border-zinc-800 bg-zinc-950 shrink-0 px-0 overflow-x-auto">
          {/* Sidebar toggle */}
          <button
            onClick={() => setShowSidebar(s => !s)}
            className="h-10 px-3 border-r border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all cursor-pointer shrink-0"
            title="Toggle Sidebar"
          >
            <LayoutPanelLeft className="h-3.5 w-3.5" />
          </button>

          {/* Open file tab */}
          <div className="flex items-center gap-2 px-4 h-full border-r border-zinc-800 bg-zinc-900 text-zinc-100 text-[11px] font-medium shrink-0 shadow-[inset_0_-1px_0_rgba(255,255,255,0.1)]">
            <FileCode className="h-3 w-3 text-blue-400" />
            <span>{activeFile}</span>
            <button className="text-zinc-700 hover:text-white cursor-pointer ml-1">
              <X className="h-2.5 w-2.5" />
            </button>
          </div>

          {activeTab === 'preview' && (
            <div className="flex items-center gap-2 px-4 h-full text-zinc-600 text-[11px] cursor-pointer hover:bg-white/[0.03] transition-colors"
              onClick={() => setActiveTab('code')}>
              <Laptop className="h-3 w-3" />
              <span>Sandbox Preview</span>
            </div>
          )}

          <div className="flex-1" />

          {/* Right controls */}
          <div className="flex items-center gap-1 px-3 shrink-0">
            {/* Preview / Code toggle */}
            <div className="flex rounded-md bg-white/[0.04] border border-white/[0.05] p-0.5 text-[10px] font-bold gap-0.5 mr-2">
              <button
                onClick={() => setActiveTab('preview')}
                className={`rounded px-2.5 py-1 transition-all cursor-pointer flex items-center gap-1 ${activeTab === 'preview' ? 'bg-white/[0.1] text-white' : 'text-zinc-600 hover:text-zinc-300'}`}
              >
                <Laptop className="h-3 w-3" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`rounded px-2.5 py-1 transition-all cursor-pointer flex items-center gap-1 ${activeTab === 'code' ? 'bg-white/[0.1] text-white' : 'text-zinc-600 hover:text-zinc-300'}`}
              >
                <Code className="h-3 w-3" />
                <span>Code</span>
              </button>
            </div>

            {/* Status */}
            <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold border mr-1 ${isCompiling ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isCompiling ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
              <span>{isCompiling ? 'Compiling...' : 'Live'}</span>
            </div>

            <button onClick={() => toast.info('Refreshing sandbox...')} className="rounded p-1.5 text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05] transition-colors cursor-pointer" title="Refresh">
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* ── Editor / Preview Body ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {activeTab === 'preview' ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 flex flex-col overflow-hidden bg-black"
                >
                  {/* Browser chrome bar */}
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-800 bg-zinc-900 shrink-0">
                    {/* dots */}
                    <div className="flex gap-1.5 shrink-0">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500/50 hover:bg-red-500 transition-colors cursor-pointer" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/50 hover:bg-yellow-500 transition-colors cursor-pointer" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500/50 hover:bg-green-500 transition-colors cursor-pointer" />
                    </div>
                    {/* URL bar */}
                    <div className="flex-1 mx-4 flex items-center gap-2 bg-black/40 border border-white/[0.06] rounded-md px-3 py-1 max-w-sm">
                      <Globe className="h-2.5 w-2.5 text-zinc-600 shrink-0" />
                      <span className="text-[10px] font-mono text-zinc-600 truncate select-all">http://localhost:5173/</span>
                    </div>
                    <button onClick={() => toast.info('Refreshing...')} className="text-zinc-600 hover:text-zinc-300 cursor-pointer transition-colors">
                      <RefreshCw className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Preview content */}
                  <div className="flex-1 overflow-y-auto flex items-center justify-center p-8 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50" />
                    {isCompiling ? (
                      <div className="relative z-10 flex flex-col items-center gap-5 text-center">
                        <div className="relative">
                          <div className="h-14 w-14 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
                          <Zap className="absolute inset-0 m-auto h-5 w-5 text-white/60" />
                        </div>
                        <div>
                          <p className="text-[11px] text-txt-primary font-bold uppercase tracking-widest animate-pulse">Compiling changes...</p>
                          <p className="text-[10px] text-txt-secondary/60 mt-2 max-w-xs leading-normal">Parsing follow-up parameters. Bundle size recalculating.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative z-10 w-full max-w-2xl">
                        {renderSandbox()}
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="code"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 flex flex-col overflow-hidden bg-black"
                >
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-1 px-4 py-1.5 border-b border-zinc-800 bg-zinc-950 text-[10px] text-zinc-500 shrink-0">
                    <span>src</span>
                    <ChevronRight className="h-3 w-3" />
                    <span>components</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-zinc-400">{activeFile}</span>
                    <div className="flex-1" />
                    <button onClick={handleCopyCode} className="flex items-center gap-1 hover:text-zinc-300 cursor-pointer transition-colors">
                      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Code lines */}
                  <div className="flex-1 overflow-auto py-2 scrollbar-thin">
                    {codeLines.map((line, i) => (
                      <SyntaxLine key={i} line={line} num={i + 1} />
                    ))}
                    {/* Cursor blink */}
                    <div className="flex">
                      <span className="w-10 shrink-0" />
                      <span className="inline-block h-4 w-0.5 bg-white/60 animate-pulse mt-1 ml-0.5" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Terminal drawer ── */}
          <AnimatePresence initial={false}>
            {showTerminal && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 250, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="border-t border-zinc-800 bg-zinc-950 flex flex-col shrink-0 relative z-20"
              >
                {/* Terminal tab bar */}
                <div className="flex items-center justify-between px-4 py-1.5 border-b border-zinc-800 bg-zinc-900 shrink-0">
                  <div className="flex items-center gap-1">
                    <button className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.05] border border-white/[0.06] text-[10px] font-bold text-white">
                      <TermIcon className="h-3 w-3 text-emerald-400" />
                      TERMINAL
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-medium text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer">
                      <AlertCircle className="h-3 w-3" />
                      PROBLEMS
                      {problemsCount > 0 && <span className="h-3.5 w-3.5 rounded-full bg-red-500/20 text-red-400 text-[8px] flex items-center justify-center">{problemsCount}</span>}
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-medium text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer">
                      <Info className="h-3 w-3" />
                      OUTPUT
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setTerminalLogs([])} title="Clear terminal" className="text-zinc-700 hover:text-zinc-300 cursor-pointer transition-colors">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setShowTerminal(false)} title="Close panel" className="text-zinc-700 hover:text-zinc-300 cursor-pointer transition-colors">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Terminal body */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-0.5 font-mono text-[10px] scrollbar-thin">
                  {/* Initial banner */}
                  <div className="text-txt-secondary/50 mb-2 select-text">ARVO Sandbox Terminal · Node v20.11.0 · Vite v6.4.3</div>
                  {terminalLogs.map((log, idx) => {
                    const isCmd = log.startsWith('$');
                    const isError = log.includes('error') || log.includes('Error');
                    const isSuccess = log.includes('success') || log.includes('completed') || log.includes('verified') || log.includes('listening');
                    return (
                      <div key={idx} className="leading-relaxed flex items-start gap-2 select-text">
                        {!isCmd && <span className="text-emerald-600 shrink-0">➜</span>}
                        {isCmd && <span className="text-zinc-500 shrink-0">$</span>}
                        <span className={isError ? 'text-error' : isSuccess ? 'text-success' : isCmd ? 'text-txt-primary' : 'text-txt-secondary'}>
                          {isCmd ? log.slice(2) : log}
                        </span>
                      </div>
                    );
                  })}
                  {isCompiling && (
                    <div className="flex items-center gap-2 text-zinc-600 animate-pulse">
                      <span className="text-emerald-700">➜</span>
                      <span>arvo: compiling...</span>
                    </div>
                  )}
                  <div ref={terminalEndRef} />
                </div>

                {/* Terminal input */}
                <div className="flex items-center gap-2 px-4 py-2 border-t border-white/[0.04] shrink-0">
                  <span className="text-emerald-600 font-mono text-[10px] shrink-0">➜</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyDown={handleTerminalCmd}
                    placeholder="Type a command..."
                    className="flex-1 bg-transparent text-[10px] font-mono text-txt-primary placeholder-txt-secondary/40 focus:outline-none select-text"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Status Bar ── */}
        <div className="flex items-center justify-between h-6 px-4 bg-accent/20 border-t border-accent/20 shrink-0 select-none">
          <div className="flex items-center gap-4 text-[9px] text-txt-secondary font-medium">
            <button className="flex items-center gap-1 hover:text-txt-primary cursor-pointer transition-colors">
              <GitBranch className="h-3 w-3" />
              <span>main</span>
            </button>
            <button className="flex items-center gap-1 hover:text-txt-primary cursor-pointer transition-colors">
              <AlertCircle className="h-3 w-3" />
              <span>0 errors · 0 warnings</span>
            </button>
          </div>
          <div className="flex items-center gap-4 text-[9px] text-txt-secondary font-medium">
            <button
              onClick={() => setShowTerminal(t => !t)}
              className="flex items-center gap-1 hover:text-txt-primary cursor-pointer transition-colors"
            >
              {showTerminal ? <PanelBottomClose className="h-3 w-3" /> : <PanelBottomOpen className="h-3 w-3" />}
              <span>Terminal</span>
            </button>
            <span className="flex items-center gap-1">
              <Wifi className="h-3 w-3 text-success" />
              Vite :5173
            </span>
            <span>TypeScript React · UTF-8</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WorkspaceView;
