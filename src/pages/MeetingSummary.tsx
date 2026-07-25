import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Sparkles, Loader2, User, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { getPageUrl } from "@/lib/utils";
import {
  useEntityGetAll,
  useEntityGetOne,
  useEntityCreate,
  useExecuteAction,
  useUser,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import {
  ProvidersEntity,
  RequestSchemesEntity,
  ClientsEntity,
  NewMeetingWizardPage,
  ParseMeetingSummaryActionAction,
  MeetingSummariesEntity,
} from "@/product-types";
import { STATIC_TRACK_KEYS } from "@/utils/fieldTranslations";
import { ClientSelectionSection } from "@/components/ClientSelectionSection";
import { AudioRecorder } from "@/components/AudioRecorder";
import { SummaryHistoryList } from "@/components/SummaryHistoryList";

export default function MeetingSummary() {
  const navigate = useNavigate();
  const user = useUser();
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("id");
  const [summary, setSummary] = useState("");
  const [processedResult, setProcessedResult] = useState<any>(null);
  const [isExistingClient, setIsExistingClient] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Restore draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem("meetingSummary_draft");
    if (draft) {
      setSummary(draft);
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    if (summary) {
      localStorage.setItem("meetingSummary_draft", summary);
    } else {
      localStorage.removeItem("meetingSummary_draft");
    }
  }, [summary]);

  const { data: clientRecord } = useEntityGetOne(ClientsEntity, { id: clientId || "" }, { enabled: !!clientId });
  const { createFunction: createSummaryRecord } = useEntityCreate(MeetingSummariesEntity);

  const { data: providers } = useEntityGetAll(ProvidersEntity);
  const { data: requestSchemes } = useEntityGetAll(RequestSchemesEntity);
  const { data: clients } = useEntityGetAll(ClientsEntity);

  const { executeFunction, isLoading } = useExecuteAction(
    ParseMeetingSummaryActionAction
  );

  const handleTranscription = (text: string) => {
    setSummary(prev => prev ? prev + "\n" + text : text);
  };

  const navigateToWizard = (result: any, navClientId: string | null, createNew?: boolean) => {
    sessionStorage.setItem("meetingSummaryData", JSON.stringify({ ...result, clientId: navClientId }));
    let wizardUrl = getPageUrl(NewMeetingWizardPage) + "?fromSummary=true";
    if (navClientId) {
      wizardUrl += `&id=${navClientId}`;
    }
    if (createNew) {
      wizardUrl += "&createNewClient=true";
    }
    navigate(wizardUrl);
  };

  const handleProcess = async () => {
    if (!summary.trim()) return;

    try {
      const result = await executeFunction({
        summary: summary.trim(),
        availableProviders: (providers || []).map((p) => ({
          id: p.id,
          name: p.provider_name,
        })),
        availableRequestTypes: (requestSchemes || []).map((s) => ({
          id: s.id,
          name: s.requestTypeName,
        })),
        availableTrackKeys: STATIC_TRACK_KEYS,
        allClients: (clients || []).map((c) => ({
          id: c.id,
          first_name: c.first_name,
          last_name: c.last_name,
          national_id: c.national_id,
        })),
      });

      // Clear localStorage on successful AI processing
      localStorage.removeItem("meetingSummary_draft");

      // Auto-save summary record (fire-and-forget)
      try {
        let resolvedClientName = "";
        if (result?.clientUpdates?.first_name || result?.clientUpdates?.last_name) {
          resolvedClientName = [result?.clientUpdates?.first_name, result?.clientUpdates?.last_name].filter(Boolean).join(" ");
        } else if (result?.clientId && clients) {
          const matched = clients.find((c: any) => c.id === result.clientId);
          if (matched) {
            resolvedClientName = [matched.first_name, matched.last_name].filter(Boolean).join(" ");
          }
        }
        createSummaryRecord({
          data: {
            rawText: summary,
            extractedData: result as any,
            agentEmail: user?.email || "",
            clientName: resolvedClientName || undefined,
            requestCount: result?.requests?.length ?? 0,
          },
        });
      } catch (_) {
        // silent
      }

      // Case 1: Pre-selected clientId from URL
      if (clientId) {
        navigateToWizard(result, clientId);
        return;
      }

      // Case 2: AI matched a client
      if (result?.clientId) {
        navigateToWizard(result, result.clientId);
        return;
      }

      // Case 3: No client found - show selection UI
      setProcessedResult(result);
    } catch (err: any) {
      toast.error(err?.message || "שגיאה בעיבוד הסיכום. נסה שוב.");
    }
  };

  const handleSaveAsSummary = async () => {
    if (!summary.trim()) return;
    setIsSaving(true);
    try {
      await createSummaryRecord({
        data: {
          rawText: summary,
          agentEmail: user?.email || "",
          requestCount: 0,
          clientName: undefined,
          extractedData: undefined,
        },
      });
      toast.success("הסיכום נשמר בהצלחה");
      localStorage.removeItem("meetingSummary_draft");
      setSummary("");
    } catch (err: any) {
      toast.error(err?.message || "שגיאה בשמירת הסיכום");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClientSelectionContinue = (selectedClientId: string | null, createNew: boolean) => {
    if (!processedResult) return;
    if (createNew) {
      navigateToWizard(processedResult, null, true);
    } else {
      navigateToWizard(processedResult, selectedClientId);
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ direction: "rtl" }}>
      <div className="mx-auto max-w-[700px] px-4 py-8 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary" />
              <CardTitle className="text-xl">עיבוד סיכום פגישה</CardTitle>
            </div>
            <CardDescription>
              הדבק את סיכום הפגישה וייווצרו עבורך פרטי הפגישה באופן אוטומטי
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {clientRecord && (
              <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  פגישה עבור: <span className="font-medium text-foreground">{clientRecord.first_name} {clientRecord.last_name}</span>
                </span>
              </div>
            )}
            <AudioRecorder
              onTranscriptionComplete={handleTranscription}
              disabled={isLoading || !!processedResult}
            />
            <Textarea
              placeholder="הדבק כאן את סיכום הפגישה..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              disabled={isLoading || !!processedResult}
              className="min-h-[220px] resize-y"
            />
            <p className="text-sm text-muted-foreground">
              הסיכום יכול לכלול: שם לקוח, תאריך פגישה, פרטי בקשות ביטוח,
              יצרנים, מסלולים ועוד
            </p>
            {!processedResult && summary.trim() && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSaveAsSummary}
                  disabled={isSaving || isLoading}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin" data-icon="inline-start" />
                      שומר...
                    </>
                  ) : (
                    <>
                      <Save data-icon="inline-start" />
                      שמור כסיכום
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleProcess}
                  disabled={isLoading || isSaving}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" data-icon="inline-start" />
                      מעבד...
                    </>
                  ) : (
                    "עבד סיכום"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {processedResult && !clientId && (
          <ClientSelectionSection
            clients={(clients || []).map((c) => ({ ...c, id: c.id }))}
            onContinue={handleClientSelectionContinue}
          />
        )}

        <Separator />

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">היסטוריית סיכומים</h2>
          <SummaryHistoryList
            providers={(providers || []).map(p => ({ ...p, id: p.id }))}
            requestSchemes={(requestSchemes || []).map(s => ({ ...s, id: s.id }))}
            clients={(clients || []).map(c => ({ ...c, id: c.id }))}
          />
        </div>
      </div>
    </div>
  );
}