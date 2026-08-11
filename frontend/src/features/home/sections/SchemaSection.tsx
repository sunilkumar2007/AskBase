import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const TABLES = [
  { id: 'customers', label: 'CUSTOMERS', x: 0, y: -100, relations: ['orders'] },
  { id: 'orders', label: 'ORDERS', x: 0, y: 0, relations: ['customers', 'products', 'inventory'] },
  { id: 'products', label: 'PRODUCTS', x: 100, y: 100, relations: ['orders', 'inventory'] },
  { id: 'inventory', label: 'INVENTORY', x: -100, y: 100, relations: ['products', 'orders'] },
];

export const SchemaSection = () => {
  const [activeTable, setActiveTable] = useState('orders');
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-32 px-8 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <motion.h2
            className="text-[60px] md:text-[90px] font-black tracking-tighter leading-[0.85] mb-12 uppercase text-[#111111]"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            Understand your<br />
            database.
          </motion.h2>
          <p className="text-xl text-[#71717A] max-w-md mb-12 font-medium leading-relaxed">
            AskBase automatically maps your database relationships, identifying how customers, orders, and products connect.
          </p>

          <div className="space-y-4">
            {TABLES.map(table => (
              <button
                key={table.id}
                onMouseEnter={() => setActiveTable(table.id)}
                className={`block w-full text-left p-6 border-l-4 transition-all ${
                  activeTable === table.id
                    ? 'border-[#CB2958] bg-[#FAFAFA] text-[#111111]'
                    : 'border-transparent text-[#A1A1AA] hover:text-[#71717A]'
                }`}
              >
                <span className="text-xs font-black uppercase tracking-[0.4em]">{table.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative h-[600px] bg-[#FAFAFA] rounded-3xl border border-[#E4E4E7] flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full">
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <AnimatePresence>
                {TABLES.map(table => (
                  table.relations.map(relId => {
                    const target = TABLES.find(t => t.id === relId);
                    if (!target || table.id > relId) return null;

                    const isActive = activeTable === table.id || activeTable === relId;

                    return (
                      <motion.line
                        key={`${table.id}-${relId}`}
                        x1={`calc(50% + ${table.x}px)`}
                        y1={`calc(50% + ${table.y}px)`}
                        x2={`calc(50% + ${target.x}px)`}
                        y2={`calc(50% + ${target.y}px)`}
                        stroke={isActive ? "#CB2958" : "#E4E4E7"}
                        strokeWidth={isActive ? 2 : 1}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1 }}
                      />
                    );
                  })
                ))}
              </AnimatePresence>
            </svg>

            {/* Nodes */}
            {TABLES.map(table => (
              <motion.div
                key={table.id}
                animate={{
                  x: table.x,
                  y: table.y,
                  scale: activeTable === table.id ? 1.1 : 1,
                  borderColor: activeTable === table.id ? "#CB2958" : "#E4E4E7",
                  backgroundColor: activeTable === table.id ? "#18181B" : "#FFFFFF",
                  color: activeTable === table.id ? "#FFFFFF" : "#18181B",
                }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-sm border shadow-xl z-10 text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer"
                onMouseEnter={() => setActiveTable(table.id)}
              >
                {table.label}
              </motion.div>
            ))}

            <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur p-4 border border-[#E4E4E7]">
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-[#CB2958] mb-1">Schema Insight</div>
              <div className="text-xs font-medium text-[#71717A]">
                {activeTable === 'customers' && "Customers are linked to Orders via a one-to-many relationship."}
                {activeTable === 'orders' && "Orders serve as the central hub connecting Customers and Products."}
                {activeTable === 'products' && "Products are tracked via Inventory and recorded in Order Items."}
                {activeTable === 'inventory' && "Inventory levels are dynamically updated based on Order volume."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
