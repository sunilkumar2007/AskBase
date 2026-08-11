import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Filter, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all');

  const notifications = [
    { id: 1, type: 'insight', title: 'Neural Insight Generated', desc: 'New revenue projection for Q4 is ready for review.', time: '2m ago', icon: Info, color: 'text-blue-500' },
    { id: 2, type: 'system', title: 'System Update', desc: 'Neural Engine upgraded to L4 Semantic Core.', time: '1h ago', icon: CheckCircle2, color: 'text-green-500' },
    { id: 3, type: 'critical', title: 'Connection Alert', desc: 'Database "Production_Main" reached 80% capacity.', time: '3h ago', icon: AlertCircle, color: 'text-red-500' },
  ];

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);

  return (
    <div className="flex-1 overflow-y-auto p-12 bg-background">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex items-end justify-between">
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">Notifications</h1>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed">
              Real-time alerts and neural insights from your data core.
            </p>
          </div>
          <div className="flex items-center gap-2 p-1 bg-muted rounded-full border border-border">
            {['all', 'insight', 'system', 'critical'].map((f) => (
              <Button
                key={f}
                variant="ghost"
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full h-10 px-6 text-[9px] font-black uppercase tracking-widest transition-all",
                  filter === f ? "bg-background text-foreground shadow-sm hover:bg-background" : "text-muted-foreground hover:bg-transparent hover:text-foreground"
                )}
              >
                {f}
              </Button>
            ))}
          </div>
        </header>

        <div className="space-y-4">
          {filtered.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-card border border-border rounded-[32px] flex items-start gap-6 hover:border-primary/30 transition-all group"
            >
              <div className={cn("w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary/10", n.color)}>
                <n.icon size={20} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">{n.title}</h3>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">{n.time}</span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">{n.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
