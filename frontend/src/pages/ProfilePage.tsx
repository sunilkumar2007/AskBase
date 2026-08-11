import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Save,
  User,
  Mail,
  Shield,
  Briefcase,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Zap,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const stats = [
    { label: 'Workspaces', value: '4', icon: Briefcase },
    { label: 'Intelligence Chats', value: '142', icon: MessageSquare },
    { label: 'Insights Generated', value: '86', icon: Zap },
    { label: 'Favorite Reports', value: '12', icon: Star }
  ];

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      toast.success("Profile updated.");
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-12 bg-background">
      <div className="max-w-5xl mx-auto space-y-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 border-2 border-foreground bg-muted rounded-[32px] flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-[#A1A1AA]" />
                )}
              </div>
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    toast.success("Avatar updated.");
                  }
                }}
              />
              <button
                onClick={() => document.getElementById('avatar-upload')?.click()}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all group-hover:scale-110 shadow-lg"
              >
                <Camera size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">{user?.name || 'Researcher'}</h1>
              <p className="text-muted-foreground text-lg font-medium tracking-tight">Intelligence Lead • Enterprise Core</p>
              <div className="flex items-center gap-4 pt-2">
                <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-primary/5 text-primary border border-primary/20 rounded-full">Pro Member</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">ID: 942-ASK-01</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={isLoading}
            className="rounded-full bg-foreground hover:bg-primary text-background px-8 h-12 text-[10px] font-black uppercase tracking-widest transition-all"
          >
            {isLoading ? 'Processing...' : isEditing ? <><Save size={16} className="mr-2" /> Save Profile</> : 'Edit Profile'}
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="p-8 border border-border rounded-[32px] space-y-4 hover:border-primary/20 transition-all group bg-card">
              <stat.icon size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-foreground tracking-tighter mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground border-b border-border pb-4">General Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Full Name</label>
                  <Input
                    defaultValue={user?.name}
                    disabled={!isEditing}
                    className="rounded-full border-2 border-border focus-visible:border-primary/30 h-12 text-sm font-medium transition-all bg-card px-6"

                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Email Address</label>
                  <Input
                    defaultValue={user?.email}
                    disabled={!isEditing}
                    className="rounded-full border-2 border-border focus-visible:border-primary/30 h-12 text-sm font-medium transition-all bg-card px-6"
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Bio / Mission</label>
                  <Textarea
                    placeholder="Describe your focus area..."
                    disabled={!isEditing}
                    className="rounded-[24px] border-2 border-border focus-visible:border-primary/30 min-h-[120px] text-sm font-medium transition-all bg-card p-6"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground border-b border-border pb-4">Intelligence Activity</h3>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-6 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-primary mt-2 transition-colors" />
                    <div className="flex-1 pb-6 border-b border-[#F4F4F5]">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">Analyzed Q3 Sales Pipeline</h4>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">2 hours ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">Generated 4 charts and 1 semantic insight regarding segment growth.</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-12">
            <section className="p-8 border border-foreground bg-foreground text-background rounded-[40px] space-y-6">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Security Access</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-background/10 pb-4">
                  <span className="text-[9px] font-bold text-background/60 uppercase tracking-widest">Role</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Intelligence Lead</span>
                </div>
                <div className="flex items-center justify-between border-b border-background/10 pb-4">
                  <span className="text-[9px] font-bold text-background/60 uppercase tracking-widest">Access Level</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">L4 Semantic</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-background/60 uppercase tracking-widest">2FA</span>
                  <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">✓ Active</span>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-full border-background/20 text-background hover:bg-background hover:text-foreground text-[9px] font-black uppercase tracking-widest h-10">
                Security Settings
              </Button>
            </section>

            <section className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Active Sessions</h3>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-2xl flex items-center justify-between bg-card">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={14} className="text-primary" />
                    <div className="text-[9px] font-black uppercase tracking-widest text-foreground">MacOS • Chrome</div>
                  </div>
                  <span className="text-[8px] font-black text-green-500 uppercase">Current</span>
                </div>
                <div className="p-4 border border-border rounded-2xl flex items-center justify-between opacity-50 bg-card">
                  <div className="flex items-center gap-3">
                    <User size={14} className="text-muted-foreground" />
                    <div className="text-[9px] font-black uppercase tracking-widest text-foreground">iPhone 15 • Mobile</div>
                  </div>
                  <button className="text-[8px] font-black text-primary uppercase">Revoke</button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
