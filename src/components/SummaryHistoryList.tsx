import { useState } from "react";
import { useNavigate } from "react-router";
import { Clock, ChevronLeft, Pencil, Sparkles, ExternalLink, Trash2, Loader2 } from "lucide-react";
import { useEntityGetAll, useEntityUpdate, useEntityDelete, useExecuteAction, useUser } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { MeetingSummariesEntity, NewMeetingWizardPage, ParseMeetingSummaryActionAction, IProvidersEntity, IRequestSchemesEntity, IClientsEntity } from "@/product-types";
import { STATIC_TRACK_KEYS } from "@/utils/fieldTranslations";
import { getPageUrl, cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface SummaryHistoryListProps {
  providers: (IProvidersEntity & { id: string })[];
  requestSchemes: (IRequestSchemesEntity & { id: string })[];
  clients: (IClientsEntity & { id: string })[];
}

export const SummaryHistoryList = ({ providers, requestSchemes, clients }: SummaryHistoryListProps) => {
  const navigate = useNavigate();
  const user = useUser();
  const { data: summaries, isLoading } = useEntityGetAll(MeetingSummariesEntity);
  const { updateFunction, isLoading: isUpdating } = useEntityUpdate(MeetingSummariesEntity);
  const { deleteFunction, isLoading: isDeleting } = useEntityDelete(MeetingSummariesEntity);
  const { executeFunction, isLoading: isProcessing } = useExecuteAction(ParseMeetingSummaryActionAction);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editedRawText, setEditedRawText] = useState("");
  const [editedClientName, setEditedClientName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const sorted = (summaries || [])
    .slice()
    .sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    })
    .slice(0, 20);

  const toggleExpand = (record: any) => {
    if (expandedId === record.id) {
      setExpandedId(null);
    } else {
      setExpandedId(record.id);
      setEditedRawText(record.rawText || "");
      setEditedClientName(record.clientName || "");
      setIsEditingName(false);
      setShowDeleteConfirm(false);
    }
  };

  const selectedRecord = sorted.find((r: any) => r.id === expandedId) || null;

  const handleSaveChanges = async () => {
    if (!selectedRecord) return;
    try {
      await updateFunction({
        id: selectedRecord.id,
        data: {
          rawText: editedRawText,
          clientName: editedClientName || undefined,
        },
      });
      toast.success("השינויים נשמרו בהצלחה");
    } catch (err: any) {
      toast.error(err?.message || "שגיאה בשמירת השינויים");
    }
  };

  const handleProcess = async () => {
    if (!selectedRecord || !editedRawText.trim()) return;
    try {
      const result = await executeFunction({
        summary: editedRawText.trim(),
        availableProviders: providers.map(p => ({ id: p.id, name: p.provider_name })),
        availableRequestTypes: requestSchemes.map(s => ({ id: s.id, name: s.requestTypeName })),
        availableTrackKeys: STATIC_TRACK_KEYS,
        allClients: clients.map(c => ({ id: c.id, first_name: c.first_name, last_name: c.last_name, national_id: c.national_id })),
      });

      await updateFunction({
        id: selectedRecord.id,
        data: {
          extractedData: result as any,
          requestCount: (result as any)?.requests?.length ?? 0,
        },
      });

      sessionStorage.setItem("meetingSummaryData", JSON.stringify(result));
      const url = getPageUrl(NewMeetingWizardPage) + "?fromSummary=true" + ((result as any)?.clientId ? `&id=${(result as any).clientId}` : "");
      navigate(url);
    } catch (err: any) {
      toast.error(err?.message || "שגיאה בעיבוד הסיכום");
    }
  };

  const handleReopen = () => {
    if (!selectedRecord) return;
    const extractedData = selectedRecord.extractedData as any;
    if (extractedData) {
      sessionStorage.setItem("meetingSummaryData", JSON.stringify(extractedData));
      let url = getPageUrl(NewMeetingWizardPage) + "?fromSummary=true";
      if (extractedData?.clientId) {
        url += `&id=${extractedData.clientId}`;
      }
      navigate(url);
    }
  };

  const handleDelete = async () => {
    if (!selectedRecord) return;
    try {
      await deleteFunction({ id: selectedRecord.id });
      toast.success("הסיכום נמחק בהצלחה");
      setExpandedId(null);
    } catch (err: any) {
      toast.error(err?.message || "שגיאה במחיקת הסיכום");
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
        const isExpanded = expandedId === record.id;
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
        const hasExtracted = record.extractedData && Object.keys(record.extractedData).length > 0;

        return (
          <Card
            key={record.id}
            className={cn(
              "p-4 transition-colors",
              isExpanded ? "border-primary/30" : "hover:bg-accent/50 cursor-pointer"
            )}
            style={{ direction: "rtl" }}
          >
            <div
              className={cn("flex items-start justify-between gap-3", !isExpanded && "cursor-pointer")}
              onClick={() => toggleExpand(record)}
            >
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
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {date}
                </span>
                <ChevronLeft
                  className={cn(
                    "size-4 text-muted-foreground transition-transform duration-200",
                    isExpanded && "rotate-[-90deg]"
                  )}
                />
              </div>
            </div>

            <div
              className={cn(
                "grid transition-all duration-300",
                isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="min-h-0 overflow-hidden">
                {isExpanded && (
                  <div
                    className="flex flex-col gap-4 pt-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Separator />

                    {/* Client name - inline edit */}
                    <div className="flex items-center gap-2">
                      {isEditingName ? (
                        <Input
                          value={editedClientName}
                          onChange={(e) => setEditedClientName(e.target.value)}
                          onBlur={() => setIsEditingName(false)}
                          onKeyDown={(e) => { if (e.key === "Enter") setIsEditingName(false); }}
                          autoFocus
                          className="text-sm"
                          placeholder="שם לקוח"
                        />
                      ) : (
                        <button
                          type="button"
                          className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors"
                          onClick={() => setIsEditingName(true)}
                        >
                          <span>{editedClientName || "לקוח לא ידוע"}</span>
                          <Pencil className="size-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Raw text textarea */}
                    <Textarea
                      value={editedRawText}
                      onChange={(e) => setEditedRawText(e.target.value)}
                      className="min-h-[200px] resize-y"
                      placeholder="טקסט הסיכום..."
                    />

                    {/* Action buttons */}
                    <div className="flex flex-col gap-2">
                      <Button
                        className="w-full"
                        onClick={handleSaveChanges}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 className="animate-spin" data-icon="inline-start" />
                            שומר...
                          </>
                        ) : (
                          "שמור שינויים"
                        )}
                      </Button>

                      {!hasExtracted && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleProcess}
                          disabled={isProcessing || !editedRawText.trim()}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="animate-spin" data-icon="inline-start" />
                              מעבד...
                            </>
                          ) : (
                            <>
                              <Sparkles data-icon="inline-start" />
                              עבד סיכום
                            </>
                          )}
                        </Button>
                      )}

                      {hasExtracted && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleReopen}
                        >
                          <ExternalLink data-icon="inline-start" />
                          פתח שוב
                        </Button>
                      )}

                      {/* Delete with inline confirmation */}
                      {!showDeleteConfirm ? (
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => setShowDeleteConfirm(true)}
                        >
                          <Trash2 data-icon="inline-start" />
                          מחק
                        </Button>
                      ) : (
                        <div className="flex flex-col gap-2 rounded-md border border-destructive p-3">
                          <p className="text-sm text-destructive font-medium">האם אתה בטוח?</p>
                          <div className="flex gap-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={handleDelete}
                              disabled={isDeleting}
                              className="flex-1"
                            >
                              {isDeleting ? (
                                <>
                                  <Loader2 className="animate-spin" data-icon="inline-start" />
                                  מוחק...
                                </>
                              ) : (
                                "כן, מחק"
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowDeleteConfirm(false)}
                              className="flex-1"
                            >
                              ביטול
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};