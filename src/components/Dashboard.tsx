import { MetricCard } from "./MetricCard";
import { ChartCard } from "./ChartCard";
import { fetchOEMData, getOEMAnalytics, OEMCompany } from "@/data/oemData";
import { useState, useEffect, lazy, Suspense } from "react";

// Lazy load Recharts components to reduce initial bundle size
const BarChart = lazy(() => import("recharts").then(module => ({ default: module.BarChart })));
const Bar = lazy(() => import("recharts").then(module => ({ default: module.Bar })));
const PieChart = lazy(() => import("recharts").then(module => ({ default: module.PieChart })));
const Pie = lazy(() => import("recharts").then(module => ({ default: module.Pie })));
const Cell = lazy(() => import("recharts").then(module => ({ default: module.Cell })));
const XAxis = lazy(() => import("recharts").then(module => ({ default: module.XAxis })));
const YAxis = lazy(() => import("recharts").then(module => ({ default: module.YAxis })));
const CartesianGrid = lazy(() => import("recharts").then(module => ({ default: module.CartesianGrid })));
const Tooltip = lazy(() => import("recharts").then(module => ({ default: module.Tooltip })));
const ResponsiveContainer = lazy(() => import("recharts").then(module => ({ default: module.ResponsiveContainer })));
const Legend = lazy(() => import("recharts").then(module => ({ default: module.Legend })));

// Chart loading component
const ChartLoader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-sm text-muted-foreground">Loading chart...</div>
  </div>
);

export const Dashboard = () => {
  const [oemData, setOEMData] = useState<OEMCompany[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchOEMData();
        setOEMData(data);
        const analyticsData = getOEMAnalytics(data);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error("Error loading OEM data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6 flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading OEM Database...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6 flex items-center justify-center">
        <div className="text-2xl font-semibold text-destructive">
          Error loading data
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            OEM Market Intelligence Dashboard
          </h1>
          <p className="text-muted-foreground">
            Strategic insights and business intelligence for Indian OEM companies and ABB motor market analysis
          </p>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Total Companies"
            value={analytics.metrics.totalCompanies.value}
            change={analytics.metrics.totalCompanies.change}
            changeType={analytics.metrics.totalCompanies.changeType}
            description={analytics.metrics.totalCompanies.description}
          />
          <MetricCard
            title="Market Penetration"
            value={analytics.metrics.marketPenetration.value}
            change={analytics.metrics.marketPenetration.change}
            changeType={analytics.metrics.marketPenetration.changeType}
            description={analytics.metrics.marketPenetration.description}
          />
          <MetricCard
            title="Business Opportunities"
            value={analytics.metrics.businessOpportunity.value}
            change={analytics.metrics.businessOpportunity.change}
            changeType={analytics.metrics.businessOpportunity.changeType}
            description={analytics.metrics.businessOpportunity.description}
          />
          <MetricCard
            title="Geographic Reach"
            value={analytics.metrics.geographicReach.value}
            change={analytics.metrics.geographicReach.change}
            changeType={analytics.metrics.geographicReach.changeType}
            description={analytics.metrics.geographicReach.description}
          />
          <MetricCard
            title="High-Value Targets"
            value={analytics.metrics.highValueTargets.value}
            change={analytics.metrics.highValueTargets.change}
            changeType={analytics.metrics.highValueTargets.changeType}
            description={analytics.metrics.highValueTargets.description}
          />
          <MetricCard
            title="Confirmed Users"
            value={analytics.metrics.confirmedRevenue.value}
            change={analytics.metrics.confirmedRevenue.change}
            changeType={analytics.metrics.confirmedRevenue.changeType}
            description={analytics.metrics.confirmedRevenue.description}
          />
        </div>

        {/* Regional Analysis & ABB Usage Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top States with Market Analysis */}
          <ChartCard
            title="Regional Market Analysis"
            description="States with highest company concentration and ABB penetration"
          >
            <Suspense fallback={<ChartLoader />}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.regionalAnalysis.slice(0, 8)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="state"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="confirmed" fill="#22c55e" name="Confirmed ABB Users" />
                  <Bar dataKey="potential" fill="#3b82f6" name="Potential Users" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </Suspense>
          </ChartCard>

          {/* ABB Motor Usage Status */}
          <ChartCard
            title="ABB Motor Usage Status"
            description="Current distribution of ABB motor adoption"
          >
            <Suspense fallback={<ChartLoader />}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.abbUsageChart}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {analytics.abbUsageChart.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Suspense>
          </ChartCard>
        </div>

        {/* Business Intelligence Summary */}
        <div className="grid grid-cols-1 gap-6">
          <ChartCard
            title="Business Intelligence Summary"
            description="Key insights and strategic recommendations from the OEM database"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-green-600">
                  {analytics.businessInsights.topEquipmentCategory}
                </div>
                <div className="text-sm text-muted-foreground">
                  Largest Equipment Category
                </div>
                <div className="text-xs text-muted-foreground">
                  Focus area for market expansion
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-600">
                  {analytics.businessInsights.topState}
                </div>
                <div className="text-sm text-muted-foreground">
                  Highest Company Concentration
                </div>
                <div className="text-xs text-muted-foreground">
                  Prime market for regional strategy
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-orange-600">
                  {analytics.businessInsights.averagePenetration}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Average Market Penetration
                </div>
                <div className="text-xs text-muted-foreground">
                  Across all regions
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-purple-600">
                  {analytics.businessInsights.totalMarketPotential}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Market Potential
                </div>
                <div className="text-xs text-muted-foreground">
                  Potential + Inferred customers
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold mb-2">Strategic Recommendations:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Focus sales efforts on {analytics.businessInsights.topEquipmentCategory} category (largest market segment)</li>
                <li>• Prioritize {analytics.businessInsights.topState} for regional expansion initiatives</li>
                <li>• Target {analytics.businessInsights.totalMarketPotential} potential customers for business development</li>
                <li>• Develop category-specific solutions for high-opportunity equipment types</li>
              </ul>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};
