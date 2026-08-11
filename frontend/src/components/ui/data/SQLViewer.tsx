import React, { useState } from 'react';
import { Copy, ChevronDown, ChevronUp, ShieldCheck, Terminal, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface SQLViewerProps {
  sql: string;
  isValidated?: boolean;
}

export function SQLViewer({ sql, isValidated = true }: SQLViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    toast.success("SQL copied to clipboard");
  };

  // Basic syntax highlighting simulation
  const highlightSQL = (text: string) => {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'LIMIT', 'JOIN', 'LEFT JOIN', 'ON', 'AS', 'COUNT', 'SUM', 'AVG'];
    let highlighted = text;
    keywords.forEach(word => {
      const reg = new RegExp(`\\b${word}\\b`, 'g');
      highlighted = highlighted.replace(reg, `<span class="text-[#CB2958] font-black">${word}</span>`);
    });
    return highlighted;
  };

  return (
    <div className="bg-[#18181B] border border-white/10 shadow-2xl overflow-hidden group">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#1C1C1F]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#CB2958]" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">QUERY_GENERATOR_V1</span>
          </div>
          <Badge variant="outline" className="text-[9px] font-black tracking-[0.1em] uppercase border-green-500/40 text-green-500 bg-green-500/5 rounded-none px-2 py-0.5">
            <ShieldCheck className="w-3 h-3 mr-1.5" />
            READ ONLY
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-[9px] font-black text-white/60 hover:text-[#CB2958] uppercase tracking-widest gap-2 rounded-none px-3"
            onClick={() => toast.info("AI Explanation: This query calculates product performance by joining orders with categories.")}
          >
            <HelpCircle className="h-3.5 w-3.5" /> Explain SQL
          </Button>
          <div className="h-4 w-px bg-white/10 mx-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white" onClick={handleCopy}>
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className={cn(
        "p-6 font-mono text-[13px] leading-relaxed text-white/90 bg-[#18181B] overflow-x-auto selection:bg-[#CB2958]/30 transition-all duration-500 ease-in-out",
        isExpanded ? "max-h-[600px]" : "max-h-[120px]"
      )}>
        <pre
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: highlightSQL(sql) }}
        />
      </div>

      {!isExpanded && (
        <div className="h-8 bg-gradient-to-t from-[#18181B] to-transparent pointer-events-none -mt-8 relative z-10" />
      )}

      <div className="px-6 py-2 border-t border-white/5 bg-[#1C1C1F] flex items-center justify-between">
        <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">Engine: AskBase Neural v4.2</span>
        <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">Safe Mode: ACTIVE</span>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
