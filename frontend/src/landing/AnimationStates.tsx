import React from 'react';
import { motion } from 'framer-motion';

interface MousePos {
  x: number;
  y: number;
}

export const QueryCard = ({ text, mousePos }: { text: string; mousePos?: MousePos }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{
      opacity: 1,
      scale: 1,
      y: 0,
      x: mousePos ? mousePos.x * 0.5 : 0,
      rotateX: mousePos ? -mousePos.y * 0.2 : 0,
      rotateY: mousePos ? mousePos.x * 0.2 : 0,
    }}
    exit={{ opacity: 0, scale: 0.9, y: -20 }}
    className="bg-white border border-[#E4E4E7] p-4 rounded-xl shadow-xl max-w-xs absolute z-30"
    style={{ left: '10%', top: '20%' }}
  >
    <div className="flex items-center gap-2 mb-2">
      <div className="w-2 h-2 rounded-full bg-[#CB2958]" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717A]">User Query</span>
    </div>
    <p className="text-sm font-medium leading-relaxed italic text-[#18181B]">
      "{text}"
    </p>
  </motion.div>
);

export const SqlPanel = ({ sql, mousePos }: { sql?: string; mousePos?: MousePos }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{
      opacity: 1,
      x: mousePos ? mousePos.x * 0.3 : 0,
      y: mousePos ? mousePos.y * 0.3 : 0,
      rotateY: mousePos ? -mousePos.x * 0.1 : 0
    }}
    exit={{ opacity: 0, x: -20 }}
    className="bg-[#18181B] p-5 rounded-xl shadow-2xl absolute z-30 font-mono text-[11px] leading-relaxed w-72"
    style={{ right: '5%', top: '30%' }}
  >
    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
      <span className="text-white/40 uppercase tracking-tighter text-[9px]">Generated SQL</span>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
      </div>
    </div>
    <div className="text-white/90 whitespace-pre-wrap">
      {sql || `SELECT product_name, SUM(revenue)\nFROM orders\nGROUP BY product_name\nORDER BY revenue DESC\nLIMIT 5;`}
    </div>
  </motion.div>
);

export const ValidationBadge = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    className="absolute bottom-20 right-10 z-40 space-y-2"
  >
    {['READ ONLY', 'VALID SQL', 'SAFE TO EXECUTE'].map((text, i) => (
      <motion.div
        key={text}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: i * 0.1 }}
        className="bg-white border border-[#E4E4E7] px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#CB2958]" />
        <span className="text-[9px] font-black tracking-widest text-[#18181B]">{text}</span>
      </motion.div>
    ))}
  </motion.div>
);
