"use client";

// JobStatisticsChart — weekly job views vs applied bar chart using Recharts.
// Matches the visual style from the dashboard screenshots.

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import type { ChartDataPoint } from "@/types/dashboard";

interface Props {
  data: ChartDataPoint[];
}

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-heading-dark text-white text-xs rounded-lg px-3 py-2 shadow-lg">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: <span className="font-bold text-white">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function JobStatisticsChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barGap={4} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          width={28}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(79,70,229,0.04)" }} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "#6b7280", paddingTop: 8 }}
          iconType="circle"
          iconSize={8}
        />
        <Bar dataKey="jobViews"  name="Job View"    fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={18} />
        <Bar dataKey="jobApplied" name="Job Applied" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
