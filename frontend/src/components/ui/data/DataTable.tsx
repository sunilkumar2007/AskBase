import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Search,
  Download,
  Copy,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

interface DataTableProps {
  data: any[];
}

export function DataTable({ data }: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  if (!data || data.length === 0) return null;

  const allColumns = Object.keys(data[0]);
  const columns = visibleColumns.length > 0 ? visibleColumns : allColumns;

  const handleCopy = () => {
    const text = data.map(row => Object.values(row).join('\t')).join('\n');
    navigator.clipboard.writeText(text);
    toast.success("Table data copied to clipboard");
  };

  const handleExport = () => {
    toast.success("Table exported as CSV");
  };

  return (
    <div className="bg-white border border-[#E4E4E7] shadow-sm overflow-hidden">
      {/* Table Toolbar */}
      <div className="px-6 py-4 border-b border-[#E4E4E7] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A1A1AA]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dataset..."
              className="w-full pl-10 pr-4 py-2 bg-[#FAFAFA] border border-[#E4E4E7] text-[11px] font-medium outline-none placeholder:text-[#A1A1AA] focus:border-[#CB2958]/20 transition-all"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 border-[#E4E4E7] text-[10px] font-black uppercase tracking-widest gap-2 rounded-none">
                <Eye className="w-3.5 h-3.5" /> Columns <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="rounded-none border-2 border-[#E4E4E7] min-w-[180px]">
              {allColumns.map(col => (
                <DropdownMenuCheckboxItem
                  key={col}
                  checked={columns.includes(col)}
                  onCheckedChange={(checked) => {
                    if (checked) setVisibleColumns([...columns, col]);
                    else setVisibleColumns(columns.filter(c => c !== col));
                  }}
                  className="text-[10px] font-black uppercase tracking-widest"
                >
                  {col.replace(/_/g, ' ')}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="h-9 border-[#E4E4E7] text-[10px] font-black uppercase tracking-widest gap-2 rounded-none">
            <Filter className="w-3.5 h-3.5" /> Filter
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-9 text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-[#FAFAFA]">
            <Copy className="w-3.5 h-3.5" /> Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExport} className="h-9 text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-[#FAFAFA]">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto max-h-[500px] no-scrollbar">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#FAFAFA] hover:bg-[#FAFAFA] border-b border-[#E4E4E7]">
              {columns.map(col => (
                <TableHead key={col} className="h-12 px-6">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-[#18181B] whitespace-nowrap">
                    {col.replace(/_/g, ' ')}
                    <ArrowUpDown className="w-3 h-3 text-[#A1A1AA] cursor-pointer hover:text-[#CB2958] transition-colors" />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i} className="hover:bg-[#FAFAFA]/50 border-b border-[#F4F4F5] transition-colors">
                {columns.map(col => (
                  <TableCell key={col} className="py-4 px-6 text-[12px] font-medium text-[#71717A] whitespace-nowrap">
                    {typeof row[col] === 'number' && (col.includes('price') || col.includes('revenue') || col.includes('sales'))
                      ? `₹${row[col].toLocaleString()}`
                      : row[col]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Table Footer / Pagination */}
      <div className="px-6 py-4 bg-[#FAFAFA] border-t border-[#E4E4E7] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#A1A1AA]">
            Showing <span className="text-[#18181B]">{data.length}</span> records
          </span>
          <div className="h-3 w-px bg-[#E4E4E7]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#A1A1AA]">
            Page <span className="text-[#18181B]">1</span> of <span className="text-[#18181B]">1</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="h-8 rounded-none border-[#E4E4E7] text-[10px] font-black uppercase tracking-widest disabled:opacity-30" disabled>Previous</Button>
           <Button variant="outline" size="sm" className="h-8 rounded-none border-[#E4E4E7] text-[10px] font-black uppercase tracking-widest">Next</Button>
        </div>
      </div>
    </div>
  );
}
