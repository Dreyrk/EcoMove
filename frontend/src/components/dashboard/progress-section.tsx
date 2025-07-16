import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressChart } from "@/components/progress-chart";

interface ProgressSectionProps {
  data: {
    date: string;
    bike: number;
    walk: number;
  }[];
}

export default function ProgressSection({ data }: ProgressSectionProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Progression sur 30 jours</CardTitle>
        <CardDescription>Votre activité quotidienne du dernier mois</CardDescription>
      </CardHeader>
      <CardContent>
        <ProgressChart data={data} />
      </CardContent>
    </Card>
  );
}
