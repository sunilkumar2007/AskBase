import React from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { Scene } from '@/components/landing/3d/Scene';
import { FloatingUI } from '@/components/landing/ui/FloatingUI';
import { Link } from '@tanstack/react-router';
import { AskBaseLogo } from '@/components/ui/AskBaseLogo';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

import { useState } from 'react';
import AuthModal from '@/components/auth/AuthModal';
import { AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  useSmoothScroll();
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);

  return (
    <div className="relative min-h-[1000vh] bg-white text-[#18181B] selection:bg-[#CB2958]/10 selection:text-[#CB2958] font-sans">
      {/* 3D Environment */}
      <Scene />

      {/* Persistent Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 w-full z-50 h-20 px-8 flex items-center justify-between pointer-events-none"
      >
        <div className="flex items-center gap-12 pointer-events-auto">
          <Link to="/" className="flex items-center gap-3">
            <AskBaseLogo size={40} className="rounded-full shadow-2xl border-white/20" />
            <span className="font-black tracking-tighter text-2xl uppercase">AskBase</span>
          </Link>
        </div>

        <div className="flex items-center gap-6 pointer-events-auto">
          <button
            onClick={() => setAuthModal('login')}
            className="rounded-full border border-[#E4E4E7] bg-white/60 backdrop-blur-md px-8 h-12 text-[11px] font-black uppercase tracking-[0.2em] text-[#71717A] hover:text-[#18181B] transition-all hover:scale-105 cursor-pointer shadow-sm"
          >
            Log in
          </button>
          <button
            onClick={() => setAuthModal('signup')}
            className="bg-[#18181B] hover:bg-black text-white rounded-full px-10 h-12 text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-xl cursor-pointer"
          >
            Sign up
          </button>
        </div>

      </motion.nav>

      {/* Auth Modal */}
      <AnimatePresence>
        {authModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            <AuthModal
              type={authModal}
              onClose={() => setAuthModal(null)}
              onSwitch={(type) => setAuthModal(type)}
            />

          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll-driven Content Layer */}
      <FloatingUI onStartFree={() => setAuthModal('signup')} />


      {/* Scroll Indicators / Stages */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-4">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[1px] h-12 bg-gradient-to-b from-[#CB2958] to-transparent"
        />
        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[#71717A] opacity-40">
          Scroll to explore the intelligence pipeline
        </span>
      </div>

      {/* Background Subtle Grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}
