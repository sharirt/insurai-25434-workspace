import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle2, AlertTriangle, TrendingUp, Globe, PieChart, BarChart3, ShieldCheck, Building2, Banknote, ChevronDown, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { IAnalyzePortfolioRiskActionOutput } from "@/product-types";

export interface FundBaseData {
  equityExposure: number;
  foreignExposure: number;
  return12Months: number;
  return3Years: number;
  return5Years: number;
  managementFeeDeposits: number | null;
  managementFeeAccumulation: number | null;
  fundTotal: number;
  trackCount: number;
}

interface RiskResultsProps {
  result: IAnalyzePortfolioRiskActionOutput;
  fundBaseDataMap?: Record<string, FundBaseData>;
}

function getRiskConfig(level: string) {
  if (level === "סיכון גבוה") {
    return {
      bg: "bg-destructive/15",
      text: "text-destructive",
      border: "border-destructive/30",
      badgeBg: "bg-destructive/15 text-destructive border-destructive/30",
      Icon: AlertTriangle,
    };
  }
  if (level === "סיכון ממוצע") {
    return {
      bg: "bg-chart-4/15",
      text: "text-chart-4",
      border: "border-chart-4/30",
      badgeBg: "bg-chart-4/15 text-chart-4 border-chart-4/30",
      Icon: BarChart3,
    };
  }
  return {
    bg: "bg-chart-3/15",
    text: "text-chart-3",
    border: "border-chart-3/30",
    badgeBg: "bg-chart-3/15 text-chart-3 border-chart-3/30",
    Icon: ShieldCheck,
  };
}

const breakdownItems = [
  { key: "equityExposure" as const, label: "חשיפה למניות", icon: TrendingUp },
  { key: "foreignExposure" as const, label: "חשיפה לחו\"ל", icon: Globe },
  { key: "diversification" as const, label: "פיזור", icon: PieChart },
  { key: "returns" as const, label: "תשואות", icon: BarChart3 },
];

const fmtPct = (val: number | null | undefined, decimals: number) => {
  if (val == null || val === 0) return "—";
  return `${(val * 100).toFixed(decimals)}%`;
};

const fmtFee = (val: number | null | undefined) => {
  if (val == null || val === 0) return null;
  return `${val}%`;
};

function findBaseData(
  map: Record<string, FundBaseData> | undefined,
  productName: string | undefined,
  providerName: string | undefined
): FundBaseData | undefined {
  if (!map || !productName) return undefined;
  // 1. Exact match
  if (map[productName]) return map[productName];
  const pName = productName.trim().toLowerCase();
  const keys = Object.keys(map);
  // 2. Case-insensitive partial match
  for (const key of keys) {
    const k = key.trim().toLowerCase();
    if (k.includes(pName) || pName.includes(k)) return map[key];
  }
  // 3. Match by provider name
  if (providerName) {
    const prov = providerName.trim().toLowerCase();
    for (const key of keys) {
      if (pName.includes(prov) || key.trim().toLowerCase().includes(prov)) return map[key];
    }
  }
  return undefined;
}

const BaseDataItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground">{value}</span>
  </div>
);

