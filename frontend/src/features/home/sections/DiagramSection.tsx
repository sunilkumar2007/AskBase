import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const DiagramSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="py-32 px-8 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <motion.h2
            className="text-[60px] md:text-[90px] font-black tracking-tighter leading-[0.85] mb-12 uppercase text-[#111111]"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            Ask your database<br />
            to explain itself.
          </motion.h2>
          <p className="text-xl text-[#71717A] max-w-md font-medium leading-relaxed mb-12">
            Generate complex architectural diagrams and process flows directly from your data schema.
          </p>

          <div className="grid grid-cols-2 gap-8">
             <div className="bg-[#FAFAFA] p-6 border border-[#E4E4E7]">
                <div className="text-[9px] font-black uppercase tracking-[0.4em] text-[#CB2958] mb-4">ER Diagram</div>
                <div className="space-y-4">
                   <div className="w-full h-[1px] bg-[#E4E4E7] relative">
                      <motion.div
                        animate={{ left: ["0%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute w-2 h-2 -top-[3px] rounded-full bg-[#CB2958]"
                      />
                   </div>
                   <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-[#71717A]">
                      <span>Customer</span>
                      <span>Order</span>
                   </div>
                </div>
             </div>
             <div className="bg-[#FAFAFA] p-6 border border-[#E4E4E7]">
                <div className="text-[9px] font-black uppercase tracking-[0.4em] text-[#CB2958] mb-4">Process Flow</div>
                <div className="space-y-4">
                   <div className="flex gap-2">
                      {[1, 2, 3, 4].map(i => (
                        <motion.div
                          key={i}
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                          className="flex-1 h-1 bg-[#CB2958]"
                        />
                      ))}
                   </div>
                   <div className="text-[8px] font-black uppercase tracking-widest text-[#71717A]">
                      Payment → Shipping
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="relative h-[600px] flex items-center justify-center">
           <div className="relative w-full h-full bg-[#18181B] rounded-3xl p-12 shadow-2xl overflow-hidden">
              {/* Animated ER Diagram Sketch */}
              <svg className="w-full h-full opacity-50">
                <motion.path
                  d="M 100 100 L 200 200 L 300 100 M 200 200 L 200 400 L 100 500 M 200 400 L 300 500"
                  fill="none"
                  stroke="#CB2958"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 3 }}
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                 <div className="text-[120px] font-black text-white/5 select-none uppercase tracking-tighter">DIAGRAM</div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};
