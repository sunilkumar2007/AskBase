import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PROBLEM_STAGES } from '@/config/landing';

export const ProblemSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="py-32 px-8 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <motion.h2
          className="text-[60px] md:text-[90px] font-black tracking-tighter leading-[0.85] mb-24 uppercase text-[#111111]"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Data should not require<br />
          a degree in SQL.
        </motion.h2>

        <div className="relative py-20 flex flex-col items-center">
          {/* Traditional Workflow */}
          <div className="space-y-4 w-full max-w-md">
            {PROBLEM_STAGES.map((stage, i) => (
              <WorkflowStep key={stage} text={stage} index={i} total={PROBLEM_STAGES.length} scrollYProgress={scrollYProgress} />
            ))}
          </div>

          {/* Transition Arrow */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0.6, 0.7], [0, 1]),
              scale: useTransform(scrollYProgress, [0.6, 0.7], [0.8, 1])
            }}
            className="my-12 text-[#71717A] text-2xl"
          >
            ↓
          </motion.div>

          {/* Compressed Workflow */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0.7, 0.8], [0, 1]),
              y: useTransform(scrollYProgress, [0.7, 0.8], [20, 0])
            }}
            className="flex flex-col items-center gap-8 w-full max-w-md"
          >
            <div className="w-full bg-[#F4F4F5] p-6 text-center text-[12px] font-black uppercase tracking-[0.4em] text-[#71717A]">Ask</div>
            <div className="text-[#CB2958] text-2xl font-black italic">↓</div>
            <div className="w-full bg-[#18181B] p-8 text-center text-[14px] font-black uppercase tracking-[0.5em] text-white shadow-2xl">AskBase</div>
            <div className="text-[#CB2958] text-2xl font-black italic">↓</div>
            <div className="w-full bg-[#CB2958] p-6 text-center text-[12px] font-black uppercase tracking-[0.4em] text-white">Answer</div>
          </motion.div>

          <motion.div
             style={{
               opacity: useTransform(scrollYProgress, [0.85, 0.95], [0, 1]),
               scale: useTransform(scrollYProgress, [0.85, 0.95], [0.5, 1.2])
             }}
             className="mt-24 text-[120px] font-black italic uppercase tracking-tighter text-[#111111]"
          >
            Just Ask.
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const WorkflowStep = ({ text, index, total, scrollYProgress }: any) => {
  const start = (index / total) * 0.4;
  const end = ((index + 1) / total) * 0.4;

  const opacity = useTransform(scrollYProgress, [start, end, 0.6, 0.7], [0, 1, 1, 0]);
  const x = useTransform(scrollYProgress, [start, end, 0.6, 0.7], [-20, 0, 0, 20]);
  const scale = useTransform(scrollYProgress, [0.6, 0.7], [1, 0.8]);

  return (
    <motion.div
      style={{ opacity, x, scale }}
      className="w-full bg-white border border-[#E4E4E7] p-4 text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#71717A]"
    >
      {text}
    </motion.div>
  );
};
