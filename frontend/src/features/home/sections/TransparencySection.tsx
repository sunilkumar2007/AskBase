import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const TransparencySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="py-32 px-8 bg-[#18181B] text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="order-2 lg:order-1 relative bg-white/5 p-12 rounded-3xl border border-white/10 min-h-[500px]">
           <div className="space-y-8">
              <div className="bg-white/5 p-6 border border-white/10">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Operation: SELECT</span>
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">✓ Safe</span>
                 </div>
                 <div className="font-mono text-sm text-white/80">SELECT * FROM orders WHERE total {" > "} 1000;</div>
              </div>

              <motion.div
                style={{
                  opacity: useTransform(scrollYProgress, [0.4, 0.5], [0, 1]),
                  x: useTransform(scrollYProgress, [0.4, 0.5], [-20, 0])
                }}
                className="bg-[#CB2958]/10 p-6 border border-[#CB2958]/30"
              >
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#CB2958]">Operation: DROP</span>
                    <span className="text-[10px] font-black text-[#CB2958] uppercase tracking-widest">✕ Blocked</span>
                 </div>
                 <div className="font-mono text-sm text-white/40 line-through">DROP TABLE customers;</div>
                 <div className="mt-4 text-[9px] font-black uppercase tracking-widest text-[#CB2958]">Safety violation: Non-read operation detected</div>
              </motion.div>
           </div>
        </div>

        <div className="order-1 lg:order-2">
          <motion.h2
            className="text-[60px] md:text-[90px] font-black tracking-tighter leading-[0.85] mb-12 uppercase text-white"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            AI should not<br />
            be a black box.
          </motion.h2>
          <p className="text-xl text-white/60 max-w-md mb-12 font-medium leading-relaxed">
            Every query is validated against a multi-layer safety protocol. Full transparency, zero risk.
          </p>
          <div className="flex gap-4">
             {['READ ONLY', 'SQLGLOT VALIDATED', 'SAFE'].map(tag => (
               <div key={tag} className="px-4 py-2 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/60">
                  {tag}
               </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};
