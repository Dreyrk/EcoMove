"use client";

import { Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ProgressData {
  date: string;
  bike: number;
  walk: number;
}

interface ProgressChartProps {
  data: ProgressData[];
}

const chartConfig = {
  bike: {
    label: "Velo",
    color: "var(--chart-1)",
  },
  walk: {
    label: "Marche",
    color: "var(--chart-2)",
  },
};

export function ProgressChart({ data }: ProgressChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("fr-FR", { month: "short", day: "numeric" }),
    total: item.bike + item.walk,
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] max-w-full w-full h-full">
      <LineChart data={formattedData}>
        <XAxis dataKey="date" tickLine={false} axisLine={false} className="text-xs" />
        <YAxis tickLine={false} axisLine={false} className="text-xs" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="bike"
          stroke="var(--color-bike)"
          strokeWidth={2}
          dot={{ fill: "var(--color-bike)", strokeWidth: 2, r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="walk"
          stroke="var(--color-walk)"
          strokeWidth={2}
          dot={{ fill: "var(--color-walk)", strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
