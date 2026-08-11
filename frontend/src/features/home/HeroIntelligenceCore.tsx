import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  QueryCard,
  SchemaGraph,
  SqlPanel,
  ValidationBadge,
  DataViz,
  InsightCard,
  FlowGraph
} from './AnimationStates';
import { HERO_SCENARIOS, LandingState, STATES, STATE_DURATIONS, PARTICLE_WORDS } from '@/config/landing';

export function HeroIntelligenceCore() {
  const [stateIndex, setStateIndex] = useState(0);
  const [scenarioIndex, setScenarioIndex] = useState(0);

  const currentState = STATES[stateIndex] || 'IDLE';
  const currentScenario = HERO_SCENARIOS[scenarioIndex]!;

  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const duration = STATE_DURATIONS[currentState] || 3000;
    const timer = setTimeout(() => {
      if (stateIndex === STATES.length - 1) {
        setScenarioIndex((prev) => (prev + 1) % HERO_SCENARIOS.length);
        setStateIndex(0);
      } else {
        setStateIndex((prev) => prev + 1);
      }
    }, duration);
    return () => clearTimeout(timer);
  }, [stateIndex, currentState]);


  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / 25,
      y: (e.clientY - rect.top - rect.height / 2) / 25,
    });
  };

  const particles = useMemo(() =>
    Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      word: PARTICLE_WORDS[i % PARTICLE_WORDS.length],
      angle: (i / 15) * Math.PI * 2,
      distance: 0.7 + Math.random() * 0.3,
      speed: 0.5 + Math.random() * 0.5,
    }))
  , []);

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ scale, opacity }}
      className="relative w-full h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          x: mousePos.x * 0.5,
          y: mousePos.y * 0.5,
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
          x: mousePos.x,
          y: mousePos.y,
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
          style={{ x: mousePos.x * 0.2, y: mousePos.y * 0.2 }}
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={false}
              animate={{
                x: Math.cos(p.angle) * 180 * p.distance + (mousePos.x * p.speed),
                y: Math.sin(p.angle) * 180 * p.distance + (mousePos.y * p.speed),
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
          <QueryCard key="query" text={currentScenario.question} mousePos={mousePos} />
        )}

        {currentState === 'SCHEMA' && (
          currentScenario.type === 'er' ? <SchemaGraph key="er" nodes={currentScenario.data} /> : <SchemaGraph key="schema" />
        )}

        {currentState === 'QUERY' && (
          <SqlPanel key="sql" sql={currentScenario.sql} mousePos={mousePos} />
        )}

        {currentState === 'VALIDATING' && (
          <>
            <SqlPanel key="sql-val" sql={currentScenario.sql} mousePos={mousePos} />
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
          currentScenario.type === 'flow' ? <FlowGraph key="flow" steps={currentScenario.data} /> : <DataViz key="viz" type={currentScenario.type} data={currentScenario.data} mousePos={mousePos} />
        )}

        {currentState === 'INSIGHT' && (
          <>
            {currentScenario.type === 'flow' ? <FlowGraph key="flow-insight" steps={currentScenario.data} /> : <DataViz key="viz-insight" type={currentScenario.type} data={currentScenario.data} mousePos={mousePos} />}
            <InsightCard key="insight" text={currentScenario.insight} metric={currentScenario.metric} mousePos={mousePos} />
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
          {currentState.replace('_', ' ')}
        </span>
      </div>
    </motion.div>
  );
}
