import { useState, useEffect, useMemo } from "react";
import { DataTable } from "@/components/DataTable";
import { fetchOEMData, OEMCompany } from "@/data/oemData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  Search,
  Download,
  Filter,
  Wrench,
  Fan,
  Truck,
  Zap,
  Cog,
} from "lucide-react";

const DataTablePage = () => {
  const [oemData, setOEMData] = useState<OEMCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchOEMData();
        setOEMData(data);
      } catch (error) {
        console.error("Error loading OEM data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter data by categories
  const categorizedData = useMemo(() => {
    const pumpsData = oemData.filter((company) =>
      company.oemType.toLowerCase().includes("pump")
    );

    const compressorsData = oemData.filter((company) =>
      company.oemType.toLowerCase().includes("compressor")
    );

    const conveyorsData = oemData.filter(
      (company) =>
        company.oemType.toLowerCase().includes("conveyor") ||
        company.oemType.toLowerCase().includes("material handling")
    );

    const blowersFansData = oemData.filter(
      (company) =>
        company.oemType.toLowerCase().includes("fan") ||
        company.oemType.toLowerCase().includes("blower")
    );

    const gearboxData = oemData.filter(
      (company) =>
        company.oemType.toLowerCase().includes("gearbox") ||
        company.oemType.toLowerCase().includes("gear")
    );

    return {
      all: oemData,
      pumps: pumpsData,
      compressors: compressorsData,
      conveyors: conveyorsData,
      blowersFans: blowersFansData,
      gearbox: gearboxData,
    };
  }, [oemData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6 flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading OEM Database...</div>
      </div>
    );
  }

  const QuickStatsCard = ({
    data,
    title,
  }: {
    data: OEMCompany[];
    title: string;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Companies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Confirmed ABB Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {
              data.filter((company) => company.usesABBMotors === "Confirmed")
                .length
            }
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Potential Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {
              data.filter((company) => company.usesABBMotors === "Potential")
                .length
            }
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            States Covered
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {
              new Set(
                data
                  .map((company) => company.state)
                  .filter((state) => state && state !== "N/A")
              ).size
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">OEM Database</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Comprehensive database of Indian Original Equipment Manufacturers
            organized by industry categories with detailed company information,
            contact details, and ABB motor usage status.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-1">
            <TabsTrigger
              value="all"
              className="flex flex-col items-center gap-1 p-3"
            >
              <Database className="h-4 w-4" />
              <span className="text-xs">All</span>
              <Badge variant="secondary" className="text-xs px-1">
                {categorizedData.all.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="pumps"
              className="flex flex-col items-center gap-1 p-3"
            >
              <Wrench className="h-4 w-4" />
              <span className="text-xs">Pumps</span>
              <Badge variant="secondary" className="text-xs px-1">
                {categorizedData.pumps.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="compressors"
              className="flex flex-col items-center gap-1 p-3"
            >
              <Zap className="h-4 w-4" />
              <span className="text-xs">Compressors</span>
              <Badge variant="secondary" className="text-xs px-1">
                {categorizedData.compressors.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="conveyors"
              className="flex flex-col items-center gap-1 p-3"
            >
              <Truck className="h-4 w-4" />
              <span className="text-xs">Conveyors</span>
              <Badge variant="secondary" className="text-xs px-1">
                {categorizedData.conveyors.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="blowersFans"
              className="flex flex-col items-center gap-1 p-3"
            >
              <Fan className="h-4 w-4" />
              <span className="text-xs">Blowers/Fans</span>
              <Badge variant="secondary" className="text-xs px-1">
                {categorizedData.blowersFans.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="gearbox"
              className="flex flex-col items-center gap-1 p-3"
            >
              <Cog className="h-4 w-4" />
              <span className="text-xs">Gearboxes</span>
              <Badge variant="secondary" className="text-xs px-1">
                {categorizedData.gearbox.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">All OEM Companies</h2>
              <p className="text-muted-foreground">
                Complete database of {categorizedData.all.length} OEM companies
                across all categories
              </p>
            </div>
            <QuickStatsCard data={categorizedData.all} title="All Companies" />

            {/* Features Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Database Features</span>
                </CardTitle>
                <CardDescription>
                  Use the powerful search and filtering capabilities to find
                  specific companies and insights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <Search className="h-3 w-3" />
                    <span>Advanced Search</span>
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <Filter className="h-3 w-3" />
                    <span>Column Sorting</span>
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <Download className="h-3 w-3" />
                    <span>CSV Export</span>
                  </Badge>
                  <Badge variant="secondary">Pagination</Badge>
                  <Badge variant="secondary">Real-time Filtering</Badge>
                </div>
              </CardContent>
            </Card>

            <DataTable data={categorizedData.all} />
          </TabsContent>

          <TabsContent value="pumps" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Wrench className="h-6 w-6 text-primary" />
                Pump Manufacturers
              </h2>
              <p className="text-muted-foreground">
                {categorizedData.pumps.length} companies specializing in pumps
                and water systems including industrial, agricultural, and
                submersible pumps
              </p>
            </div>
            <QuickStatsCard
              data={categorizedData.pumps}
              title="Pump Companies"
            />
            <DataTable data={categorizedData.pumps} />
          </TabsContent>

          <TabsContent value="compressors" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                Compressor Manufacturers
              </h2>
              <p className="text-muted-foreground">
                {categorizedData.compressors.length} companies manufacturing air
                compressors, gas compressors, and refrigeration compressors
              </p>
            </div>
            <QuickStatsCard
              data={categorizedData.compressors}
              title="Compressor Companies"
            />
            <DataTable data={categorizedData.compressors} />
          </TabsContent>

          <TabsContent value="conveyors" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Truck className="h-6 w-6 text-primary" />
                Conveyor & Material Handling
              </h2>
              <p className="text-muted-foreground">
                {categorizedData.conveyors.length} companies providing conveyor
                systems, belting, and material handling solutions
              </p>
            </div>
            <QuickStatsCard
              data={categorizedData.conveyors}
              title="Conveyor Companies"
            />
            <DataTable data={categorizedData.conveyors} />
          </TabsContent>

          <TabsContent value="blowersFans" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Fan className="h-6 w-6 text-primary" />
                Blowers & Fans
              </h2>
              <p className="text-muted-foreground">
                {categorizedData.blowersFans.length} companies manufacturing
                industrial fans, blowers, and air movement equipment
              </p>
            </div>
            <QuickStatsCard
              data={categorizedData.blowersFans}
              title="Blower/Fan Companies"
            />
            <DataTable data={categorizedData.blowersFans} />
          </TabsContent>

          <TabsContent value="gearbox" className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Cog className="h-6 w-6 text-primary" />
                Gearbox & Transmission
              </h2>
              <p className="text-muted-foreground">
                {categorizedData.gearbox.length} companies specializing in
                gearboxes, gear drives, and power transmission equipment
              </p>
            </div>
            <QuickStatsCard
              data={categorizedData.gearbox}
              title="Gearbox Companies"
            />
            <DataTable data={categorizedData.gearbox} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataTablePage;
