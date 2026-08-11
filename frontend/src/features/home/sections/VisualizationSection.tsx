import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const DATA_POINTS = [
  { label: 'JAN', value: 45 },
  { label: 'FEB', value: 52 },
  { label: 'MAR', value: 48 },
  { label: 'APR', value: 70 },
  { label: 'MAY', value: 65 },
  { label: 'JUN', value: 85 },
];

type VizType = 'BAR' | 'LINE' | 'PIE' | 'SCATTER';

export const VisualizationSection = () => {
  const [vizType, setVizType] = useState<VizType>('BAR');

  useEffect(() => {
    const interval = setInterval(() => {
      const types: VizType[] = ['BAR', 'LINE', 'PIE', 'SCATTER'];
      setVizType(prev => {
        const nextIndex = (types.indexOf(prev) + 1) % types.length;
        return types[nextIndex] as VizType;
      });

    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 px-8 bg-[#18181B] text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="order-2 lg:order-1 relative h-[500px] flex items-center justify-center bg-white/5 rounded-3xl border border-white/10 p-12">
          <div className="w-full h-full relative flex items-center justify-center">
             <AnimatePresence mode="wait">
                <motion.div
                  key={vizType}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="w-full h-full flex items-end justify-center gap-4"
                >
                   {vizType === 'BAR' && DATA_POINTS.map((d, i) => (
                     <div key={i} className="flex-1 flex flex-col items-center gap-4">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${d.value}%` }}
                          className="w-full bg-[#CB2958] rounded-t-sm shadow-2xl shadow-[#CB2958]/20"
                        />
                        <span className="text-[10px] font-black opacity-40">{d.label}</span>
                     </div>
                   ))}

                   {vizType === 'LINE' && (
                     <svg className="w-full h-full">
                        <motion.path
                          d={`M ${DATA_POINTS.map((d, i) => `${(i / (DATA_POINTS.length - 1)) * 100}% ${100 - d.value}%`).join(' L ')}`}
                          fill="none"
                          stroke="#CB2958"
                          strokeWidth="4"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          className="w-full h-full"
                          style={{ overflow: 'visible' }}
                        />
                        {DATA_POINTS.map((d, i) => (
                          <motion.circle
                            key={i}
                            cx={`${(i / (DATA_POINTS.length - 1)) * 100}%`}
                            cy={`${100 - d.value}%`}
                            r="6"
                            fill="#FFFFFF"
                            stroke="#CB2958"
                            strokeWidth="3"
                          />
                        ))}
                     </svg>
                   )}

                   {vizType === 'PIE' && (
                      <motion.div
                        className="w-64 h-64 rounded-full border-[30px] border-[#CB2958]"
                        initial={{ rotate: -90, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                      />
                   )}

                   {vizType === 'SCATTER' && DATA_POINTS.map((d, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          x: (Math.random() - 0.5) * 200,
                          y: (Math.random() - 0.5) * 200,
                        }}
                        className="absolute w-4 h-4 rounded-full bg-[#CB2958]"
                      />
                   ))}
                </motion.div>
             </AnimatePresence>
          </div>

          <div className="absolute top-8 left-8 flex gap-4">
            {['BAR', 'LINE', 'PIE', 'SCATTER'].map(t => (
              <span key={t} className={`text-[9px] font-black tracking-widest ${vizType === t ? 'text-[#CB2958]' : 'text-white/20'}`}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <motion.h2
            className="text-[60px] md:text-[90px] font-black tracking-tighter leading-[0.85] mb-12 uppercase text-white"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            Numbers are data.<br />
            Patterns are insight.
          </motion.h2>
          <p className="text-xl text-white/60 max-w-md mb-12 font-medium leading-relaxed">
            Instant visualization of any dataset. From basic tables to complex multi-dimensional charts in seconds.
          </p>
        </div>
      </div>
    </section>
  );
};
