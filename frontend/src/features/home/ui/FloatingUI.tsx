import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLandingStore } from '@/stores/useLandingStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV = [
  { label: 'ASK', stages: ['hero', 'ask'] },
  { label: 'UNDERSTAND', stages: ['understanding'] },
  { label: 'FEATURES', stages: ['features'] },
  { label: 'ABOUT', stages: ['about'] },
];

const FEATURES = [
  { title: 'Natural language', desc: 'Ask in plain words. No SQL knowledge required.' },
  { title: 'Schema Intelligence', desc: 'Automatically maps tables and relationships.' },
  { title: 'Visual Insights', desc: 'Instant charts and diagrams from your data.' },
  { title: 'Enterprise Security', desc: 'Read-only access with transparent query logs.' },
];

export function FloatingUI({ onStartFree }: { onStartFree?: () => void }) {
  const activeStage = useLandingStore((state) => state.activeStage);
  const scrollProgress = useLandingStore((state) => state.scrollProgress);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex flex-col items-center justify-center p-6 sm:p-8">
      {/* Scroll Progress Sidebar */}
      <div className="fixed right-6 lg:right-12 top-1/2 -translate-y-1/2 flex items-center gap-6 lg:gap-8 pointer-events-none">
        <div className="flex flex-col gap-8 items-end">
          {NAV.map(({ label, stages }) => {
            const isActive = stages.includes(activeStage);
            return (
              <div key={label} className="flex items-center justify-end gap-4 group pointer-events-auto cursor-help">
                <span className={cn(
                  "text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-700",
                  isActive ? "text-[#18181B] -translate-x-2" : "text-[#A1A1AA] opacity-20"
                )}>
                  {label}
                </span>
                <div className="relative flex items-center justify-center">
                  <div className={cn(
                    "w-2 h-2 rounded-full transition-all duration-700",
                    isActive ? "bg-[#CB2958] scale-125" : "bg-[#E4E4E7]"
                  )} />
                  {isActive && (
                    <motion.div
                      layoutId="active-dot-glow"
                      className="absolute inset-0 bg-[#CB2958]/20 blur-md rounded-full"
                      initial={false}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="relative h-96 w-[1px] bg-[#F4F4F5] rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-[#CB2958]"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeStage === 'hero' && (
          <motion.div
            key="hero-text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="text-center max-w-4xl"
          >
            <h1 className="text-6xl sm:text-8xl lg:text-[120px] font-black tracking-tighter leading-[0.85] uppercase mb-8">
              Ask your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#111111] to-[#CB2958]">Database.</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#71717A] font-medium mb-12">
              Enterprise-grade data intelligence.<br />
              No SQL required. Just natural language.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 pointer-events-auto">
              <button
                onClick={onStartFree}
                className="bg-[#18181B] text-white rounded-full px-10 py-5 text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all hover:scale-105"

              >
                Start for free ↗
              </button>
              <button
                onClick={() => {
                  const el = document.documentElement;
                  const target = el.scrollHeight * 0.15;
                  window.scrollTo({ top: target, behavior: 'smooth' });
                }}
                className="border border-[#E4E4E7] rounded-full px-10 py-5 text-[11px] font-black uppercase tracking-widest hover:bg-[#FAFAFA] transition-colors pointer-events-auto cursor-pointer"
              >
                Explore demo
              </button>
            </div>
          </motion.div>
        )}

        {activeStage === 'ask' && (
          <motion.div
            key="ask-card"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -40 }}
            className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[40px] p-10 shadow-2xl max-w-md"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#CB2958]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#71717A]">Input</span>
            </div>
            <p className="text-3xl font-medium italic text-[#18181B] leading-tight">
              "Show me the top 5 products by revenue this quarter."
            </p>
          </motion.div>
        )}

        {activeStage === 'understanding' && (
          <motion.div
            key="understanding-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="w-full max-w-4xl aspect-[16/9] sm:aspect-video bg-white/70 backdrop-blur-xl border border-white/60 rounded-[40px] p-8 sm:p-12 shadow-2xl flex flex-col justify-center relative overflow-hidden"
          >
            {/* Background subtle elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#CB2958]/5 blur-[80px] rounded-full" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#18181B]/5 blur-[80px] rounded-full" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 rounded-full bg-[#CB2958]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#71717A]">Understanding your schema</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                {['CUSTOMERS', 'ORDERS', 'ORDER_ITEMS', 'PRODUCTS'].map((t, i) => (
                  <div
                    key={t}
                    className={cn(
                      "rounded-2xl border px-4 py-6 text-[10px] font-black uppercase tracking-widest text-center transition-all duration-300",
                      i === 3
                        ? "border-[#CB2958]/40 text-[#CB2958] bg-[#CB2958]/5 shadow-[0_8px_30px_rgb(203,41,88,0.1)] scale-105"
                        : "border-[#E4E4E7] text-[#71717A] bg-white/60 hover:border-[#A1A1AA]"
                    )}
                  >
                    {t}
                  </div>
                ))}
              </div>

              <p className="text-xl sm:text-2xl text-[#3F3F46] font-medium leading-relaxed max-w-3xl">
                AskBase maps tables, keys and relationships first — so it knows that revenue lives in
                <span className="text-[#18181B] font-black"> order_items</span>, joined to
                <span className="text-[#18181B] font-black"> products</span>, before it answers a single question.
              </p>
            </div>
          </motion.div>
        )}

        {activeStage === 'features' && (
          <motion.div
            key="features-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="w-full max-w-3xl bg-white/60 backdrop-blur-2xl border border-white/60 rounded-[40px] p-8 sm:p-12 shadow-2xl"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#CB2958] mb-8">Features</div>
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
              {FEATURES.map((f) => (
                <div key={f.title} className="space-y-2">
                  <h3 className="text-lg font-black uppercase tracking-tight text-[#18181B]">{f.title}</h3>
                  <p className="text-sm text-[#71717A] font-medium leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeStage === 'about' && (
          <motion.div
            key="about-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="w-full max-w-2xl bg-white/60 backdrop-blur-2xl border border-white/60 rounded-[40px] p-8 sm:p-12 shadow-2xl"
          >
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#CB2958] mb-6">About</div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-[0.95] mb-6">
              Data should answer,<br />not wait in a queue.
            </h2>
            <p className="text-base sm:text-lg text-[#3F3F46] font-medium leading-relaxed mb-8">
              AskBase is an intelligent interface for your data. We bridge the gap between complex database schemas and natural language queries, empowering teams to get answers instantly without technical bottlenecks. Our goal is to make data intelligence accessible, safe, and conversational for everyone in the organization.
            </p>
            <div className="flex flex-wrap items-center gap-6 pointer-events-auto">
              <button
                onClick={onStartFree}
                className="bg-[#18181B] text-white rounded-full px-10 py-5 text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all hover:scale-105"
              >
                Start for free ↗
              </button>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#A1A1AA]">
                Read-only • Schema aware • Query transparent
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
