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
import { RiskResults } from "@/components/RiskResults";
import { FundsList } from "@/components/FundsList";
import type { IAnalyzePortfolioRiskActionOutput, IInvestmentTracksEntity } from "@/product-types";

const DEFAULT_PROMPT = `אתה מנתח פיננסי מומחה המתמחה בתיקי פנסיה וחיסכון ישראליים. לפניך נתוני תיק השקעות פנסיוני מלאים, כולל ממוצעים משוקללים מחושבים מראש. ספק ניתוח מפורט בטקסט חופשי בעברית. התייחס לנקודות הבאות:

1) חשיפה למניות (equityExposure) - השתמש בממוצע המשוקלל המחושב מראש שסופק בנתונים. אל תחשב מחדש.
2) חשיפה לחו"ל (foreignExposure) - השתמש בממוצע המשוקלל המחושב מראש שסופק בנתונים. אל תחשב מחדש.
3) פיזור בין מסלולים וסוגי מוצרים - השתמש במשקל של כל מסלול בתיק כדי להעריך את רמת הפיזור.
4) תשואות היסטוריות (12 חודשים, 3 שנים, 5 שנים) - השתמש בממוצעים המשוקללים המחושבים מראש.
5) יחס בין מוצרים פעילים ולא פעילים.
6) השוואת דמי ניהול בין המוצרים.
7) המלצות ספציפיות לשיפור התיק.

הערות חשובות:
- הנתונים כוללים רק מסלולים עם יתרה חיובית (כבר מסוננים).
- משקל כל מסלול בתיק הכולל מסופק - השתמש בו להקשר.
- הממוצעים המשוקללים כבר מחושבים - אין צורך לחשב אותם מחדש, פשוט השתמש בהם בניתוח.

חשוב: אם אין מסלולי השקעה זמינים עבור מוצר מסוים, נתח את רמת הסיכון לפי סוג המוצר ושם התוכנית. לדוגמה: קרן השתלמות או פנסיה עם שם תוכנית המכיל "מניות" הוא סיכון גבוה, "כללי" הוא סיכון בינוני, "אג״ח" או "כספי" הוא סיכון נמוך. השתמש בנתוני המוצר עצמו (סוג מוצר, שם תוכנית, יצרן, סטטוס, יתרה כוללת, דמי ניהול) כדי להעריך את רמת הסיכון.`;

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

  const buildEnrichedPrompt = () => {
    const clientTracks = getClientTracks();
    const positiveTracks = clientTracks.filter(
      (t: any) => t.trackAccumulationAmount != null && t.trackAccumulationAmount > 0
    );

    if (positiveTracks.length === 0) return prompt;

    const totalPortfolioValue = positiveTracks.reduce(
      (sum: number, t: any) => sum + (t.trackAccumulationAmount ?? 0),
      0
    );

    const weightedAvg = (field: keyof IInvestmentTracksEntity) =>
      positiveTracks.reduce(
        (sum: number, t: any) => sum + ((t[field] as number) ?? 0) * (t.trackAccumulationAmount ?? 0),
        0
      ) / totalPortfolioValue;

    const weightedEquityExposure = weightedAvg("equityExposure");
    const weightedForeignExposure = weightedAvg("foreignExposure");
    const weightedReturn12 = weightedAvg("return12Months");
    const weightedReturn3Y = weightedAvg("return3Years");
    const weightedReturn5Y = weightedAvg("return5Years");

    const trackDetails = positiveTracks
      .map((t: any) => {
        const weight = ((t.trackAccumulationAmount ?? 0) / totalPortfolioValue) * 100;
        return `- ${t.trackName ?? "לא ידוע"} | צבירה: ${(t.trackAccumulationAmount ?? 0).toLocaleString()} | משקל: ${weight.toFixed(1)}% | חשיפה למניות: ${((t.equityExposure ?? 0) * 100).toFixed(1)}% | חשיפה לחו"ל: ${((t.foreignExposure ?? 0) * 100).toFixed(1)}% | תשואה 12 חודשים: ${((t.return12Months ?? 0) * 100).toFixed(2)}% | תשואה 3 שנים: ${((t.return3Years ?? 0) * 100).toFixed(2)}% | תשואה 5 שנים: ${((t.return5Years ?? 0) * 100).toFixed(2)}%`;
      })
      .join("\n");

    const dataSuffix = `\n\n--- נתוני סיכום משוקללים מחושבים מראש ---
שווי תיק כולל: ${totalPortfolioValue.toLocaleString()}
חשיפה ממוצעת משוקללת למניות: ${(weightedEquityExposure * 100).toFixed(1)}%
חשיפה ממוצעת משוקללת לחו"ל: ${(weightedForeignExposure * 100).toFixed(1)}%
תשואה ממוצעת משוקללת 12 חודשים: ${(weightedReturn12 * 100).toFixed(2)}%
תשואה ממוצעת משוקללת 3 שנים: ${(weightedReturn3Y * 100).toFixed(2)}%
תשואה ממוצעת משוקללת 5 שנים: ${(weightedReturn5Y * 100).toFixed(2)}%

פירוט מסלולים (רק מסלולים עם יתרה חיובית):
${trackDetails}`;

    return prompt + dataSuffix;
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
          <FundsList clientId={selectedClientId} />

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
            <RiskResults result={analysisResult} />
          )}
        </>
      )}
    </div>
  );
}