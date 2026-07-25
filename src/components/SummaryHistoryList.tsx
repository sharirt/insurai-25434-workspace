import { useNavigate } from "react-router";
import { Clock } from "lucide-react";
import { useEntityGetAll } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { MeetingSummariesEntity, NewMeetingWizardPage } from "@/product-types";
import { getPageUrl } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const SummaryHistoryList = () => {
  const navigate = useNavigate();
  const { data: summaries, isLoading } = useEntityGetAll(MeetingSummariesEntity);

  const sorted = (summaries || [])
    .slice()
    .sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    })
    .slice(0, 20);

  const handleReopen = (record: typeof MeetingSummariesEntity["instanceType"] & { id: string; createdAt: string }) => {
    const extractedData = record.extractedData as any;
    if (extractedData) {
      sessionStorage.setItem("meetingSummaryData", JSON.stringify(extractedData));
      let url = getPageUrl(NewMeetingWizardPage) + "?fromSummary=true";
      if (extractedData?.clientId) {
        url += `&id=${extractedData.clientId}`;
      }
      navigate(url);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!sorted.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
        <Clock className="size-8" />
        <p className="text-sm">אין היסטוריית סיכומים עדיין</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((record: any) => {
        const date = record.createdAt
          ? new Date(record.createdAt).toLocaleDateString("he-IL", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";
        const clientName = record.clientName || "לקוח לא ידוע";
        const requestCount = record.requestCount ?? 0;
        const rawPreview = record.rawText
          ? record.rawText.length > 100
            ? record.rawText.slice(0, 100) + "..."
            : record.rawText
          : "";

        return (
          <Card
            key={record.id}
            className="p-4 hover:bg-accent/50 transition-colors"
            style={{ direction: "rtl" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{clientName}</span>
                  {requestCount > 0 && (
                    <Badge variant="secondary">{requestCount} בקשות</Badge>
                  )}
                </div>
                {rawPreview && (
                  <p className="text-xs text-muted-foreground truncate">
                    {rawPreview}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {date}
                </span>
                {record.extractedData && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReopen(record)}
                  >
                    פתח שוב
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};