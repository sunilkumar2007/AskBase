import React from 'react';
import {
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Target,
  MessageSquarePlus,
  Share2
} from 'lucide-react';
import { toast } from "sonner";
import { useChatStore } from '@/stores/useChatStore';

interface InsightOutputProps {
  what: string;
  why: string;
  nextQuestion?: string;
}

export function InsightOutput({ what, why, nextQuestion }: InsightOutputProps) {
  const addMessage = useChatStore((state) => state.addMessage);

  const handleSuggestionClick = () => {
    if (nextQuestion) {
      addMessage({
        role: 'user',
        content: nextQuestion,
        type: 'text'
      });
      toast.info("Opening new analysis...");
    }
  };

  return (
    <div className="flex flex-col bg-white">
      <div className="p-8 border-b border-[#E4E4E7]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 flex items-center justify-center bg-[#CB2958]/5 text-[#CB2958]">
            <Lightbulb size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#111111]">Semantic Intelligence</span>
        </div>

        <div className="space-y-10">
          <section className="space-y-4">
            <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#A1A1AA]">WHAT THE DATA SAYS</h5>
            <div className="flex gap-4">
              <div className="w-1 bg-[#CB2958] shrink-0" />
              <p className="text-lg font-medium tracking-tight leading-relaxed text-[#111111]">
                {what}
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#A1A1AA]">WHY IT MATTERS</h5>
            <div className="flex gap-4">
              <div className="w-1 bg-[#111111] shrink-0" />
              <p className="text-sm font-medium leading-relaxed text-[#71717A]">
                {why}
              </p>
            </div>
          </section>

          {nextQuestion && (
            <section className="pt-6 border-t border-[#E4E4E7]">
              <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#A1A1AA] mb-4">SUGGESTED FOLLOW-UP</h5>
              <button
                onClick={handleSuggestionClick}
                className="w-full p-6 border-2 border-[#E4E4E7] hover:border-[#CB2958] group transition-all text-left flex items-center justify-between"
              >
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#111111] mb-1">Deep Dive</p>
                  <p className="text-sm font-medium text-[#71717A] group-hover:text-[#111111] transition-colors">{nextQuestion}</p>
                </div>
                <div className="w-10 h-10 flex items-center justify-center border border-[#E4E4E7] group-hover:bg-[#CB2958] group-hover:border-[#CB2958] group-hover:text-white transition-all">
                  <ArrowRight size={16} />
                </div>
              </button>
            </section>
          )}
        </div>
      </div>

      <div className="p-4 bg-[#FAFAFA] flex justify-end gap-4">
        <button className="text-[9px] font-black uppercase tracking-widest text-[#71717A] hover:text-[#111111] flex items-center gap-2 transition-colors">
          <Share2 size={12} />
          Share Insight
        </button>
        <button className="text-[9px] font-black uppercase tracking-widest text-[#71717A] hover:text-[#CB2958] flex items-center gap-2 transition-colors">
          <MessageSquarePlus size={12} />
          Add to Report
        </button>
      </div>
    </div>
  );
}
