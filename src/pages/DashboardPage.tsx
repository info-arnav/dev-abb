import { useState, useEffect } from "react";
import { Dashboard } from "@/components/Dashboard";
import { BarChart3 } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Analytics Dashboard
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Comprehensive analytics and insights into the Indian OEM landscape,
            ABB motor adoption trends, and market opportunities.
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <Dashboard />
    </div>
  );
};

export default DashboardPage;
