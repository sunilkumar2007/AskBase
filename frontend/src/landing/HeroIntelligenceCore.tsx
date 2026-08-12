import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PARTICLE_WORDS = ['SQL', 'SCHEMA', 'DATA', 'QUERY', 'JOIN', 'METRIC', 'SAFETY', 'REASONING'];

export function HeroIntelligenceCore() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / 25,
      y: (e.clientY - rect.top - rect.height / 2) / 25,
    });
  };

  const particles = useMemo(() =>
    Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      word: PARTICLE_WORDS[i % PARTICLE_WORDS.length],
      angle: (i / 14) * Math.PI * 2,
      distance: 0.7 + Math.random() * 0.3,
      speed: 0.5 + Math.random() * 0.5,
    }))
  , []);

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[550px] flex items-center justify-center overflow-hidden pointer-events-auto"
    >
      {/* Background Ambient Glow */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.12, 0.25, 0.12],
          x: mousePos.x * 0.5,
          y: mousePos.y * 0.5,
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[420px] h-[420px] rounded-full bg-[#CB2958] blur-[110px] pointer-events-none"
      />

      {/* Central Interactive Orb */}
      <motion.div
        className="relative z-20 w-32 h-32 rounded-full bg-white border border-[#E4E4E7] shadow-2xl flex items-center justify-center cursor-pointer"
        animate={{
          x: mousePos.x,
          y: mousePos.y,
        }}
        whileHover={{ scale: 1.08 }}
      >
        <div className="w-16 h-16 bg-[#CB2958] rounded-2xl flex items-center justify-center rotate-45 shadow-lg shadow-[#CB2958]/30">
          <span className="text-white text-2xl font-black -rotate-45">?</span>
        </div>

        {/* Orbiting Particles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 pointer-events-none"
          style={{ x: mousePos.x * 0.2, y: mousePos.y * 0.2 }}
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={false}
              animate={{
                x: Math.cos(p.angle) * 180 * p.distance + (mousePos.x * p.speed),
                y: Math.sin(p.angle) * 180 * p.distance + (mousePos.y * p.speed),
                opacity: 0.5,
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <span className="text-[9px] font-black tracking-widest text-[#CB2958] uppercase select-none opacity-50">
                {p.word}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
