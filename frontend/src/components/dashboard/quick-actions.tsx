import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
        <CardDescription>Que souhaitez-vous faire?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <a
          href="/activity/new"
          className="flex items-center justify-between p-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
          <div>
            <p className="font-medium">Enregistrer l&apos;activité du jour</p>
            <p className="text-sm text-muted-foreground">Ajoutez votre déplacement eco-friendly</p>
          </div>
          <Badge variant="outline">Nouveau</Badge>
        </a>

        <a
          href="/stats"
          className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
          <div>
            <p className="font-medium">Voir le classement complet</p>
            <p className="text-sm text-muted-foreground">Consultez tous les participants et équipes</p>
          </div>
        </a>
      </CardContent>
    </Card>
  );
}
