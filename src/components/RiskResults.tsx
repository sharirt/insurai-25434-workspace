import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, TrendingUp, Globe, PieChart, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IAnalyzePortfolioRiskActionOutput } from "@/product-types";

interface RiskResultsProps {
  result: IAnalyzePortfolioRiskActionOutput;
}

function getRiskColor(score: number) {
  if (score <= 3) return { bg: "bg-chart-3/20", text: "text-chart-3", border: "border-chart-3" };
  if (score <= 6) return { bg: "bg-chart-4/20", text: "text-chart-4", border: "border-chart-4" };
  return { bg: "bg-destructive/20", text: "text-destructive", border: "border-destructive" };
}

const breakdownItems = [
  { key: "equityExposure" as const, label: "חשיפה למניות", icon: TrendingUp },
  { key: "foreignExposure" as const, label: "חשיפה לחו\"ל", icon: Globe },
  { key: "diversification" as const, label: "פיזור", icon: PieChart },
  { key: "returns" as const, label: "תשואות", icon: BarChart3 },
];

export const RiskResults = ({ result }: RiskResultsProps) => {
  if (!result) return null;

  const score = result?.riskScore;
  const riskColor = getRiskColor(score ?? 5);

  return (
    <div className="flex flex-col gap-6" style={{ direction: "rtl" }}>
      <Card>
        <CardContent className="flex items-center gap-6 pt-6">
          {score != null && (
            <div className={cn("flex items-center justify-center rounded-full size-20 border-4 shrink-0", riskColor.bg, riskColor.border)}>
              <span className={cn("text-3xl font-bold", riskColor.text)}>{score}</span>
            </div>
          )}
          <div className="flex flex-col gap-1">
            {result?.riskLabel && (
              <Badge variant="secondary" className="w-fit text-base px-3 py-1">
                {result.riskLabel}
              </Badge>
            )}
            <p className="text-sm text-muted-foreground">ציון סיכון מ-1 (שמרני) עד 10 (אגרסיבי)</p>
          </div>
        </CardContent>
      </Card>

      {result?.summary && (
        <Card>
          <CardHeader>
            <CardTitle>סיכום ניתוח</CardTitle>
          </CardHeader>
          <CardContent>
            <Markdown>{result.summary}</Markdown>
          </CardContent>
        </Card>
      )}

      {result?.breakdown && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {breakdownItems.map((item) => {
            const value = result.breakdown?.[item.key];
            if (!value) return null;
            const Icon = item.icon;
            return (
              <Card key={item.key}>
                <CardContent className="flex items-start gap-3 pt-6">
                  <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                    <Icon className="text-primary" data-icon="inline-start" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {result?.strengths && result.strengths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>נקודות חוזק</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {result.strengths.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-chart-3/10 p-3">
                <CheckCircle2 className="text-chart-3 shrink-0 mt-0.5" data-icon="inline-start" />
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {result?.improvements && result.improvements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>נקודות לשיפור</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {result.improvements.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-chart-4/10 p-3">
                <AlertTriangle className="text-chart-4 shrink-0 mt-0.5" data-icon="inline-start" />
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};