import { useState, useEffect } from "react";
import { fetchOEMData, OEMCompany } from "@/data/oemData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Search,
  Filter,
  Users,
} from "lucide-react";

const CompanyDirectoryPage = () => {
  const [oemData, setOEMData] = useState<OEMCompany[]>([]);
  const [filteredData, setFilteredData] = useState<OEMCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedABBStatus, setSelectedABBStatus] = useState<string>("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchOEMData();
        setOEMData(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Error loading OEM data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = oemData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (company) =>
          company.oemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.oemType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply state filter
    if (selectedState !== "all") {
      filtered = filtered.filter((company) => company.state === selectedState);
    }

    // Apply type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((company) =>
        company.oemType.toLowerCase().includes(selectedType.toLowerCase())
      );
    }

    // Apply ABB status filter
    if (selectedABBStatus !== "all") {
      filtered = filtered.filter(
        (company) => company.usesABBMotors === selectedABBStatus
      );
    }

    setFilteredData(filtered);
  }, [oemData, searchTerm, selectedState, selectedType, selectedABBStatus]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6 flex items-center justify-center">
        <div className="text-2xl font-semibold">
          Loading Company Directory...
        </div>
      </div>
    );
  }

  const states = [
    ...new Set(
      oemData
        .map((company) => company.state)
        .filter((state) => state && state !== "N/A")
    ),
  ].sort();
  const types = [
    "pump",
    "compressor",
    "fan",
    "gearbox",
    "conveyor",
    "textile",
    "automotive",
    "power",
    "chemical",
  ];
  const abbStatuses = [
    ...new Set(oemData.map((company) => company.usesABBMotors)),
  ];

  const getABBStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "potential":
        return <Badge variant="secondary">Potential</Badge>;
      case "inferred":
        return <Badge variant="outline">Inferred</Badge>;
      default:
        return <Badge variant="destructive">Unknown</Badge>;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedState("all");
    setSelectedType("all");
    setSelectedABBStatus("all");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              Company Directory
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Browse through our comprehensive directory of Indian OEM companies
            with detailed profiles, contact information, and business insights.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Search & Filter Companies</span>
            </CardTitle>
            <CardDescription>
              Use the filters below to find specific companies or market
              segments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Industry Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedABBStatus}
                onValueChange={setSelectedABBStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="ABB Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {abbStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredData.length} of {oemData.length} companies
            </div>
          </CardContent>
        </Card>

        {/* Company Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((company) => (
            <Card
              key={company.srNo}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-2">
                      {company.oemName}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {company.oemType}
                    </CardDescription>
                  </div>
                  {getABBStatusBadge(company.usesABBMotors)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">
                    {company.city && company.city !== "N/A"
                      ? `${company.city}, `
                      : ""}
                    {company.state || "Location not specified"}
                  </span>
                </div>

                {company.contactPhone && company.contactPhone !== "N/A" && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{company.contactPhone}</span>
                  </div>
                )}

                {company.contactEmail && company.contactEmail !== "N/A" && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{company.contactEmail}</span>
                  </div>
                )}

                {company.sourceNotes && (
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      <strong>Notes:</strong> {company.sourceNotes}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredData.length === 0 && (
          <Card className="mt-8">
            <CardContent className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No companies found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or clear the filters to see
                all companies.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CompanyDirectoryPage;
