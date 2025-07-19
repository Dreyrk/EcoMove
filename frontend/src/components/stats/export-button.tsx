import { Button } from "@/components/ui/button";
import { IndividualRankingType, TeamRankingType } from "@/types";
import { Download } from "lucide-react";

interface ExportButtonProps {
  data: IndividualRankingType[] | TeamRankingType[];
  isExporting: boolean;
  setIsExporting: (value: boolean) => void;
}

export default function ExportButton({ data, isExporting, setIsExporting }: ExportButtonProps) {
  const handleExport = () => {
    setIsExporting(true);

    setTimeout(() => {
      exportToCSV(data);
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

// Fonction utilitaire pour exporter les données du classement (individuel ou équipe) au format CSV
function exportToCSV(data: (IndividualRankingType | TeamRankingType)[]) {
  // Si aucune donnée n’est présente, on lève une erreur
  if (data.length === 0) {
    throw new Error("Aucune donnée à exporter.");
  }

  // On récupère le premier élément pour déterminer s’il s’agit d’un classement individuel ou d’équipe
  const firstRow = data[0];

  // Déclaration des entêtes et des lignes du CSV
  let headers: string[];
  let rows: (string | number)[][];

  // Si les données correspondent à un classement individuel
  if (isIndividual(firstRow)) {
    headers = ["Rang", "Nom", "Équipe", "Total KM", "Moyenne Journalière", "Badge"];

    // On force ici le typage du tableau pour que TypeScript comprenne que tous les éléments sont bien du type IndividualRankingType
    const individualData = data as IndividualRankingType[];

    // On formate chaque ligne à exporter en CSV
    rows = individualData.map((row) => [
      row.rank,
      row.name,
      row.team,
      row.totalKm,
      row.avgDaily,
      row.badge ?? "", // Si badge est null, on insère une chaîne vide
    ]);
  } else {
    // Sinon, il s’agit d’un classement par équipe
    headers = ["Rang", "Équipe", "Total KM", "Membres", "Moyenne/Utilisateur", "Badge"];

    const teamData = data as TeamRankingType[];

    rows = teamData.map((row) => [row.rank, row.name, row.totalKm, row.members, row.avgPerUser, row.badge ?? ""]);
  }

  // On assemble le contenu CSV : chaque ligne est jointe par des virgules, chaque ligne par des sauts de ligne
  const csvContent = [headers, ...rows]
    .map((line) =>
      line
        .map((value) =>
          // Si une valeur texte contient une virgule, on l'entoure de guillemets
          typeof value === "string" && value.includes(",") ? `"${value}"` : value
        )
        .join(",")
    )
    .join("\n");

  // On crée un Blob contenant le contenu CSV (type MIME pour du texte CSV encodé en UTF-8)
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // On génère une URL temporaire pour le Blob
  const url = URL.createObjectURL(blob);

  // On crée un lien <a> temporaire pour déclencher le téléchargement du fichier CSV
  const link = document.createElement("a");
  link.href = url;
  link.download = "ecomove-rankings.csv";
  document.body.appendChild(link);
  link.click(); // Téléchargement
  document.body.removeChild(link); // Nettoyage du DOM

  // On libère l'URL temporaire
  URL.revokeObjectURL(url);
}

// Type guard : permet à TypeScript de distinguer entre IndividualRankingType et TeamRankingType
function isIndividual(row: IndividualRankingType | TeamRankingType): row is IndividualRankingType {
  // On considère qu'un individu possède les propriétés "avgDaily" et "team"
  return "avgDaily" in row && "team" in row;
}
