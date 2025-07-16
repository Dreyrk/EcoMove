import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function StatCard({
  title,
  icon,
  value,
  subtitle,
}: {
  title: string;
  icon: React.ReactNode;
  value: string;
  subtitle: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
