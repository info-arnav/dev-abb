// OEM Database Analytics Data

export interface OEMCompany {
  srNo: number;
  oemType: string;
  oemName: string;
  city: string;
  state: string;
  contactPhone: string;
  contactEmail: string;
  usesABBMotors: string;
  sourceNotes: string;
}

// Function to fetch and parse CSV data
export const fetchOEMData = async (): Promise<OEMCompany[]> => {
  try {
    const response = await fetch("/consolidated_oem_database_fixed.csv");
    const csvText = await response.text();

    const lines = csvText.split("\n");
    const headers = lines[0].split(",");

    const data: OEMCompany[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const values = parseCSVLine(line);
        if (values.length >= 9) {
          data.push({
            srNo: parseInt(values[0]) || 0,
            oemType: values[1] || "",
            oemName: values[2] || "",
            city: values[3] || "",
            state: values[4] || "",
            contactPhone: values[5] || "",
            contactEmail: values[6] || "",
            usesABBMotors: values[7] || "",
            sourceNotes: values[8] || "",
          });
        }
      }
    }

    return data;
  } catch (error) {
    console.error("Error fetching OEM data:", error);
    return [];
  }
};

// Helper function to parse CSV line with proper handling of quoted fields
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};

// Analytics functions for the OEM data
export const getOEMAnalytics = (data: OEMCompany[]) => {
  // ABB Motor Usage Distribution
  const abbUsageData = data.reduce((acc, company) => {
    const status = company.usesABBMotors;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const abbUsageChart = Object.entries(abbUsageData).map(([status, count]) => ({
    name:
      status === "Yes"
        ? "Confirmed Users"
        : status === "Potential"
        ? "Potential Users"
        : status === "Unknown"
        ? "Unknown Status"
        : status === "Inferred"
        ? "Inferred Users"
        : status,
    value: count,
    percentage: ((count / data.length) * 100).toFixed(1),
    fill:
      status === "Yes"
        ? "#22c55e"
        : status === "Potential"
        ? "#3b82f6"
        : status === "Unknown"
        ? "#ef4444"
        : status === "Inferred"
        ? "#f59e0b"
        : "#6b7280",
  }));

  // State-wise Distribution
  const stateData = data.reduce((acc, company) => {
    const state = company.state;
    if (state && state !== "N/A") {
      acc[state] = (acc[state] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topStates = Object.entries(stateData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([state, count]) => ({
      state,
      companies: count,
      percentage: ((count / data.length) * 100).toFixed(1),
    }));

  // Equipment Category Distribution
  const oemTypeData = data.reduce((acc, company) => {
    const oemType = company.oemType;
    const parts = oemType.split(" - ");
    const equipmentType = parts[0] || oemType;

    let category = "";
    const equipmentLower = equipmentType.toLowerCase();

    if (equipmentLower.includes("pump")) {
      category = "Pumps";
    } else if (equipmentLower.includes("compressor")) {
      category = "Compressors";
    } else if (equipmentLower.includes("fan") || equipmentLower.includes("blower")) {
      category = "Fans/Blowers";
    } else if (equipmentLower.includes("gearbox") || equipmentLower.includes("gear")) {
      category = "Gearboxes";
    } else if (equipmentLower.includes("conveyor")) {
      category = "Conveyors";
    } else {
      category = equipmentType;
    }

    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const equipmentDistribution = Object.entries(oemTypeData)
    .sort(([, a], [, b]) => b - a)
    .map(([type, count]) => ({
      equipment: type,
      companies: count,
      percentage: ((count / data.length) * 100).toFixed(1),
    }));

  // Market Opportunity Analysis by Equipment Type
  const marketAnalysis = Object.entries(oemTypeData).map(([equipment, total]) => {
    const equipmentCompanies = data.filter(company => {
      const equipmentType = company.oemType.split(" - ")[0] || company.oemType;
      const equipmentLower = equipmentType.toLowerCase();
      
      if (equipment === "Pumps") return equipmentLower.includes("pump");
      if (equipment === "Compressors") return equipmentLower.includes("compressor");
      if (equipment === "Fans/Blowers") return equipmentLower.includes("fan") || equipmentLower.includes("blower");
      if (equipment === "Gearboxes") return equipmentLower.includes("gearbox") || equipmentLower.includes("gear");
      if (equipment === "Conveyors") return equipmentLower.includes("conveyor");
      return equipmentType === equipment;
    });

    const confirmed = equipmentCompanies.filter(c => c.usesABBMotors === "Yes").length;
    const potential = equipmentCompanies.filter(c => c.usesABBMotors === "Potential").length;
    const inferred = equipmentCompanies.filter(c => c.usesABBMotors === "Inferred").length;

    return {
      equipment,
      total,
      confirmed,
      potential,
      inferred,
      unknown: total - confirmed - potential - inferred,
      penetrationRate: ((confirmed / total) * 100).toFixed(1),
      opportunityScore: potential + (inferred * 0.5),
    };
  }).sort((a, b) => b.opportunityScore - a.opportunityScore);

  // Regional Analysis with ABB Usage
  const regionalAnalysis = Object.entries(stateData).map(([state, total]) => {
    const stateCompanies = data.filter(company => company.state === state);
    const confirmed = stateCompanies.filter(c => c.usesABBMotors === "Yes").length;
    const potential = stateCompanies.filter(c => c.usesABBMotors === "Potential").length;
    
    return {
      state,
      total,
      confirmed,
      potential,
      penetrationRate: total > 0 ? ((confirmed / total) * 100).toFixed(1) : "0",
      marketPotential: potential,
    };
  }).sort((a, b) => b.total - a.total).slice(0, 10);

  // Business Intelligence Metrics
  const totalConfirmed = abbUsageData["Yes"] || 0;
  const totalPotential = abbUsageData["Potential"] || 0;
  const totalInferred = abbUsageData["Inferred"] || 0;
  const totalUnknown = (abbUsageData["Unknown"] || 0) + (abbUsageData["Information Unavailable"] || 0);

  const metrics = {
    totalCompanies: {
      value: data.length.toLocaleString(),
      change: 0,
      changeType: "neutral" as const,
      description: "Total OEM Companies in Database",
    },
    marketPenetration: {
      value: ((totalConfirmed / data.length) * 100).toFixed(1) + "%",
      change: 0,
      changeType: "increase" as const,
      description: "Current ABB Market Penetration",
    },
    businessOpportunity: {
      value: (totalPotential + totalInferred + Math.floor(totalUnknown * 0.3)).toLocaleString(),
      change: 0,
      changeType: "increase" as const,
      description: "Estimated Business Opportunities",
    },
    geographicReach: {
      value: Object.keys(stateData).length.toString(),
      change: 0,
      changeType: "neutral" as const,
      description: "States with OEM Presence",
    },
    highValueTargets: {
      value: marketAnalysis.slice(0, 2).reduce((sum, cat) => sum + cat.potential, 0).toString(),
      change: 0,
      changeType: "increase" as const,
      description: "High-Priority Potential Customers",
    },
    confirmedRevenue: {
      value: totalConfirmed.toString(),
      change: 0,
      changeType: "increase" as const,
      description: "Confirmed ABB Motor Users",
    },
  };

  return {
    abbUsageChart,
    topStates,
    equipmentDistribution,
    marketAnalysis,
    regionalAnalysis,
    metrics,
    businessInsights: {
      topEquipmentCategory: equipmentDistribution[0]?.equipment || "N/A",
      topState: topStates[0]?.state || "N/A",
      averagePenetration: (
        regionalAnalysis.reduce((sum, r) => sum + parseFloat(r.penetrationRate), 0) / 
        regionalAnalysis.length
      ).toFixed(1),
      totalMarketPotential: totalPotential + totalInferred,
    },
  };
};
