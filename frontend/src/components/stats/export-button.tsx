import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
  data: {
    rank: number;
    name: string;
    team: string;
    totalKm: number;
    avgDaily: number;
  }[];
  isExporting: boolean;
  setIsExporting: (value: boolean) => void;
}

export default function ExportButton({ data, isExporting, setIsExporting }: ExportButtonProps) {
  const handleExport = () => {
    setIsExporting(true);

    setTimeout(() => {
      const csv = [
        ["Rank", "Name", "Team", "Total KM", "Daily Average"],
        ...data.map((row) => [row.rank, row.name, row.team, row.totalKm, row.avgDaily]),
      ]
        .map((line) => line.join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ecomove-rankings.csv";
      a.click();
      URL.revokeObjectURL(url);
      setIsExporting(false);
    }, 1000);
  };

  return (
    <Button onClick={handleExport} disabled={isExporting}>
      <Download className="h-4 w-4 mr-2" />
      {isExporting ? "Exporting..." : "Export CSV"}
    </Button>
  );
}
