import { useState, useEffect } from "react";
import { ShieldAlert, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useExecuteAction, useEntityGetAll } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { AnalyzePortfolioRiskAction, FundsEntity, InvestmentTracksEntity } from "@/product-types";
import { toast } from "sonner";
import { ClientSelector } from "@/components/ClientSelector";
import { RiskResults, FundBaseData } from "@/components/RiskResults";
import { TracksBreakdown } from "@/components/TracksBreakdown";
import type { IAnalyzePortfolioRiskActionOutput, IInvestmentTracksEntity } from "@/product-types";

const DEFAULT_PROMPT = `אתה מנתח פיננסי מומחה המתמחה בתיקי פנסיה וחיסכון ישראליים.

הנתונים הבאים הוכנו עבורך ומכילים שתי רמות מידע:
(א) נתוני מוצר/קופה — סוג מוצר, שם תוכנית, יצרן, סטטוס (פעיל/לא פעיל), יתרה כוללת, דמי ניהול מהפקדה ומצבירה.
(ב) מסלולי השקעה לכל מוצר — שם מסלול, סכום צבירה, משקל בתוך המוצר ובתיק הכולל, חשיפה למניות, חשיפה לחו"ל, תשואות (12 חודשים, 3 שנים, 5 שנים).

נתח כל מוצר/קופה בנפרד עם סעיף ייעודי משלו, ולאחר מכן ספק ניתוח כולל של התיק.

התייחס לנושאים הבאים:
1) רמת סיכון כוללת של התיק.
2) ניתוח לפי מוצר — לכל מוצר ציין רמת סיכון, נקודות חוזק ונקודות לשיפור.
3) הערכת פיזור — בין מוצרים, מסלולים וסוגי חשיפה.
4) השוואת דמי ניהול בין המוצרים.
5) יחס בין מוצרים פעילים ולא פעילים.
6) המלצות ספציפיות לשיפור התיק.

הערה חשובה: אם למוצר מסוים אין מסלולי השקעה, הסק את רמת הסיכון מסוג המוצר ושם התוכנית — שם המכיל "מניות" = סיכון גבוה, "כללי" = סיכון ממוצע, "אג״ח" או "כספי" = סיכון נמוך.`;

