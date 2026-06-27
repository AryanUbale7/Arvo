import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Terminal, 
  Brain, 
  Layers, 
  Globe, 
  Lock, 
  Mail, 
  Check, 
  Search, 
  BookOpen, 
  MessageSquare,
  HelpCircle,
  ShieldCheck,
  Zap,
  Layout,
  Code,
  Building,
  UserCheck,
  ShoppingBag,
  BarChart3,
  Cpu,
  Database,
  Layers2
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { mockDb } from '@/utils/mockDb';
import { toast } from 'sonner';

// --- Shared Header Component ---
const PageHeader: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuthStore();

  return (
    <header className="relative z-20 flex h-16 items-center justify-between px-6 md:px-12 border-b border-white/[0.04] bg-black/60 backdrop-blur-md shrink-0 select-none">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5 hover:cursor-pointer animate-fade-in" onClick={() => navigate('/')}>
          <img 
            src="/arvologo.svg" 
            alt="ARVO Logo" 
            className="h-8 w-auto object-contain invert" 
          />
        </div>

        <nav className="hidden lg:flex items-center gap-6 text-[11px] text-[#94A3B8] font-semibold">
          <a onClick={() => navigate('/features')} className="hover:text-white transition-colors cursor-pointer">Features</a>
          <a onClick={() => navigate('/examples')} className="hover:text-white transition-colors cursor-pointer">Examples</a>
          <a onClick={() => navigate('/pricing')} className="hover:text-white transition-colors cursor-pointer">Pricing</a>
          <a onClick={() => navigate('/docs')} className="hover:text-white transition-colors cursor-pointer">Docs</a>
          <a onClick={() => navigate('/enterprise')} className="hover:text-white transition-colors cursor-pointer">Enterprise</a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-[11px] text-[#94A3B8] font-medium">
              Signed in as <strong className="text-white">{user?.name || 'Aryan'}</strong>
            </span>
            <button 
              onClick={() => {
                logout();
                toast.success('Signed out successfully.');
              }}
              className="text-[11px] text-[#94A3B8] hover:text-white font-bold transition-colors cursor-pointer"
            >
              Sign out
            </button>
            <button
              onClick={() => { const proj = mockDb.getOrCreateDefaultProject(); navigate(`/workspace/${proj.id}`); }}
              className="rounded-lg bg-white hover:bg-zinc-100 text-black px-4 py-2 text-[11px] font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
            >
              <span>Go to Console</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => navigate('/auth')}
              className="text-[11px] text-[#94A3B8] hover:text-white font-bold transition-colors cursor-pointer"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="rounded-lg bg-white hover:bg-zinc-100 text-black px-4 py-2 text-[11px] font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};

// --- Shared Background Layer ---
const PageBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Background neon dots grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />
      
      {/* Glow orb */}
      <div className="absolute -top-[20%] left-[20%] right-[20%] w-[60%] aspect-square rounded-full bg-white/[0.01] blur-[140px]" />
      
      {/* Curved Earth Backdrop at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 w-full aspect-[16/6] pointer-events-none select-none opacity-20">
        <img 
          src="/earth_bg_dark_mode.png" 
          alt="" 
          className="w-full h-full object-cover select-none pointer-events-none" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>
    </div>
  );
};


// --- FEATURES PAGE ---
export const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Zap, title: 'Instant Dev Sandbox', desc: 'Spin up fully functional Node, Python, and React container sandboxes on-demand. Compile, execute, and view hot-reloading outputs in under 2 seconds.' },
    { icon: Brain, title: 'Multi-Agent Workspace', desc: 'Deploy automated coding subagents configured with terminal execute, code replacement, and search tools. Orchestrate complex workflows asynchronously.' },
    { icon: Terminal, title: 'Interactive Web Shell', desc: 'Direct terminal command execution on isolated sandbox runtimes. Install NPM/Pip dependencies, run builds, and invoke diagnostic tests.' },
    { icon: Layers, title: 'Database & Mock Runtimes', desc: 'Equipped with integrated SQLite, PostgreSQL mocks, and JSON storages. Seamlessly write persistent database layers for mock application sandboxes.' },
    { icon: Globe, title: 'Unified Preview Routing', desc: 'Access your sandboxed applications live. ARVO handles port mapping and secure reverse proxies to let you test APIs and frontends immediately.' },
    { icon: ShieldCheck, title: 'SOC2 Compliant Sandboxing', desc: 'Every product run is sandboxed in secure, isolated containers. Hardened compute isolation guarantees secure workspace code storage.' }
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-black overflow-x-hidden font-sans text-[#F8FAFC]">
      <PageHeader />
      <PageBackground />

      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-6 py-16 md:py-24 space-y-16">
        {/* Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="rounded-full bg-zinc-900/50 border border-white/[0.08] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Features Checklist</span>
          <h1 className="text-display md:text-5xl font-black tracking-tight leading-tight">
            Designed for <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">intelligent</span> product creation.
          </h1>
          <p className="text-xs md:text-sm text-[#94A3B8] leading-relaxed">
            ARVO packs isolated compute environments, parallel subagents, and responsive browser previews into a single unified developer panel.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className="relative group rounded-2xl border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] backdrop-blur-xl p-6 transition-all flex flex-col gap-4 shadow-xl"
              >
                {/* Glow border on hover */}
                <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/10 transition-colors pointer-events-none" />
                <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white leading-tight">{feat.title}</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed font-medium">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="rounded-lg bg-white hover:bg-zinc-100 text-black px-6 py-3 text-xs font-bold shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch Your Workspace</span>
            <ArrowRight className="h-4 w-4 text-black" />
          </button>
        </div>
      </main>
    </div>
  );
};

