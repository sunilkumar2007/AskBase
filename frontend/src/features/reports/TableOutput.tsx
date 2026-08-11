import React from 'react';
import {
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  FileJson,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';
import { DataTable } from "@/components/data/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TableOutputProps {
  data: any[];
  title: string;
}

export function TableOutput({ data, title }: TableOutputProps) {
  const handleExport = (type: string) => {
    toast.info(`Exporting as ${type}...`);
    setTimeout(() => {
      toast.success(`${type} export complete.`);
    }, 1000);
  };

  return (
    <div className="flex flex-col">
      <div className="p-6 border-b border-[#E4E4E7] flex items-center justify-between">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#111111]">{title}</h4>
          <p className="text-[9px] font-bold text-[#A1A1AA] uppercase tracking-widest mt-0.5">{data.length} Rows</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" size={12} />
            <Input
              placeholder="SEARCH DATA..."
              className="h-9 w-48 pl-9 rounded-none border-2 border-[#E4E4E7] text-[9px] font-bold tracking-widest bg-transparent focus-visible:ring-0 focus-visible:border-[#CB2958]/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-1">
             <Tooltip>
               <TooltipTrigger asChild>
                 <button className="p-2 text-[#71717A] hover:text-[#111111] transition-colors">
                   <Filter size={14} />
                 </button>
               </TooltipTrigger>
               <TooltipContent>Filter Columns</TooltipContent>
             </Tooltip>
             <Tooltip>
               <TooltipTrigger asChild>
                 <button className="p-2 text-[#71717A] hover:text-[#111111] transition-colors">
                   <Eye size={14} />
                 </button>
               </TooltipTrigger>
               <TooltipContent>Column Visibility</TooltipContent>
             </Tooltip>
          </div>
        </div>
      </div>

      <div className="max-h-[400px] overflow-auto">
        <DataTable data={data} />
      </div>

      <div className="p-4 border-t border-[#E4E4E7] bg-[#FAFAFA] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center border border-[#E4E4E7] bg-white text-[#A1A1AA] hover:text-[#111111] transition-all">
            <ChevronLeft size={14} />
          </button>
          <span className="text-[9px] font-black tracking-widest text-[#111111] px-2">PAGE 1 OF 1</span>
          <button className="w-8 h-8 flex items-center justify-center border border-[#E4E4E7] bg-white text-[#A1A1AA] hover:text-[#111111] transition-all">
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('CSV')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E4E4E7] text-[9px] font-black uppercase tracking-widest text-[#71717A] hover:text-[#CB2958] hover:border-[#CB2958]/20 transition-all"
          >
            <FileSpreadsheet size={12} />
            CSV
          </button>
          <button
            onClick={() => handleExport('EXCEL')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E4E4E7] text-[9px] font-black uppercase tracking-widest text-[#71717A] hover:text-[#CB2958] hover:border-[#CB2958]/20 transition-all"
          >
            <FileSpreadsheet size={12} />
            EXCEL
          </button>
          <button
            onClick={() => handleExport('JSON')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E4E4E7] text-[9px] font-black uppercase tracking-widest text-[#71717A] hover:text-[#CB2958] hover:border-[#CB2958]/20 transition-all"
          >
            <FileJson size={12} />
            JSON
          </button>
        </div>
      </div>
    </div>
  );
}
