// ============================================================================
// DEVELOPMENT ONLY MOCK DATA
// This file contains static mock assets used during local development
// and offline testing. It must eventually be replaced by production APIs.
// ============================================================================

export const RECENT_ACTIVITY = [
  { id: 1, title: 'Q3 Revenue Analysis', type: 'REPORT', timestamp: '2h ago' },
  { id: 2, title: 'Product Trends', type: 'CHART', timestamp: '5h ago' },
  { id: 3, title: 'Sales Schema', type: 'DIAGRAM', timestamp: '1d ago' },
];

export const mockQueryResult = [
  { product: 'Premium Widgets', revenue: 45000, region: 'North America' },
  { product: 'Mega Gadgets', revenue: 32000, region: 'Europe' },
  { product: 'Super Sockets', revenue: 28000, region: 'Asia' },
  { product: 'Ultra Adapters', revenue: 15000, region: 'South America' },
];

export const mockSQL = `SELECT product_name, SUM(amount) as revenue
FROM sales
JOIN products ON sales.product_id = products.id
WHERE sales.created_at >= '2026-07-01'
GROUP BY product_name
ORDER BY revenue DESC
LIMIT 5;`;
