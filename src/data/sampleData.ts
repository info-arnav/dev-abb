// Sample data for analytics dashboard

export const salesData = [
  { month: "Jan", sales: 45000, profit: 12000, expenses: 33000 },
  { month: "Feb", sales: 52000, profit: 15000, expenses: 37000 },
  { month: "Mar", sales: 48000, profit: 13500, expenses: 34500 },
  { month: "Apr", sales: 61000, profit: 18000, expenses: 43000 },
  { month: "May", sales: 55000, profit: 16500, expenses: 38500 },
  { month: "Jun", sales: 67000, profit: 20000, expenses: 47000 },
];

export const categoryData = [
  { name: "Electronics", value: 35, fill: "hsl(var(--chart-1))" },
  { name: "Clothing", value: 25, fill: "hsl(var(--chart-2))" },
  { name: "Home & Garden", value: 20, fill: "hsl(var(--chart-3))" },
  { name: "Sports", value: 12, fill: "hsl(var(--chart-4))" },
  { name: "Books", value: 8, fill: "hsl(var(--chart-5))" },
];

export const performanceData = [
  { quarter: "Q1", performance: 75, target: 80 },
  { quarter: "Q2", performance: 85, target: 80 },
  { quarter: "Q3", performance: 90, target: 85 },
  { quarter: "Q4", performance: 95, target: 90 },
];

export const regionData = [
  { region: "North America", sales: 120000, customers: 1250 },
  { region: "Europe", sales: 98000, customers: 980 },
  { region: "Asia Pacific", sales: 85000, customers: 1100 },
  { region: "Latin America", sales: 45000, customers: 520 },
  { region: "Middle East", sales: 32000, customers: 380 },
];

export const metrics = {
  totalRevenue: {
    value: "€2.4M",
    change: 12.5,
    changeType: "increase" as const,
    description: "vs last month"
  },
  activeUsers: {
    value: "48.2K",
    change: 8.2,
    changeType: "increase" as const,
    description: "vs last month"
  },
  conversionRate: {
    value: "3.42%",
    change: -2.1,
    changeType: "decrease" as const,
    description: "vs last month"
  },
  avgOrderValue: {
    value: "€156",
    change: 15.3,
    changeType: "increase" as const,
    description: "vs last month"
  }
};