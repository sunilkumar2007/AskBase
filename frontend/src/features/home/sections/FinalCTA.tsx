import React from 'react';
import { motion } from 'framer-motion';

export const FinalCTA = () => {
  return (
    <section className="py-48 px-8 bg-white overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-[80px] md:text-[150px] font-black tracking-tighter leading-[0.8] uppercase text-[#111111] mb-24"
        >
          Ask<br />
          Better<br />
          Questions.<br />
          <span className="text-[#CB2958]">Get Better Answers.</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <a href="/chat">
            <button className="bg-[#18181B] hover:bg-[#000] text-white px-16 py-8 text-sm font-black uppercase tracking-[0.5em] shadow-2xl transition-all group flex items-center gap-4 mx-auto">
              Start Asking
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ↗
              </motion.span>
            </button>
          </a>
        </motion.div>
      </div>

      {/* Intelligence Core Convergence Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
         <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#CB2958]/20 rounded-full"
         />
      </div>
    </section>
  );
};
