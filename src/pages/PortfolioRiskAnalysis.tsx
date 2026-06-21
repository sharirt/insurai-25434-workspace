import { useState, useEffect } from "react";
import { ShieldAlert, ChevronDown, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  useExecuteAction,
  useEntityGetOne,
  useEntityUpdate,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import {
  AnalyzePortfolioRiskAction,
  ClientsEntity,
} from "@/product-types";
import { toast } from "sonner";
import { ClientSelector } from "@/components/ClientSelector";
import { RiskResults } from "@/components/RiskResults";
import { FundsList } from "@/components/FundsList";
import { format } from "date-fns";
import type { IAnalyzePortfolioRiskActionOutput } from "@/product-types";

const DEFAULT_PROMPT = `אתה מנתח פיננסי מומחה המתמחה בתיקי פנסיה וחיסכון ישראליים. לפניך נתוני תיק השקעות פנסיוני מלאים. ספק ניתוח מפורט בטקסט חופשי בעברית. התייחס לנקודות הבאות: 1) חשיפה למניות (equityExposure) - ממוצע משוקלל לפי יתרה. 2) חשיפה לחו"ל (foreignExposure) - ממוצע משוקלל. 3) פיזור בין מסלולים וסוגי מוצרים. 4) תשואות היסטוריות (12 חודשים, 3 שנים, 5 שנים). 5) יחס בין מוצרים פעילים ולא פעילים. 6) השוואת דמי ניהול בין המוצרים. 7) המלצות ספציפיות לשיפור התיק.

חשוב: אם אין מסלולי השקעה זמינים עבור מוצר מסוים, נתח את רמת הסיכון לפי סוג המוצר ושם התוכנית. לדוגמה: קרן השתלמות או פנסיה עם שם תוכנית המכיל "מניות" הוא סיכון גבוה, "כללי" הוא סיכון בינוני, "אג״ח" או "כספי" הוא סיכון נמוך. השתמש בנתוני המוצר עצמו (סוג מוצר, שם תוכנית, יצרן, סטטוס, יתרה כוללת, דמי ניהול) כדי להעריך את רמת הסיכון.`;

export default function PortfolioRiskAnalysis() {
  const [selectedClientId, setSelectedClientId] = useState("");
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [promptOpen, setPromptOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<IAnalyzePortfolioRiskActionOutput | null>(null);
  const [isNewAnalysis, setIsNewAnalysis] = useState(false);

  const { executeFunction, isLoading } = useExecuteAction(AnalyzePortfolioRiskAction);

  const { data: clientData, isLoading: isLoadingClient } = useEntityGetOne(
    ClientsEntity,
    { id: selectedClientId },
    { enabled: !!selectedClientId }
  );

  const { updateFunction, isLoading: isSaving } = useEntityUpdate(ClientsEntity);

  // Reset when client changes
  useEffect(() => {
    setAnalysisResult(null);
    setIsNewAnalysis(false);
  }, [selectedClientId]);

  // Load saved analysis when client data arrives
  useEffect(() => {
    if (clientData?.riskAnalysis?.riskScore) {
      setAnalysisResult(clientData.riskAnalysis as IAnalyzePortfolioRiskActionOutput);
      setIsNewAnalysis(false);
    }
  }, [clientData]);

  const handleAnalyze = async () => {
    try {
      const response = await executeFunction({
        clientId: selectedClientId,
        prompt,
      });
      setAnalysisResult(response as IAnalyzePortfolioRiskActionOutput);
      setIsNewAnalysis(true);
    } catch {
      toast.error("שגיאה בניתוח התיק. נסה שוב.");
    }
  };

  const handleSave = async () => {
    if (!selectedClientId || !analysisResult) return;
    try {
      await updateFunction({
        id: selectedClientId,
        data: {
          riskAnalysis: {
            ...analysisResult,
            analyzedAt: new Date().toISOString(),
          },
        },
      });
      toast.success("הניתוח נשמר בהצלחה");
      setIsNewAnalysis(false);
    } catch {
      toast.error("שגיאה בשמירת הניתוח");
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

          {isLoadingClient && !analysisResult && (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {analysisResult && (
            <>
              <RiskResults result={analysisResult} />

              <div className="flex items-center justify-center">
                {isNewAnalysis ? (
                  <Badge variant="outline" className="border-chart-4 text-chart-4 bg-chart-4/10">
                    ניתוח חדש
                  </Badge>
                ) : clientData?.riskAnalysis?.analyzedAt ? (
                  <Badge variant="secondary" className="flex items-center gap-1.5">
                    <Calendar className="size-3" />
                    ניתוח אחרון: {format(new Date(clientData.riskAnalysis.analyzedAt), "dd/MM/yyyy")}
                  </Badge>
                ) : null}
              </div>

              {isNewAnalysis && (
                <Button onClick={handleSave} disabled={isSaving} className="w-full">
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin" data-icon="inline-start" />
                      שומר...
                    </>
                  ) : (
                    "שמור ניתוח"
                  )}
                </Button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}