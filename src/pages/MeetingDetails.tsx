import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useEntityGetOne, useEntityUpdate, useExecuteAction, useEntityGetAll } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { MeetingsEntity, SendMeetingFormsForSignatureAction, RequestsEntity } from "@/product-types";
import { MeetingInfoCard, MeetingInfoCardSkeleton } from "@/components/MeetingInfoCard";
import { MeetingRequestCard } from "@/components/MeetingRequestCard";
import { SignatureCountdownBadge } from "@/components/SignatureCountdownBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Send, Loader2, FileText, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useSignatureCountdown } from "@/hooks/useSignatureCountdown";

export default function MeetingDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const meetingId = searchParams.get("meetingId") || "";

  const { data: meeting, isLoading } = useEntityGetOne(
    MeetingsEntity,
    { id: meetingId },
    { enabled: !!meetingId }
  );

  const { executeFunction, isLoading: isSending } = useExecuteAction(
    SendMeetingFormsForSignatureAction
  );

  const { updateFunction: updateMeeting } = useEntityUpdate(MeetingsEntity);
  const { updateFunction: updateRequest } = useEntityUpdate(RequestsEntity);

  const { data: allRequests } = useEntityGetAll(RequestsEntity, undefined, {
    enabled: !!meeting && (meeting.requests?.length ?? 0) > 0,
  });

  const hasAutoUpdated = useRef(false);
  const hasAutoUpdatedYitzran = useRef(false);

  useEffect(() => {
    if (isLoading || !meeting || hasAutoUpdated.current) return;
    const meetingRequestIds = meeting.requests;
    if (!meetingRequestIds || meetingRequestIds.length === 0) return;
    if (meeting.status === "מוכן לשליחה ללקוח") return;
    if (!allRequests || allRequests.length === 0) return;

    const linkedRequests = allRequests.filter((r) => meetingRequestIds.includes(r.id));
    if (linkedRequests.length === 0) return;

    const allReady = linkedRequests.every((r) => r.status === "מוכן לשליחה ללקוח");
    if (allReady) {
      hasAutoUpdated.current = true;
      updateMeeting({
        id: meetingId,
        data: { status: "מוכן לשליחה ללקוח" },
      });
    }
  }, [isLoading, meeting, allRequests, meetingId, updateMeeting]);

  useEffect(() => {
    if (isLoading || !meeting || hasAutoUpdatedYitzran.current) return;
    const meetingRequestIds = meeting.requests;
    if (!meetingRequestIds || meetingRequestIds.length === 0) return;
    if (meeting.status === "נשלח ליצרן") return;
    if (!allRequests || allRequests.length === 0) return;

    const linkedRequests = allRequests.filter((r) => meetingRequestIds.includes(r.id));
    if (linkedRequests.length === 0) return;

    const allSentToYitzran = linkedRequests.every((r) => r.status === "נשלח ליצרן");
    if (allSentToYitzran) {
      hasAutoUpdatedYitzran.current = true;
      updateMeeting({
        id: meetingId,
        data: { status: "נשלח ליצרן" },
      });
    }
  }, [isLoading, meeting, allRequests, meetingId, updateMeeting]);

  const [refreshCounter, setRefreshCounter] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const requests = meeting?.requests || [];
  const hasRequests = requests.length > 0;

  const { isExpired, hasActiveRequests, label, variant } = useSignatureCountdown(meetingId);

  const handleSendAll = async () => {
    try {
      await executeFunction({ meetingId });

      const requestIds = meeting?.requests || [];
      await Promise.all([
        updateMeeting({ id: meetingId, data: { status: "נשלח ללקוח" as any } }),
        ...requestIds.map((reqId) =>
          updateRequest({ id: reqId, data: { status: "נשלח ללקוח" as any } })
        ),
      ]);

      setRefreshCounter((c) => c + 1);
      setHasSent(true);
      toast.success("כל הטפסים נשלחו לחתימה בהצלחה");
    } catch (err: any) {
      toast.error(`שגיאה בשליחה: ${err?.message || "שגיאה לא ידועה"}`);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await executeFunction({ meetingId });
      setRefreshCounter((c) => c + 1);
      toast.success("הטפסים נשלחו מחדש לחתימה");
    } catch (err: any) {
      toast.error(`שגיאה בשליחה מחדש: ${err?.message || "שגיאה לא ידועה"}`);
    } finally {
      setIsResending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6" dir="rtl">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
          <MeetingInfoCardSkeleton />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen bg-background p-6" dir="rtl">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <Alert variant="destructive">
            <AlertDescription>פגישה לא נמצאה</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 bg-background z-10 py-2">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowRight />
            </Button>
            <h1 className="text-xl font-bold">פרטי פגישה</h1>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveRequests && label && (
              <SignatureCountdownBadge label={label} variant={variant} />
            )}
            {isExpired && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResend}
                disabled={isResending}
              >
                {isResending ? (
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                ) : (
                  <RefreshCw data-icon="inline-start" />
                )}
                {isResending ? "שולח..." : "שלח שוב לחתימה"}
              </Button>
            )}
<Button
              onClick={handleSendAll}
              disabled={isSending || !hasRequests}
            >
              {isSending ? (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              ) : hasSent ? (
                <RefreshCw data-icon="inline-start" />
              ) : (
                <Send data-icon="inline-start" />
              )}
              {isSending ? "שולח..." : hasSent ? "שלח שוב" : "שלח הכל לחתימה"}
            </Button>
          </div>
        </div>

        {/* Meeting Info */}
        <MeetingInfoCard meeting={meeting as typeof MeetingsEntity["instanceType"] & { id: string }} />

        {/* Requests Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">בקשות</h2>
            <Badge variant="secondary">{requests.length}</Badge>
          </div>

          {!hasRequests ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <FileText className="size-10" />
              <p>אין בקשות לפגישה זו</p>
            </div>
          ) : (
            requests.map((requestId) => (
              <MeetingRequestCard key={`${requestId}-${refreshCounter}`} requestId={requestId} meetingId={meetingId} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}