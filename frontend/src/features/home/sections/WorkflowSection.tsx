import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { WORKFLOW_STAGES } from '@/config/landing';

export const WorkflowSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="py-32 px-8 bg-[#FAFAFA] overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <motion.h2
          className="text-[60px] md:text-[90px] font-black tracking-tighter leading-[0.85] mb-24 uppercase text-[#111111]"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          One question.<br />
          A whole data workflow.
        </motion.h2>

        <div className="relative mt-32 max-w-4xl mx-auto">
          {/* Vertical Pipeline Line */}
          <div className="absolute left-[20px] top-0 bottom-0 w-[1px] bg-[#E4E4E7]" />

          {/* Pulse Indicator */}
          <motion.div
            className="absolute left-[19px] top-0 w-[3px] h-20 bg-[#CB2958] z-10"
            style={{
              top: useTransform(scrollYProgress, [0.1, 0.9], ["0%", "90%"])
            }}
          />

          <div className="space-y-24 relative z-0">
            {WORKFLOW_STAGES.map((stage, i) => (
              <WorkflowNode
                key={stage}
                text={stage}
                index={i}
                total={WORKFLOW_STAGES.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const WorkflowNode = ({ text, index, total, scrollYProgress }: any) => {
  const start = 0.1 + (index / total) * 0.8;
  const end = 0.1 + ((index + 0.5) / total) * 0.8;

  const isActive = useTransform(scrollYProgress, [start - 0.05, start, end, end + 0.05], [0, 1, 1, 0]);
  const color = useTransform(scrollYProgress, [start - 0.05, start, end, end + 0.05], ["#A1A1AA", "#CB2958", "#CB2958", "#A1A1AA"]);
  const x = useTransform(scrollYProgress, [start - 0.05, start, end], [0, 20, 20]);
  const scale = useTransform(scrollYProgress, [start - 0.05, start, end], [1, 1.1, 1.1]);

  return (
    <div className="flex items-center gap-12">
      <motion.div
        style={{
          backgroundColor: color,
          scale: scale
        }}
        className="w-[40px] h-[40px] rounded-full border-4 border-white shadow-sm flex-shrink-0 relative z-20"
      />
      <motion.div
        style={{ x, opacity: useTransform(scrollYProgress, [start - 0.1, start], [0.3, 1]) }}
        className="flex flex-col"
      >
        <motion.span
          style={{ color }}
          className="text-2xl font-black uppercase tracking-[0.2em]"
        >
          {text}
        </motion.span>
        <motion.p
          style={{ opacity: isActive }}
          className="text-sm text-[#71717A] max-w-sm mt-2 font-medium"
        >
          Automated processing of your data request at the {text.toLowerCase()} stage.
        </motion.p>
      </motion.div>
    </div>
  );
};
