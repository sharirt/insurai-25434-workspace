import { useState } from "react";
import { useNavigate } from "react-router";
import { Sparkles, Loader2 } from "lucide-react";
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

export default function MeetingSummary() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState("");

  const { data: providers } = useEntityGetAll(ProvidersEntity);
  const { data: requestSchemes } = useEntityGetAll(RequestSchemesEntity);
  const { data: clients } = useEntityGetAll(ClientsEntity);

  const { executeFunction, isLoading } = useExecuteAction(
    ParseMeetingSummaryActionAction
  );

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

      sessionStorage.setItem("meetingSummaryData", JSON.stringify(result));
      navigate(
        getPageUrl(NewMeetingWizardPage) + "?fromSummary=true"
      );
    } catch (err: any) {
      toast.error(err?.message || "שגיאה בעיבוד הסיכום. נסה שוב.");
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="mx-auto max-w-[700px] px-4 py-8">
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
            <Textarea
              placeholder="הדבק כאן את סיכום הפגישה..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              disabled={isLoading}
              className="min-h-[220px] resize-y"
            />
            <p className="text-sm text-muted-foreground">
              הסיכום יכול לכלול: שם לקוח, תאריך פגישה, פרטי בקשות ביטוח,
              יצרנים, מסלולים ועוד
            </p>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}