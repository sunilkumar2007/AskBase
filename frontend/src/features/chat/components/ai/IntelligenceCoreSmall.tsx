import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export function IntelligenceCoreSmall({ isProcessing }: { isProcessing?: boolean }) {
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <motion.div
        animate={{
          rotate: 360,
          scale: isProcessing ? [1, 1.2, 1] : 1
        }}
        transition={{
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity }
        }}
        className="absolute inset-0 border-2 border-[#CB2958]/20 rounded-sm"
      />
      <motion.div
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute w-4 h-4 border border-[#CB2958] rounded-sm"
      />
      <div className="w-1.5 h-1.5 bg-[#CB2958] shadow-[0_0_8px_#CB2958]" />
    </div>
  );
}
