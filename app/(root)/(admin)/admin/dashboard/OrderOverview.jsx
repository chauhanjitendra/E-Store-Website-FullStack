"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";

export const description = "A bar chart";

const chartData = [
  { month: "January", amount: 286 },
  { month: "February", amount: 350 },
  { month: "March", amount: 437 },
  { month: "April", amount: 230 },
  { month: "May", amount: 209 },
  { month: "June", amount: 214 },
  { month: "July", amount: 210 },
  { month: "August", amount: 310 },
  { month: "September", amount: 350 },
  { month: "October", amount: 414 },
  { month: "November", amount: 450 },
  { month: "December", amount: 484 },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const chartConfig = {
  amount: {
    label: "Amount",
    // color: "var(--chart-1)",
    color: "#8b51ff",
  },
};

export function OrderOverview() {
  const [liveChartData, setLiveChartData] = useState([]);
  const { data: monthlySales, loading } = useFetch(
    "/api/dashboard/admin/monthly",
  );

  useEffect(() => {
    if (monthlySales && monthlySales.success) {
      const getChartData = months.map((month, index) => {
        const monthData = monthlySales.data.find(item => item?._id?.month === index + 1)
        return {
          month: month,
          amount: monthData ? monthData.totalSales : 0
        }
      })
      setLiveChartData(getChartData);
    }
  }, [monthlySales]);

  return (
    <div>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={liveChartData.length > 0 ? liveChartData : chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            // cursor={false}
            cursor={true}
            content={<ChartTooltipContent />}
          />
          <Bar dataKey="amount" fill="var(--color-amount)" radius={8} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
