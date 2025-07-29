import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  BarChart3,
  Table,
  Home,
  Database,
  TrendingUp,
  Users,
} from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Analytics Dashboard", icon: BarChart3 },
    { path: "/data-table", label: "Database View", icon: Table },
    { path: "/insights", label: "Market Insights", icon: TrendingUp },
    { path: "/companies", label: "Company Directory", icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  const NavLinks = ({ mobile = false }) => (
    <div className={`flex ${mobile ? "flex-col space-y-4" : "space-x-6"}`}>
      {navItems.map(({ path, label, icon: Icon }) => (
        <Link
          key={path}
          to={path}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive(path)
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
          onClick={() => mobile && setIsOpen(false)}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                OEM Analytics
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden collapse:flex items-center">
            <NavLinks />
          </div>

          {/* Mobile Navigation */}
          <div className="collapse:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex items-center space-x-2 mb-8">
                  <Database className="h-8 w-8 text-primary" />
                  <span className="text-2xl font-bold">OEM Analytics</span>
                </div>
                <NavLinks mobile />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
