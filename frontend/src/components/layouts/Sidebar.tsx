import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  LayoutDashboard,
  Search,
  PlusCircle,
  FolderKanban,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  MoreHorizontal,
  Trash2,
  Edit2
} from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useChatStore } from '@/stores/useChatStore';
import { cn } from '@/lib/utils';
import { AskBaseLogo } from '@/components/ui/AskBaseLogo';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { toast } from 'sonner';


const NAV_ITEMS = [
  { label: 'Home', icon: Home, to: '/app' },
  { label: 'Dashboard', icon: LayoutDashboard, to: '/app/dashboard' },
  { label: 'Search', icon: Search, to: '/app/search' },
  { label: 'New Chat', icon: PlusCircle, to: '/app/chat' },
  { label: 'Projects', icon: FolderKanban, to: '/app/projects' },
];

const WORKSPACE_ITEMS = [
  { label: 'Recent', icon: Clock, to: '#' },
  { label: 'Favorites', icon: Star, to: '#' },
];

export function Sidebar() {
  const isCollapsed = useSettingsStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useSettingsStore((state) => state.toggleSidebar);
  const { history, toggleFavorite, deleteChat, renameChat } = useChatStore();
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("Log out of AskBase?")) {
      logout();
      toast.success("Log out successful.");
    }
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Delete this chat?")) {
      deleteChat(id);
      toast.success("Chat deleted.");
    }
  };


  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed ? 80 : 260,
      }}
      transition={{
        duration: 0.5,
        ease: [0.32, 0.72, 0, 1]
      }}
      className="h-screen bg-card border-r border-border flex flex-col relative z-50 shadow-2xl overflow-visible"
    >
      {/* Logo Section */}
      <div className="h-20 px-6 flex items-center mb-2 overflow-hidden">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded-logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <AskBaseLogo size={36} className="rounded-xl shadow-none" />
              <span className="font-black tracking-tighter text-xl uppercase text-foreground whitespace-nowrap">AskBase</span>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="mx-auto"
            >
              <AskBaseLogo size={32} className="rounded-xl shadow-none" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 space-y-8 overflow-y-auto custom-scrollbar">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.label}
              {...item}
              isActive={location.pathname === item.to}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>

        <div className="space-y-4">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-3">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground">Recent Analysis</p>
              <Clock size={10} className="text-muted-foreground" />
            </div>
          )}
          <div className="space-y-1">
            {history.map((chat) => (
              <div key={chat.id} className="group relative">
                <Link
                  to="/app/chat"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all",
                    isCollapsed && "justify-center"
                  )}
                >
                  {!isCollapsed ? (
                    <>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black uppercase tracking-widest truncate">{chat.title}</p>
                        </div>
                        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter mt-0.5">{chat.date}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(chat.id); }}
                          className={cn("p-1 transition-colors", chat.isFavorite ? "text-primary" : "text-muted-foreground hover:text-primary")}
                        >
                          <Star size={10} fill={chat.isFavorite ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const newTitle = window.prompt("Rename chat:", chat.title);
                            if (newTitle) renameChat(chat.id, newTitle);
                          }}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit2 size={10} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                          className="p-1 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-border group-hover:bg-primary transition-colors" />
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border space-y-1 bg-card/80 backdrop-blur-md">
        <SidebarItem
          label="Settings"
          icon={Settings}
          to="/app/settings"
          isActive={location.pathname === '/app/settings'}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          label="Profile"
          icon={User}
          to="/app/profile"
          isActive={location.pathname === '/app/profile'}
          isCollapsed={isCollapsed}
        />
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-primary transition-all group",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>


      {/* Enhanced Collapse Toggle */}
      <motion.button
        onClick={toggleSidebar}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "absolute top-7 -right-4 w-8 h-8 flex items-center justify-center transition-all duration-500 z-[60] group",
          isCollapsed ? "opacity-100" : "opacity-100" // Always visible
        )}
      >
        <div className="absolute inset-0 bg-primary shadow-lg shadow-primary/20 rounded-full transition-all duration-300 group-hover:scale-110" />
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            <motion.div
              key="arrow-right"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight size={16} className="text-white relative z-10" />
            </motion.div>
          ) : (
            <motion.div
              key="arrow-left"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft size={16} className="text-white relative z-10" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visual Pulse for Visibility when collapsed */}
        {isCollapsed && (
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary rounded-full -z-10"
          />
        )}
      </motion.button>
    </motion.aside>
  );
}

function SidebarItem({ label, icon: Icon, to, isActive, isCollapsed }: any) {
  return (
    <Link
      to={to}
      className={cn(
        "relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
        isActive ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
        isCollapsed && "justify-center"
      )}
    >
      {/* Active Indicator */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      <Icon size={20} className={cn(isActive && "text-primary")} />

      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-sm font-medium"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-[#111111] text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
          {label}
        </div>
      )}
    </Link>
  );
}
