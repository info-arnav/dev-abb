import { useState, useEffect } from "react";
import { fetchOEMData, getOEMAnalytics, OEMCompany } from "@/data/oemData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  MapPin,
  Factory,
  Target,
  Lightbulb,
  DollarSign,
} from "lucide-react";

const MarketInsightsPage = () => {
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
        <div className="text-2xl font-semibold">Loading Market Insights...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6 flex items-center justify-center">
        <div className="text-2xl font-semibold text-destructive">
          Error loading insights
        </div>
      </div>
    );
  }

  const marketOpportunities = [
    {
      title: "High Potential Markets",
      description:
        "Gujarat and Maharashtra lead with highest OEM concentration",
      icon: Target,
      value: "35%",
      detail: "of total companies located in top 2 states",
    },
    {
      title: "Untapped Segments",
      description:
        "Renewable Energy and Automation sectors show growth potential",
      icon: TrendingUp,
      value: "15%",
      detail: "market share in emerging sectors",
    },
    {
      title: "Geographic Expansion",
      description: "20+ states covered with room for rural market penetration",
      icon: MapPin,
      value: "20+",
      detail: "states with OEM presence",
    },
    {
      title: "Industry Diversification",
      description: "Strong presence across 15+ industrial verticals",
      icon: Factory,
      value: "15+",
      detail: "major industry categories",
    },
  ];

  const keyInsights = [
    {
      title: "Market Penetration Analysis",
      insights: [
        "Pumps & Water Systems dominate the market with highest OEM count",
        "Traditional industries show higher ABB adoption rates",
        "Emerging sectors like renewable energy present growth opportunities",
        "Geographic concentration in industrial hubs of Gujarat, Maharashtra, and Tamil Nadu",
      ],
    },
    {
      title: "ABB Adoption Patterns",
      insights: [
        `${analytics.metrics.confirmedABBUsers.value} companies confirmed as ABB users`,
        `${analytics.metrics.potentialUsers.value} companies identified as potential prospects`,
        "Higher adoption rates in heavy industrial applications",
        "Growing interest in energy-efficient motor solutions",
      ],
    },
    {
      title: "Regional Market Dynamics",
      insights: [
        "Western India leads in industrial OEM concentration",
        "South India shows strong presence in textile and automotive sectors",
        "Northern markets emerging in construction and infrastructure",
        "Eastern region focuses on heavy industries and mining equipment",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Market Insights
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Strategic analysis of the Indian OEM landscape, market
            opportunities, and business intelligence to drive informed
            decision-making.
          </p>
        </div>

        {/* Market Opportunities */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Market Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketOpportunities.map(
              ({ title, description, icon: Icon, value, detail }) => (
                <Card key={title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon className="h-8 w-8 text-primary" />
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {value}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {detail}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{description}</CardDescription>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </div>

        {/* Industry Breakdown */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Industry Distribution
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Top Industry Categories</CardTitle>
              <CardDescription>
                Distribution of OEMs across major industrial sectors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.topOEMTypes.slice(0, 8).map((type: any) => (
                <div key={type.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{type.type}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {type.count} companies
                      </span>
                      <Badge variant="secondary">{type.percentage}%</Badge>
                    </div>
                  </div>
                  <Progress
                    value={parseFloat(type.percentage)}
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Geographic Insights */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Geographic Distribution
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top States by OEM Count</CardTitle>
                <CardDescription>
                  Regional concentration of OEM companies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.topStates.slice(0, 6).map((state: any) => (
                  <div key={state.state} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{state.state}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {state.companies} companies
                        </span>
                        <Badge variant="outline">{state.percentage}%</Badge>
                      </div>
                    </div>
                    <Progress
                      value={parseFloat(state.percentage)}
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Concentration</CardTitle>
                <CardDescription>
                  Regional market analysis and opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-semibold">Western India</div>
                      <div className="text-sm text-muted-foreground">
                        Gujarat, Maharashtra
                      </div>
                    </div>
                    <Badge>High Density</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-semibold">Southern India</div>
                      <div className="text-sm text-muted-foreground">
                        Tamil Nadu, Karnataka
                      </div>
                    </div>
                    <Badge variant="secondary">Strong Presence</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-semibold">Northern India</div>
                      <div className="text-sm text-muted-foreground">
                        Delhi, Uttar Pradesh
                      </div>
                    </div>
                    <Badge variant="outline">Growing Market</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Key Insights */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Strategic Insights
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {keyInsights.map(({ title, insights }) => (
              <Card key={title}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <span>{title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {insights.map((insight, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {insight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-primary" />
              <span>Recommended Actions</span>
            </CardTitle>
            <CardDescription>
              Strategic recommendations based on market analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Short-term Opportunities</h4>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                    <span className="text-sm">
                      Focus on high-potential Gujarat and Maharashtra markets
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                    <span className="text-sm">
                      Target confirmed ABB users for expansion opportunities
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                    <span className="text-sm">
                      Develop solutions for pump and compressor sectors
                    </span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Long-term Strategy</h4>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                    <span className="text-sm">
                      Invest in renewable energy and automation sectors
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                    <span className="text-sm">
                      Expand presence in emerging northern and eastern markets
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                    <span className="text-sm">
                      Build partnerships with potential ABB users
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketInsightsPage;
