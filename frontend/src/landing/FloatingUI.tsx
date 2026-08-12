import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV = [
 { label: 'ASK', id: 'hero' },
 { label: 'UNDERSTAND', id: 'understanding' },
 { label: 'FEATURES', id: 'features' },
 { label: 'ABOUT', id: 'about' },
];

const FEATURES = [
 { title: 'Natural language', desc: 'Ask in plain words. No SQL knowledge required.' },
 { title: 'Schema Intelligence', desc: 'Automatically maps tables and relationships.' },
 { title: 'Visual Insights', desc: 'Instant charts and diagrams from your data.' },
 { title: 'Enterprise Security', desc: 'Read-only access with transparent query logs.' },
];

export interface FloatingUIProps {
 activeStage?: 'hero' | 'understanding' | 'features' | 'about';
 onStageSelect?: (stage: 'hero' | 'understanding' | 'features' | 'about') => void;
 onStartFree?: () => void;
 onExploreDemo?: () => void;
}

export function FloatingUI({ activeStage = 'hero', onStageSelect, onStartFree, onExploreDemo }: FloatingUIProps) {
  return (
    <div className="relative w-full font-sans pointer-events-none z-10">
      {/* Scroll Progress Sidebar */}
      <div className="fixed right-6 lg:right-12 top-1/2 -translate-y-1/2 flex items-center gap-6 lg:gap-8 pointer-events-none z-50">
        <div className="flex flex-col gap-8 items-end">
          {NAV.map(({ label, id }) => {
            const isActive = activeStage === id;
            return (
              <button
                key={label}
                type="button"
                onClick={() => onStageSelect ? onStageSelect(id as any) : null}
                className="flex items-center justify-end gap-4 group pointer-events-auto cursor-pointer border-none bg-transparent"
              >
                <span className={`text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-300 ${
                  isActive ? "text-[#18181B] -translate-x-2" : "text-[#A1A1AA] opacity-40 hover:opacity-100"
                }`}>
                  {label}
                </span>
                <div className="relative flex items-center justify-center">
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isActive ? "bg-[#CB2958] scale-125" : "bg-[#E4E4E7]"
                  }`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slide 1: Hero */}
      <section id="hero-section" className="min-h-screen flex flex-col items-center justify-start pt-16 sm:pt-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl pointer-events-auto z-20"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter uppercase mb-6">
            <span className="text-[#18181B]">Ask your </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CB2958] via-[#E63967] to-[#CB2958]">Database.</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[#71717A] font-medium mb-8">
            Enterprise-grade data intelligence. No SQL required. Just natural language.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              type="button"
              onClick={onStartFree}
              className="bg-[#18181B] text-white rounded-full px-10 py-5 text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all hover:scale-105 shadow-xl cursor-pointer"
            >
              Start for free &#8599;
            </button>
            <button
              type="button"
              onClick={onExploreDemo}
              className="border border-[#E4E4E7] bg-white/80 rounded-full px-10 py-5 text-[11px] font-black uppercase tracking-widest hover:bg-[#FAFAFA] transition-colors cursor-pointer shadow-sm"
            >
              Explore demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Slide 2: Schema Understanding */}
      <section id="understanding-section" className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl bg-white/90 backdrop-blur-2xl border border-white/80 rounded-[40px] p-8 sm:p-12 shadow-2xl pointer-events-auto"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-[#CB2958]" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#71717A]">Understanding your schema</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {['CUSTOMERS', 'ORDERS', 'ORDER_ITEMS', 'PRODUCTS'].map((t, i) => (
              <div
                key={t}
                className={`rounded-2xl border px-4 py-5 text-[10px] font-black uppercase tracking-widest text-center ${
                  i === 3
                    ? "border-[#CB2958]/40 text-[#CB2958] bg-[#CB2958]/5 shadow-sm scale-105"
                    : "border-[#E4E4E7] text-[#71717A] bg-white/80"
                }`}
              >
                {t}
              </div>
            ))}
          </div>
          <p className="text-lg sm:text-xl text-[#3F3F46] font-medium leading-relaxed">
            AskBase maps tables, keys and relationships first — so it knows how revenue joins to products before executing queries.
          </p>
        </motion.div>
      </section>

      {/* Slide 3: Features */}
      <section id="features-section" className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-3xl bg-white/90 backdrop-blur-2xl border border-white/80 rounded-[40px] p-8 sm:p-12 shadow-2xl pointer-events-auto"
        >
          <div className="text-[11px] font-black uppercase tracking-[0.5em] text-[#CB2958] mb-8">Features</div>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="space-y-2">
                <h3 className="text-lg font-black uppercase tracking-tight text-[#18181B]">{f.title}</h3>
                <p className="text-sm text-[#71717A] font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Slide 4: About */}
      <section id="about-section" className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl bg-white/90 backdrop-blur-2xl border border-white/80 rounded-[40px] p-8 sm:p-12 shadow-2xl pointer-events-auto"
        >
          <div className="text-[11px] font-black uppercase tracking-[0.5em] text-[#CB2958] mb-6">About</div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-4">
            Data should answer, not wait in a queue.
          </h2>
          <p className="text-base text-[#3F3F46] font-medium leading-relaxed mb-6">
            AskBase is an intelligent interface for your data. We bridge complex database schemas and natural language queries for instant insights.
          </p>
          <button
            type="button"
            onClick={onStartFree}
            className="bg-[#18181B] text-white rounded-full px-8 py-4 text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all cursor-pointer"
          >
            Start for free &#8599;
          </button>
        </motion.div>
      </section>
    </div>
  );
}
