import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '@/services/auth.service';
import { AskBaseLogo } from '@/components/ui/AskBaseLogo';
import { useNavigate } from '@tanstack/react-router';


interface AuthModalProps {
  type: 'login' | 'signup';
  onClose: () => void;
  onSwitch?: (type: 'login' | 'signup') => void;
}

export default function AuthModal({ type, onClose, onSwitch }: AuthModalProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // DEVELOPMENT-ONLY "ONE-CLICK DEMO SIGN UP" flow
    // When the modal opens, we immediately trigger the demo session
    const triggerDemoAuth = async () => {
      setIsLoading(true);
      await authService.loginAsDemoUser();
      navigate({ to: '/app' });
    };

    triggerDemoAuth();
  }, [navigate]);

  const handleAuth = () => {
    // Redirect logic handled in useEffect for the one-click requirement
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/5 backdrop-blur-[2px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white/70 border border-white/40 shadow-2xl rounded-[40px] overflow-hidden backdrop-blur-3xl flex min-h-[600px]"
      >
        {/* Left Side: Form */}
        <div className="flex-1 p-16 flex flex-col justify-center">
          <div className="text-left space-y-8 mb-12 relative">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-white/40">
              <AskBaseLogo size={56} className="shadow-none border-none rounded-none" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-black uppercase tracking-tight text-[#18181B]">
                {type === 'login' ? 'Welcome back' : 'Create account'}
              </h1>
              <p className="text-sm text-[#71717A] font-medium max-w-sm">
                {type === 'login'
                  ? 'Enter your credentials to access the AskBase intelligence pipeline.'
                  : 'Start your journey with enterprise-grade data intelligence.'}
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
            <div className="grid gap-6">
              {type === 'signup' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#A1A1AA]">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-white/50 border border-white/60 focus:border-[#CB2958]/40 transition-all outline-none text-sm font-medium rounded-2xl shadow-sm backdrop-blur-md"
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#A1A1AA]">Email Address</label>
                <input
                  type="email"
                  className="w-full px-6 py-4 bg-white/50 border border-white/60 focus:border-[#CB2958]/40 transition-all outline-none text-sm font-medium rounded-2xl shadow-sm backdrop-blur-md"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#A1A1AA]">Password</label>
                  {type === 'login' && (
                    <a href="#" className="text-[9px] font-black uppercase tracking-widest text-[#CB2958] hover:underline">Forgot?</a>
                  )}
                </div>
                <input
                  type="password"
                  className="w-full px-6 py-4 bg-white/50 border border-white/60 focus:border-[#CB2958]/40 transition-all outline-none text-sm font-medium rounded-2xl shadow-sm backdrop-blur-md"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              disabled={isLoading}
              type="submit"
              className="w-full bg-[#CB2958] hover:bg-[#b0234c] text-white rounded-2xl h-16 font-black transition-all uppercase tracking-[0.2em] mt-4 shadow-xl shadow-[#CB2958]/20 text-[12px]"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (type === 'login' ? 'Sign In' : 'Create Account')}
            </Button>
          </form>


          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#E4E4E7]/50"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-transparent px-4 text-[#A1A1AA]">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="rounded-2xl h-14 border-white/60 bg-white/40 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/60 transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" className="rounded-2xl h-14 border-white/60 bg-white/40 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/60 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.111.825-.261.825-.579 0-.285-.012-1.23-.018-2.223-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.218.694.825.576C20.565 21.795 24 17.308 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </Button>
          </div>

          <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1AA] mt-10">
            {type === 'login' ? "Need an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => onSwitch?.(type === 'login' ? 'signup' : 'login')}
              className="text-[#CB2958] hover:underline cursor-pointer ml-1"
            >
              {type === 'login' ? 'Sign up now' : 'Log in here'}
            </button>
          </p>
        </div>

        {/* Right Side: Features (Visible on large screens) */}
        <div className="hidden lg:flex w-[40%] bg-[#F4F4F5]/40 p-16 flex-col justify-center border-l border-white/20 relative backdrop-blur-md">
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-3 text-[#A1A1AA] hover:text-[#CB2958] transition-all bg-white/20 hover:bg-white/40 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-12">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#CB2958]">Platform Features</span>
              <h3 className="text-3xl font-black leading-[1.1] uppercase text-[#18181B]">Everything you need to query.</h3>
            </div>

            <div className="space-y-8">
              {[
                { title: 'AI Reasoning', desc: 'Complex natural language to SQL translation in milliseconds.' },
                { title: 'Data Safety', desc: 'Enterprise-grade read-only validation by default.' },
                { title: 'Visualization', desc: 'Instant, dynamic charts generated directly from your results.' }
              ].map((f, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#CB2958] mt-2.5 shrink-0 group-hover:scale-150 transition-transform" />
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-black uppercase tracking-widest text-[#18181B]">{f.title}</div>
                    <div className="text-xs text-[#71717A] font-medium leading-relaxed">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-white/30">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#A1A1AA]">Trusted by modern data teams</span>
              <div className="flex gap-5 mt-6 opacity-40 grayscale">
                <div className="h-6 w-16 bg-[#18181B]/10 rounded-full" />
                <div className="h-6 w-16 bg-[#18181B]/10 rounded-full" />
                <div className="h-6 w-16 bg-[#18181B]/10 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
