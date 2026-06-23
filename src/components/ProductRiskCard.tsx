import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle2, AlertTriangle, TrendingUp, Globe, PieChart, BarChart3, ShieldCheck, Building2, Banknote, ChevronDown, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getRiskConfig, findBaseData, fmtPct, fmtFee, BaseDataItem } from "@/components/RiskResults";
import type { FundBaseData } from "@/components/RiskResults";

interface ProductRiskCardProps {
  product: any;
  fundBaseDataMap?: Record<string, FundBaseData>;
}

export const ProductRiskCard = ({ product, fundBaseDataMap }: ProductRiskCardProps) => {
  const [isBaseDataOpen, setIsBaseDataOpen] = useState(false);

  const prodConfig = getRiskConfig(product.riskLevel);
  const borderColor = product.riskLevel === "סיכון גבוה"
    ? "border-r-destructive"
    : product.riskLevel === "סיכון ממוצע"
      ? "border-r-chart-4"
      : "border-r-chart-3";

  const ext = product as typeof product & { providerName?: string; trackName?: string; amount?: number; portfolioPercentage?: number };
  const chips: { icon: typeof Building2; label: string; value: string }[] = [];
  if (ext.providerName) chips.push({ icon: Building2, label: "יצרן", value: ext.providerName });
  if (ext.trackName) chips.push({ icon: TrendingUp, label: "שם מסלול", value: ext.trackName });
  if (ext.amount != null) chips.push({ icon: Banknote, label: "סכום מושקע", value: `₪${ext.amount.toLocaleString("he-IL")}` });
  if (ext.portfolioPercentage != null) chips.push({ icon: PieChart, label: "אחוז מהתיק", value: `${ext.portfolioPercentage.toFixed(2)}%` });

  const baseData = findBaseData(fundBaseDataMap, product.productName, ext.providerName);

  return (
    <Card className={cn("border-r-4", borderColor)}>
      <CardHeader>
        <div className="flex items-center gap-3 flex-wrap">
          <CardTitle className="text-base font-bold">{product.productName}</CardTitle>
          <Badge variant="outline" className={cn("text-xs", prodConfig.badgeBg)}>
            {product.riskLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {chips.length > 0 && (
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
        )}
        <Collapsible open={isBaseDataOpen} onOpenChange={setIsBaseDataOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs gap-1.5 h-7">
              <Database className="size-3.5" />
              נתוני בסיס
              <ChevronDown className={cn("size-3.5 transition-transform", isBaseDataOpen && "rotate-180")} />
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
        <p className="text-sm text-muted-foreground leading-relaxed">{product.analysis}</p>

        {((product.strengths && product.strengths.length > 0) || (product.issues && product.issues.length > 0)) && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-chart-3">✓ נקודות חוזקה</p>
              {product.strengths?.map((s: string, i: number) => (
                <div key={i} className="flex items-start gap-2 bg-chart-3/10 rounded-lg p-3">
                  <CheckCircle2 className="text-chart-3 shrink-0 mt-0.5" />
                  <p className="text-sm">{s}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-chart-4">⚠ נקודות חולשה</p>
              {product.issues?.map((issue: string, i: number) => (
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
};