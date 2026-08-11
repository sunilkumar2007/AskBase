import React, { useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { AskBaseLogo } from './AskBaseLogo';

export type OrbState = 'idle' | 'listening' | 'processing' | 'querying' | 'analyzing' | 'visualizing' | 'success' | 'error';

interface AskBaseOrbProps {
  state?: OrbState;
  size?: number;
}

const PARTICLE_WORDS = [
  'SELECT', 'SCHEMA', 'DATA', 'QUERY', 'REVENUE',
  'CUSTOMER', 'PRODUCT', 'ORDER', 'INSIGHT', 'JOIN'
];

export function AskBaseOrb({ state = 'idle', size = 300 }: AskBaseOrbProps) {
  const particles = useMemo(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      word: PARTICLE_WORDS[i % PARTICLE_WORDS.length],
      angle: (i / 20) * Math.PI * 2,
      distance: 0.8 + Math.random() * 0.4,
    }))
  , []);

  const variants: Variants = {
    idle: { scale: 1, opacity: 0.8 },
    listening: { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 2 } },
    processing: { rotate: 360, transition: { repeat: Infinity, duration: 10, ease: "linear" as const } },
    querying: { scale: 0.9, opacity: 1 },
    analyzing: { scale: 1.05 },
    visualizing: { scale: 1.1 },
    success: { scale: 1.2, filter: 'brightness(1.2)' },
    error: { scale: 0.8, filter: 'grayscale(1) contrast(0.5)' }
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Core Glow */}
      <motion.div
        animate={state}
        variants={variants}
        className="absolute w-1/3 h-1/3 rounded-full bg-[#CB2958] blur-[60px] opacity-40"
      />

      {/* Particle container */}
      <motion.div
        animate={state === 'processing' ? { rotate: 360 } : { rotate: 0 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="relative w-full h-full"
      >
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={false}
            animate={{
              x: Math.cos(p.angle) * (size / 2) * p.distance * (state === 'listening' ? 1.1 : 1),
              y: Math.sin(p.angle) * (size / 2) * p.distance * (state === 'listening' ? 1.1 : 1),
              opacity: state === 'idle' ? 0.3 : 0.8,
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="text-[10px] font-mono tracking-widest text-[#CB2958]/80 font-bold select-none">
              {p.word}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Central Identity */}
      <div className="absolute w-16 h-16 rounded-full border border-[#CB2958]/20 flex items-center justify-center bg-white shadow-2xl overflow-hidden">
        <AskBaseLogo size={64} className="shadow-none border-none rounded-none" />
      </div>
    </div>
  );
}
