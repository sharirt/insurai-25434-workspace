import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import { CheckCircle2, AlertTriangle, TrendingUp, Globe, PieChart, BarChart3, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IAnalyzePortfolioRiskActionOutput } from "@/product-types";

interface RiskResultsProps {
  result: IAnalyzePortfolioRiskActionOutput;
}

function getRiskConfig(level: string) {
  if (level === "סיכון גבוה") {
    return {
      bg: "bg-destructive/15",
      text: "text-destructive",
      border: "border-destructive/30",
      Icon: AlertTriangle,
    };
  }
  if (level === "סיכון ממוצע") {
    return {
      bg: "bg-chart-4/15",
      text: "text-chart-4",
      border: "border-chart-4/30",
      Icon: BarChart3,
    };
  }
  return {
    bg: "bg-chart-3/15",
    text: "text-chart-3",
    border: "border-chart-3/30",
    Icon: ShieldCheck,
  };
}

const breakdownItems = [
  { key: "equityExposure" as const, label: "חשיפה למניות", icon: TrendingUp },
  { key: "foreignExposure" as const, label: "חשיפה לחו\"ל", icon: Globe },
  { key: "diversification" as const, label: "פיזור", icon: PieChart },
  { key: "returns" as const, label: "תשואות", icon: BarChart3 },
];

export const RiskResults = ({ result }: RiskResultsProps) => {
  if (!result) return null;

  const riskLevel = result?.riskLevel ?? "סיכון ממוצע";
  const config = getRiskConfig(riskLevel);
  const RiskIcon = config.Icon;

  return (
    <div className="flex flex-col gap-6" style={{ direction: "rtl" }}>
      <Card className={cn("border-2", config.border, config.bg)}>
        <CardContent className="flex flex-col items-center gap-3 py-8">
          <RiskIcon className={cn("size-12", config.text)} />
          <p className={cn("text-2xl font-bold", config.text)}>{riskLevel}</p>
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
                    <Icon className="text-primary" />
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

      {(result?.strengths?.length || result?.improvements?.length) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result?.strengths && result.strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>נקודות חוזק</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {result.strengths.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-chart-3/10 p-3">
                    <CheckCircle2 className="text-chart-3 shrink-0 mt-0.5" />
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
                    <AlertTriangle className="text-chart-4 shrink-0 mt-0.5" />
                    <p className="text-sm">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
};