import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Zap,
  Database,
  Bell,
  Eye,
  Mic,
  Globe,
  Lock,
  LogOut,
  Trash2,
  ChevronRight,
  Check
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from '@tanstack/react-router';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const {
    showSQL,
    setShowSQL,
    autoVisualization,
    setAutoVisualization,
    theme,
    setTheme
  } = useSettingsStore();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Log out of AskBase?")) {
      logout();
      toast.success("Successfully logged out.");
      navigate({ to: '/login' });
    }
  };

  const sections = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'appearance', label: 'Appearance', icon: Eye },
    { id: 'intelligence', label: 'Intelligence', icon: Zap },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'data', label: 'Data Sources', icon: Database },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">Settings</h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            Configure your intelligence workspace, neural engine preferences, and security protocols.
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex gap-16">
          <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-2 w-64 shrink-0">
            {sections.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className={cn(
                  "flex items-center gap-4 w-full justify-start rounded-full px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-transparent",
                  activeTab === section.id
                    ? "bg-foreground text-background"
                    : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <section.icon size={16} />
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 min-w-0 pb-32">
            <TabsContent value="general" className="mt-0 space-y-12">
              <section className="space-y-8">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground border-b border-border pb-4">Workspace Preferences</h3>
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Auto-Save Reports</p>
                      <p className="text-[10px] font-medium text-muted-foreground mt-1">Automatically save all generated artifacts to the current project.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Desktop Notifications</p>
                      <p className="text-[10px] font-medium text-muted-foreground mt-1">Receive alerts when long-running queries complete.</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0 space-y-12">
              <section className="space-y-8">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground border-b border-border pb-4">Visual Theme</h3>
                <div className="grid grid-cols-3 gap-6">
                  {['Light', 'Dark', 'System'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t.toLowerCase() as any)}
                      className={cn(
                        "p-6 border-2 flex flex-col items-center gap-4 transition-all group rounded-[32px]",
                        theme === t.toLowerCase() ? "border-foreground" : "border-border hover:border-primary/20"
                      )}
                    >
                      <div className={cn(
                        "w-full aspect-video border border-border rounded-xl",
                        t === 'Light' ? 'bg-white' : t === 'Dark' ? 'bg-foreground' : 'bg-gradient-to-br from-white to-foreground'
                      )} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{t} Mode</span>
                      {theme === t.toLowerCase() && <Check size={14} className="text-primary" />}
                    </button>
                  ))}
                </div>
              </section>
            </TabsContent>

            <TabsContent value="intelligence" className="mt-0 space-y-12">
              <section className="space-y-8">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground border-b border-border pb-4">Neural Engine</h3>
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Transparent SQL</p>
                      <p className="text-[10px] font-medium text-muted-foreground mt-1">Show the underlying SQL query for every natural language request.</p>
                    </div>
                    <Switch checked={showSQL} onCheckedChange={setShowSQL} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Auto Visualization</p>
                      <p className="text-[10px] font-medium text-muted-foreground mt-1">Automatically generate charts when the data structure allows.</p>
                    </div>
                    <Switch checked={autoVisualization} onCheckedChange={setAutoVisualization} />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Default Chart Engine</p>
                    <Select defaultValue="echarts">
                      <SelectTrigger className="rounded-full border-2 border-border h-12 text-[10px] font-black uppercase tracking-widest px-6">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="echarts" className="text-[10px] font-black uppercase tracking-widest">ECharts (Standard)</SelectItem>
                        <SelectItem value="d3" className="text-[10px] font-black uppercase tracking-widest">D3.js (Advanced)</SelectItem>
                        <SelectItem value="canvas" className="text-[10px] font-black uppercase tracking-widest">Raw Canvas (Performance)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="voice" className="mt-0 space-y-12">
              <section className="space-y-8">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground border-b border-border pb-4">Voice Synthesis</h3>
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Enable Voice Mode</p>
                      <p className="text-[10px] font-medium text-muted-foreground mt-1">Allow audio-based interaction with the intelligence core.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Audio Visualization</p>
                      <p className="text-[10px] font-medium text-muted-foreground mt-1">Show real-time waveforms during voice interaction.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="account" className="mt-0 space-y-12">
              <section className="space-y-8">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground border-b border-border pb-4">Management</h3>
                <div className="space-y-8">
                  <div className="p-8 border-2 border-border rounded-[40px] space-y-6">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-foreground">Danger Zone</p>
                      <p className="text-[10px] font-medium text-muted-foreground mt-1">Destructive actions cannot be reversed.</p>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="rounded-full border-2 border-border hover:border-foreground text-[9px] font-black uppercase tracking-widest px-8"
                      >
                        <LogOut size={14} className="mr-2" />
                        Log Out
                      </Button>
                      <Button
                        variant="destructive"
                        className="rounded-full bg-red-500 hover:bg-red-600 text-[9px] font-black uppercase tracking-widest px-8"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
