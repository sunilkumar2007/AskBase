import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Mic, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const COMMANDS = [
  { id: 'chart', label: '@chart', desc: 'Generate chart' },
  { id: 'table', label: '@table', desc: 'Generate table' },
  { id: 'sql', label: '@sql', desc: 'Show SQL' },
  { id: 'diagram', label: '@diagram', desc: 'Create diagram' },
  { id: 'flow', label: '@flow', desc: 'Create flow' },
  { id: 'insight', label: '@insight', desc: 'Explain data' },
  { id: 'report', label: '@report', desc: 'Build report' },
  { id: 'schema', label: '@schema', desc: 'Explore schema' },
  { id: 'source', label: '@source', desc: 'Select data source' },
];

export function SmartChatInput({ onSend, isProcessing, onVoiceTrigger }: { onSend: (text: string, chips: string[]) => void, isProcessing: boolean, onVoiceTrigger?: () => void }) {
  const [value, setValue] = useState('');
  const [chips, setChips] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const addChip = (label: string) => {
    if (!chips.includes(label)) {
      setChips([...chips, label]);
    }
    // Remove the @trigger from text
    const words = value.split(' ');
    words.pop();
    setValue(words.join(' ') + (words.length > 0 ? ' ' : ''));
    setShowAutocomplete(false);
    inputRef.current?.focus();
  };

  const handleSend = () => {
    if ((!value.trim() && chips.length === 0) || isProcessing) return;
    onSend(value, chips);
    setValue('');
    setChips([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showAutocomplete) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % COMMANDS.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + COMMANDS.length) % COMMANDS.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const command = COMMANDS[selectedIndex];
        if (command) {
          addChip(command.label);
        }
      } else if (e.key === 'Escape') {
        setShowAutocomplete(false);
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setValue(val);

    // Check for @ trigger
    const lastWord = val.split(' ').pop() || '';
    if (lastWord.startsWith('@')) {
      setShowAutocomplete(true);
    } else {
      setShowAutocomplete(false);
    }
  };

  const removeChip = (label: string) => {
    setChips(chips.filter(c => c !== label));
  };

  return (
    <div className="relative max-w-4xl mx-auto w-full">
      <AnimatePresence>
        {showAutocomplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 w-64 bg-white border border-[#E4E4E7] shadow-xl rounded-xl mb-4 overflow-hidden z-50"
          >
            {COMMANDS.map((cmd, i) => (
              <button
                key={cmd.id}
                onClick={() => addChip(cmd.label)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 text-left transition-colors",
                  i === selectedIndex ? "bg-[#CB2958]/5 text-[#CB2958]" : "hover:bg-[#FAFAFA] text-[#71717A]"
                )}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">{cmd.label}</span>
                <span className="text-[9px] font-medium opacity-60">{cmd.desc}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn(
        "relative bg-card border-2 border-border transition-all shadow-xl shadow-black/[0.02] rounded-[40px] overflow-hidden",
        isProcessing ? "opacity-50 pointer-events-none" : "focus-within:border-primary/30"
      )}>
        <div className="flex flex-wrap items-center gap-2 p-4 pb-0">
          <input
            type="file"
            id="resource-upload"
            className="hidden"
            multiple
            onChange={(e) => {
              if (e.target.files?.length) {
                toast.success(`${e.target.files.length} resources staged.`);
              }
            }}
          />
          <button
            onClick={() => document.getElementById('resource-upload')?.click()}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all mr-2"
          >
            <Plus size={20} />
          </button>
          {chips.map(chip => (
            <span key={chip} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#CB2958]/5 text-[#CB2958] text-[9px] font-black uppercase tracking-widest border border-[#CB2958]/20 rounded-full">
              {chip}
              <X size={10} className="cursor-pointer hover:scale-125 transition-transform" onClick={() => removeChip(chip)} />
            </span>
          ))}
        </div>

        <textarea
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={chips.length > 0 ? "" : "Ask anything about your data..."}
          className="w-full h-24 p-6 text-sm font-medium text-foreground placeholder:text-muted-foreground resize-none outline-none bg-transparent"
        />

        <div className="flex items-center justify-between p-4 pt-0">
          <button
            onClick={onVoiceTrigger}
            className="flex items-center gap-2 px-6 py-2 text-muted-foreground hover:text-primary transition-colors bg-muted/50 rounded-full"
          >
            <Mic size={16} />
            <span className="text-[9px] font-black uppercase tracking-widest">Voice</span>
          </button>
          <button
            onClick={handleSend}
            disabled={!value.trim() && chips.length === 0}
            className="flex items-center gap-2 px-8 py-3 bg-foreground hover:bg-primary disabled:opacity-50 disabled:hover:bg-foreground text-background text-[10px] font-black uppercase tracking-widest transition-all rounded-full"
          >
            <span>Send</span>
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
