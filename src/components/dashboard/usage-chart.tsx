"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UsageChartProps {
  data: Array<{
    createdAt: Date;
    _sum: {
      credits: number | null;
    };
  }>;
}

export function UsageChart({ data }: UsageChartProps) {
  const chartData = data.map((item) => ({
    date: item.createdAt.toLocaleDateString(),
    credits: item._sum.credits || 0,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="credits"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={{ fill: "#0ea5e9", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#0ea5e9", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