export const RiskResults = ({ result, fundBaseDataMap }: RiskResultsProps) => {
  const [openBaseData, setOpenBaseData] = useState<Record<number, boolean>>({});

  if (!result) return null;

  const riskLevel = result?.riskLevel ?? "סיכון ממוצע";
  const config = getRiskConfig(riskLevel);
  const RiskIcon = config.Icon;

  const productAnalysis = result?.productAnalysis?.filter((p: any) => p.amount != null && p.amount > 0);

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
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
          </CardContent>
        </Card>
      )}

      {productAnalysis && productAnalysis.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">ניתוח לפי מוצר</h2>
          {productAnalysis.map((product, idx) => {
            const prodConfig = getRiskConfig(product.riskLevel);
            const borderColor = product.riskLevel === "סיכון גבוה"
              ? "border-r-destructive"
              : product.riskLevel === "סיכון ממוצע"
                ? "border-r-chart-4"
                : "border-r-chart-3";
            return (
              <Card key={idx} className={cn("border-r-4", borderColor)}>
                <CardHeader>
                  <div className="flex items-center gap-3 flex-wrap">
                    <CardTitle className="text-base font-bold">{product.productName}</CardTitle>
                    <Badge variant="outline" className={cn("text-xs", prodConfig.badgeBg)}>
                      {product.riskLevel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {(() => {
                    const ext = product as typeof product & { providerName?: string; trackName?: string; amount?: number; portfolioPercentage?: number };
                    const chips: { icon: typeof Building2; label: string; value: string }[] = [];
                    if (ext.providerName) chips.push({ icon: Building2, label: "יצרן", value: ext.providerName });
                    if (ext.trackName) chips.push({ icon: TrendingUp, label: "שם מסלול", value: ext.trackName });
                    if (ext.amount != null) chips.push({ icon: Banknote, label: "סכום מושקע", value: `₪${ext.amount.toLocaleString("he-IL")}` });
                    if (ext.portfolioPercentage != null) chips.push({ icon: PieChart, label: "אחוז מהתיק", value: `${ext.portfolioPercentage.toFixed(2)}%` });
                    if (chips.length === 0) return null;
                    return (
                      <div className="flex flex-wrap gap-2">
                        {chips.map((chip, ci) => {
                          const ChipIcon = chip.icon;
                          return (
                            <span key={ci} className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                              <ChipIcon className="size-3.5 shrink-0" />
                              <span className="font-medium">{chip.label}:</span>
                              <span>{chip.value}</span>
                            </span>
                          );
                        })}
                      </div>
                    );
                  })()}
                  {(() => {
                    const ext = product as typeof product & { providerName?: string };
                    const baseData = findBaseData(fundBaseDataMap, product.productName, ext.providerName);
                    return (
                      <Collapsible open={!!openBaseData[idx]} onOpenChange={(val) => setOpenBaseData(prev => ({ ...prev, [idx]: val }))}>
                        <CollapsibleTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs gap-1.5 h-7">
                            <Database className="size-3.5" />
                            נתוני בסיס
                            <ChevronDown className={cn("size-3.5 transition-transform", openBaseData[idx] && "rotate-180")} />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          {baseData ? (
                            <div className="bg-muted/50 rounded-lg p-3 mt-2">
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <BaseDataItem label="חשיפה למניות" value={fmtPct(baseData.equityExposure, 1)} />
                                <BaseDataItem label='חשיפה לחו"ל' value={fmtPct(baseData.foreignExposure, 1)} />
                                <BaseDataItem label="תשואה 12 חודשים" value={fmtPct(baseData.return12Months, 2)} />
                                <BaseDataItem label="תשואה 3 שנים" value={fmtPct(baseData.return3Years, 2)} />
                                <BaseDataItem label="תשואה 5 שנים" value={fmtPct(baseData.return5Years, 2)} />
                                {fmtFee(baseData.managementFeeDeposits) && <BaseDataItem label="דמי ניהול מהפקדה" value={fmtFee(baseData.managementFeeDeposits)!} />}
                                {fmtFee(baseData.managementFeeAccumulation) && <BaseDataItem label="דמי ניהול מצבירה" value={fmtFee(baseData.managementFeeAccumulation)!} />}
                                <BaseDataItem label="סה״כ צבירה" value={`₪${baseData.fundTotal?.toLocaleString("he-IL") ?? "—"}`} />
                                <BaseDataItem label="מספר מסלולים" value={String(baseData.trackCount ?? 0)} />
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground mt-2">אין נתוני בסיס זמינים למוצר זה</p>
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })()}
                  <p className="text-sm text-muted-foreground leading-relaxed">{product.analysis}</p>

                  {((product.strengths && product.strengths.length > 0) || (product.issues && product.issues.length > 0)) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <p className="text-xs font-semibold text-chart-3">✓ נקודות חוזקה</p>
                        {product.strengths?.map((s, i) => (
                          <div key={i} className="flex items-start gap-2 bg-chart-3/10 rounded-lg p-3">
                            <CheckCircle2 className="text-chart-3 shrink-0 mt-0.5" />
                            <p className="text-sm">{s}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-xs font-semibold text-chart-4">⚠ נקודות חולשה</p>
                        {product.issues?.map((issue, i) => (
                          <div key={i} className="flex items-start gap-2 bg-chart-4/10 rounded-lg p-3">
                            <AlertTriangle className="text-chart-4 shrink-0 mt-0.5" />
                            <p className="text-sm">{issue}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
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