import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Chrome, 
  Lock, 
  Mail, 
  User, 
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { mockDb } from '@/utils/mockDb';
import { toast } from 'sonner';

export const AuthView: React.FC = () => {
  const [view, setView] = useState<'login' | 'register'>('login');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const proj = mockDb.getOrCreateDefaultProject();
      navigate(`/workspace/${proj.id}`);
    }
  }, [isAuthenticated, navigate]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (view === 'register') {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        toast.error('You must agree to the Terms & Conditions.');
        return;
      }
    }

    triggerAuthFlow();
  };

  const triggerAuthFlow = () => {
    setSubmitting(true);
    setTimeout(() => {
      // Login store state commit
      login(
        { 
          id: '1', 
          name: name || (email ? email.split('@')[0] : 'Aryan'), 
          email: email || 'developer@arvo.ai' 
        },
        'mock-jwt-token-xyz',
        ''
      );
      
      const savedPrompt = mockDb.getCapturedPrompt() || 'Interactive AI Support Bot';
      const newProj = mockDb.createProjectFromPrompt(savedPrompt);
      mockDb.clearCapturedPrompt();
      
      setSubmitting(false);
      toast.success(view === 'login' ? 'Successfully authenticated!' : 'Account registered successfully!');
      
      // Navigate to workspace
      navigate(`/workspace/${newProj.id}`);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden font-sans text-white px-4">
      
      {/* Giant Static Photorealistic Earth Horizon Backdrop (Spans screen edge-to-edge behind the auth card) */}
      <div className="absolute top-[260px] md:top-[200px] left-0 right-0 w-full aspect-[16/8] pointer-events-none select-none z-0 overflow-hidden">
        <img 
          src="/earth_bg_dark_mode.png" 
          alt="Earth Space Background" 
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none opacity-80" 
        />
        {/* Edge vignette blenders to merge the backdrop seamlessly */}
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none bg-gradient-to-t from-black to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-b from-black to-transparent" />
      </div>

      {/* Brand logo header */}
      <div className="relative z-10 mb-8 flex flex-col items-center select-none cursor-pointer" onClick={() => navigate('/')}>
        <img 
          src="/arvologo.svg" 
          alt="ARVO Logo" 
          className="h-10 w-auto object-contain invert" 
        />
      </div>

      {/* Auth Card (Glassmorphism + Professional Borders) */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        
        {/* View Switcher Tabs */}
        <div className="flex border-b border-white/5 pb-4 mb-6 justify-center gap-6 text-xs select-none">
          <button
            onClick={() => setView('login')}
            className={`pb-1 font-bold tracking-wider uppercase transition-colors cursor-pointer ${
              view === 'login' 
                ? 'text-white border-b-2 border-white' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setView('register')}
            className={`pb-1 font-bold tracking-wider uppercase transition-colors cursor-pointer ${
              view === 'register' 
                ? 'text-white border-b-2 border-white' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4 text-left text-xs">
          
          {view === 'register' && (
            <div className="space-y-1">
              <label className="text-zinc-400 font-semibold">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Aryan Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                  className="w-full bg-black border border-white/10 rounded-lg py-2 pl-9 pr-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-zinc-400 font-semibold">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="developer@arvo.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="w-full bg-black border border-white/10 rounded-lg py-2 pl-9 pr-3 text-white placeholder-zinc-700 focus:outline-none focus:border-white"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400 font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                className="w-full bg-black border border-white/10 rounded-lg py-2 pl-9 pr-10 text-white focus:outline-none focus:border-white"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {view === 'register' && (
            <div className="space-y-1">
              <label className="text-zinc-400 font-semibold">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={submitting}
                  className="w-full bg-black border border-white/10 rounded-lg py-2 pl-9 pr-3 text-white focus:outline-none focus:border-white"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
              </div>
            </div>
          )}

          {view === 'register' && (
            <label className="flex items-center gap-2 py-1 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                disabled={submitting}
                className="rounded border-white/10 bg-black text-white focus:ring-0"
              />
              <span className="text-[10px] text-zinc-400">
                I agree to the <span className="text-white hover:underline">Terms & Conditions</span>
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-white hover:bg-zinc-100 text-black border border-transparent rounded-lg py-2.5 text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-all mt-6 shadow-sm"
          >
            {submitting ? (
              <span className="h-4 w-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
            ) : (
              <>
                <span>{view === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="relative flex py-2 items-center select-none my-3">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-3 text-[9px] text-zinc-600 uppercase tracking-widest font-bold">Or</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        <button
          onClick={triggerAuthFlow}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-black hover:bg-zinc-950 text-white border border-white/10 rounded-lg py-2 text-xs font-semibold cursor-pointer transition-colors"
        >
          <Chrome className="h-4 w-4 text-white" />
          <span>Continue with Google</span>
        </button>

      </div>
    </div>
  );
};
export default AuthView;
