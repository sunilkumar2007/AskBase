import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'base',
  themeVariables: {
    primaryColor: '#CB2958',
    primaryTextColor: '#FFFFFF',
    primaryBorderColor: '#A91F48',
    lineColor: '#CB2958',
    secondaryColor: '#FAFAFA',
    tertiaryColor: '#FFFFFF',
    fontFamily: 'Geist, sans-serif',
    fontSize: '12px'
  },
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis'
  }
});

interface MermaidRendererProps {
  chart: string;
}

export function MermaidRenderer({ chart }: MermaidRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.removeAttribute('data-processed');
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div className="mermaid w-full flex justify-center p-4 bg-white border border-[#E4E4E7] rounded-sm overflow-x-auto" ref={ref}>
      {chart}
    </div>
  );
}
