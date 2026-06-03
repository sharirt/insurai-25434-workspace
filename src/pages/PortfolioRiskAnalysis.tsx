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

const DEFAULT_PROMPT = `אתה מנתח פיננסי מומחה המתמחה בתיקי פנסיה וחיסכון ישראליים. לפניך נתוני תיק השקעות פנסיוני מלאים. נתח את רמת הסיכון הכוללת של התיק על סקאלה של 1-10 (1=שמרני מאוד, 10=אגרסיבי מאוד). התייחס לנקודות הבאות: 1) חשיפה למניות (equityExposure) - ממוצע משוקלל לפי יתרה. 2) חשיפה לחו"ל (foreignExposure) - ממוצע משוקלל. 3) פיזור בין מסלולים וסוגי מוצרים. 4) תשואות היסטוריות (12 חודשים, 3 שנים, 5 שנים). 5) יחס בין מוצרים פעילים ולא פעילים. החזר ניתוח מפורט הכולל: ציון סיכון, תווית רמת הסיכון, סיכום, נקודות חוזק, נקודות לשיפור, ופירוט לפי קטגוריות.`;

export default function PortfolioRiskAnalysis() {
  const [selectedClientId, setSelectedClientId] = useState("");
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [promptOpen, setPromptOpen] = useState(false);

  const { executeFunction, result, isLoading, error } = useExecuteAction(
    AnalyzePortfolioRiskAction
  );

  const handleAnalyze = async () => {
    try {
      await executeFunction({
        clientId: selectedClientId,
        prompt,
      });
    } catch (err: any) {
      const message = err?.message || "";
      if (message.includes("no funds") || message.includes("לא נמצאו")) {
        toast.error("לא נמצאו מוצרים פנסיוניים עבור לקוח זה");
      } else {
        toast.error("שגיאה בניתוח התיק. נסה שוב.");
      }
    }
  };

  if (error && !result) {
    const errorMessage = (error as any)?.message || "";
    if (!errorMessage.includes("no funds") && !errorMessage.includes("לא נמצאו")) {
      toast.error("שגיאה בניתוח התיק. נסה שוב.");
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto" style={{ direction: "rtl" }}>
      <div className="flex items-center gap-3">
        <ShieldAlert className="text-primary" />
        <h1 className="text-2xl font-bold text-foreground">
          ניתוח סיכון תיק השקעות
        </h1>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <label className="text-sm font-medium text-foreground">בחר לקוח</label>
          <ClientSelector value={selectedClientId} onChange={setSelectedClientId} />

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
                מנתח...
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

      {!selectedClientId && !result && (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <ShieldAlert className="size-12 opacity-30" />
            <p className="text-lg">בחר לקוח כדי לנתח את תיק ההשקעות שלו</p>
          </CardContent>
        </Card>
      )}

      {result && <RiskResults result={result} />}
    </div>
  );
}