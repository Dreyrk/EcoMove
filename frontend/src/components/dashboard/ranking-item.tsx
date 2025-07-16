import { Badge } from "../ui/badge";

export default function RankingItem({
  title,
  description,
  value,
  variant,
}: {
  title: string;
  description: string;
  value: string;
  variant: "default" | "secondary";
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Badge variant={variant} className="text-lg font-bold">
        {value}
      </Badge>
    </div>
  );
}
