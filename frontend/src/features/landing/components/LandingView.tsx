import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Terminal,
  Brain,
  Layers,
  Globe,
  Paperclip,
  FolderDown,
  ShoppingBag,
  BarChart3,
  Layout,
  MessageSquare,
  User,
  ShieldCheck,
  Zap,
  Lock,
  Check,
  X,
  ChevronRight,
  Code,
  Database,
  Cpu,
  Package,
  BookOpen,
  Building,
  Mail,
  Search,
  Play,
  Star,
  GitBranch,
  Server,
  Layers2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { mockDb } from '@/utils/mockDb';
import { toast } from 'sonner';

// ── Data ──────────────────────────────────────────────────────────────────────

const EXAMPLES = [
  { title: 'E-commerce store', desc: 'Modern store with cart, payments & admin panel', prompt: 'Build a premium E-commerce store with cart drawer, stripe payments, and admin panel dashboard', icon: ShoppingBag, tag: 'App Template' },
  { title: 'SaaS Dashboard', desc: 'Analytics dashboard with charts and reports', prompt: 'Build a SaaS Dashboard with real-time analytics graphs, charts, and downloadable reports', icon: BarChart3, tag: 'Dashboard' },
  { title: 'AI Landing Page', desc: 'Convert visitors with AI powered landing page', prompt: 'Build a high-converting AI Landing Page featuring responsive layouts, custom widgets, and signups', icon: Layout, tag: 'AI Tool' },
  { title: 'AI Chat App', desc: 'Chat application with real-time messaging', prompt: 'Build an AI Chat App with real-time message feeds, channels, and simulated assistant responses', icon: MessageSquare, tag: 'AI Tool' },
  { title: 'Portfolio Website', desc: 'Personal portfolio with projects and blog', prompt: 'Build a sleek Portfolio Website with animated project showcases, biography details, and blog listing', icon: User, tag: 'App Template' },
];

const FEATURES_FULL = [
  { icon: Zap, title: 'Instant Generation', desc: 'Describe your idea and ARVO produces a working product in under 30 seconds — no templates, no filler.', color: 'text-txt-primary', bg: 'bg-white/5 border-white/10' },
  { icon: Brain, title: 'Multi-Agent Orchestration', desc: 'Parallel AI agents handle frontend, backend, and database tasks simultaneously for blazing-fast results.', color: 'text-txt-primary', bg: 'bg-white/5 border-white/10' },
  { icon: Terminal, title: 'Full-Stack Apps', desc: 'ARVO builds real frontend, backend, APIs, and database schemas — not just mockups.', color: 'text-txt-primary', bg: 'bg-white/5 border-white/10' },
  { icon: ShieldCheck, title: 'Secure & Scalable', desc: 'Production-ready code with auth, rate limiting, and cloud deployment baked in from the start.', color: 'text-txt-primary', bg: 'bg-white/5 border-white/10' },
  { icon: Code, title: 'Live Sandbox Preview', desc: 'Every generated project runs in an isolated Vite sandbox with hot-reload so you see changes instantly.', color: 'text-txt-primary', bg: 'bg-white/5 border-white/10' },
  { icon: Database, title: 'Database Integration', desc: 'Auto-configures Postgres, Supabase or SQLite schemas and seeds them with realistic sample data.', color: 'text-txt-primary', bg: 'bg-white/5 border-white/10' },
  { icon: GitBranch, title: 'Git-Ready Output', desc: 'Every workspace exports a clean git repo with conventional commits, ready to push to GitHub.', color: 'text-txt-secondary', bg: 'bg-white/5 border-white/10' },
  { icon: Globe, title: 'One-Click Deploy', desc: 'Deploy to Vercel, Render, or any cloud provider with a single click from the ARVO console.', color: 'text-txt-primary', bg: 'bg-white/5 border-white/10' },
];

const PRICING_PLANS = [
  {
    name: 'Free',
    price: { monthly: '$0', annual: '$0' },
    desc: 'Perfect to try ARVO',
    features: ['3 sandbox projects / month', '10 AI generation credits', 'Vite preview environment', 'Community support', 'Export to ZIP'],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: { monthly: '$24', annual: '$19' },
    desc: 'For serious builders',
    features: ['Unlimited sandbox projects', '500 AI generation credits / mo', 'Full-stack app generation', 'Priority support', 'One-click Vercel deploy', 'Git export & CI/CD', 'Custom domain preview'],
    cta: 'Start Pro Trial',
    highlight: true,
  },
  {
    name: 'Team',
    price: { monthly: '$79', annual: '$59' },
    desc: 'For collaborative teams',
    features: ['Everything in Pro', '5 team members', 'Shared workspace projects', 'Role-based access control', 'Audit logs', 'Slack integration', 'Dedicated account manager'],
    cta: 'Start Team Trial',
    highlight: false,
  },
];

