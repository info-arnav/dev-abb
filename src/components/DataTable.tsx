import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, Filter, X } from "lucide-react";
import { OEMCompany } from "@/data/oemData";

interface DataTableProps {
  data: OEMCompany[];
}

export const DataTable = ({ data }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof OEMCompany | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const itemsPerPage = 50;

  // Extract unique equipment categories
  const equipmentCategories = useMemo(() => {
    const categories = new Set<string>();
    data.forEach((company) => {
      if (company.oemType.includes(" - ")) {
        categories.add(company.oemType.split(" - ")[0]);
      }
    });
    return Array.from(categories).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((company) => {
      const matchesSearch = Object.values(company).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesCategory =
        categoryFilter === "all" ||
        (company.oemType.includes(" - ") &&
          company.oemType.split(" - ")[0] === categoryFilter);

      return matchesSearch && matchesCategory;
    });
  }, [data, searchTerm, categoryFilter]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn]?.toString() || "";
      const bVal = b[sortColumn]?.toString() || "";

      if (sortDirection === "asc") {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });
  }, [filteredData, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (column: keyof OEMCompany) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleExport = () => {
    const csv = [
      Object.keys(data[0] || {}).join(","),
      ...sortedData.map((row) =>
        Object.values(row)
          .map((val) =>
            typeof val === "string" && val.includes(",") ? `"${val}"` : val
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "oem_database.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getABBStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return (
          <Badge variant="default" className="bg-green-500">
            Confirmed
          </Badge>
        );
      case "potential":
        return <Badge variant="secondary">Potential</Badge>;
      case "inferred":
        return <Badge variant="outline">Inferred</Badge>;
      default:
        return <Badge variant="destructive">Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-2xl font-bold">
            OEM Database - Excel View
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 w-full sm:w-80"
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by equipment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {equipmentCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categoryFilter && categoryFilter !== "all" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCategoryFilter("all")}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filter
              </Button>
            )}
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>Total Records: {sortedData.length}</span>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <span>
            Showing {paginatedData.length} of {sortedData.length} entries
          </span>
          {categoryFilter && categoryFilter !== "all" && (
            <span className="text-primary font-medium">
              Filtered by: {categoryFilter}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead
                  className="cursor-pointer hover:bg-muted/70 font-semibold"
                  onClick={() => handleSort("srNo")}
                >
                  Sr. No.{" "}
                  {sortColumn === "srNo" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/70 font-semibold"
                  onClick={() => handleSort("oemType")}
                >
                  OEM Type{" "}
                  {sortColumn === "oemType" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/70 font-semibold"
                  onClick={() => handleSort("oemName")}
                >
                  OEM Name{" "}
                  {sortColumn === "oemName" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/70 font-semibold"
                  onClick={() => handleSort("city")}
                >
                  City/District{" "}
                  {sortColumn === "city" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/70 font-semibold"
                  onClick={() => handleSort("state")}
                >
                  State{" "}
                  {sortColumn === "state" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="font-semibold">Contact Phone</TableHead>
                <TableHead className="font-semibold">Contact Email</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/70 font-semibold"
                  onClick={() => handleSort("usesABBMotors")}
                >
                  ABB Motors{" "}
                  {sortColumn === "usesABBMotors" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="font-semibold">Source/Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((company) => (
                <TableRow key={company.srNo} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{company.srNo}</TableCell>
                  <TableCell className="max-w-48">
                    <div className="space-y-1">
                      {company.oemType.includes(" - ") ? (
                        <>
                          <div className="font-medium text-sm text-primary">
                            {company.oemType.split(" - ")[0]}
                          </div>
                          <div
                            className="text-xs text-muted-foreground truncate"
                            title={company.oemType.split(" - ")[1]}
                          >
                            {company.oemType.split(" - ")[1]}
                          </div>
                        </>
                      ) : (
                        <div className="truncate" title={company.oemType}>
                          {company.oemType}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-64">
                    <div className="truncate" title={company.oemName}>
                      {company.oemName}
                    </div>
                  </TableCell>
                  <TableCell>{company.city || "N/A"}</TableCell>
                  <TableCell>{company.state || "N/A"}</TableCell>
                  <TableCell className="max-w-32">
                    <div className="truncate" title={company.contactPhone}>
                      {company.contactPhone || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-48">
                    <div className="truncate" title={company.contactEmail}>
                      {company.contactEmail || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getABBStatusBadge(company.usesABBMotors)}
                  </TableCell>
                  <TableCell className="max-w-64">
                    <div className="truncate" title={company.sourceNotes}>
                      {company.sourceNotes}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, sortedData.length)} of{" "}
            {sortedData.length} entries
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page =
                Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
