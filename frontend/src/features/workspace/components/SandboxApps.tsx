import React, { useState } from 'react';
import { 
  Plus, 
  Trash, 
  Settings, 
  Brain, 
  Sparkles, 
  DollarSign, 
  Users, 
  Send,
  Calendar,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';

// ----------------------------------------------------
// 1. SaaS Billing Calculator
// ----------------------------------------------------
export const SaaSBillingCalculator: React.FC = () => {
  const [seats, setSeats] = useState(5);
  const [tier, setTier] = useState<'standard' | 'enterprise'>('standard');
  const [yearly, setYearly] = useState(true);
  const [aiAddon, setAiAddon] = useState(false);

  const calculatePrice = () => {
    const basePrice = tier === 'standard' ? 12 : 36;
    const aiCost = aiAddon ? 15 : 0;
    const discount = yearly ? 0.8 : 1.0;
    
    return Math.round((seats * basePrice + aiCost) * discount);
  };

  return (
    <div className="font-sans text-slate-300 p-6 bg-slate-950/80 rounded-2xl border border-white/5 space-y-6 max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">ARVO Scale Billing</h3>
          <p className="text-[10px] text-slate-500">Instant seat price configurations</p>
        </div>
        <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">Vite Sandbox v1.2</span>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Team Seats</span>
            <span className="text-primary tabular-nums">{seats} Seats</span>
          </div>
          <input
            type="range"
            min={1}
            max={50}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setTier('standard')}
            className={`rounded-lg border p-3 text-left transition-all ${
              tier === 'standard' 
                ? 'bg-primary/10 border-primary text-white' 
                : 'bg-slate-900 border-white/5 text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className="font-bold">Standard Tier</div>
            <div className="text-[9px] font-normal text-slate-500 mt-0.5">$12 / seat / mo</div>
          </button>

          <button
            onClick={() => setTier('enterprise')}
            className={`rounded-lg border p-3 text-left transition-all ${
              tier === 'enterprise' 
                ? 'bg-primary/10 border-primary text-white' 
                : 'bg-slate-900 border-white/5 text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className="font-bold">Enterprise Pro</div>
            <div className="text-[9px] font-normal text-slate-500 mt-0.5">$36 / seat / mo</div>
          </button>
        </div>

        <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
          <div>
            <div className="font-semibold text-slate-300">Annual Billing Discount</div>
            <p className="text-[9px] text-slate-500">Save 20% on yearly plans</p>
          </div>
          <input
            type="checkbox"
            checked={yearly}
            onChange={(e) => setYearly(e.target.checked)}
            className="h-4 w-4 rounded border-white/10 bg-slate-900 text-primary focus:ring-primary"
          />
        </div>

        <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
          <div>
            <div className="font-semibold text-slate-300 flex items-center gap-1">
              <Brain className="h-3.5 w-3.5 text-accent animate-pulse" />
              <span>ARVO AI Co-Pilot Addon</span>
            </div>
            <p className="text-[9px] text-slate-500">Real-time prompt suggestions (+$15/mo)</p>
          </div>
          <input
            type="checkbox"
            checked={aiAddon}
            onChange={(e) => setAiAddon(e.target.checked)}
            className="h-4 w-4 rounded border-white/10 bg-slate-900 text-accent focus:ring-accent"
          />
        </div>
      </div>

      <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Estimated Cost</span>
          <span className="text-2xl font-black text-white tabular-nums">${calculatePrice()}</span>
          <span className="text-[9px] text-slate-500"> / month</span>
        </div>
        <button
          onClick={() => toast.success('Billing setup confirmed!')}
          className="rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/30 px-4 py-2 text-xs font-bold text-primary transition-colors"
        >
          Confirm Plan
        </button>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 2. VisionOS Spatial Tasks (Kanban Board)
// ----------------------------------------------------
export const VisionOSKanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Adjust canvas opacity rules', status: 'TODO', priority: 'HIGH' },
    { id: 2, title: 'Calibrate Eye-Tracking sync', status: 'IN_PROGRESS', priority: 'URGENT' },
    { id: 3, title: 'Test glassy component contrast', status: 'DONE', priority: 'LOW' }
  ]);

  const [newTitle, setNewTitle] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setTasks(prev => [
      ...prev,
      {
        id: Date.now(),
        title: newTitle,
        status: 'TODO',
        priority: 'MEDIUM'
      }
    ]);
    setNewTitle('');
    toast.success('Task deployed to Kanban board');
  };

  const handleMoveStatus = (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'TODO' ? 'IN_PROGRESS' : 'DONE';
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: nextStatus } : t));
    toast.info('Task state migrated');
  };

  return (
    <div className="font-sans text-slate-300 p-6 bg-slate-950/80 rounded-2xl border border-white/5 space-y-6 max-w-xl mx-auto shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-primary/5 blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-primary animate-pulse" />
            <span>VisionOS Spatial Tasks</span>
          </h3>
          <p className="text-[10px] text-slate-500">Interactive Glassmorphism Sandbox</p>
        </div>
      </div>

      <form onSubmit={handleAddTask} className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add new spatial deliverable..."
          className="flex-1 bg-slate-900 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/30 px-3.5 py-1.5 text-xs font-bold text-primary"
        >
          Add
        </button>
      </form>

      <div className="grid grid-cols-3 gap-3">
        {['TODO', 'IN_PROGRESS', 'DONE'].map((colId) => {
          const colTasks = tasks.filter(t => t.status === colId);
          const colTitle = colId === 'TODO' ? 'To Do' : colId === 'IN_PROGRESS' ? 'Active' : 'Done';
          
          return (
            <div key={colId} className="rounded-xl bg-slate-900/40 p-2.5 border border-white/[0.03] space-y-2 min-h-[160px]">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/5 pb-1.5 px-1">
                <span>{colTitle}</span>
                <span className="tabular-nums font-mono text-[9px] bg-slate-950/80 px-1.5 py-0.5 rounded border border-white/5">{colTasks.length}</span>
              </div>
              
              <div className="space-y-1.5">
                {colTasks.map(t => (
                  <div
                    key={t.id}
                    className="bg-slate-950/60 border border-white/5 hover:border-primary/20 rounded-lg p-2 text-[10px] space-y-2 cursor-pointer transition-all hover:translate-y-[-1px]"
                  >
                    <div className="font-semibold text-slate-200 line-clamp-2">{t.title}</div>
                    
                    <div className="flex justify-between items-center text-[8px] border-t border-white/5 pt-1.5">
                      <span className={`px-1 rounded-sm font-bold ${
                        t.priority === 'URGENT' ? 'text-error' : 'text-slate-500'
                      }`}>{t.priority}</span>
                      
                      {colId !== 'DONE' && (
                        <button
                          onClick={() => handleMoveStatus(t.id, colId)}
                          className="text-primary hover:text-white font-bold"
                        >
                          Move →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 3. Interactive AI Support Bot
// ----------------------------------------------------
export const AISupportBot: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Hello! I am your ARVO customer telemetry bot. Ask me about system parameters, model queues, or active databases.' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputVal('');
    setIsBotTyping(true);

    setTimeout(() => {
      let botResponse = 'Telemetry request completed. Sensor calibration drifts are within the acceptable range (<1.5%).';
      if (userText.toLowerCase().includes('queue') || userText.toLowerCase().includes('titan')) {
        botResponse = 'The Titan GPU compute queues in us-east4 currently exhibit an average response latency of 42 minutes. Remediations active.';
      }
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      setIsBotTyping(false);
      toast.success('AI responded');
    }, 1000);
  };

  return (
    <div className="font-sans text-slate-300 p-6 bg-slate-950/80 rounded-2xl border border-white/5 space-y-4 max-w-md mx-auto shadow-2xl relative overflow-hidden flex flex-col h-[350px]">
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-accent animate-pulse" />
          <div>
            <h3 className="text-xs font-bold text-white">ARVO Core Companion</h3>
            <span className="text-[9px] text-slate-500">Live Agent Consensus Mode</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`rounded-lg p-2.5 text-[10px] leading-relaxed max-w-[85%] ${
              m.sender === 'user'
                ? 'bg-primary/10 text-primary border border-primary/20 ml-auto'
                : 'bg-slate-900 border border-white/5 text-slate-300'
            }`}
          >
            {m.text}
          </div>
        ))}
        {isBotTyping && (
          <div className="bg-slate-900 border border-white/5 rounded-lg p-2.5 text-[10px] italic text-slate-500 animate-pulse">
            AI is reasoning...
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 shrink-0 border-t border-white/5 pt-3">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask Companion details..."
          className="flex-1 bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary/20 hover:bg-primary/30 border border-primary/30 px-3 hover:text-white flex items-center justify-center text-primary transition-colors"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
};
