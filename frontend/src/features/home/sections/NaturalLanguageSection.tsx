import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const NaturalLanguageSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const questionOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.3, 0.4], [0, 1, 1, 0]);
  const sqlOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.5, 0.6], [0, 1, 1, 0]);
  const dataOpacity = useTransform(scrollYProgress, [0.5, 0.6, 0.7, 0.8], [0, 1, 1, 0]);
  const vizOpacity = useTransform(scrollYProgress, [0.7, 0.8, 0.9, 1.0], [0, 1, 1, 0]);

  const xPos = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "-300%"]);

  return (
    <section ref={containerRef} className="py-32 bg-white overflow-hidden h-[300vh] relative">
      <div className="sticky top-0 h-screen flex flex-col justify-center px-8">
        <motion.h2
          className="text-[60px] md:text-[90px] font-black tracking-tighter leading-[0.85] mb-24 uppercase text-[#111111]"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          From Question<br />
          to Query.
        </motion.h2>

        <div className="relative w-full overflow-hidden h-96">
          <motion.div style={{ x: xPos }} className="flex w-[400%] h-full">
            {/* Step 1: Language */}
            <div className="w-1/4 flex items-center justify-center px-20">
              <motion.div style={{ opacity: questionOpacity }} className="bg-white border border-[#E4E4E7] p-12 shadow-2xl w-full">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#CB2958] mb-6">Natural Language</div>
                <div className="text-4xl font-black italic">"Show me monthly revenue for this year."</div>
              </motion.div>
            </div>

            {/* Step 2: SQL */}
            <div className="w-1/4 flex items-center justify-center px-20">
              <motion.div style={{ opacity: sqlOpacity }} className="bg-[#18181B] p-12 shadow-2xl w-full font-mono text-xl">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-6">Generated SQL</div>
                <div className="text-white">
                  <span className="text-[#CB2958]">SELECT</span> month, <span className="text-[#CB2958]">SUM</span>(revenue)<br/>
                  <span className="text-[#CB2958]">FROM</span> sales<br/>
                  <span className="text-[#CB2958]">WHERE</span> year = 2026<br/>
                  <span className="text-[#CB2958]">GROUP BY</span> month;
                </div>
              </motion.div>
            </div>

            {/* Step 3: Data */}
            <div className="w-1/4 flex items-center justify-center px-20">
              <motion.div style={{ opacity: dataOpacity }} className="bg-white border border-[#E4E4E7] p-12 shadow-2xl w-full overflow-x-auto">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#71717A] mb-6">Query Result</div>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E4E4E7]">
                      <th className="py-2 font-black uppercase tracking-widest">Month</th>
                      <th className="py-2 font-black uppercase tracking-widest">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Jan', 'Feb', 'Mar', 'Apr'].map(m => (
                      <tr key={m} className="border-b border-[#F4F4F5]">
                        <td className="py-2 font-medium">{m}</td>
                        <td className="py-2 font-mono">$124,500</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </div>

            {/* Step 4: Viz */}
            <div className="w-1/4 flex items-center justify-center px-20">
              <motion.div style={{ opacity: vizOpacity }} className="bg-white border border-[#E4E4E7] p-12 shadow-2xl w-full">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#71717A] mb-6">Visualization</div>
                <div className="flex items-end gap-2 h-48">
                  {[40, 60, 45, 80, 55, 90].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      className="flex-1 bg-[#18181B] hover:bg-[#CB2958] transition-colors"
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-[#71717A]">
          <span style={{ color: scrollYProgress.get() > 0.1 && scrollYProgress.get() < 0.3 ? '#CB2958' : '' }}>Language</span>
          <span style={{ color: scrollYProgress.get() > 0.3 && scrollYProgress.get() < 0.5 ? '#CB2958' : '' }}>SQL</span>
          <span style={{ color: scrollYProgress.get() > 0.5 && scrollYProgress.get() < 0.7 ? '#CB2958' : '' }}>Data</span>
          <span style={{ color: scrollYProgress.get() > 0.7 ? '#CB2958' : '' }}>Visualization</span>
        </div>
      </div>
    </section>
  );
};
