import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeType: "increase" | "decrease";
  description?: string;
}

export const MetricCard = ({ title, value, change, changeType, description }: MetricCardProps) => {
  const isPositive = changeType === "increase";
  
  return (
    <Card className="p-6 bg-card border-border hover:shadow-lg transition-all duration-200 hover:shadow-primary/20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-accent" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span 
              className={`text-sm font-medium ${
                isPositive ? "text-accent" : "text-destructive"
              }`}
            >
              {Math.abs(change)}%
            </span>
            {description && (
              <span className="text-sm text-muted-foreground">
                {description}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};