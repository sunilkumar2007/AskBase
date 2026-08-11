import React, { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { ChartRenderer } from "@/components/charts/ChartRenderer";
import { mockQueryResult } from "@/lib/mock-data";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function DashboardPage() {
  const [activeRange, setActiveRange] = useState('Last 30 Days');

  const kpis = [
    { label: 'Total Revenue', value: '$4.2M', trend: '+12.5%', isUp: true, icon: DollarSign },
    { label: 'Active Users', value: '18.4K', trend: '+8.2%', isUp: true, icon: Users },
    { label: 'Avg Order Value', value: '$242', trend: '-2.4%', isUp: false, icon: ShoppingBag },
    { label: 'Conversion Rate', value: '3.8%', trend: '+0.5%', isUp: true, icon: Activity },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-12 bg-background">
      <header className="flex items-end justify-between">
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight text-foreground">Intelligence Dashboard</h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium leading-relaxed">
            Real-time visual synthesis of your production data. Neural insights updated every 60 seconds.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 p-1 bg-muted rounded-full border border-border">
            {['Last 7 Days', 'Last 30 Days', 'Last 90 Days'].map((range) => (
              <Button
                key={range}
                variant="ghost"
                onClick={() => {
                  setActiveRange(range);
                  toast.info(`Retreiving data for ${range}...`);
                }}
                className={cn(
                  "rounded-full h-10 px-6 text-[10px] font-black uppercase tracking-widest transition-all",
                  range === activeRange ? "bg-background text-foreground shadow-sm hover:bg-background" : "text-muted-foreground hover:bg-transparent hover:text-foreground"
                )}
              >
                {range}
              </Button>
            ))}
          </div>
          <Button variant="outline" className="rounded-full h-12 px-6 text-[10px] font-black uppercase tracking-widest border-2 hover:border-primary transition-all">
            <Filter size={14} className="mr-2" />
            Filters
          </Button>
          <Button className="rounded-full bg-foreground hover:bg-primary text-primary-foreground px-8 h-12 text-[10px] font-black uppercase tracking-widest transition-all">
            <Download size={14} className="mr-2" />
            Export Report
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 border border-border bg-card rounded-[32px] space-y-4 hover:border-primary transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 border border-border rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                <kpi.icon size={18} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest",
                kpi.isUp ? "text-green-500" : "text-red-500"
              )}>
                {kpi.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{kpi.label}</p>
              <p className="text-3xl font-black text-foreground tracking-tighter mt-1">{kpi.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-[40px] border border-border bg-card p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">Revenue Growth Pipeline</h3>
            <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest">Historical View</span>
          </div>
          <div className="h-[400px]">
            <ChartRenderer
              type="line"
              data={mockQueryResult}
              xKey="name"
              yKey="sales"
              title="Monthly Performance"
            />
          </div>
        </Card>

        <Card className="rounded-[40px] border border-border bg-card p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">Segment Distribution</h3>
            <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest">Neural Mapping</span>
          </div>
          <div className="h-[400px]">
            <ChartRenderer
              type="pie"
              data={mockQueryResult}
              xKey="name"
              yKey="sales"
              title="Category Mix"
            />
          </div>
        </Card>
      </div>

      <div className="p-12 bg-foreground text-background rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em]">AskBase Intelligence Core</h3>
          <p className="text-[10px] font-medium text-background/40 uppercase tracking-widest">Analyzing anomalies in real-time production traffic...</p>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center">
            <span className="text-[14px] font-black text-primary">142ms</span>
            <span className="text-[8px] font-bold text-background/40 uppercase tracking-widest mt-1">Latency</span>
          </div>
          <div className="w-[1px] h-8 bg-background/10" />
          <div className="flex flex-col items-center">
            <span className="text-[14px] font-black text-green-500">Secure</span>
            <span className="text-[8px] font-bold text-background/40 uppercase tracking-widest mt-1">SQLGlot</span>
          </div>
          <div className="w-[1px] h-8 bg-background/10" />
          <button className="px-8 py-3 bg-background text-foreground rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all">
            Full Audit
          </button>
        </div>
      </div>
    </div>
  );
}
