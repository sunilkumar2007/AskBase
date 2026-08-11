import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const InsightSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="py-32 px-8 bg-[#FAFAFA] overflow-hidden">
      <div className="max-w-[1440px] mx-auto text-center">
        <motion.h2
          className="text-[60px] md:text-[90px] font-black tracking-tighter leading-[0.85] mb-24 uppercase text-[#111111]"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Don't just see<br />
          the numbers.<br />
          <span className="text-[#CB2958]">Understand them.</span>
        </motion.h2>

        <div className="relative max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Revenue', val: '₹2.4M', growth: '+18%' },
            { label: 'Orders', val: '12,543', growth: '+12%' },
            { label: 'Customers', val: '8,429', growth: '+8%' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 border border-[#E4E4E7] shadow-lg text-left"
            >
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#71717A] mb-4">{stat.label}</div>
              <div className="text-4xl font-black mb-2">{stat.val}</div>
              <div className="text-[10px] font-black text-[#CB2958]">{stat.growth} ↑</div>
            </motion.div>
          ))}

          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0.6, 0.8], [0, 1]),
              y: useTransform(scrollYProgress, [0.6, 0.8], [50, 0])
            }}
            className="col-span-1 md:col-span-3 bg-[#18181B] p-12 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8">
               <motion.div
                 animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="w-24 h-24 bg-[#CB2958] blur-3xl rounded-full"
               />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-6">AskBase Insight</div>
            <p className="text-3xl md:text-4xl font-black text-white italic leading-tight max-w-2xl">
              "Revenue grew faster than order volume, suggesting higher average order value per customer."
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
