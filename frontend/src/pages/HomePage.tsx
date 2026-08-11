import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, BarChart3, Database, MessageSquare } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from '@tanstack/react-router';
import { AskBaseLogo } from '@/components/ui/AskBaseLogo';
import { toast } from 'sonner';

import VoiceMode from '@/components/ai/VoiceMode';

export function HomePage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else if (hour < 21) setGreeting('Good evening');
    else setGreeting('Good night');
  }, []);

  const handlePrompt = (prompt: string) => {
    navigate({ to: '/app/chat' });
  };

  return (
    <div className="flex-1 flex flex-col p-8 overflow-y-auto bg-background">
      <VoiceMode isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
      <div className="max-w-4xl mx-auto w-full pt-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6 mb-2"
        >
          <AskBaseLogo size={64} className="rounded-2xl shadow-lg" />
          <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground flex items-center gap-4">
            <span>{greeting}, {user?.name?.split(' ')[0]}.</span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-3 h-3 bg-primary rounded-full blur-[2px]"
            />
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-muted-foreground font-medium mb-12"
        >
          What would you like to understand today?
        </motion.p>

        <div className="relative group">
          <div className="absolute inset-0 bg-primary/5 rounded-[40px] blur-xl transition-all group-hover:blur-2xl" />
          <div className="relative bg-card border border-border rounded-[40px] p-6 shadow-sm hover:border-primary/50 transition-all">
            <textarea
              className="w-full h-32 p-4 text-sm font-medium text-foreground placeholder:text-muted-foreground resize-none outline-none bg-transparent"
              placeholder="Ask anything about your data..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handlePrompt('');
                }
              }}
            />
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="home-resource-upload"
                  className="hidden"
                  multiple
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      toast.success(`${e.target.files.length} resources staged.`);
                    }
                  }}
                />
                <button
                  onClick={() => document.getElementById('home-resource-upload')?.click()}
                  className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-full transition-all"
                >
                  <Sparkles size={16} />
                </button>
                <button
                  onClick={() => setIsVoiceOpen(true)}
                  className="px-3 py-1.5 bg-muted text-muted-foreground text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  Voice Mode
                </button>
              </div>
              <button
                onClick={() => handlePrompt('')}
                className="px-6 py-2 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-primary/90 transition-all"
              >
                Send Analysis
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[
            { icon: MessageSquare, label: 'New Chat', to: '/app/chat' },
            { icon: BarChart3, label: 'Dashboard', to: '/app/dashboard' },
            { icon: Database, label: 'Projects', to: '/app/projects' },
            { icon: Zap, label: 'Insights', to: '/app/chat' },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => navigate({ to: action.to as any })}
              className="flex items-center gap-3 p-4 bg-card border border-border rounded-[24px] hover:border-primary transition-all text-foreground hover:shadow-sm group"
            >
              <action.icon size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[9px] font-black uppercase tracking-widest">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
