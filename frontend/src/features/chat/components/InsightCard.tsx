import React from 'react';
import { Lightbulb, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InsightCardProps {
  title: string;
  content: string;
  metric?: string;
  trend?: 'up' | 'down' | 'neutral';
  whyItMatters?: string;
  nextQuestion?: string;
  onNextQuestionClick?: (question: string) => void;
}

export function InsightCard({
  title,
  content,
  metric,
  trend,
  whyItMatters = "Order value increased faster than order volume, signaling healthy market positioning.",
  nextQuestion = "Want me to compare this with last quarter?",
  onNextQuestionClick
}: InsightCardProps) {
  return (
    <div className="bg-white border border-[#E4E4E7] p-8 space-y-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4">
        <Lightbulb className="w-16 h-16 text-[#CB2958]/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
      </div>

      <div className="space-y-4 relative">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#CB2958]">WHAT THE DATA SAYS</span>
          <h4 className="text-sm font-black uppercase tracking-tight text-[#18181B]">{title}</h4>
        </div>

        <div className="space-y-2">
          <p className="text-xl font-medium leading-relaxed tracking-tight text-[#18181B] pr-12">
            {content}
          </p>
          {metric && (
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black tracking-tighter text-[#18181B]">{metric}</span>
              {trend === 'up' && <TrendingUp className="w-5 h-5 text-green-500" />}
              {trend === 'down' && <TrendingDown className="w-5 h-5 text-red-500" />}
            </div>
          )}
        </div>

        <div className="pt-4 space-y-2 border-t border-[#F4F4F5]">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#A1A1AA]">WHY IT MATTERS</span>
          <p className="text-xs text-[#71717A] leading-relaxed font-medium">
            {whyItMatters}
          </p>
        </div>

        {nextQuestion && (
          <div className="pt-4">
            <Button
              variant="ghost"
              onClick={() => onNextQuestionClick?.(nextQuestion)}
              className="p-0 h-auto text-[10px] font-black uppercase tracking-widest text-[#CB2958] hover:text-[#CB2958] hover:bg-transparent group/btn"
            >
              <span className="mr-2">NEXT QUESTION: "{nextQuestion}"</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
