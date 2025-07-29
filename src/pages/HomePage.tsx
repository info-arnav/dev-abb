import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Database,
  TrendingUp,
  Users,
  Factory,
  Zap,
  Globe,
  Shield,
} from "lucide-react";

const HomePage = () => {
  const industries = [
    "Pumps & Water Systems",
    "Compressors & Air Systems",
    "Gearboxes & Transmission",
    "Material Handling",
    "Textile Machinery",
    "Automotive Parts",
    "Power Equipment",
    "Chemical Processing",
    "Food & Beverage",
    "Heavy Industries",
    "HVAC & Refrigeration",
    "Renewable Energy",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-muted/20 to-primary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              OEM Database
              <span className="text-primary"> Analytics</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Comprehensive insights into Indian Original Equipment
              Manufacturers (OEMs) and their ABB motor adoption patterns across
              diverse industrial sectors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/dashboard">View Analytics Dashboard</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8"
              >
                <Link to="/data-table">Browse Database</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-16 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Industries Covered
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our database spans across major industrial sectors in India,
              providing comprehensive market coverage.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry) => (
              <Badge
                key={industry}
                variant="secondary"
                className="text-sm py-2 px-4"
              >
                {industry}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Explore the Data?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Dive into comprehensive analytics, discover market trends, and
                identify business opportunities in the Indian OEM landscape.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/dashboard">Start Analytics</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/insights">Market Insights</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
