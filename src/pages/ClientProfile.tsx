import { useEntityGetAll, useEntityGetOne, useEntityDelete, useExecuteAction, useUser } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { ClientsEntity, FundsEntity, MeetingsEntity, RequestsEntity, RequestSchemesEntity, ProvidersEntity, ClientProfilePage, ClientsManagerPage, NewMeetingWizardPage, NewRequestWizardPage, ParseMeetingSummaryAndCreateAction } from "@/product-types";
import { useSearchParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, AlertCircle, Calendar, Sparkles, Loader2, FileUp, Plus, Pencil } from "lucide-react";
import { getPageUrl } from "@/lib/utils";
import { FundsTable, FundsTableSkeleton } from "@/components/FundsTable";
import { ClientProfileMeetingsSection } from "@/components/ClientProfileMeetingsSection";
import { DeleteMeetingDialog } from "@/components/DeleteMeetingDialog";
import { ClientInfoCard } from "@/components/ClientInfoCard";
import { ClientFormDialog } from "@/components/ClientFormDialog";
import { ImportFundsDialog } from "@/components/ImportFundsDialog";
import { ImportInvestmentTracksDialog } from "@/components/ImportInvestmentTracksDialog";
import { FundsProviderPieChart } from "@/components/FundsProviderPieChart";
import { StandaloneRequestsSection } from "@/components/StandaloneRequestsSection";
import { toast } from "sonner";
import { useMemo, useState, useCallback } from "react";

