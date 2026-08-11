import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { Sidebar } from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';
import { CommandPalette } from "@/components/ui/CommandPalette";
import VoiceMode from '@/components/ai/VoiceMode';
import { ReportPanel } from '@/components/reports/ReportPanel';
import {
  Search,
  Bell,
  Share2,
  Star,
  MoreHorizontal,
  ChevronRight,
  BarChart3,
  Settings,
  HelpCircle,
  Zap
} from 'lucide-react';
import { authService } from '@/services/auth.service';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useAuthStore } from '@/stores/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { Toaster } from "@/components/ui/sonner";

export default function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [voiceOpen, setVoiceOpen] = useState(false);
  const showReportPanel = useSettingsStore((state) => state.showReportPanel);
  const toggleReportPanel = useSettingsStore((state) => state.toggleReportPanel);
  const location = useLocation();

  const pathParts = location.pathname.split('/').filter(Boolean).slice(1);
  const firstPart = pathParts[0] || 'Overview';
  const pageTitle = firstPart.charAt(0).toUpperCase() + firstPart.slice(1);


  return (
    <TooltipProvider>
      <div className={cn(
        "flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary/10 selection:text-primary",
        useSettingsStore.getState().theme === 'dark' ? 'dark' : ''
      )}>
        <Sidebar />

        <motion.div
          animate={{
            paddingRight: showReportPanel ? 420 : 0
          }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="flex-1 flex flex-col relative overflow-hidden"
        >
          {/* Topbar */}
          <header className="h-20 border-b border-border flex items-center justify-between px-8 bg-background/80 backdrop-blur-md z-30 shrink-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span>App</span>
                <ChevronRight size={10} />
                <span className="text-foreground">{pageTitle}</span>
              </div>

              {authService.isDemoMode() && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full">
                  <Zap size={10} className="text-primary fill-primary" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary">Demo Mode</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Search size={18} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Search (⌘K)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate({ to: '/app/notifications' as any })}
                    className="text-muted-foreground hover:text-foreground transition-colors relative"
                  >
                    <Bell size={18} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>

              <div className="h-8 w-[1px] bg-border" />

              {location.pathname.includes('/chat') && (
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                        <Star size={18} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Favorite Chat</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Share2 size={18} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Share Analysis</TooltipContent>
                  </Tooltip>
                </div>
              )}

              <div className="flex items-center gap-3">
                {user?.avatar && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full border border-border cursor-pointer hover:border-primary transition-colors"
                      />
                    </TooltipTrigger>
                    <TooltipContent>User Profile</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 flex flex-col relative overflow-hidden">
            <Outlet />
          </main>

          <VoiceMode isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
          <CommandPalette />
          <Toaster position="bottom-right" theme={useSettingsStore.getState().theme === 'dark' ? 'dark' : 'light'} />
        </motion.div>

        <AnimatePresence>
          {showReportPanel && <ReportPanel />}
        </AnimatePresence>
      </div>
    </TooltipProvider>

  );
}