const DOCS_SECTIONS = [
  { id: 'quickstart', label: 'Quickstart', icon: Play },
  { id: 'cli', label: 'CLI Reference', icon: Terminal },
  { id: 'orchestration', label: 'Agent Orchestration', icon: Brain },
  { id: 'networking', label: 'Live Networking', icon: Server },
];

const DOCS_CONTENT: Record<string, { title: string; body: string; code: string }> = {
  quickstart: {
    title: 'Quickstart Guide',
    body: 'Install the ARVO SDK and create your first AI-generated project in under 2 minutes. ARVO handles environment setup, dependency resolution, and scaffold generation automatically.',
    code: `import arvo from '@arvo/sdk';\n\nconst project = await arvo.createProject('my-app', {\n  template: 'ecommerce',\n  stack: 'react-vite-ts',\n});\n\nconsole.log(\`Preview: \${project.previewUrl}\`);`,
  },
  cli: {
    title: 'CLI Reference',
    body: 'Use the ARVO CLI to generate, run, and deploy projects from your terminal. The CLI wraps the full API surface and supports piping prompts from stdin.',
    code: `# Install globally\nnpm install -g @arvo/cli\n\n# Create a project from a prompt\narvo create "Build a SaaS billing calculator"\n\n# Run the sandbox locally\narvo dev --port 3000`,
  },
  orchestration: {
    title: 'Agent Orchestration',
    body: 'ARVO spawns multiple parallel AI agents to handle frontend, backend, and infra tasks concurrently. Monitor agent progress in real-time via the event stream.',
    code: `const agent = await arvo.runAgent(\n  "add checkout drawer modal component"\n);\n\nagent.on('progress', (step) => {\n  console.log(\`[\${step.agent}] \${step.desc}\`);\n});\n\nawait agent.done();`,
  },
  networking: {
    title: 'Live Networking',
    body: 'Every sandbox gets a unique secure tunnel URL so you can share previews with teammates or embed in staging environments — no port-forwarding needed.',
    code: `const proxy = await arvo.getProxyRoute(3000);\n\nconsole.log(\`Secure URL: \${proxy.secureUrl}\`);\nconsole.log(\`Expires: \${proxy.expiresAt}\`);`,
  },
};

const PARTNERS = [
  { name: 'Vercel', icon: Layers },
  { name: 'Linear', icon: Terminal },
  { name: 'Raycast', icon: Sparkles },
  { name: 'Render', icon: Globe },
  { name: 'Supabase', icon: Brain },
  { name: 'GitHub', icon: GitBranch },
  { name: 'Cloudflare', icon: Server },
];

// ── Section fade-in animation wrapper ─────────────────────────────────────────
const Section: React.FC<{ id: string; className?: string; children: React.ReactNode }> = ({ id, className = '', children }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    className={`relative z-10 w-full max-w-6xl mx-auto px-6 ${className}`}
  >
    {children}
  </motion.section>
);

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-txt-secondary mb-4">
    {children}
  </span>
);

