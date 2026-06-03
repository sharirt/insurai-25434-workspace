import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { Markdown } from "@/components/ui/markdown";
import type { IAnalyzePortfolioRiskActionOutput } from "@/product-types";

interface RiskResultsProps {
  result: IAnalyzePortfolioRiskActionOutput;
}

const getRiskColor = (score: number) => {
  if (score <= 3) return "bg-chart-3";
  if (score <= 6) return "bg-chart-4";
  return "bg-destructive";
};

const getRiskProgressColor = (score: number) => {
  if (score <= 3) return "[&>div]:bg-chart-3";
  if (score <= 6) return "[&>div]:bg-chart-4";
  return "[&>div]:bg-destructive";
};

export const RiskResults = ({ result }: RiskResultsProps) => {
  const { riskScore, riskLabel, summary, strengths, improvements, breakdown } = result;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <div className="text-5xl font-bold text-foreground">
            {riskScore} / 10
          </div>
          <Progress
            value={riskScore * 10}
            className={`h-4 w-full max-w-md ${getRiskProgressColor(riskScore)}`}
          />
          <Badge variant="secondary" className="text-base px-4 py-1">
            {riskLabel}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>סיכום</CardTitle>
        </CardHeader>
        <CardContent>
          <Markdown>{summary}</Markdown>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {breakdown?.equityExposure && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">חשיפה למניות</CardTitle>
            </CardHeader>
            <CardContent>
              <Markdown>{breakdown.equityExposure}</Markdown>
            </CardContent>
          </Card>
        )}
        {breakdown?.foreignExposure && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">חשיפה לחו&quot;ל</CardTitle>
            </CardHeader>
            <CardContent>
              <Markdown>{breakdown.foreignExposure}</Markdown>
            </CardContent>
          </Card>
        )}
        {breakdown?.diversification && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">פיזור</CardTitle>
            </CardHeader>
            <CardContent>
              <Markdown>{breakdown.diversification}</Markdown>
            </CardContent>
          </Card>
        )}
        {breakdown?.returns && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">תשואות</CardTitle>
            </CardHeader>
            <CardContent>
              <Markdown>{breakdown.returns}</Markdown>
            </CardContent>
          </Card>
        )}
      </div>

      {strengths && strengths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>נקודות חוזק</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="text-chart-3 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {improvements && improvements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>נקודות לשיפור</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {improvements.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <AlertTriangle className="text-chart-4 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};