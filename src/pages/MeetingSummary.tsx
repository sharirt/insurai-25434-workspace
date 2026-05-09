import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Sparkles, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getPageUrl } from "@/lib/utils";
import {
  useEntityGetAll,
  useEntityGetOne,
  useExecuteAction,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import {
  ProvidersEntity,
  RequestSchemesEntity,
  ClientsEntity,
  NewMeetingWizardPage,
  ParseMeetingSummaryActionAction,
} from "@/product-types";
import { STATIC_TRACK_KEYS } from "@/utils/fieldTranslations";
import { ClientSelectionSection } from "@/components/ClientSelectionSection";

export default function MeetingSummary() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("id");
  const [summary, setSummary] = useState("");
  const [processedResult, setProcessedResult] = useState<any>(null);
  const [isExistingClient, setIsExistingClient] = useState(false);

  const { data: clientRecord } = useEntityGetOne(ClientsEntity, { id: clientId || "" }, { enabled: !!clientId });

  const { data: providers } = useEntityGetAll(ProvidersEntity);
  const { data: requestSchemes } = useEntityGetAll(RequestSchemesEntity);
  const { data: clients } = useEntityGetAll(ClientsEntity);

  const { executeFunction, isLoading } = useExecuteAction(
    ParseMeetingSummaryActionAction
  );

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
            {!processedResult && (
              <Button
                onClick={handleProcess}
                disabled={!summary.trim() || isLoading}
                className="w-full"
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
            )}
          </CardContent>
        </Card>

        {processedResult && !clientId && (
          <ClientSelectionSection
            clients={(clients || []).map((c) => ({ ...c, id: c.id }))}
            onContinue={handleClientSelectionContinue}
          />
        )}
      </div>
    </div>
  );
}