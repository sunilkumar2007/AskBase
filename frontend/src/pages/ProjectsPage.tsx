import React from 'react';
import { motion } from 'framer-motion';
import {
  FolderPlus,
  Search,
  MoreHorizontal,
  Star,
  Share2,
  Trash2,
  Database,
  MessageSquare,
  Clock,
  Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjectStore } from '@/stores/useProjectStore';
import { toast } from 'sonner';

export default function ProjectsPage() {
  const { projects, toggleFavorite, deleteProject, addProject } = useProjectStore();

  const handleNewProject = () => {
    const name = window.prompt("Project Name:");
    if (!name) return;
    const description = window.prompt("Project Description:");

    addProject({
      name,
      description: description || "New collaborative workspace.",
      chatsCount: 0,
      sourcesCount: 0,
      isFavorite: false,
    });
    toast.success("Project workspace created.");
  };

  return (
    <div className="flex-1 overflow-y-auto p-12 bg-background relative">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex items-end justify-between">
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">Projects</h1>
            <p className="text-muted-foreground text-lg max-w-2xl font-medium leading-relaxed">
              Persistent workspaces for focused data intelligence. Each project maintains its own context, sources, and reports.
            </p>
          </div>
          <Button
            onClick={handleNewProject}
            className="rounded-full bg-foreground hover:bg-primary text-background px-8 h-12 text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <FolderPlus size={16} className="mr-2" />
            New Project
          </Button>
        </header>

        <div className="flex items-center gap-6 py-8 border-y border-border">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="SEARCH PROJECTS..."
              className="pl-14 h-14 rounded-full border-2 border-border text-[10px] font-black tracking-widest bg-card focus-visible:ring-0 focus-visible:border-primary/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black tracking-widest text-muted-foreground">
            <span className="text-foreground">ALL PROJECTS</span>
            <span>FAVORITES</span>
            <span>SHARED</span>
            <span>ARCHIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group border border-border bg-card p-8 rounded-[40px] space-y-8 hover:border-primary transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 border-2 border-foreground rounded-2xl flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-all">
                   <Database size={20} />
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(project.id); }}
                    className={`p-2 transition-colors ${project.isFavorite ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Star size={16} fill={project.isFavorite ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteProject(project.id); toast.success("Project deleted."); }}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newName = window.prompt("Rename project:", project.name);
                      if (newName) {
                        // In a real app we'd call a store action
                        toast.success("Project renamed.");
                      }
                    }}
                    className="p-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all"
                  >
                    <Edit2 size={12} />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {project.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-muted-foreground" />
                  <span className="text-[10px] font-black text-foreground uppercase tracking-widest">{project.chatsCount} Chats</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database size={14} className="text-muted-foreground" />
                  <span className="text-[10px] font-black text-foreground uppercase tracking-widest">{project.sourcesCount} Sources</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-[#A1A1AA]">
                  <Clock size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Active 2h ago</span>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-4 border-card bg-muted flex items-center justify-center text-[10px] font-black group-hover:border-primary/10 transition-all">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-4 border-card bg-primary text-primary-foreground flex items-center justify-center text-[8px] font-black">
                    +
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <button
            onClick={handleNewProject}
            className="border-2 border-dashed border-border p-8 rounded-[40px] flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
              <FolderPlus size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary">New Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
}
