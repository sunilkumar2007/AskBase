import React from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Terminal,
  BarChart3,
  Mic,
  ShieldCheck,
  Network,
  History,
  FileText
} from 'lucide-react';

const features = [
  {
    title: "Natural Language to SQL",
    description: "Ask complex questions in plain English. AskBase understands your intent and translates it into high-performance SQL queries instantly.",
    icon: Database,
    color: "#CB2958"
  },
  {
    title: "SQL Transparency",
    description: "Never wonder what happened behind the scenes. Review, copy, and explain the generated SQL. Safety first with built-in read-only validation.",
    icon: Terminal,
    color: "#18181B"
  },
  {
    title: "Instant Visualization",
    description: "Automatic chart selection. From revenue trends to category distribution, your data is visualized exactly how it should be.",
    icon: BarChart3,
    color: "#CB2958"
  },
  {
    title: "Database Intelligence",
    description: "Automatic schema discovery. AskBase learns your table relationships and keys to provide deep context-aware answers.",
    icon: Network,
    color: "#18181B"
  },
  {
    title: "Semantic Insights",
    description: "Go beyond the numbers. AskBase explains trends, identifies anomalies, and provides written summaries of your data findings.",
    icon: FileText,
    color: "#CB2958"
  },
  {
    title: "Voice Intelligence",
    description: "Control your database with your voice. Integrated transcription and intent understanding for hands-free data analysis.",
    icon: Mic,
    color: "#18181B"
  }
];

export default function FeaturesPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#FAFAFA]">
      <section className="pt-24 pb-12 px-8 max-w-6xl mx-auto space-y-4">
        <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Enterprise<br/><span className="text-[#CB2958]">Intelligence.</span></h1>
        <p className="text-lg text-[#71717A] max-w-2xl font-medium">
          AskBase combines advanced language models with robust database engineering to make data accessible to everyone.
        </p>
      </section>

      <section className="px-8 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E4E4E7] border border-[#E4E4E7]">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 space-y-4 hover:bg-[#FAFAFA] transition-colors group"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-sm bg-[#F4F4F5] text-[#18181B] group-hover:bg-[#CB2958] group-hover:text-white transition-all">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest">{f.title}</h3>
              <p className="text-xs text-[#71717A] leading-relaxed font-medium">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
