import React from "react";
import { PieChart, Pie, Cell, Label } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart as PieChartIcon } from "lucide-react";
import { useThemeMode } from "@blocksdiy/blocks-client-sdk/reactSdk";
import type { IFundsEntity } from "@/product-types";

const DARK_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#F43F5E",
  "#8B5CF6",
  "#06B6D4",
];

const LIGHT_COLORS = [
  "#60A5FA",
  "#34D399",
  "#FBBF24",
  "#F87171",
  "#A78BFA",
  "#22D3EE",
];

interface FundsProviderPieChartProps {
  funds: (IFundsEntity & { id: string })[];
  isLoading: boolean;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `₪${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `₪${(value / 1_000).toFixed(0)}K`;
  }
  return formatCurrency(value);
}

const RADIAN = Math.PI / 180;

interface OutsideLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  percent: number;
  name: string;
  lineOpacity: number;
}

function renderOutsideLabelFactory(lineOpacity: number) {
  return function renderOutsideLabel({ cx, cy, midAngle, outerRadius, percent, name }: Omit<OutsideLabelProps, "lineOpacity">) {
    if (percent < 0.04) return null;

    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);
    const mx = cx + (outerRadius + 16) * cos;
    const my = cy + (outerRadius + 16) * sin;
    const ex = cx + (outerRadius + 40) * cos;
    const ey = cy + (outerRadius + 40) * sin;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <path
          d={`M${cx + outerRadius * cos},${cy + outerRadius * sin}L${mx},${my}L${ex},${ey}`}
          stroke="#FFFFFF"
          strokeOpacity={lineOpacity}
          strokeWidth={1}
          fill="none"
        />
        <text
          x={ex + (cos >= 0 ? 4 : -4)}
          y={ey}
          textAnchor={textAnchor}
          fill="#FFFFFF"
          fontSize={12}
          fontWeight={600}
        >
          {name}
        </text>
        <text
          x={ex + (cos >= 0 ? 4 : -4)}
          y={ey + 16}
          textAnchor={textAnchor}
          fill="#FFFFFF"
          fillOpacity={0.7}
          fontSize={11}
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };
}

interface ThemeStyles {
  cardStyle: React.CSSProperties;
  skeletonBg: string;
  skeletonBgLight: string;
  titleColor: string;
  descColor: string;
  centerLabelColor: string;
  centerTotalColor: string;
  pillBg: string;
  pillNameColor: string;
  pillAmountColor: string;
  emptyIconColor: string;
  emptyTextColor: string;
  colors: string[];
  lineOpacity: number;
}

function getThemeStyles(isDark: boolean): ThemeStyles {
  if (isDark) {
    return {
      cardStyle: {
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        borderColor: "rgba(255,255,255,0.1)",
      },
      skeletonBg: "rgba(255,255,255,0.1)",
      skeletonBgLight: "rgba(255,255,255,0.06)",
      titleColor: "#FFFFFF",
      descColor: "rgba(255,255,255,0.5)",
      centerLabelColor: "rgba(255,255,255,0.6)",
      centerTotalColor: "#FFFFFF",
      pillBg: "rgba(255,255,255,0.07)",
      pillNameColor: "#FFFFFF",
      pillAmountColor: "rgba(255,255,255,0.5)",
      emptyIconColor: "rgba(255,255,255,0.4)",
      emptyTextColor: "rgba(255,255,255,0.5)",
      colors: DARK_COLORS,
      lineOpacity: 0.4,
    };
  }
  return {
    cardStyle: {
      background: "linear-gradient(135deg, #1A2B4A 0%, #2E5090 100%)",
      borderColor: "rgba(255,255,255,0.15)",
    },
    skeletonBg: "rgba(255,255,255,0.12)",
    skeletonBgLight: "rgba(255,255,255,0.12)",
    titleColor: "#FFFFFF",
    descColor: "rgba(255,255,255,0.6)",
    centerLabelColor: "rgba(255,255,255,0.65)",
    centerTotalColor: "#FFFFFF",
    pillBg: "rgba(255,255,255,0.12)",
    pillNameColor: "#FFFFFF",
    pillAmountColor: "rgba(255,255,255,0.55)",
    emptyIconColor: "rgba(255,255,255,0.4)",
    emptyTextColor: "rgba(255,255,255,0.5)",
    colors: LIGHT_COLORS,
    lineOpacity: 0.5,
  };
}

export const FundsProviderPieChart = ({ funds, isLoading }: FundsProviderPieChartProps) => {
  const { themeMode } = useThemeMode();
  const isDark = themeMode === "dark" || themeMode === "system";
  const theme = getThemeStyles(isDark);

  if (isLoading) {
    return (
      <Card className="border overflow-hidden" style={theme.cardStyle}>
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-48" style={{ backgroundColor: theme.skeletonBg }} />
          <Skeleton className="h-4 w-32" style={{ backgroundColor: theme.skeletonBgLight }} />
        </CardHeader>
        <CardContent className="pt-6">
          <Skeleton className="h-[420px] w-full" style={{ backgroundColor: theme.skeletonBgLight }} />
          <Skeleton className="h-12 w-full mt-4" style={{ backgroundColor: theme.skeletonBgLight }} />
        </CardContent>
      </Card>
    );
  }

  const grouped = new Map<string, number>();
  funds?.forEach((fund) => {
    const name = fund.providerName?.trim() || "לא ידוע";
    const balance = fund.totalBalance || 0;
    grouped.set(name, (grouped.get(name) || 0) + balance);
  });

  const chartData = Array.from(grouped.entries())
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (chartData.length === 0) {
    return (
      <Card className="border overflow-hidden" style={theme.cardStyle}>
        <CardHeader>
          <CardTitle style={{ color: theme.titleColor }}>התפלגות צבירה לפי יצרן</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <PieChartIcon style={{ color: theme.emptyIconColor }} />
            <p className="font-medium" style={{ color: theme.emptyTextColor }}>אין נתוני צבירה להצגה</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  const chartConfig: Record<string, { label: string; color: string }> = {};
  chartData.forEach((item, index) => {
    chartConfig[item.name] = {
      label: item.name,
      color: theme.colors[index % theme.colors.length],
    };
  });

  const outsideLabelRenderer = renderOutsideLabelFactory(theme.lineOpacity);

  return (
    <Card className="border overflow-hidden" style={theme.cardStyle}>
      <CardHeader>
        <CardTitle className="text-lg font-bold" style={{ color: theme.titleColor }}>
          התפלגות צבירה לפי יצרן
        </CardTitle>
        <CardDescription style={{ color: theme.descColor }}>
          סה״כ {chartData.length} יצרנים
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <ChartContainer config={chartConfig} className="min-h-[420px] w-full">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(Number(value))}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={130}
              strokeWidth={0}
              label={outsideLabelRenderer}
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={theme.colors[index % theme.colors.length]}
                />
              ))}
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
                          y={(viewBox.cy || 0) - 12}
                          fill={theme.centerLabelColor}
                          fontSize={13}
                        >
                          סה״כ
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 14}
                          fill={theme.centerTotalColor}
                          fontSize={18}
                          fontWeight={700}
                        >
                          {formatCompactCurrency(total)}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          {chartData.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center gap-2 rounded-full px-3 py-1.5"
              style={{ backgroundColor: theme.pillBg }}
            >
              <span
                className="inline-block size-2.5 rounded-full shrink-0"
                style={{ backgroundColor: theme.colors[index % theme.colors.length] }}
              />
              <span className="text-sm font-medium" style={{ color: theme.pillNameColor }}>{item.name}</span>
              <span className="text-xs" style={{ color: theme.pillAmountColor }}>{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};