import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const VoiceSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="py-32 px-8 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto text-center">
        <motion.h2
          className="text-[60px] md:text-[90px] font-black tracking-tighter leading-[0.85] mb-24 uppercase text-[#111111]"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Ask with your voice.
        </motion.h2>

        <div className="relative max-w-2xl mx-auto">
           {/* Voice Orb Interaction */}
           <div className="w-64 h-64 mx-auto rounded-full border border-[#E4E4E7] shadow-2xl flex items-center justify-center relative mb-12">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-[#CB2958]/5 rounded-full blur-2xl"
              />
              <div className="w-32 h-32 bg-[#CB2958] rounded-sm flex items-center justify-center rotate-45 shadow-lg relative z-10">
                 <div className="flex gap-1 -rotate-45">
                    {[1, 2, 3, 4, 5].map(i => (
                       <motion.div
                         key={i}
                         animate={{ height: [8, 24, 8] }}
                         transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                         className="w-1 bg-white rounded-full"
                       />
                    ))}
                 </div>
              </div>
           </div>

           <motion.div
             style={{
               opacity: useTransform(scrollYProgress, [0.3, 0.5], [0, 1]),
               y: useTransform(scrollYProgress, [0.3, 0.5], [20, 0])
             }}
             className="text-4xl font-black italic text-[#111111] mb-12"
           >
              "Show me revenue by month."
           </motion.div>

           <div className="flex justify-center gap-12">
              {['UNDERSTANDING', 'QUERYING', 'VISUALIZING'].map((status, i) => (
                <motion.div
                   key={status}
                   style={{
                     opacity: useTransform(scrollYProgress, [0.5 + (i*0.1), 0.7 + (i*0.1)], [0.3, 1]),
                     color: useTransform(scrollYProgress, [0.5 + (i*0.1), 0.7 + (i*0.1)], ["#A1A1AA", "#CB2958"])
                   }}
                   className="text-[10px] font-black uppercase tracking-[0.4em]"
                >
                   {status}
                </motion.div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
};
