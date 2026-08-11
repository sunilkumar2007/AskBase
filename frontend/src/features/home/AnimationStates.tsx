import React from 'react';
import { motion } from 'framer-motion';

interface MousePos {
  x: number;
  y: number;
}

export const QueryCard = ({ text, mousePos }: { text: string, mousePos?: MousePos }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{
      opacity: 1,
      scale: 1,
      y: 0,
      x: mousePos ? mousePos.x * 0.5 : 0,
      rotateX: mousePos ? -mousePos.y * 0.2 : 0,
      rotateY: mousePos ? mousePos.x * 0.2 : 0,
    }}
    exit={{ opacity: 0, scale: 0.9, y: -20 }}
    className="bg-white border border-[#E4E4E7] p-4 rounded-lg shadow-xl max-w-xs absolute z-30"
    style={{ left: '10%', top: '20%' }}
  >
    <div className="flex items-center gap-2 mb-2">
      <div className="w-2 h-2 rounded-full bg-[#CB2958]" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717A]">User Query</span>
    </div>
    <p className="text-sm font-medium leading-relaxed italic text-[#18181B]">
      "{text}"
    </p>
  </motion.div>
);

export const SchemaGraph = ({ nodes }: { nodes?: any[] }) => {
  const defaultNodes = [
    { label: 'CUSTOMERS', x: 0, y: -60 },
    { label: 'ORDERS', x: 0, y: 0 },
    { label: 'PRODUCTS', x: 60, y: 60 },
    { label: 'REVENUE', x: -60, y: 60 },
  ];
  const activeNodes = nodes || defaultNodes;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div className="relative w-full h-full">
        {activeNodes.map((node, i) => (
          <motion.div
            key={node.label}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-[#E4E4E7] px-3 py-1 rounded text-[10px] font-bold shadow-sm"
            style={{
              x: node.x,
              y: node.y
            }}
          >
            {node.label}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export const SqlPanel = ({ sql, mousePos }: { sql?: string, mousePos?: MousePos }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{
      opacity: 1,
      x: mousePos ? mousePos.x * 0.3 : 0,
      y: mousePos ? mousePos.y * 0.3 : 0,
      rotateY: mousePos ? -mousePos.x * 0.1 : 0
    }}
    exit={{ opacity: 0, x: -20 }}
    className="bg-[#18181B] p-5 rounded-lg shadow-2xl absolute z-30 font-mono text-[11px] leading-relaxed w-72"
    style={{ right: '5%', top: '30%' }}
  >
    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
      <span className="text-white/40 uppercase tracking-tighter text-[9px]">Generated SQL</span>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
      </div>
    </div>
    <div className="text-white/90 whitespace-pre-wrap">
      {sql || `SELECT product_name, SUM(revenue)\nFROM orders\nGROUP BY product_name\nORDER BY revenue DESC\nLIMIT 5;`}
    </div>
  </motion.div>
);

export const ValidationBadge = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    className="absolute bottom-20 right-10 z-40 space-y-2"
  >
    {['READ ONLY', 'VALID SQL', 'SAFE TO EXECUTE'].map((text, i) => (
      <motion.div
        key={text}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: i * 0.1 }}
        className="bg-white border border-[#E4E4E7] px-3 py-1 rounded shadow-lg flex items-center gap-2"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#CB2958]" />
        <span className="text-[9px] font-black tracking-widest text-[#18181B]">{text}</span>
      </motion.div>
    ))}
  </motion.div>
);

export const DataViz = ({ type, data, mousePos }: { type?: string, data?: any[], mousePos?: MousePos }) => {
  const defaultData = [
    { label: 'Laptop', value: 100, highlight: true },
    { label: 'Phone', value: 85 },
    { label: 'Monitor', value: 70 },
    { label: 'Tablet', value: 55 },
    { label: 'Keyboard', value: 40 },
  ];
  const activeData = data || defaultData;
  const isLine = type === 'line';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: mousePos ? mousePos.x * 0.4 : 0,
        y: mousePos ? mousePos.y * 0.4 : 0,
      }}
      exit={{ opacity: 0 }}
      className="bg-white border border-[#E4E4E7] p-6 rounded-lg shadow-xl absolute z-30 w-72"
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
    >
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] mb-4">
        {isLine ? 'Revenue Trend' : 'Product Revenue Share'}
      </h4>
      <div className={isLine ? "flex items-end gap-2 h-32" : "space-y-3"}>
        {activeData.map((item: any, i: number) => (
          isLine ? (
            <div key={item.label} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${item.value}%` }}
                className={`w-full rounded-t-sm ${item.highlight ? 'bg-[#CB2958]' : 'bg-[#18181B]'}`}
              />
              <span className="text-[7px] font-bold opacity-40">{item.label}</span>
            </div>
          ) : (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-[#18181B]">
                <span>{item.label}</span>
                <span>{item.value}%</span>
              </div>
              <div className="h-1.5 bg-[#F4F4F5] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                  className={`h-full ${item.highlight ? 'bg-[#CB2958]' : 'bg-[#18181B]'}`}
                />
              </div>
            </div>
          )
        ))}
      </div>
    </motion.div>
  );
};

export const InsightCard = ({ text, metric, mousePos }: { text?: string, metric?: string, mousePos?: MousePos }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{
      opacity: 1,
      y: mousePos ? mousePos.y * 0.5 : 0,
      x: mousePos ? mousePos.x * 0.5 : 0,
      rotateZ: mousePos ? mousePos.x * 0.1 : 0
    }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-[#CB2958] p-5 rounded-lg shadow-2xl absolute z-40 text-white w-56"
    style={{ right: '10%', bottom: '20%' }}
  >
    <div className="text-[9px] font-black tracking-widest mb-2 opacity-80 uppercase">Insight</div>
    <p className="text-xs font-medium leading-relaxed">
      {text || "Laptop generated the highest revenue this quarter."}
    </p>
    <div className="mt-3 text-lg font-black">{metric || "+22%"}</div>
  </motion.div>
);

export const FlowGraph = ({ steps }: { steps: any[] }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 flex items-center justify-center pointer-events-none"
  >
    <div className="relative w-full h-full">
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-[#E4E4E7] px-3 py-1 rounded text-[10px] font-bold shadow-sm z-10"
            style={{ x: step.x, y: step.y }}
          >
            {step.label}
          </motion.div>
          {i < steps.length - 1 && (
            <motion.div
              className="absolute h-[1px] bg-[#E4E4E7] origin-left z-0"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              style={{
                left: `calc(50% + ${step.x}px + 20px)`,
                top: `calc(50% + ${step.y}px)`,
                width: `${steps[i+1].x - step.x - 40}px`
              }}
            >
              <motion.div
                className="h-full w-2 bg-[#CB2958]"
                animate={{ x: [0, steps[i+1].x - step.x - 40] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </div>
  </motion.div>
);
