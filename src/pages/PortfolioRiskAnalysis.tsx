import { useState } from "react";
import { ShieldAlert, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useExecuteAction } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { AnalyzePortfolioRiskAction } from "@/product-types";
import { toast } from "sonner";
import { ClientSelector } from "@/components/ClientSelector";
import { RiskResults } from "@/components/RiskResults";
import { FundsList } from "@/components/FundsList";
import type { IAnalyzePortfolioRiskActionOutput } from "@/product-types";

function parseRiskResult(raw: unknown): IAnalyzePortfolioRiskActionOutput | null {
  if (!raw) return null;
  const obj = raw as Record<string, unknown>;

  // Case 1: result has riskScore directly
  if (typeof obj.riskScore === "number") {
    return obj as unknown as IAnalyzePortfolioRiskActionOutput;
  }

  // Case 2: nested in structuredOutput
  if (obj.structuredOutput && typeof obj.structuredOutput === "object") {
    const so = obj.structuredOutput as Record<string, unknown>;
    if (typeof so.riskScore === "number") {
      return so as unknown as IAnalyzePortfolioRiskActionOutput;
    }
  }

  // Case 3: result is a JSON string
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.riskScore === "number") {
        return parsed as IAnalyzePortfolioRiskActionOutput;
      }
    } catch { /* not JSON */ }
  }

  // Case 4: result.text is a JSON string
  if (typeof obj.text === "string") {
    try {
      const parsed = JSON.parse(obj.text);
      if (parsed && typeof parsed.riskScore === "number") {
        return parsed as IAnalyzePortfolioRiskActionOutput;
      }
    } catch { /* not JSON */ }
  }

  return null;
}

const DEFAULT_PROMPT = `אתה מנתח פיננסי מומחה המתמחה בתיקי פנסיה וחיסכון ישראליים. לפניך נתוני תיק השקעות פנסיוני מלאים. ספק ניתוח מפורט בטקסט חופשי בעברית. התייחס לנקודות הבאות: 1) חשיפה למניות (equityExposure) - ממוצע משוקלל לפי יתרה. 2) חשיפה לחו"ל (foreignExposure) - ממוצע משוקלל. 3) פיזור בין מסלולים וסוגי מוצרים. 4) תשואות היסטוריות (12 חודשים, 3 שנים, 5 שנים). 5) יחס בין מוצרים פעילים ולא פעילים. 6) השוואת דמי ניהול בין המוצרים. 7) המלצות ספציפיות לשיפור התיק.

חשוב: אם אין מסלולי השקעה זמינים עבור מוצר מסוים, נתח את רמת הסיכון לפי סוג המוצר ושם התוכנית. לדוגמה: קרן השתלמות או פנסיה עם שם תוכנית המכיל "מניות" הוא סיכון גבוה, "כללי" הוא סיכון בינוני, "אג״ח" או "כספי" הוא סיכון נמוך. השתמש בנתוני המוצר עצמו (סוג מוצר, שם תוכנית, יצרן, סטטוס, יתרה כוללת, דמי ניהול) כדי להעריך את רמת הסיכון.`;

export default function PortfolioRiskAnalysis() {
  const [selectedClientId, setSelectedClientId] = useState("");
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [promptOpen, setPromptOpen] = useState(false);

  const { executeFunction, result, streamResult, isLoading } = useExecuteAction(
    AnalyzePortfolioRiskAction
  );

  const rawResult = result ?? streamResult;
  const parsedResult = parseRiskResult(rawResult);

  const handleAnalyze = async () => {
    try {
      await executeFunction({
        clientId: selectedClientId,
        prompt,
      });
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

          {parsedResult && <RiskResults result={parsedResult} />}
        </>
      )}
    </div>
  );
}