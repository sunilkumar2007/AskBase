import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ConversationSection = () => {
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
            Ask.<br />
            Then ask more.
          </motion.h2>
          <p className="text-xl text-[#71717A] max-w-md font-medium leading-relaxed">
            Conversational context allows you to drill down into data naturally. Transform charts, filter results, and explore insights through a continuous dialogue.
          </p>
        </div>

        <div className="relative bg-[#FAFAFA] rounded-3xl border border-[#E4E4E7] p-8 min-h-[500px] flex flex-col justify-end gap-6 overflow-hidden">
          {/* Chat Bubble 1 */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0.1, 0.2], [0, 1]),
              x: useTransform(scrollYProgress, [0.1, 0.2], [-20, 0])
            }}
            className="self-start bg-white border border-[#E4E4E7] p-4 rounded-lg shadow-sm max-w-xs"
          >
            <div className="text-[8px] font-black text-[#CB2958] uppercase mb-1">User</div>
            <div className="text-xs font-bold">"Show me the top 5 products by revenue."</div>
          </motion.div>

          {/* Response 1 (Chart) */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0.3, 0.4], [0, 1]),
              scale: useTransform(scrollYProgress, [0.3, 0.4], [0.95, 1])
            }}
            className="self-end bg-[#18181B] p-6 rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="text-[8px] font-black text-white/40 uppercase mb-4">AskBase • Bar Chart</div>
            <div className="flex items-end gap-2 h-24">
              {[80, 60, 45, 30, 20].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  className="flex-1 bg-[#CB2958]"
                />
              ))}
            </div>
          </motion.div>

          {/* Chat Bubble 2 */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0.5, 0.6], [0, 1]),
              x: useTransform(scrollYProgress, [0.5, 0.6], [-20, 0])
            }}
            className="self-start bg-white border border-[#E4E4E7] p-4 rounded-lg shadow-sm max-w-xs"
          >
            <div className="text-[8px] font-black text-[#CB2958] uppercase mb-1">User</div>
            <div className="text-xs font-bold">"Now show their trend over the last year."</div>
          </motion.div>

          {/* Response 2 (Morphed Line Chart) */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0.7, 0.8], [0, 1]),
              scale: useTransform(scrollYProgress, [0.7, 0.8], [0.95, 1])
            }}
            className="self-end bg-[#18181B] p-6 rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="text-[8px] font-black text-white/40 uppercase mb-4">AskBase • Line Chart</div>
            <svg className="w-full h-24 overflow-visible">
               <motion.path
                 d="M 0 60 L 50 40 L 100 80 L 150 20 L 200 50 L 250 10 L 300 30"
                 fill="none"
                 stroke="#CB2958"
                 strokeWidth="3"
                 initial={{ pathLength: 0 }}
                 whileInView={{ pathLength: 1 }}
               />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
