import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, Database, MessageSquare, Star, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/stores/useChatStore';
import { useProjectStore } from '@/stores/useProjectStore';
import { useNavigate } from '@tanstack/react-router';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const history = useChatStore((state) => state.history);
  const projects = useProjectStore((state) => state.projects);
  const navigate = useNavigate();

  const filteredHistory = history.filter(chat =>
    chat.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(query.toLowerCase()) ||
    project.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-12 bg-background">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">Intelligence Search</h1>
          <p className="text-muted-foreground text-lg font-medium leading-relaxed">
            Retrieve context from past conversations, project data, and strategic reports.
          </p>
        </header>

        <div className="relative group">
          <div className="absolute inset-0 bg-primary/5 rounded-[40px] blur-xl transition-all group-hover:blur-2xl" />
          <div className="relative flex items-center bg-card border border-border rounded-[40px] px-8 py-2 shadow-sm focus-within:border-primary transition-all">
            <Search className="text-muted-foreground mr-4" size={24} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH EVERYTHING..."
              className="border-none bg-transparent h-16 text-lg font-bold tracking-tight focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="space-y-12">
          {/* Projects Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Workspaces ({filteredProjects.length})</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {filteredProjects.length > 0 ? filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ x: 8 }}
                  className="group flex items-center justify-between p-6 bg-card border border-border rounded-[32px] hover:border-primary transition-all cursor-pointer"
                  onClick={() => navigate({ to: '/app/projects' })}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-all">
                      <Database size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-foreground uppercase tracking-wider">{project.name}</h3>
                      <p className="text-xs text-muted-foreground font-medium">{project.description}</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                </motion.div>
              )) : (
                <div className="p-8 text-center border-2 border-dashed border-border rounded-[32px]">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No matching projects</p>
                </div>
              )}
            </div>
          </section>

          {/* Conversations Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Recent Analysis ({filteredHistory.length})</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {filteredHistory.length > 0 ? filteredHistory.map((chat) => (
                <motion.div
                  key={chat.id}
                  whileHover={{ x: 8 }}
                  className="group flex items-center justify-between p-6 bg-card border border-border rounded-[32px] hover:border-primary transition-all cursor-pointer"
                  onClick={() => navigate({ to: '/app/chat' })}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-foreground uppercase tracking-wider">{chat.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{chat.date}</span>
                        {chat.isFavorite && <Star size={10} className="fill-primary text-primary" />}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                </motion.div>
              )) : (
                <div className="p-8 text-center border-2 border-dashed border-border rounded-[32px]">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No matching conversations</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
