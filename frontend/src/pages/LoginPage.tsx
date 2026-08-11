import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 bg-white p-8 border border-[#E4E4E7] shadow-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#CB2958] rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">?</span>
            </div>
            <span className="font-black tracking-tighter text-2xl uppercase">AskBase</span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Welcome back</h1>
          <p className="text-sm text-[#71717A]">Access your enterprise intelligence.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#71717A]">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-[#F4F4F5] border-2 border-transparent focus:border-[#CB2958]/20 transition-all outline-none text-sm font-medium"
                placeholder="name@company.com"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#71717A]">Password</label>
                <a href="#" className="text-[9px] font-bold uppercase tracking-widest text-[#CB2958]">Forgot?</a>
              </div>
              <input
                type="password"
                className="w-full px-4 py-3 bg-[#F4F4F5] border-2 border-transparent focus:border-[#CB2958]/20 transition-all outline-none text-sm font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Link to="/app">
            <Button className="w-full bg-[#18181B] hover:bg-[#CB2958] text-white rounded-none h-12 font-bold transition-all uppercase tracking-widest mt-4">
              Continue
            </Button>
          </Link>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#E4E4E7]"></span></div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold"><span className="bg-white px-2 text-[#A1A1AA]">Or continue with</span></div>
        </div>

        <Button variant="outline" className="w-full rounded-none h-12 border-[#E4E4E7] font-medium text-sm flex items-center justify-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </Button>

        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-[#71717A]">
          Don't have an account? <Link to="/landing" className="text-[#CB2958] hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