export default function PortfolioRiskAnalysis() {
  const [selectedClientId, setSelectedClientId] = useState("");
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [promptOpen, setPromptOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<IAnalyzePortfolioRiskActionOutput | null>(null);

  const { executeFunction, isLoading } = useExecuteAction(AnalyzePortfolioRiskAction);

  const { data: funds } = useEntityGetAll(FundsEntity, { clientId: selectedClientId }, { enabled: !!selectedClientId });
  const { data: allTracks } = useEntityGetAll(InvestmentTracksEntity);

  useEffect(() => {
    setAnalysisResult(null);
  }, [selectedClientId]);

  const getClientTracks = () => {
    if (!funds?.length || !allTracks?.length) return [];
    const policyNumbers = new Set(funds.map((f: any) => f.policyNumber).filter(Boolean));
    return allTracks.filter((t: any) => policyNumbers.has(t.policyNumber));
  };

  const buildFundBaseDataMap = (): Record<string, FundBaseData> => {
    if (!funds?.length || !allTracks?.length) return {};
    const clientTracks = getClientTracks();
    const positiveTracks = clientTracks.filter(
      (t: any) => t.trackAccumulationAmount != null && t.trackAccumulationAmount > 0
    );
    const allClientFunds = funds ?? [];
    const tracksByPolicy: Record<string, any[]> = {};
    for (const t of positiveTracks) {
      const pn = t.policyNumber ?? "__none__";
      if (!tracksByPolicy[pn]) tracksByPolicy[pn] = [];
      tracksByPolicy[pn].push(t);
    }
    const wAvg = (tracks: any[], field: string) => {
      const total = tracks.reduce((s: number, t: any) => s + (t.trackAccumulationAmount ?? 0), 0);
      if (total === 0) return 0;
      return tracks.reduce(
        (s: number, t: any) => s + ((t[field] as number) ?? 0) * (t.trackAccumulationAmount ?? 0),
        0
      ) / total;
    };
    const map: Record<string, FundBaseData> = {};
    for (const f of allClientFunds) {
      const fundTracks = tracksByPolicy[f.policyNumber ?? ""] ?? [];
      if (fundTracks.length === 0) continue;
      const fundTotal = fundTracks.reduce((s: number, t: any) => s + (t.trackAccumulationAmount ?? 0), 0);
      map[f.planName ?? ""] = {
        equityExposure: wAvg(fundTracks, "equityExposure"),
        foreignExposure: wAvg(fundTracks, "foreignExposure"),
        return12Months: wAvg(fundTracks, "return12Months"),
        return3Years: wAvg(fundTracks, "return3Years"),
        return5Years: wAvg(fundTracks, "return5Years"),
        managementFeeDeposits: f.managementFeeDeposits ?? null,
        managementFeeAccumulation: f.managementFeeAccumulation ?? null,
        fundTotal,
        trackCount: fundTracks.length,
      };
    }
    return map;
  };

  const fundBaseDataMap = buildFundBaseDataMap();

  const buildEnrichedPrompt = () => {
    const clientTracks = getClientTracks();
    const positiveTracks = clientTracks.filter(
      (t: any) => t.trackAccumulationAmount != null && t.trackAccumulationAmount > 0
    );

    const allClientFunds = funds ?? [];
    // Only include funds that have at least one track with positive accumulation
    const clientFunds = allClientFunds.filter((f: any) => {
      const fundTracks = positiveTracks.filter((t: any) => t.policyNumber === f.policyNumber);
      return fundTracks.length > 0;
    });
    if (clientFunds.length === 0) return prompt;

    // Group tracks by fund policyNumber
    const tracksByPolicy: Record<string, any[]> = {};
    for (const t of positiveTracks) {
      const pn = t.policyNumber ?? "__none__";
      if (!tracksByPolicy[pn]) tracksByPolicy[pn] = [];
      tracksByPolicy[pn].push(t);
    }

    // Overall portfolio totals
    const totalPortfolioValue = positiveTracks.reduce(
      (sum: number, t: any) => sum + (t.trackAccumulationAmount ?? 0),
      0
    );

    const weightedAvg = (tracks: any[], field: keyof IInvestmentTracksEntity) => {
      const total = tracks.reduce((s: number, t: any) => s + (t.trackAccumulationAmount ?? 0), 0);
      if (total === 0) return 0;
      return tracks.reduce(
        (s: number, t: any) => s + ((t[field] as number) ?? 0) * (t.trackAccumulationAmount ?? 0),
        0
      ) / total;
    };

    // Build per-fund sections
    const fundSections = clientFunds.map((f: any) => {
      const header = `\n--- מוצר: ${f.planName ?? "לא ידוע"} ---
סוג מוצר: ${f.productType ?? "לא ידוע"}
יצרן: ${f.providerName ?? "לא ידוע"}
סטטוס: ${f.status ?? "לא ידוע"}
יתרה כוללת: ${(f.totalBalance ?? 0).toLocaleString()}
דמי ניהול מהפקדה: ${f.managementFeeDeposits ?? "לא ידוע"}
דמי ניהול מצבירה: ${f.managementFeeAccumulation ?? "לא ידוע"}`;

      const fundTracks = tracksByPolicy[f.policyNumber ?? ""] ?? [];
      if (fundTracks.length === 0) {
        return header + "\nמסלולי השקעה: אין מסלולים זמינים";
      }

      const fundTotal = fundTracks.reduce((s: number, t: any) => s + (t.trackAccumulationAmount ?? 0), 0);
      const trackLines = fundTracks.map((t: any) => {
        const fundWeight = fundTotal > 0 ? ((t.trackAccumulationAmount ?? 0) / fundTotal) * 100 : 0;
        const portfolioWeight = totalPortfolioValue > 0 ? ((t.trackAccumulationAmount ?? 0) / totalPortfolioValue) * 100 : 0;
        return `  - ${t.trackName ?? "לא ידוע"} | צבירה: ${(t.trackAccumulationAmount ?? 0).toLocaleString()} | משקל במוצר: ${fundWeight.toFixed(1)}% | משקל בתיק: ${portfolioWeight.toFixed(1)}% | חשיפה למניות: ${((t.equityExposure ?? 0) * 100).toFixed(1)}% | חשיפה לחו"ל: ${((t.foreignExposure ?? 0) * 100).toFixed(1)}% | תשואה 12 חודשים: ${((t.return12Months ?? 0) * 100).toFixed(2)}% | תשואה 3 שנים: ${((t.return3Years ?? 0) * 100).toFixed(2)}% | תשואה 5 שנים: ${((t.return5Years ?? 0) * 100).toFixed(2)}%`;
      }).join("\n");

      const fundAvg = `ממוצעים משוקללים למוצר: חשיפה למניות ${(weightedAvg(fundTracks, "equityExposure") * 100).toFixed(1)}% | חשיפה לחו"ל ${(weightedAvg(fundTracks, "foreignExposure") * 100).toFixed(1)}% | תשואה 12 חודשים ${(weightedAvg(fundTracks, "return12Months") * 100).toFixed(2)}% | תשואה 3 שנים ${(weightedAvg(fundTracks, "return3Years") * 100).toFixed(2)}% | תשואה 5 שנים ${(weightedAvg(fundTracks, "return5Years") * 100).toFixed(2)}%`;

      return header + "\nמסלולי השקעה:\n" + trackLines + "\n" + fundAvg;
    }).join("\n");

    // Overall weighted averages
    let overallSection = "";
    if (totalPortfolioValue > 0) {
      overallSection = `\n\n--- סיכום כולל של התיק ---
שווי תיק כולל: ${totalPortfolioValue.toLocaleString()}
חשיפה ממוצעת משוקללת למניות: ${(weightedAvg(positiveTracks, "equityExposure") * 100).toFixed(1)}%
חשיפה ממוצעת משוקללת לחו"ל: ${(weightedAvg(positiveTracks, "foreignExposure") * 100).toFixed(1)}%
תשואה ממוצעת משוקללת 12 חודשים: ${(weightedAvg(positiveTracks, "return12Months") * 100).toFixed(2)}%
תשואה ממוצעת משוקללת 3 שנים: ${(weightedAvg(positiveTracks, "return3Years") * 100).toFixed(2)}%
תשואה ממוצעת משוקללת 5 שנים: ${(weightedAvg(positiveTracks, "return5Years") * 100).toFixed(2)}%`;
    }

    return prompt + "\n\n--- נתוני התיק ---" + fundSections + overallSection;
  };

  const handleAnalyze = async () => {
    try {
      const enrichedPrompt = buildEnrichedPrompt();
      const response = await executeFunction({
        clientId: selectedClientId,
        prompt: enrichedPrompt,
      });
      setAnalysisResult(response as IAnalyzePortfolioRiskActionOutput);
    } catch {
      toast.error("שגיאה בניתוח התיק. נסה שוב.");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto" style={{ direction: "rtl" }}>
      <div className="flex items-center gap-3">
        <ShieldAlert className="text-primary" />
        <h1 className="text-2xl font-bold text-foreground">
          ניתוח סיכון תיק השקעות
        </h1>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">בחר לקוח</label>
        <ClientSelector value={selectedClientId} onChange={setSelectedClientId} />
      </div>

      {!selectedClientId && (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <ShieldAlert className="size-12 opacity-30" />
            <p className="text-lg">בחר לקוח כדי לצפות בתיק ההשקעות שלו</p>
          </CardContent>
        </Card>
      )}

      {selectedClientId && (
        <>
          <Card>
            <CardContent className="flex flex-col gap-4 pt-6">
              <Collapsible open={promptOpen} onOpenChange={setPromptOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-0">
                    <ChevronDown
                      className={`transition-transform ${promptOpen ? "rotate-180" : ""}`}
                    />
                    <span>עריכת פרומפט</span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={8}
                    className="mt-2"
                  />
                </CollapsibleContent>
              </Collapsible>

              <Button
                onClick={handleAnalyze}
                disabled={!selectedClientId || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" data-icon="inline-start" />
                    מנתח תיק...
                  </>
                ) : (
                  <>
                    <ShieldAlert data-icon="inline-start" />
                    נתח תיק
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {analysisResult && (
            <>
              <RiskResults result={analysisResult} fundBaseDataMap={fundBaseDataMap} />
              <TracksBreakdown funds={funds ?? []} allTracks={allTracks ?? []} />
            </>
          )}
        </>
      )}
    </div>
  );
}