const SectionHeading: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => (
  <div className="mb-10">
    <h2 className="text-2xl md:text-3xl font-black text-txt-primary tracking-tight leading-tight">{children}</h2>
    {sub && <p className="text-sm text-txt-secondary mt-3 max-w-xl leading-relaxed">{sub}</p>}
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
export const LandingView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [annualBilling, setAnnualBilling] = useState(false);
  const [activeDoc, setActiveDoc] = useState('quickstart');
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    // Pro-level preloader duration
    const timer = setTimeout(() => setShowPreloader(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuthStore();

  useEffect(() => {
    document.documentElement.classList.remove('light');
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePromptSubmit = (submittedPrompt: string) => {
    if (!submittedPrompt.trim()) return;
    if (!isAuthenticated) {
      mockDb.setCapturedPrompt(submittedPrompt);
      navigate('/auth');
      toast.info('Session authorization required to spawn sandbox.');
    } else {
      const newProj = mockDb.createProjectFromPrompt(submittedPrompt);
      toast.success(`Provisioning: ${newProj.name}`);
      navigate(`/workspace/${newProj.id}`);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-bg-l0 overflow-x-hidden font-sans select-none text-txt-primary transition-colors duration-200">
      
      {/* Pro Preloader */}
      <AnimatePresence>
        {showPreloader && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1, delay: 0.8 } }}
          >
            {/* Split Screen Backgrounds */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-1/2 bg-bg-l0"
              initial={{ y: 0 }}
              exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1/2 bg-bg-l0"
              initial={{ y: 0 }}
              exit={{ y: "100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            />

            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              exit={{ scale: 1.5, opacity: 0, filter: "blur(10px)", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
            >
              {/* Logo Reveal */}
              <motion.div
                className="overflow-hidden pb-1"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
              >
                <img 
                  src="/arvologo.svg" 
                  alt="ARVO Logo" 
                  className="h-14 md:h-16 w-auto invert"
                />
              </motion.div>

              {/* Progress Line */}
              <motion.div 
                className="h-[1px] bg-white/50 mt-8 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
                style={{ width: 140 }}
              />

              {/* Status Text */}
              <div className="overflow-hidden mt-4">
                <motion.p
                  className="text-[9px] font-mono font-bold text-white/70 tracking-[0.3em] uppercase"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.8 }}
                >
                  System Initialized
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background dot grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-6 md:px-12 border-b border-white/[0.04] bg-bg-l0/80 backdrop-blur-md">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollTo('hero')}>
            <img src="/arvologo.svg" alt="ARVO Logo" className="h-8 w-auto object-contain invert" />
          </div>
          <nav className="hidden lg:flex items-center gap-2 text-[11px] text-txt-secondary font-semibold">
            {['features', 'examples', 'pricing', 'docs', 'enterprise'].map(s => (
              <a key={s} onClick={() => scrollTo(s)} className="px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all cursor-pointer capitalize">{s}</a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-[11px] text-txt-secondary font-medium hidden sm:block">
                Signed in as <strong className="text-txt-primary">{user?.name || 'Aryan'}</strong>
              </span>
              <button onClick={() => { logout(); toast.success('Signed out.'); }} className="text-[11px] text-txt-secondary hover:text-txt-primary font-bold transition-colors cursor-pointer">Sign out</button>
              <button onClick={() => { const p = mockDb.getOrCreateDefaultProject(); navigate(`/workspace/${p.id}`); }} className="rounded-lg bg-white hover:bg-zinc-100 text-black px-4 py-2 text-[11px] font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer">
                Go to Console <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/auth')} className="text-[11px] text-txt-secondary hover:text-txt-primary font-bold transition-colors cursor-pointer">Sign in</button>
              <button onClick={() => navigate('/auth')} className="rounded-lg bg-white hover:bg-zinc-100 text-black px-4 py-2 text-[11px] font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer">
                Get Started <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── Hero ── */}
      <section id="hero" className="relative z-10 flex flex-col items-center justify-center pt-20 pb-32 px-4 text-center">

        {/* Earth background */}
        <div className="absolute top-[220px] left-0 right-0 w-full aspect-[16/7] pointer-events-none select-none z-0 overflow-hidden">
          <img src="/earth_bg_dark_mode.png" alt="Earth" className="absolute inset-0 w-full h-full object-cover opacity-80" />
          <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-bg-l0 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-bg-l0 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-txt-secondary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-txt-secondary">AI-Powered Product Creation</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-tight">
            Idea to Product,<br />
            <span className="bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">instantly.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            className="text-sm text-txt-secondary max-w-xl mx-auto leading-relaxed">
            Describe your idea in natural language and ARVO builds full-stack apps, websites, dashboards, and tools — in seconds.
          </motion.p>

          {/* Prompt box */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="w-full max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]">
            <div className="p-5 flex flex-col gap-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`What do you want to build?\nExample: An AI landing page for my SaaS that helps creators...`}
                rows={4}
                maxLength={5000}
                className="w-full bg-transparent border-0 text-txt-primary placeholder-txt-secondary/40 focus:outline-none text-sm resize-none font-medium"
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePromptSubmit(prompt); } }}
              />
              <div className="flex items-center justify-between border-t border-white/[0.04] pt-3 gap-3">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => toast.info('Attachments are integrated with mock DB.')} className="rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 px-3 py-1.5 text-[10px] font-bold text-txt-secondary hover:text-txt-primary flex items-center gap-1.5 cursor-pointer transition-colors">
                    <Paperclip className="h-3.5 w-3.5" /> Attach
                  </button>
                  <button type="button" onClick={() => toast.info('Module imports configured.')} className="rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 px-3 py-1.5 text-[10px] font-bold text-txt-secondary hover:text-txt-primary flex items-center gap-1.5 cursor-pointer transition-colors">
                    <FolderDown className="h-3.5 w-3.5" /> Import
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-txt-secondary/60 font-mono tabular-nums">{prompt.length}/5000</span>
                  <button onClick={() => handlePromptSubmit(prompt)} disabled={!prompt.trim()} className="rounded-lg bg-white text-black hover:bg-zinc-100 px-5 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-all">
                    <Sparkles className="h-3.5 w-3.5" /> Generate <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick features */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl mx-auto border border-white/10 bg-bg-l0/80 backdrop-blur-md rounded-2xl p-5">
            {[
              { icon: Zap, title: 'Instant Generation', desc: 'From idea to working product' },
              { icon: Sparkles, title: 'AI-Powered', desc: 'Advanced AI understands you' },
              { icon: Terminal, title: 'Full-Stack Apps', desc: 'Frontend, backend & database' },
              { icon: ShieldCheck, title: 'Secure & Scalable', desc: 'Production-ready by default' },
            ].map((f, i) => (
              <div key={i} className="flex gap-3 items-start text-left">
                <div className="h-8 w-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                  <f.icon className="h-4 w-4 text-txt-secondary" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-txt-primary">{f.title}</h4>
                  <p className="text-[9px] text-txt-secondary mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Partners marquee */}
          <div className="w-full max-w-3xl mx-auto border-t border-white/[0.06] pt-6 overflow-hidden">
            <p className="text-[10px] font-bold text-txt-secondary uppercase tracking-widest mb-4">Trusted by builders at</p>
            <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
              <div className="animate-marquee flex gap-12 text-txt-secondary text-xs font-bold pr-12">
                {[...PARTNERS, ...PARTNERS].map((p, i) => (
                  <span key={i} className="hover:text-txt-primary transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer">
                    <p.icon className="h-4 w-4" />{p.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
           FEATURES
           ═══════════════════════════════════════════════════════════════════ */}
      <Section id="features" className="py-28">
        <div className="text-center mb-16">
          <SectionLabel><Zap className="h-3 w-3" /> Features</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-txt-primary tracking-tight leading-tight mt-3">
            Built for speed.<br />
            <span className="bg-gradient-to-r from-white via-white/80 to-white/50 bg-clip-text text-transparent">Designed for scale.</span>
          </h2>
          <p className="text-sm text-txt-secondary mt-4 max-w-lg mx-auto leading-relaxed">
            Everything you need to go from zero to deployed, powered by multi-agent AI that works in parallel.
          </p>
        </div>

        {/* Bento grid — 1 hero + 3 medium + 4 small */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Hero feature (spans 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-7 flex flex-col justify-between min-h-[200px] group hover:border-white/20 transition-all duration-300"
          >
            <div>
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                <Zap className="h-6 w-6 text-txt-primary" />
              </div>
              <h3 className="text-xl font-black text-txt-primary mb-2">Instant Generation</h3>
              <p className="text-sm text-txt-secondary leading-relaxed max-w-sm">
                Describe your idea and ARVO produces a working product in under 30 seconds — no templates, no filler, no waiting.
              </p>
            </div>
            <div className="flex items-center gap-6 mt-6 pt-5 border-t border-primary/10">
              {[
                { n: '< 30s', l: 'Avg. Build Time' },
                { n: '12', l: 'Parallel Agents' },
                { n: '99.9%', l: 'Uptime SLA' },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-lg font-black text-txt-primary tabular-nums">{s.n}</p>
                  <p className="text-[10px] text-txt-secondary font-medium">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right stack — 2 cards */}
          {[FEATURES_FULL[1], FEATURES_FULL[3]].map((f, i) => (
            <motion.div
              key={`right-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.45 }}
              className="rounded-2xl border border-white/[0.06] bg-bg-l1 p-5 hover:border-white/[0.12] hover:bg-bg-l2 transition-all duration-300 flex flex-col"
            >
              <div className={`h-10 w-10 rounded-xl border flex items-center justify-center mb-4 ${f.bg}`}>
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <h3 className="text-sm font-bold text-txt-primary mb-1.5">{f.title}</h3>
              <p className="text-[11px] text-txt-secondary leading-relaxed flex-1">{f.desc}</p>
            </motion.div>
          ))}

          {/* Bottom row — 4 cards */}
          {[FEATURES_FULL[2], FEATURES_FULL[4], FEATURES_FULL[5], FEATURES_FULL[6]].map((f, i) => (
            <motion.div
              key={`bot-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
              className="rounded-2xl border border-white/[0.06] bg-bg-l1 p-5 hover:border-white/[0.12] hover:bg-bg-l2 transition-all duration-300"
            >
              <div className={`h-10 w-10 rounded-xl border flex items-center justify-center mb-4 ${f.bg}`}>
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <h3 className="text-sm font-bold text-txt-primary mb-1.5">{f.title}</h3>
              <p className="text-[11px] text-txt-secondary leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* How it works — numbered steps */}
        <div className="mt-16">
          <h3 className="text-lg font-black text-txt-primary mb-8 text-center">How it works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-6 left-[16.6%] right-[16.6%] h-[1px] bg-gradient-to-r from-white/10 via-white/30 to-white/10" />
            {[
              { step: '01', title: 'Describe Your Idea', desc: 'Type a natural-language prompt describing the app, dashboard, or tool you want.', accent: 'text-txt-primary border-white/20 bg-white/5' },
              { step: '02', title: 'AI Agents Build It', desc: '12 parallel agents compile frontend, backend, database schemas, and assets concurrently.', accent: 'text-txt-primary border-white/20 bg-white/5' },
              { step: '03', title: 'Deploy & Iterate', desc: 'Preview in a live sandbox, refine with follow-up prompts, then deploy with one click.', accent: 'text-txt-primary border-white/20 bg-white/5' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center px-6 py-8"
              >
                <div className={`h-12 w-12 rounded-full border-2 flex items-center justify-center text-base font-black mb-5 relative z-10 ${s.accent}`}>
                  {s.step}
                </div>
                <h4 className="text-sm font-bold text-txt-primary mb-2">{s.title}</h4>
                <p className="text-[11px] text-txt-secondary leading-relaxed max-w-[240px]">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
           EXAMPLES
           ═══════════════════════════════════════════════════════════════════ */}
      <Section id="examples" className="py-28">
        <div className="text-center mb-16">
          <SectionLabel><Layout className="h-3 w-3" /> Examples</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-txt-primary tracking-tight leading-tight mt-3">
            Start with a blueprint.
          </h2>
          <p className="text-sm text-txt-secondary mt-4 max-w-lg mx-auto leading-relaxed">
            Click any template below to instantly spawn it in an ARVO sandbox — fully interactive and editable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            ...EXAMPLES,
            { title: 'Admin Panel', desc: 'Full CRUD admin with data tables and role-based auth', prompt: 'Build an admin panel with data tables, user management, and role-based auth', icon: Database, tag: 'Dashboard' },
            { title: 'Blog Platform', desc: 'Content-rich blog with markdown editor and comments', prompt: 'Build a blog platform with markdown editor, categories, and comments', icon: BookOpen, tag: 'Content' },
          ].map((item, i) => {
            // Assign each card a subtle accent colour based on index
            const accents = [
              { iconBg: 'bg-primary/10 border-primary/20', iconColor: 'text-primary', tagBg: 'bg-primary/10 text-primary border-primary/20' },
              { iconBg: 'bg-accent/10 border-accent/20', iconColor: 'text-accent', tagBg: 'bg-accent/10 text-accent border-accent/20' },
              { iconBg: 'bg-info/10 border-info/20', iconColor: 'text-info', tagBg: 'bg-info/10 text-info border-info/20' },
              { iconBg: 'bg-warning/10 border-warning/20', iconColor: 'text-warning', tagBg: 'bg-warning/10 text-warning border-warning/20' },
              { iconBg: 'bg-success/10 border-success/20', iconColor: 'text-success', tagBg: 'bg-success/10 text-success border-success/20' },
              { iconBg: 'bg-error/10 border-error/20', iconColor: 'text-error', tagBg: 'bg-error/10 text-error border-error/20' },
              { iconBg: 'bg-primary/10 border-primary/20', iconColor: 'text-primary', tagBg: 'bg-primary/10 text-primary border-primary/20' },
            ];
            const a = accents[i % accents.length];

            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                onClick={() => { setPrompt(item.prompt); handlePromptSubmit(item.prompt); }}
                className="group relative rounded-2xl border border-white/[0.06] bg-bg-l1 p-6 text-left hover:border-white/[0.15] hover:bg-bg-l2 transition-all duration-300 flex flex-col gap-4 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className={`h-11 w-11 rounded-xl border flex items-center justify-center ${a.iconBg}`}>
                    <item.icon className={`h-5 w-5 ${a.iconColor}`} />
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider border rounded-full px-2.5 py-0.5 ${a.tagBg}`}>{item.tag}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-txt-primary mb-1.5">{item.title}</h4>
                  <p className="text-[11px] text-txt-secondary leading-relaxed">{item.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-txt-secondary group-hover:text-primary transition-colors pt-3 border-t border-white/[0.04]">
                  <Play className="h-3 w-3" />
                  <span>Launch sandbox</span>
                  <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 rounded-2xl border border-white/[0.06] bg-bg-l1 p-6 flex flex-col md:flex-row items-center gap-4 justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-bold text-txt-primary">Have something else in mind?</p>
              <p className="text-[11px] text-txt-secondary">Type any idea into the prompt box and ARVO will build it.</p>
            </div>
          </div>
          <button onClick={() => scrollTo('hero')} className="rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] px-5 py-2.5 text-xs font-bold text-txt-primary cursor-pointer transition-colors flex items-center gap-2 shrink-0">
            <ArrowRight className="h-3.5 w-3.5 rotate-[-90deg]" /> Back to Prompt
          </button>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
           PRICING
           ═══════════════════════════════════════════════════════════════════ */}
      <Section id="pricing" className="py-28">
        <div className="text-center mb-16">
          <SectionLabel><Star className="h-3 w-3" /> Pricing</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-txt-primary tracking-tight leading-tight mt-3">
            Simple, transparent pricing.
          </h2>
          <p className="text-sm text-txt-secondary mt-4 max-w-md mx-auto leading-relaxed">
            Start free, upgrade when you're ready. No hidden fees, cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-xs font-bold transition-colors ${!annualBilling ? 'text-txt-primary' : 'text-txt-secondary'}`}>Monthly</span>
            <button onClick={() => setAnnualBilling(a => !a)} className="relative h-7 w-12 rounded-full bg-bg-l2 border border-white/10 cursor-pointer transition-colors focus:outline-none">
              <span className={`absolute top-1 h-5 w-5 rounded-full shadow-md transition-all duration-200 ${annualBilling ? 'left-[26px] bg-primary' : 'left-1 bg-txt-secondary'}`} />
            </button>
            <span className={`text-xs font-bold transition-colors ${annualBilling ? 'text-txt-primary' : 'text-txt-secondary'}`}>Annual</span>
            {annualBilling && (
              <span className="text-[10px] font-bold text-success border border-success/30 bg-success/10 rounded-full px-2.5 py-0.5 animate-pulse">Save ~20%</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch max-w-4xl mx-auto">
          {PRICING_PLANS.map((plan, i) => {
            const planAccent = i === 0 ? 'border-white/[0.06] bg-bg-l1'
              : i === 1 ? 'border-primary/30 bg-gradient-to-b from-primary/[0.06] to-transparent shadow-[0_0_60px_rgba(0,194,255,0.06)]'
              : 'border-white/[0.06] bg-bg-l1';

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className={`relative rounded-2xl border p-7 flex flex-col gap-6 ${planAccent}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-black text-[10px] font-bold rounded-full px-4 py-1 uppercase tracking-wider shadow-lg shadow-primary/25">
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-txt-secondary mb-2">{plan.name}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-txt-primary">{annualBilling ? plan.price.annual : plan.price.monthly}</span>
                    <span className="text-sm text-txt-secondary font-medium">/mo</span>
                  </div>
                  <p className="text-[12px] text-txt-secondary mt-2">{plan.desc}</p>
                </div>

                <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <ul className="space-y-3 flex-1">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-[12px] text-txt-secondary">
                      <div className="h-4 w-4 rounded-full bg-success/15 border border-success/25 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-2.5 w-2.5 text-success" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/auth')}
                  className={`w-full rounded-xl py-3 text-xs font-bold transition-all cursor-pointer ${plan.highlight
                    ? 'bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20'
                    : 'bg-white/[0.05] border border-white/10 text-txt-primary hover:bg-white/[0.1]'}`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-lg font-black text-txt-primary mb-6 text-center">Frequently asked questions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { q: 'Can I change plans anytime?', a: 'Yes, upgrade or downgrade at any time. Changes take effect at the next billing cycle.' },
              { q: 'What counts as a "credit"?', a: 'One credit = one AI generation task. Editing prompts and re-running does not consume additional credits.' },
              { q: 'Is there a student discount?', a: 'Yes — email us with a .edu address for 50% off any paid plan.' },
              { q: 'Do you offer a free trial?', a: 'The Free plan never expires. Pro and Team plans have a 14-day trial with no card required.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-white/[0.06] bg-bg-l1 p-5"
              >
                <p className="text-sm font-bold text-txt-primary mb-2">{item.q}</p>
                <p className="text-[12px] text-txt-secondary leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
           DOCS
           ═══════════════════════════════════════════════════════════════════ */}
      <Section id="docs" className="py-28">
        <div className="text-center mb-16">
          <SectionLabel><BookOpen className="h-3 w-3" /> Documentation</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-txt-primary tracking-tight leading-tight mt-3">
            Developer Documentation.
          </h2>
          <p className="text-sm text-txt-secondary mt-4 max-w-lg mx-auto leading-relaxed">
            Everything you need to integrate ARVO into your workflow. Pick a topic to explore.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 max-w-5xl mx-auto">
          {/* Sidebar nav */}
          <div className="lg:w-56 shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-txt-secondary mb-3 px-1">Topics</p>
            <div className="space-y-1">
              {DOCS_SECTIONS.map(s => {
                const isActive = activeDoc === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveDoc(s.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[12px] font-semibold transition-all cursor-pointer ${isActive
                      ? 'bg-primary/10 border border-primary/20 text-primary'
                      : 'text-txt-secondary hover:text-txt-primary hover:bg-white/[0.03] border border-transparent'}`}
                  >
                    <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-primary/15' : 'bg-white/[0.04]'}`}>
                      <s.icon className={`h-3.5 w-3.5 ${isActive ? 'text-primary' : ''}`} />
                    </div>
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDoc}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="flex-1 rounded-2xl border border-white/[0.06] bg-bg-l1 overflow-hidden"
            >
              {/* Description */}
              <div className="p-6 border-b border-white/[0.05]">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    {DOCS_SECTIONS.find(s => s.id === activeDoc) && (
                      (() => { const S = DOCS_SECTIONS.find(s => s.id === activeDoc)!; return <S.icon className="h-4 w-4 text-primary" />; })()
                    )}
                  </div>
                  <h3 className="text-base font-bold text-txt-primary">{DOCS_CONTENT[activeDoc].title}</h3>
                </div>
                <p className="text-[12px] text-txt-secondary leading-relaxed">{DOCS_CONTENT[activeDoc].body}</p>
              </div>

              {/* Code block with line numbers */}
              <div className="bg-bg-l0 p-0">
                {/* Code header bar */}
                <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.04]">
                  <span className="h-2.5 w-2.5 rounded-full bg-error/50" />
                  <span className="h-2.5 w-2.5 rounded-full bg-warning/50" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success/50" />
                  <span className="ml-3 text-[10px] font-mono text-txt-secondary">index.ts</span>
                  <div className="flex-1" />
                  <button
                    onClick={() => { navigator.clipboard.writeText(DOCS_CONTENT[activeDoc].code); toast.success('Code copied!'); }}
                    className="text-[10px] text-txt-secondary hover:text-txt-primary cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <Code className="h-3 w-3" /> Copy
                  </button>
                </div>
                {/* Code body */}
                <div className="overflow-x-auto py-4">
                  {DOCS_CONTENT[activeDoc].code.split('\n').map((line, i) => (
                    <div key={i} className="flex hover:bg-white/[0.02] transition-colors px-5">
                      <span className="select-none w-8 shrink-0 text-right pr-4 text-txt-secondary/30 text-[11px] leading-[22px] font-mono tabular-nums">
                        {i + 1}
                      </span>
                      <span className="text-txt-secondary text-[11px] leading-[22px] font-mono whitespace-pre">
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
           ENTERPRISE
           ═══════════════════════════════════════════════════════════════════ */}
      <Section id="enterprise" className="py-28">
        <div className="text-center mb-16">
          <SectionLabel><Building className="h-3 w-3" /> Enterprise</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-black text-txt-primary tracking-tight leading-tight mt-3">
            Built for teams that<br />
            <span className="bg-gradient-to-r from-accent via-accent/70 to-primary bg-clip-text text-transparent">ship at scale.</span>
          </h2>
          <p className="text-sm text-txt-secondary mt-4 max-w-lg mx-auto leading-relaxed">
            Custom SLAs, dedicated infrastructure, SSO, audit logs, and a dedicated customer success team.
          </p>
        </div>

        {/* Stats counter row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {[
            { value: '500+', label: 'Enterprise clients', accent: 'text-primary' },
            { value: '99.99%', label: 'Uptime guaranteed', accent: 'text-success' },
            { value: '4 hr', label: 'Max response SLA', accent: 'text-warning' },
            { value: 'SOC 2', label: 'Type II certified', accent: 'text-accent' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-white/[0.06] bg-bg-l1 p-6 text-center"
            >
              <p className={`text-2xl md:text-3xl font-black tabular-nums mb-1 ${s.accent}`}>{s.value}</p>
              <p className="text-[11px] text-txt-secondary font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {[
            { icon: ShieldCheck, title: 'SOC 2 Type II', desc: 'Enterprise-grade security and compliance across every layer of infrastructure.', accent: 'text-success', bg: 'bg-success/10 border-success/20' },
            { icon: Lock, title: 'SSO & SAML', desc: 'Integrate with Okta, Azure AD, or any SAML 2.0-compatible identity provider.', accent: 'text-accent', bg: 'bg-accent/10 border-accent/20' },
            { icon: Cpu, title: 'Dedicated Compute', desc: 'Isolated, dedicated build runners with guaranteed performance and zero noisy neighbours.', accent: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
            { icon: GitBranch, title: 'Git Integration', desc: 'Push generated code directly to private GitHub, GitLab, or Bitbucket organisations.', accent: 'text-info', bg: 'bg-info/10 border-info/20' },
            { icon: Server, title: 'On-Premise', desc: 'Run ARVO within your private cloud or on-prem Kubernetes cluster for total data control.', accent: 'text-warning', bg: 'bg-warning/10 border-warning/20' },
            { icon: Layers2, title: 'Priority SLA', desc: '24/7 dedicated support with guaranteed 4-hour response time for critical issues.', accent: 'text-error', bg: 'bg-error/10 border-error/20' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="rounded-2xl border border-white/[0.06] bg-bg-l1 p-6 hover:border-white/[0.12] transition-all duration-300 group"
            >
              <div className={`h-10 w-10 rounded-xl border flex items-center justify-center mb-4 ${f.bg}`}>
                <f.icon className={`h-5 w-5 ${f.accent}`} />
              </div>
              <h4 className="text-sm font-bold text-txt-primary mb-1.5">{f.title}</h4>
              <p className="text-[11px] text-txt-secondary leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.06] to-primary/[0.04] p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 justify-between"
        >
          <div>
            <h3 className="text-xl font-black text-txt-primary mb-2">Ready to bring ARVO to your team?</h3>
            <p className="text-sm text-txt-secondary max-w-md leading-relaxed">Talk to our sales team and get a custom demo tailored to your stack, security requirements, and workflow.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => toast.info('Sales team contact form coming soon.')} className="rounded-xl bg-white text-black hover:bg-zinc-100 px-7 py-3 text-xs font-bold cursor-pointer flex items-center gap-2 shadow-lg transition-all">
              <Mail className="h-3.5 w-3.5" /> Contact Sales
            </button>
            <button onClick={() => scrollTo('pricing')} className="rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-txt-primary px-7 py-3 text-xs font-bold cursor-pointer transition-colors">
              View Pricing
            </button>
          </div>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════
           FOOTER
           ═══════════════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 bg-bg-l0 pt-12 overflow-hidden">
        {/* Moon Background */}
        <div className="absolute top-0 left-0 right-0 w-full h-[700px] opacity-50 pointer-events-none mix-blend-screen flex justify-center items-start overflow-hidden">
          <img src="/moon.jpg" alt="Moon" className="w-full max-w-[1400px] h-full object-cover object-top" style={{ maskImage: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)' }} />
        </div>

        {/* Footer columns */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <img src="/arvologo.svg" alt="ARVO" className="h-10 w-auto invert mb-4 opacity-90 drop-shadow-lg" />
              <p className="text-[11px] text-white font-medium leading-relaxed max-w-[200px] drop-shadow-md">AI-native product operating system. Build faster, ship with confidence.</p>
            </div>

            {[
              { label: 'Product', links: ['Features', 'Examples', 'Pricing', 'Changelog', 'Roadmap'] },
              { label: 'Developers', links: ['Documentation', 'API Reference', 'SDK', 'CLI', 'Status'] },
              { label: 'Company', links: ['About', 'Blog', 'Careers', 'Press Kit', 'Contact'] },
              { label: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Security', 'GDPR', 'Cookie Policy'] },
            ].map(col => (
              <div key={col.label}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-4 drop-shadow-md">{col.label}</p>
                <div className="space-y-3">
                  {col.links.map(l => (
                    <p key={l} className="text-[11px] font-medium text-white/90 hover:text-white transition-colors cursor-pointer drop-shadow-md">{l}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 border-t border-white/[0.04]">
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-txt-secondary">
            <span>© 2025 ARVO Technologies, Inc. All rights reserved.</span>
            <span>Made with ❤️ for builders everywhere</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingView;