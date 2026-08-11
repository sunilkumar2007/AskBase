import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Volume2 } from 'lucide-react';

export default function VoiceMode({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [status, setStatus] = useState<'listening' | 'processing' | 'responding'>('listening');

  useEffect(() => {
    if (!isOpen) return;

    // Simulate interaction cycle
    const timer = setInterval(() => {
      setStatus(prev => {
        if (prev === 'listening') return 'processing';
        if (prev === 'processing') return 'responding';
        return 'listening';
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#111111]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8"
    >
      <button
        onClick={onClose}
        className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
      >
        <X size={32} strokeWidth={1} />
      </button>

      <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
        {/* Orbital Rings */}
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{
              rotate: 360,
              scale: status === 'listening' ? [1, 1.05, 1] : 1
            }}
            transition={{
              rotate: { duration: 20 + i * 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, delay: i * 0.5 }
            }}
            className="absolute inset-0 border border-primary/10 rounded-full"
          />
        ))}

        {/* AI Globe (Particle Placeholder) */}
        <div className="relative w-64 h-64">
           <motion.div
             animate={{
                scale: status === 'listening' ? [1, 1.1, 1] : 1,
                boxShadow: status === 'processing'
                  ? ["0 0 40px var(--primary)", "0 0 80px var(--primary)", "0 0 40px var(--primary)"]
                  : "0 0 20px var(--primary)"
              }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute inset-0 bg-primary rounded-full mix-blend-screen opacity-20 blur-2xl"
           />

           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-primary/30 rounded-full flex items-center justify-center">
                 <div className="w-32 h-32 border border-primary/50 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary rounded-full shadow-[0_0_30px_var(--primary)]" />
                 </div>
              </div>
           </div>

           {/* Waveforms */}
           <div className="absolute inset-x-0 -bottom-12 flex justify-center gap-1.5 h-8">
              {[...Array(24)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: status === 'listening'
                      ? [4, Math.random() * 32 + 8, 4]
                      : status === 'responding'
                        ? [4, Math.random() * 24 + 4, 4]
                        : 4
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.05
                  }}
                  className="w-1 bg-primary/40 rounded-full"
                />
              ))}
           </div>
        </div>
      </div>

      <div className="mt-24 text-center space-y-6">
        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">
          {status === 'listening' ? 'Listening...' : status === 'processing' ? 'Thinking...' : 'Responding...'}
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter max-w-md">
          {status === 'listening'
            ? 'What is the revenue contribution by segment?'
            : status === 'processing'
              ? 'Analyzing Sales Database...'
              : 'Synthesizing performance report for Q4.'}
        </h2>
        <div className="flex items-center justify-center gap-8 pt-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all cursor-pointer">
              <Mic size={20} />
            </div>
            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Mute</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all cursor-pointer">
              <Volume2 size={20} />
            </div>
            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Audio</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
