import React, { useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Copy,
  Download,
  Maximize2,
  Plus,
  Save,
  Info,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

interface ChartRendererProps {
  type: 'bar' | 'line' | 'pie' | 'scatter';
  data: any[];
  xKey?: string;
  yKey?: string;
  title?: string;
  explanation?: string;
}

export function ChartRenderer({ type, data, xKey, yKey, title, explanation }: ChartRendererProps) {
  const chartRef = useRef<any>(null);

  const getOptions = () => {
    const isHorizontal = type === 'bar';

    const baseOptions = {
      backgroundColor: 'transparent',
      animationDuration: 2000,
      animationEasing: 'cubicOut',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        borderWidth: 1,
        textStyle: { color: 'var(--foreground)', fontSize: 10, fontWeight: 'bold' },
        padding: [8, 12],
        borderRadius: 12,
      },
      grid: {
        top: 20,
        right: 20,
        bottom: 40,
        left: 50,
        containLabel: true
      },
    };

    if (type === 'bar' || type === 'line') {
      return {
        ...baseOptions,
        xAxis: {
          type: 'category',
          data: data.map(d => d[xKey || 'name']),
          axisLine: { lineStyle: { color: 'var(--border)' } },
          axisLabel: { color: 'var(--muted-foreground)', fontSize: 9, fontWeight: 'bold' }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          splitLine: { lineStyle: { color: 'var(--border)', type: 'dashed' } },
          axisLabel: { color: 'var(--muted-foreground)', fontSize: 9, fontWeight: 'bold' }
        },
        series: [{
          data: data.map(d => d[yKey || 'value']),
          type: type,
          smooth: type === 'line',
          showSymbol: type === 'line',
          symbolSize: 8,
          itemStyle: {
            color: '#CB2958',
            borderRadius: type === 'bar' ? [12, 12, 0, 0] : 0
          },
          lineStyle: { width: 3, color: '#CB2958' },
          areaStyle: type === 'line' ? {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{ offset: 0, color: '#CB295822' }, { offset: 1, color: '#CB295800' }]
            }
          } : undefined,
          animationDelay: (idx: number) => idx * 100,
        }]
      };
    }

    if (type === 'pie') {
      return {
        ...baseOptions,
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 12, borderColor: 'var(--card)', borderWidth: 2 },
          label: { show: false },
          emphasis: { label: { show: true, fontSize: 12, fontWeight: 'bold' } },
          data: data.map(d => ({ value: d[yKey || 'value'], name: d[xKey || 'name'] })),
          color: ['#CB2958', 'var(--primary)', 'var(--muted-foreground)', 'var(--border)', 'var(--muted)'],
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: (idx: number) => idx * 200,
        }]
      };
    }

    return baseOptions;
  };

  const handleCopy = () => {
    toast.success("Chart configuration copied");
  };

  const handleExport = () => {
    const imgData = chartRef.current?.getEchartsInstance().getDataURL({
      pixelRatio: 2,
      backgroundColor: 'var(--background)'
    });
    const link = document.createElement('a');
    link.download = `${title || 'chart'}.png`;
    link.href = imgData;
    link.click();
    toast.success("Chart exported as PNG");
  };

  return (
    <div className="bg-card border border-border p-8 space-y-8 group relative rounded-[40px]">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          {title && <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">{title}</h3>}
          {explanation && (
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              <Info className="w-3 h-3 text-primary" />
              {explanation}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy} title="Copy Configuration">
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleExport} title="Export as Image">
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Add to Dashboard">
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-none border-2 border-[#E4E4E7]">
              <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Save to Project</DropdownMenuItem>
              <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Fullscreen View</DropdownMenuItem>
              <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest cursor-pointer text-[#CB2958]">Delete Chart</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="h-full min-h-[250px] w-full">
        <ReactECharts
          ref={chartRef}
          option={getOptions()}
          style={{ height: '100%', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    </div>
  );
}
