export type LandingState =
  | 'IDLE'
  | 'QUESTION'
  | 'UNDERSTANDING'
  | 'SCHEMA'
  | 'QUERY'
  | 'VALIDATING'
  | 'DATABASE'
  | 'DATA'
  | 'VISUALIZE'
  | 'INSIGHT'
  | 'COMPLETE';

export const STATES: LandingState[] = [
  'IDLE', 'QUESTION', 'UNDERSTANDING', 'SCHEMA', 'QUERY',
  'VALIDATING', 'DATABASE', 'DATA', 'VISUALIZE', 'INSIGHT', 'COMPLETE'
];

export const STATE_DURATIONS: Record<LandingState, number> = {
  IDLE: 3000,
  QUESTION: 3000,
  UNDERSTANDING: 2000,
  SCHEMA: 3000,
  QUERY: 3000,
  VALIDATING: 2000,
  DATABASE: 3000,
  DATA: 2000,
  VISUALIZE: 4000,
  INSIGHT: 3000,
  COMPLETE: 3000
};

export const PARTICLE_WORDS = [
  'SELECT', 'SCHEMA', 'DATA', 'QUERY', 'REVENUE',
  'CUSTOMER', 'PRODUCT', 'ORDER', 'INSIGHT', 'JOIN',
  'FROM', 'GROUP BY', 'LIMIT', 'TREND', 'ANALYSIS'
];

export const HERO_SCENARIOS = [

  {
    id: 'products-revenue',
    question: "Show me the top 5 products by revenue.",
    type: 'bar',
    sql: "SELECT product_name, SUM(revenue) FROM orders GROUP BY product_name ORDER BY revenue DESC LIMIT 5;",
    insight: "Laptop generated the highest revenue this quarter.",
    metric: "+22%",
    data: [
      { label: 'Laptop', value: 100, highlight: true },
      { label: 'Phone', value: 85 },
      { label: 'Monitor', value: 70 },
      { label: 'Tablet', value: 55 },
      { label: 'Keyboard', value: 40 },
    ]
  },
  {
    id: 'monthly-revenue',
    question: "Show monthly revenue for the last 12 months.",
    type: 'line',
    sql: "SELECT month, SUM(revenue) FROM sales WHERE date > NOW() - INTERVAL '12 months' GROUP BY month ORDER BY month;",
    insight: "Revenue peaked in December, driven by holiday sales.",
    metric: "+45%",
    data: [
      { label: 'Jan', value: 30 },
      { label: 'Feb', value: 35 },
      { label: 'Mar', value: 45 },
      { label: 'Apr', value: 40 },
      { label: 'May', value: 55 },
      { label: 'Jun', value: 65 },
      { label: 'Jul', value: 60 },
      { label: 'Aug', value: 70 },
      { label: 'Sep', value: 75 },
      { label: 'Oct', value: 80 },
      { label: 'Nov', value: 90 },
      { label: 'Dec', value: 100, highlight: true },
    ]
  },
  {
    id: 'customer-orders-er',
    question: "How are customers related to orders?",
    type: 'er',
    sql: "EXPLAIN SCHEMA customers, orders;",
    insight: "Customers have a one-to-many relationship with orders via customer_id.",
    metric: "Schema",
    data: [
      { label: 'CUSTOMERS', x: -80, y: -40 },
      { label: 'ORDERS', x: 80, y: -40 },
      { label: 'ORDER_ITEMS', x: 80, y: 40 },
      { label: 'PRODUCTS', x: -80, y: 40 },
    ]
  },
  {
    id: 'order-flow',
    question: "How does an order move through the system?",
    type: 'flow',
    sql: "EXPLAIN PROCESS order_lifecycle;",
    insight: "Orders typically move from 'Pending' to 'Delivered' in 3.2 days.",
    metric: "3.2 Days",
    data: [
      { label: 'PENDING', x: -120, y: 0 },
      { label: 'PAID', x: -40, y: 0 },
      { label: 'SHIPPED', x: 40, y: 0 },
      { label: 'DELIVERED', x: 120, y: 0 },
    ]
  }
];

export const WORKFLOW_STAGES = [
  "QUESTION",
  "AI AGENT",
  "SCHEMA",
  "SQL",
  "VALIDATION",
  "DATABASE",
  "ANALYSIS",
  "VISUALIZATION",
  "INSIGHT"
];

export const PROBLEM_STAGES = [
  "OPEN DATABASE",
  "UNDERSTAND SCHEMA",
  "WRITE SQL",
  "DEBUG QUERY",
  "EXPORT DATA",
  "BUILD CHART",
  "INTERPRET DATA"
];