// --- EXAMPLES PAGE (Enhanced with Dynamic Category Filter) ---
export const ExamplesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = ['All', 'App Templates', 'Dashboards', 'AI Tools', 'Content Sites', 'Personal'];

  const examples = [
    { title: 'E-commerce Store', desc: 'Complete e-commerce experience with interactive checkout drawers, Stripe payment simulators, product catalogs, and administrative sales logs.', icon: ShoppingBag, category: 'App Templates' },
    { title: 'SaaS Analytics Dashboard', desc: 'Real-time corporate analytics console featuring live charts, interactive metrics filters, user permission toggles, and downloadable report logs.', icon: BarChart3, category: 'Dashboards' },
    { title: 'AI Chatbot Feed', desc: 'Dual-feed instant chat board running channel lists, user profile cards, response status indicators, and preconfigured assistant chat logs.', icon: MessageSquare, category: 'AI Tools' },
    { title: 'Developer Documentation Site', desc: 'Developer docs template with full sidebar routing hierarchies, responsive code-snippets blocks, search queries, and helpful tip callouts.', icon: BookOpen, category: 'Content Sites' },
    { title: 'Responsive Portfolio', desc: 'Sleek portfolio showcase including micro-animations, customizable dark mode states, and fully operational email inquiry contact sheets.', icon: UserCheck, category: 'Personal' }
  ];

  const filteredExamples = activeFilter === 'All' 
    ? examples 
    : examples.filter(ex => ex.category === activeFilter);

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-black overflow-x-hidden font-sans text-[#F8FAFC]">
      <PageHeader />
      <PageBackground />

      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-6 py-16 md:py-24 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="rounded-full bg-zinc-900/50 border border-white/[0.08] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Library Showcase</span>
          <h1 className="text-display md:text-5xl font-black tracking-tight leading-tight">
            Spawn ready-made <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">blueprints</span> in seconds.
          </h1>
          <p className="text-xs md:text-sm text-[#94A3B8] leading-relaxed">
            Choose a starting template below. Clicking any card redirects you to the editor console to boot the sandbox environment immediately.
          </p>
        </div>

        {/* Categories filters menu */}
        <div className="flex flex-wrap gap-2 justify-center py-2 select-none border-b border-white/[0.05]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all cursor-pointer border ${
                activeFilter === cat 
                  ? 'bg-white border-transparent text-black font-extrabold' 
                  : 'bg-white/[0.01] hover:bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {filteredExamples.length > 0 ? (
            filteredExamples.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx} 
                  onClick={() => navigate('/')}
                  className="relative group rounded-2xl border border-white/10 bg-white/[0.01] hover:bg-white/[0.03] backdrop-blur-xl p-6 transition-all flex gap-5 cursor-pointer shadow-xl"
                >
                  <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/10 transition-colors pointer-events-none" />
                  <div className="h-10 w-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2 flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{item.category}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-sm font-bold text-white leading-tight">{item.title}</h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-12 border border-white/5 bg-white/[0.01] rounded-2xl">
              <span className="text-xs text-zinc-500 font-bold block">No templates match this category.</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- PRICING PAGE (Enhanced with Dynamic Annual Toggle) ---
