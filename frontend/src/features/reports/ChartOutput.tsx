import React from 'react';
import { ChartRenderer } from "@/components/charts/ChartRenderer";
import {
  Copy,
  Download,
  Maximize2,
  Plus,
  BarChart3,
  LineChart,
  PieChart,
  Activity
} from 'lucide-react';
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ChartOutputProps {
  type: 'bar' | 'line' | 'pie' | 'scatter';
  data: any[];
  title: string;
  description?: string;
  xKey: string;
  yKey: string;
}

export function ChartOutput({ type, data, title, description, xKey, yKey }: ChartOutputProps) {
  const handleCopy = () => {
    toast.success("Chart copied to clipboard");
  };

  const handleAddToDashboard = () => {
    toast.success("Added to dashboard.");
  };

  const getIcon = () => {
    switch(type) {
      case 'line': return <LineChart size={14} />;
      case 'pie': return <PieChart size={14} />;
      case 'scatter': return <Activity size={14} />;
      default: return <BarChart3 size={14} />;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="p-6 border-b border-[#E4E4E7] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#CB2958]">{getIcon()}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#111111]">{title}</span>
          </div>
          {description && (
            <p className="text-[9px] font-medium text-[#71717A]">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={handleCopy} className="p-2 text-[#A1A1AA] hover:text-[#111111] transition-colors">
                <Copy size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Copy Image</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={handleAddToDashboard} className="p-2 text-[#A1A1AA] hover:text-[#CB2958] transition-colors">
                <Plus size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Add to Dashboard</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="p-6 h-[300px]">
        <ChartRenderer type={type} data={data} xKey={xKey} yKey={yKey} title={title} />
      </div>

      <div className="p-4 border-t border-[#E4E4E7] bg-[#FAFAFA] flex justify-end gap-2">
        <button className="text-[9px] font-black uppercase tracking-widest text-[#71717A] hover:text-[#111111] px-3 py-1.5 transition-colors">
          Fullscreen
        </button>
        <button className="text-[9px] font-black uppercase tracking-widest text-[#71717A] hover:text-[#111111] px-3 py-1.5 transition-colors">
          Export PNG
        </button>
      </div>
    </div>
  );
}
