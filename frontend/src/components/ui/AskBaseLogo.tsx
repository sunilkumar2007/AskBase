import React from 'react';
import { cn } from '@/lib/utils';

interface AskBaseLogoProps {
  className?: string;
  size?: number;
}

export function AskBaseLogo({ className, size = 40 }: AskBaseLogoProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "relative flex items-center justify-center rounded-[28%] bg-white shadow-[0_8px_30px_rgb(203,41,88,0.12)] border border-[#CB2958]/10 overflow-hidden group",
        className
      )}
    >
      {/* Background Gradient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(203,41,88,0.15),transparent)]" />

      {/* 3D Abstract Database/Query Mark */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[70%] h-[70%] drop-shadow-[0_2px_4px_rgba(203,41,88,0.2)]"
      >
        {/* Abstract Stacked Layers (Database) */}
        <path
          d="M25 45C25 41.134 40.67 38 60 38C79.33 38 95 41.134 95 45V55C95 58.866 79.33 62 60 62C40.67 62 25 58.866 25 55V45Z"
          fill="#CB2958"
          fillOpacity="0.1"
          stroke="#CB2958"
          strokeWidth="2.5"
        />
        <path
          d="M5 25C5 21.134 20.67 18 40 18C59.33 18 75 21.134 75 25V35C75 38.866 59.33 42 40 42C20.67 42 5 38.866 5 35V25Z"
          fill="white"
          stroke="#CB2958"
          strokeWidth="3.5"
        />

        {/* Intelligence Spark / Query Cursor */}
        <circle cx="78" cy="78" r="8" fill="#CB2958" className="animate-pulse" />
        <path
          d="M72 78H84M78 72V84"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Glass Reflection */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/40 to-transparent rotate-[-45deg] pointer-events-none" />
    </div>
  );
}
