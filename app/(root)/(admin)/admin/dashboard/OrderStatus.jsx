"use client";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Label } from "recharts";
export const description = "A donut chart";

const chartConfig = {
  pending: {
    label: "Pending",
    color: "#3b82f6",
  },
  processing: {
    label: "Processing",
    color: "#eab308",
  },
  shipped: {
    label: "Shipped",
    color: "#06b6d4",
  },
  delivered: {
    label: "Delivered",
    color: "#22c55e",
  },
  cancelled: {
    label: "Cancelled",
    color: "#ef4444",
  },
  unverified: {
    label: "Unverified",
    color: "#f97316",
  },
};

export function OrderStatus() {
  const { data: statusData, loading } = useFetch("/api/dashboard/admin/order-status");
  const [chartData, setChartData] = useState([
    { status: "pending", count: 0, fill: "var(--color-pending)" },
    { status: "processing", count: 0, fill: "var(--color-processing)" },
    { status: "shipped", count: 0, fill: "var(--color-shipped)" },
    { status: "delivered", count: 0, fill: "var(--color-delivered)" },
    { status: "cancelled", count: 0, fill: "var(--color-cancelled)" },
    { status: "unverified", count: 0, fill: "var(--color-unverified)" },
  ]);

  useEffect(() => {
    if (statusData && statusData.success) {
      const updatedData = chartData.map(item => {
        const found = statusData.data.find(d => d._id === item.status);
        return {
          ...item,
          count: found ? found.count : 0
        };
      });
      setChartData(updatedData);
    }
  }, [statusData]);

  const totalOrders = chartData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            innerRadius={60}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalOrders}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Orders Status
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="">
        <ul>
          {chartData.map((item) => (
            <li key={item.status} className="flex justify-between items-center mb-3 text-sm capitalize">
              <span>{item.status}</span>
              <span className={`rounded-full px-2 text-sm text-white`} style={{ backgroundColor: chartConfig[item.status]?.color }}>
                {item.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
