import { Progress } from "../ui/progress";

export default function ActivityItem({
  label,
  icon,
  value,
  percent,
}: {
  label: string;
  icon: React.ReactNode;
  value: number;
  percent: number;
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold">{value} km</div>
          <div className="text-xs text-muted-foreground">{Math.round(percent)}%</div>
        </div>
      </div>
      <Progress value={percent} className="h-2" />
    </>
  );
}
