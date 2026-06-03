import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import type { IAnalyzePortfolioRiskActionOutput } from "@/product-types";

interface RiskResultsProps {
  result: IAnalyzePortfolioRiskActionOutput;
}

export const RiskResults = ({ result }: RiskResultsProps) => {
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle>ניתוח AI</CardTitle>
      </CardHeader>
      <CardContent>
        <Markdown>{result?.summary ?? ""}</Markdown>
      </CardContent>
    </Card>
  );
};