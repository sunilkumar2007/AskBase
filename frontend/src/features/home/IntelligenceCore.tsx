import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QueryCard,
  SchemaGraph,
  SqlPanel,
  ValidationBadge,
  DataViz,
  InsightCard
} from './AnimationStates';

export type LandingState =
  | 'IDLE'
  | 'QUESTION'
  | 'UNDERSTANDING'
  | 'SCHEMA'
  | 'QUERY'
  | 'VALIDATING'
  | 'DATABASE'
  | 'DATA'
  | 'VISUALIZE'
  | 'INSIGHT'
  | 'COMPLETE';

const STATES: LandingState[] = [
  'IDLE', 'QUESTION', 'UNDERSTANDING', 'SCHEMA', 'QUERY',
  'VALIDATING', 'DATABASE', 'DATA', 'VISUALIZE', 'INSIGHT', 'COMPLETE'
];

const STATE_DURATIONS: Record<LandingState, number> = {
  IDLE: 3000,
  QUESTION: 3000,
  UNDERSTANDING: 2000,
  SCHEMA: 3000,
  QUERY: 3000,
  VALIDATING: 2000,
  DATABASE: 3000,
  DATA: 2000,
  VISUALIZE: 4000,
  INSIGHT: 3000,
  COMPLETE: 3000
};

const PARTICLE_WORDS = [
  'SELECT', 'SCHEMA', 'DATA', 'QUERY', 'REVENUE',
  'CUSTOMER', 'PRODUCT', 'ORDER', 'INSIGHT', 'JOIN',
  'FROM', 'GROUP BY', 'LIMIT', 'TREND', 'ANALYSIS'
];

export function IntelligenceCore() {
  const [stateIndex, setStateIndex] = useState(0);
  const currentState = STATES[stateIndex];

  useEffect(() => {
    const timer = setTimeout(() => {
      setStateIndex((prev) => (prev + 1) % STATES.length);
    }, (currentState && STATE_DURATIONS[currentState]) || 3000);
    return () => clearTimeout(timer);
  }, [currentState]);

  const particles = useMemo(() =>
    Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      word: PARTICLE_WORDS[i % PARTICLE_WORDS.length],
      angle: (i / 15) * Math.PI * 2,
      distance: 0.7 + Math.random() * 0.3,
    }))
  , []);

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute w-[400px] h-[400px] rounded-full bg-[#CB2958] blur-[100px]"
      />

      {/* Central Orb / Identity */}
      <motion.div
        className="relative z-20 w-32 h-32 rounded-full bg-white border border-[#E4E4E7] shadow-2xl flex items-center justify-center"
        animate={{
          scale: currentState === 'UNDERSTANDING' ? 1.1 : 1,
          borderColor: currentState === 'VALIDATING' ? '#CB2958' : '#E4E4E7',
        }}
      >
        <div className="w-16 h-16 bg-[#CB2958] rounded-sm flex items-center justify-center rotate-45 shadow-lg">
          <span className="text-white text-2xl font-black -rotate-45">?</span>
        </div>

        {/* Orbiting Words Container */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={false}
              animate={{
                x: Math.cos(p.angle) * 180 * p.distance,
                y: Math.sin(p.angle) * 180 * p.distance,
                opacity: currentState === 'IDLE' ? 0.2 : 0.6,
                scale: currentState === 'UNDERSTANDING' ? 1.2 : 1,
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <span className="text-[9px] font-black tracking-widest text-[#CB2958] uppercase select-none opacity-40">
                {p.word}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* State Specific Overlays */}
      <AnimatePresence mode="wait">
        {currentState === 'QUESTION' && (
          <QueryCard key="query" text="Show me the top 5 products by revenue this quarter." />
        )}

        {currentState === 'SCHEMA' && (
          <SchemaGraph key="schema" />
        )}

        {currentState === 'QUERY' && (
          <SqlPanel key="sql" />
        )}

        {currentState === 'VALIDATING' && (
          <>
            <SqlPanel key="sql-val" />
            <ValidationBadge key="badge" />
          </>
        )}

        {(currentState === 'DATABASE' || currentState === 'DATA') && (
           <motion.div
            key="db-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
           >
              <motion.div
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-40 h-40 border-2 border-[#CB2958] rounded-full"
              />
           </motion.div>
        )}

        {currentState === 'VISUALIZE' && (
          <DataViz key="viz" />
        )}

        {currentState === 'INSIGHT' && (
          <>
            <DataViz key="viz-insight" />
            <InsightCard key="insight" />
          </>
        )}
      </AnimatePresence>

      {/* Status Label */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-[#CB2958]"
        />
        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#18181B] opacity-40">
          {(currentState || 'IDLE').replace('_', ' ')}
        </span>
      </div>
    </div>
  );
}
