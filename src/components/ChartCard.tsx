import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const ChartCard = ({ title, description, children, className = "" }: ChartCardProps) => {
  return (
    <Card className={`p-6 bg-card border-border hover:shadow-lg transition-all duration-200 hover:shadow-primary/20 ${className}`}>
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="h-64">
          {children}
        </div>
      </div>
    </Card>
  );
};