export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    { name: 'Developer', price: '$0', desc: 'For individuals exploring virtual sandboxing environments.', features: ['1 active sandbox runtime', 'Basic subagent code edits', 'Standard terminal execution', 'Access to documentation'], cta: 'Boot Free', active: false },
    { name: 'Pro', price: billingCycle === 'annual' ? '$19' : '$24', desc: 'For developers creating multi-agent full-stack products.', features: ['5 active sandboxes concurrently', 'Advanced subagent orchestration', 'Interactive Web Shell access', 'SQLite database persistence', 'Priority preview proxies'], cta: 'Upgrade to Pro', active: true },
    { name: 'Enterprise', price: 'Custom', desc: 'For teams requiring isolated compute security.', features: ['Unlimited sandbox environments', 'Dedicated compute isolated nodes', 'Hardened SOC2 security audits', 'Custom subagent configuration', 'Dedicated support channels'], cta: 'Contact Operations', active: false }
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-black overflow-x-hidden font-sans text-[#F8FAFC]">
      <PageHeader />
      <PageBackground />

      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-6 py-16 md:py-24 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="rounded-full bg-zinc-900/50 border border-white/[0.08] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Pricing Structures</span>
          <h1 className="text-display md:text-5xl font-black tracking-tight leading-tight">
            Transparent pricing, <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">unlimited</span> scale.
          </h1>
          <p className="text-xs md:text-sm text-[#94A3B8] leading-relaxed">
            Select the tier suited for your operations. All premium tiers grant direct interactive compute.
          </p>
        </div>

        {/* Dynamic Billing Toggle Switcher */}
        <div className="flex justify-center select-none">
          <div className="relative rounded-xl border border-white/10 bg-white/[0.02] p-1 flex gap-1 items-center">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                billingCycle === 'monthly' 
                  ? 'bg-white text-black font-extrabold' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'annual' 
                  ? 'bg-white text-black font-extrabold' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span>Annual</span>
              <span className="rounded bg-black text-white text-[8px] px-1 font-black leading-tight border border-white/10">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 items-stretch">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative rounded-2xl border p-6 flex flex-col justify-between gap-6 shadow-2xl backdrop-blur-xl transition-all ${
                plan.active 
                  ? 'border-white/20 bg-white/[0.03] md:scale-105 z-10' 
                  : 'border-white/10 bg-white/[0.01]'
              }`}
            >
              {plan.active && (
                <span className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-white text-black px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                  Popular Option
                </span>
              )}

              <div className="space-y-4 text-left">
                <div>
                  <h3 className="text-sm font-bold text-white">{plan.name}</h3>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-normal font-medium">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1 py-2 border-b border-white/5">
                  <span className="text-3xl font-extrabold text-white transition-all">{plan.price}</span>
                  {plan.price !== 'Custom' && (
                    <span className="text-[10px] text-zinc-500 font-medium">
                      / month {billingCycle === 'annual' && '(billed annually)'}
                    </span>
                  )}
                </div>

                <ul className="space-y-2.5 pt-2">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex gap-2 items-center text-xs text-zinc-300 font-medium">
                      <Check className="h-4 w-4 text-white shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  toast.success(`Plan ${plan.name} request logged!`);
                  navigate('/auth');
                }}
                className={`w-full py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-all border ${
                  plan.active 
                    ? 'bg-white hover:bg-zinc-100 text-black border-transparent shadow-sm' 
                    : 'bg-transparent hover:bg-white/[0.04] text-white border-white/10'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

// --- DOCS PAGE (Enhanced with Live Language API Snippets Switcher) ---
export const DocsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('quickstart');
  const [codeLang, setCodeLang] = useState<'js' | 'python' | 'curl'>('js');

  const docSections = [
    { id: 'quickstart', label: 'Quickstart Guides', title: 'Spinning Up Sandboxes', content: 'ARVO allocates virtual container environments dynamically when you submit a prompt. To initialize a blank Workspace instance, issue your prompt detailing the stack. Subagents automatically parse the description, create directories, package requirements, and deploy code libraries.' },
    { id: 'cli', label: 'CLI & Run Shell', title: 'Terminal Commands Execution', content: 'The built-in web shell communicates directly with isolated Docker sandbox runtimes. You can run common compilation tools, invoke package installers (`npm install`, `pip install`), initialize databases (`sqlite3`), and diagnostic tests. Scripts run natively at 60fps with real-time log streaming.' },
    { id: 'orchestration', label: 'Subagent Orchestration', title: 'Running Coding Agents', content: 'ARVO incorporates parallel subagents. You can instruct the agentic pipeline to write, search, and patch files. Use markdown formatting to outline tasks, and subagents coordinate recursively to solve files, compiling and validating builds step-by-step.' },
    { id: 'networking', label: 'Networking & API Proxies', title: 'API Reverse Proxies', content: 'Applications spawned inside the sandbox are securely reverse-proxied. ARVO maps port redirects (e.g. port 3000 for React apps, 8000 for Python APIs) to let you interact with browser previews live. Secure SSL routes are provisioned instantly.' }
  ];

  const activeDoc = docSections.find(doc => doc.id === activeTab) || docSections[0];

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-black overflow-x-hidden font-sans text-[#F8FAFC]">
      <PageHeader />
      <PageBackground />

      <div className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-6 py-12 flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-56 shrink-0 border-r border-white/5 pr-4 flex flex-col gap-1.5 text-left select-none">
          <div className="flex items-center gap-2 px-2.5 py-1.5 mb-4 bg-white/[0.02] border border-white/5 rounded-lg">
            <Search className="h-3.5 w-3.5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search docs..." 
              className="bg-transparent border-0 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-0 w-full"
              onChange={() => toast.info('Documentation search indexed.')}
            />
          </div>

          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest px-2.5 mb-1.5 block">Documentation</span>
          {docSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === sec.id 
                  ? 'bg-white/[0.04] text-white border-l-2 border-white pl-2' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 space-y-6 text-left">
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">System Pathways</span>
            <h1 className="text-display md:text-4xl font-extrabold text-white tracking-tight">{activeDoc.title}</h1>
          </div>

          <div className="prose prose-invert max-w-none text-xs md:text-sm text-zinc-300 leading-relaxed font-medium space-y-4">
            <p>{activeDoc.content}</p>
            
            {/* Example Snippet Console with language selection */}
            <div className="pt-4 space-y-2.5">
              <div className="flex items-center justify-between select-none">
                <h3 className="text-white font-bold text-sm">Example Commands & API</h3>
                
                {/* Language Switch Tab */}
                <div className="rounded-lg border border-white/10 bg-white/[0.01] p-0.5 flex gap-1 items-center">
                  {(['js', 'python', 'curl'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setCodeLang(lang)}
                      className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all cursor-pointer ${
                        codeLang === lang 
                          ? 'bg-white text-black font-extrabold' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-zinc-950 border border-white/5 p-4 font-mono text-[10px] text-zinc-400 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                {codeLang === 'js' && activeDoc.id === 'quickstart' && `const arvo = require('@arvo/sdk');\nconst project = await arvo.createProject('react-ecommerce', { template: 'ecommerce' });`}
                {codeLang === 'js' && activeDoc.id === 'cli' && `import { exec } from 'child_process';\nexec('npm run dev -- --port 3000', (err, stdout) => console.log(stdout));`}
                {codeLang === 'js' && activeDoc.id === 'orchestration' && `const agent = await arvo.runAgent("add checkout drawer modal component");\nagent.on('progress', (step) => console.log(step.desc));`}
                {codeLang === 'js' && activeDoc.id === 'networking' && "const proxy = await arvo.getProxyRoute(3000);\nconsole.log(`Live route: ${proxy.secureUrl}`);"}

                {codeLang === 'python' && activeDoc.id === 'quickstart' && `import arvo\nproject = arvo.create_project('react-ecommerce', template='ecommerce')`}
                {codeLang === 'python' && activeDoc.id === 'cli' && `import subprocess\nsubprocess.run(["npm", "run", "dev", "--", "--port", "3000"])`}
                {codeLang === 'python' && activeDoc.id === 'orchestration' && `import arvo\nagent = arvo.run_agent("add checkout drawer modal component")\nfor step in agent.steps: print(step.desc)`}
                {codeLang === 'python' && activeDoc.id === 'networking' && `import arvo\nroute = arvo.get_proxy_route(3000)\nprint(f"Live route: {route.secure_url}")`}

                {codeLang === 'curl' && activeDoc.id === 'quickstart' && `$ curl -X POST https://api.arvo.ai/v1/projects \\\n  -H "Authorization: Bearer $ARVO_API_KEY" \\\n  -d '{"name": "react-ecommerce", "template": "ecommerce"}'`}
                {codeLang === 'curl' && activeDoc.id === 'cli' && `$ arvo exec "npm run dev -- --port 3000"`}
                {codeLang === 'curl' && activeDoc.id === 'orchestration' && `$ curl -X POST https://api.arvo.ai/v1/agents \\\n  -H "Authorization: Bearer $ARVO_API_KEY" \\\n  -d '{"task": "add checkout drawer modal component"}'`}
                {codeLang === 'curl' && activeDoc.id === 'networking' && `$ curl https://api.arvo.ai/v1/proxies/3000`}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- ENTERPRISE PAGE (Enhanced with Live Resource Projection Calculator) ---
export const EnterprisePage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', org: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  
  // Projection calculator states
  const [sandboxesCount, setSandboxesCount] = useState<number>(30);
  const [agentsCount, setAgentsCount] = useState<number>(8);

  const calculatedRAM = sandboxesCount * 2; // 2GB RAM per sandbox
  const calculatedCPU = agentsCount * 1.5; // 1.5 Cores per agent

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setFormData({ name: '', email: '', org: '', message: '' });
      toast.success('Enterprise operations request logged. Support team will contact shortly.');
    }, 1500);
  };

  const enterpriseFeatures = [
    { icon: ShieldCheck, title: 'Hardened SOC2 Isolation', desc: 'Secure enterprise containers with dedicated kernel partitions, preventing cross-tenant data leaks.' },
    { icon: Building, title: 'Private VPC Compute Nodes', desc: 'Provision sandboxes directly inside your private VPC (AWS, GCP, Azure) to maintain full network isolation.' },
    { icon: Code, title: 'Custom Subagent Policies', desc: 'Configure custom agent access rights, library permissions, and CLI execution bounds to align with security standards.' }
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-black overflow-x-hidden font-sans text-[#F8FAFC]">
      <PageHeader />
      <PageBackground />

      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-6 py-12 md:py-16 flex flex-col lg:flex-row gap-10 items-stretch">
        
        {/* Left column */}
        <div className="flex-1 space-y-8 text-left flex flex-col justify-center">
          <div className="space-y-4">
            <span className="rounded-full bg-zinc-900/50 border border-white/[0.08] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Enterprise Tiers</span>
            <h1 className="text-display md:text-5xl font-black tracking-tight leading-tight">
              Enterprise-grade <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">compute</span> controls.
            </h1>
            <p className="text-xs md:text-sm text-[#94A3B8] leading-relaxed">
              ARVO scales secure container resources, SOC2 compliance protocols, and VPC isolated orchestration nodes for global enterprise engineering teams.
            </p>
          </div>

          {/* Calculator Spec Panel */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.01] backdrop-blur-xl p-5 space-y-5 shadow-xl select-none">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Live Compute Resource Estimator</span>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span>Concurrent Sandboxes</span>
                  <span className="text-white font-extrabold">{sandboxesCount} runtimes</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="200" 
                  step="5"
                  value={sandboxesCount} 
                  onChange={(e) => setSandboxesCount(parseInt(e.target.value))}
                  className="w-full accent-white bg-zinc-900 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span>Parallel Coding Agents</span>
                  <span className="text-white font-extrabold">{agentsCount} subagents</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="50" 
                  step="1"
                  value={agentsCount} 
                  onChange={(e) => setAgentsCount(parseInt(e.target.value))}
                  className="w-full accent-white bg-zinc-900 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5 text-center">
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider block">Allocated RAM</span>
                <span className="text-sm font-extrabold text-white flex items-center justify-center gap-1">
                  <Database className="h-4 w-4 text-white" />
                  {calculatedRAM} GB
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider block">Allocated Compute vCPU</span>
                <span className="text-sm font-extrabold text-white flex items-center justify-center gap-1">
                  <Cpu className="h-4 w-4 text-white" />
                  {calculatedCPU} Cores
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            {enterpriseFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="h-9 w-9 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{feat.title}</h4>
                    <p className="text-[11px] text-[#94A3B8] mt-1 leading-normal font-medium">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column (Request Form) */}
        <div className="w-full lg:w-[380px] shrink-0 relative z-10 rounded-2xl border border-white/10 bg-white/[0.01] backdrop-blur-xl p-6 shadow-2xl text-left flex flex-col justify-center">
          <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
            <Building className="h-4.5 w-4.5 text-white" />
            <span>Request Enterprise Access</span>
          </h3>
          <p className="text-[10px] text-zinc-500 mb-6 font-medium">Log organizational details to schedule a product demo with our operations leads.</p>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Your Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Developer Aryan"
                disabled={submitting}
                className="w-full bg-black border border-white/10 rounded-lg py-2 px-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Corporate Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="aryan@enterprise.org"
                disabled={submitting}
                className="w-full bg-black border border-white/10 rounded-lg py-2 px-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Organization Name</label>
              <input
                type="text"
                required
                value={formData.org}
                onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                placeholder="ARVO Engineering"
                disabled={submitting}
                className="w-full bg-black border border-white/10 rounded-lg py-2 px-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-medium">Operational Message</label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Specify compute requirements..."
                disabled={submitting}
                className="w-full bg-black border border-white/10 rounded-lg py-2 px-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-white hover:bg-zinc-100 text-black border border-transparent rounded-lg py-2.5 text-xs font-bold cursor-pointer flex items-center justify-center gap-2 transition-all mt-4"
            >
              {submitting ? (
                <span className="h-4 w-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  <span>Request Contact</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
export default FeaturesPage;