export default function ClientProfile() {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("id");
  const [isDeleteMeetingDialogOpen, setIsDeleteMeetingDialogOpen] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<typeof MeetingsEntity['instanceType'] | null>(null);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [isImportFundsDialogOpen, setIsImportFundsDialogOpen] = useState(false);
  const [isImportTracksDialogOpen, setIsImportTracksDialogOpen] = useState(false);
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false);

  const user = useUser();
  const { executeFunction: executeParseSummary, isLoading: isParsingSummary } = useExecuteAction(ParseMeetingSummaryAndCreateAction);

  const { data: client, isLoading: isLoadingClient, error: clientError, refetch: refetchClient } = useEntityGetOne(
    ClientsEntity,
    { id: clientId || "" },
    { enabled: !!clientId }
  );

  const { data: funds, isLoading: isLoadingFunds, error: fundsError, refetch: refetchFunds } = useEntityGetAll(
    FundsEntity,
    { clientId: clientId || "" },
    { enabled: !!clientId }
  );

  const { data: meetings, isLoading: isLoadingMeetings, error: meetingsError, refetch: refetchMeetings } = useEntityGetAll(
    MeetingsEntity,
    { clientId: clientId || "" },
    { enabled: !!clientId }
  );

  const { data: allRequests, isLoading: isLoadingRequests, error: requestsError, refetch: refetchRequests } = useEntityGetAll(
    RequestsEntity,
    { clientId: clientId || "" },
    { enabled: !!clientId }
  );

  const { data: requestSchemes } = useEntityGetAll(RequestSchemesEntity);
  const { data: providersData } = useEntityGetAll(ProvidersEntity);
  const { deleteFunction: deleteRequest } = useEntityDelete(RequestsEntity);

  const standaloneRequests = useMemo(
    () => (allRequests?.filter((r) => r.isStandalone === true) as (typeof RequestsEntity["instanceType"] & { id: string })[]) || [],
    [allRequests]
  );

  const requestSchemesMap = useMemo(() => {
    const map: Record<string, string> = {};
    requestSchemes?.forEach((s) => {
      if (s.id && s.requestTypeName) map[s.id] = s.requestTypeName;
    });
    return map;
  }, [requestSchemes]);

  const providersMap = useMemo(() => {
    const map: Record<string, string> = {};
    providersData?.forEach((p) => {
      if (p.id && p.provider_name) map[p.id] = p.provider_name;
    });
    return map;
  }, [providersData]);

  const handleDeleteRequest = async (id: string) => {
    await deleteRequest({ id });
    refetchRequests();
  };

  const sortedFunds = useMemo(
    () => funds?.sort((a, b) => {
      const aActive = a.status === "\u05E4\u05E2\u05D9\u05DC";
      const bActive = b.status === "\u05E4\u05E2\u05D9\u05DC";
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      return (a.planName || "").localeCompare(b.planName || "");
    }) || [],
    [funds]
  );

  const sortedMeetings = useMemo(
    () => meetings?.sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateB - dateA;
    }) || [],
    [meetings]
  );

  const clientsManagerUrl = getPageUrl(ClientsManagerPage);

  const handleDeleteMeeting = (meeting: typeof MeetingsEntity['instanceType']) => {
    setMeetingToDelete(meeting);
    setIsDeleteMeetingDialogOpen(true);
  };

  const handleDeleteMeetingClose = () => {
    setIsDeleteMeetingDialogOpen(false);
    setMeetingToDelete(null);
    refetchMeetings();
  };

  const handleSummaryDialogClose = useCallback(() => {
    setIsSummaryDialogOpen(false);
    setSummaryText("");
  }, []);

  const handleSummarySubmit = useCallback(async () => {
    if (!summaryText.trim() || !clientId || !user?.email) return;

    try {
      const response = await executeParseSummary({
        summary: summaryText.trim(),
        clientId,
        agentEmail: user.email,
      });

      const requestCount = response?.items?.[0]?.requests?.length || 0;
      toast.success(`הפגישה נוצרה בהצלחה עם ${requestCount} בקשות`);
      handleSummaryDialogClose();
      refetchMeetings();
    } catch (err: any) {
      toast.error(err?.message || "שגיאה ביצירת הפגישה מהסיכום");
    }
  }, [summaryText, clientId, user?.email, executeParseSummary, handleSummaryDialogClose, refetchMeetings]);

  const handleEditClientClose = useCallback(() => {
    setIsEditClientDialogOpen(false);
    refetchClient();
  }, [refetchClient]);

  if (!clientId) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              לא סופק מזהה לקוח. אנא בחר לקוח מרשימת הלקוחות.
            </AlertDescription>
          </Alert>
          <Link to={clientsManagerUrl} className="mt-4 inline-block">
            <Button variant="outline">
              <ArrowLeft className="ml-2 h-4 w-4" />
              חזרה ללקוחות
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoadingClient) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-10 w-32 mb-6" />
          <Skeleton className="h-48 w-full mb-8" />
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (clientError || !client) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              שגיאה בטעינת פרטי הלקוח. אנא נסה שוב מאוחר יותר.
            </AlertDescription>
          </Alert>
          <Link to={clientsManagerUrl} className="mt-4 inline-block">
            <Button variant="outline">
              <ArrowLeft className="ml-2 h-4 w-4" />
              חזרה ללקוחות
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Link to={clientsManagerUrl}>
              <Button variant="outline">
                <ArrowLeft className="ml-2 h-4 w-4" />
                חזרה ללקוחות
              </Button>
            </Link>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={getPageUrl(NewRequestWizardPage, { id: clientId, standalone: "true" })}>
                <Plus data-icon="inline-start" />
                צור בקשה חדשה
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setIsSummaryDialogOpen(true)}>
              <Sparkles className="ml-2 h-4 w-4" />
              סיכום פגישה
            </Button>
            <Button asChild>
              <Link to={getPageUrl(NewMeetingWizardPage, { id: clientId })}>
                <Calendar className="ml-2 h-4 w-4" />
                צור פגישה חדשה
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <Button variant="outline" onClick={() => setIsEditClientDialogOpen(true)}>
              <Pencil data-icon="inline-start" />
              עריכת פרטים
            </Button>
          </div>
          <ClientInfoCard client={client} />
        </div>

        <div className="mb-8">
          <FundsProviderPieChart funds={sortedFunds} isLoading={isLoadingFunds} />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">מוצרים</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsImportTracksDialogOpen(true)}>
              <FileUp className="ml-2 h-4 w-4" />
              ייבוא מסלולי השקעה מאקסל
            </Button>
            <Button variant="outline" onClick={() => setIsImportFundsDialogOpen(true)}>
              <FileUp className="ml-2 h-4 w-4" />
              ייבוא מוצרים מאקסל
            </Button>
          </div>
        </div>

        {isLoadingFunds ? (
          <FundsTableSkeleton rows={5} />
        ) : fundsError ? (
          <Alert variant="destructive" className="mb-12">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              שגיאה בטעינת פרטי הקרנות. אנא נסה שוב מאוחר יותר.
            </AlertDescription>
          </Alert>
        ) : !sortedFunds || sortedFunds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 mb-12">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">לא נמצאו מוצרים</h3>
              <p className="text-muted-foreground">
                ללקוח זה אין עדיין מוצרים.
              </p>
            </div>
          </div>
        ) : (
          <FundsTable funds={sortedFunds} />
        )}

        <StandaloneRequestsSection
          requests={standaloneRequests}
          isLoading={isLoadingRequests}
          error={requestsError}
          requestSchemesMap={requestSchemesMap}
          providersMap={providersMap}
          onDelete={handleDeleteRequest}
        />

        <ClientProfileMeetingsSection
          meetings={sortedMeetings as (typeof MeetingsEntity["instanceType"] & { id: string })[]}
          isLoading={isLoadingMeetings}
          error={meetingsError}
          onDelete={handleDeleteMeeting}
        />
      </div>

      <DeleteMeetingDialog
        open={isDeleteMeetingDialogOpen}
        onClose={handleDeleteMeetingClose}
        meeting={meetingToDelete}
      />

      <ImportFundsDialog
        open={isImportFundsDialogOpen}
        onClose={() => setIsImportFundsDialogOpen(false)}
        clientId={clientId}
        onSuccess={() => {
          refetchFunds();
        }}
      />

      <ImportInvestmentTracksDialog
        open={isImportTracksDialogOpen}
        onClose={() => setIsImportTracksDialogOpen(false)}
        clientId={clientId}
        onSuccess={() => {
          refetchFunds();
        }}
      />

      <ClientFormDialog
        open={isEditClientDialogOpen}
        onClose={handleEditClientClose}
        client={client}
      />

      <Dialog open={isSummaryDialogOpen} onOpenChange={(open) => { if (!open) handleSummaryDialogClose(); }}>
        <DialogContent className="sm:max-w-xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>יצירת פגישה מסיכום</DialogTitle>
            <DialogDescription>
              הדבק את סיכום הפגישה בעברית וייווצרו פגישה ובקשות באופן אוטומטי
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              dir="rtl"
              rows={8}
              placeholder="הדבק כאן את סיכום הפגישה בעברית..."
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              disabled={isParsingSummary}
              className="resize-y min-h-[200px] text-base leading-relaxed"
            />
          </div>
          <DialogFooter className="flex flex-row-reverse gap-2 sm:flex-row-reverse">
            <Button
              variant="outline"
              onClick={handleSummaryDialogClose}
              disabled={isParsingSummary}
            >
              ביטול
            </Button>
            <Button
              onClick={handleSummarySubmit}
              disabled={!summaryText.trim() || isParsingSummary}
            >
              {isParsingSummary ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  יוצר פגישה...
                </>
              ) : (
                "צור פגישה"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}