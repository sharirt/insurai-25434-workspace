import { useSearchParams, useNavigate } from "react-router";
import { useCallback, useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Loader2, UserPlus } from "lucide-react";
import { getPageUrl } from "@/lib/utils";
import { ClientProfilePage, ClientsEntity } from "@/product-types";
import type { IClientsEntity } from "@/product-types";
import {
  useEntityGetOne,
  useEntityGetAll,
  useEntityUpdate,
  useEntityCreate,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import { toast } from "sonner";
import { useNewMeetingWizard } from "@/hooks/useNewMeetingWizard";
import type { PendingRequest } from "@/hooks/useNewMeetingWizard";
import { WizardStepIndicator } from "@/components/WizardStepIndicator";
import { MeetingStep1Content } from "@/components/MeetingStep1Content";
import { MeetingStep3Content } from "@/components/MeetingStep3Content";
import { MeetingAddRequestDialog } from "@/components/MeetingAddRequestDialog";
import { ClientInfoForm } from "@/components/ClientInfoForm";
import { ClientSelectorCombobox } from "@/components/ClientSelectorCombobox";
import {
  mapClientToFormData,
  createEmptyClientFormData,
} from "@/utils/ClientFormDataMapper";

export default function NewMeetingWizard() {
  const [searchParams] = useSearchParams();
  const fromSummary = searchParams.get("fromSummary") === "true";
  const createNewClientParam = searchParams.get("createNewClient") === "true";
  const navigate = useNavigate();

  // Read and clear sessionStorage summary data
  const summaryData = useMemo(() => {
    if (!fromSummary) return null;
    try {
      const raw = sessionStorage.getItem("meetingSummaryData");
      sessionStorage.removeItem("meetingSummaryData");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [fromSummary]);

  const initialClientId =
    fromSummary && summaryData?.clientId
      ? String(summaryData.clientId)
      : searchParams.get("id") || "";

  // Selected client ID state - can change when user picks from combobox
  const [selectedClientId, setSelectedClientId] = useState(initialClientId);

  const navigateToClientProfile = useCallback(() => {
    if (fromSummary && !searchParams.get("id")) {
      navigate("/ClientsManager");
    } else {
      navigate(
        getPageUrl(ClientProfilePage, {
          id: selectedClientId || initialClientId,
        })
      );
    }
  }, [navigate, selectedClientId, initialClientId, fromSummary, searchParams]);

  // Fetch single client data (for initial load when clientId is known)
  const { data: clientData, isLoading: isLoadingClient } = useEntityGetOne(
    ClientsEntity,
    { id: initialClientId },
    { enabled: !!initialClientId }
  );

  // Fetch all clients for the combobox
  const { data: allClients, isLoading: isLoadingAllClients } =
    useEntityGetAll(ClientsEntity);

  const { updateFunction: updateClient } = useEntityUpdate(ClientsEntity);
  const { createFunction: createClient } = useEntityCreate(ClientsEntity);

  // Local form state for client info (Step 2)
  const [clientFormData, setClientFormData] = useState<
    Partial<IClientsEntity>
  >({});
  const [isSavingClient, setIsSavingClient] = useState(false);

  // Add Request dialog state
  const [isAddRequestDialogOpen, setIsAddRequestDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<PendingRequest | null>(
    null
  );

  // Populate form data when client data loads (initial load)
  useEffect(() => {
    if (clientData) {
      const baseData = mapClientToFormData(clientData);

      // Merge clientUpdates from summary data if present
      if (summaryData?.clientUpdates) {
        const updates = summaryData.clientUpdates;
        for (const key of Object.keys(updates)) {
          if (
            updates[key] !== undefined &&
            updates[key] !== null &&
            updates[key] !== ""
          ) {
            (baseData as any)[key] = updates[key];
          }
        }
      }

      setClientFormData(baseData);
    }
  }, [clientData, summaryData]);

  // Populate form data from summaryData.clientUpdates when creating a new client
  useEffect(() => {
    if (createNewClientParam && summaryData?.clientUpdates && !initialClientId) {
      const updates = summaryData.clientUpdates;
      const formData: Partial<IClientsEntity> = {};
      for (const key of Object.keys(updates)) {
        if (
          updates[key] !== undefined &&
          updates[key] !== null &&
          updates[key] !== ""
        ) {
          (formData as any)[key] = updates[key];
        }
      }
      setClientFormData(formData);
    }
  }, [createNewClientParam, summaryData, initialClientId]);

  // Handle client selection from combobox
  const handleSelectClient = (id: string | null) => {
    setSelectedClientId(id ?? "");
    if (id && allClients) {
      const client = allClients.find((c) => c.id === id);
      if (client) {
        setClientFormData(mapClientToFormData(client));
      }
    } else if (!id) {
      setClientFormData(createEmptyClientFormData());
    }
  };

  const handleClientFieldChange = useCallback(
    (field: keyof IClientsEntity, value: string | boolean) => {
      setClientFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const {
    step,
    meetingDate,
    setMeetingDate,
    selectedAgentId,
    setSelectedAgentId,
    meetingNotes,
    setMeetingNotes,
    isAgentAutoFilled,
    isStep1Valid,
    sortedAgents,
    isLoadingAgents,
    pendingRequests,
    addPendingRequest,
    removePendingRequest,
    sortedProviders,
    sortedRequestTypes,
    sortedFunds,
    isLoadingProviders,
    isLoadingRequestTypes,
    isLoadingFunds,
    requestSchemes,
    handleNext,
    handleBack,
    handleSubmit,
    isSubmitting,
  } = useNewMeetingWizard({
    clientId: selectedClientId,
    onSuccess: navigateToClientProfile,
    initialData: summaryData
      ? {
          meetingDate: summaryData.meetingDate,
          meetingNotes: summaryData.meetingNotes,
          requests: summaryData.requests,
        }
      : undefined,
  });

  // Handle Step 2 Next: save/create client data then proceed
  const handleStep2Next = useCallback(async () => {
    setIsSavingClient(true);
    try {
      if (selectedClientId) {
        // Update existing client
        await updateClient({
          id: selectedClientId,
          data: clientFormData,
        });
      } else {
        // Create new client
        const newClient = await createClient({
          data: clientFormData,
        });
        setSelectedClientId(newClient.id);
      }
      handleNext();
    } catch (err: any) {
      toast.error(err?.message || "שגיאה בשמירת פרטי הלקוח");
      // Still allow proceeding even on error
      handleNext();
    } finally {
      setIsSavingClient(false);
    }
  }, [
    selectedClientId,
    clientFormData,
    updateClient,
    createClient,
    handleNext,
  ]);

  const stepTitles: Record<1 | 2 | 3, string> = {
    1: "פגישה חדשה - שלב 1 מתוך 3",
    2: "פגישה חדשה - שלב 2 מתוך 3",
    3: "פגישה חדשה - שלב 3 מתוך 3",
  };

  const cardTitles: Record<1 | 2 | 3, string> = {
    1: "פרטי פגישה",
    2: "פרטי לקוח",
    3: "בקשות",
  };

  const handleBackNavigation = useCallback(() => {
    if (step === 1) {
      navigateToClientProfile();
    } else {
      handleBack();
    }
  }, [step, handleBack, navigateToClientProfile]);

  const handleOpenAddDialog = useCallback(() => {
    setEditingRequest(null);
    setIsAddRequestDialogOpen(true);
  }, []);

  const handleCloseAddDialog = useCallback(() => {
    setIsAddRequestDialogOpen(false);
    setEditingRequest(null);
  }, []);

  const handleEditRequest = useCallback((request: PendingRequest) => {
    setEditingRequest(request);
    setIsAddRequestDialogOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackNavigation}
            disabled={isSubmitting || isSavingClient}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            {stepTitles[step]}
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <WizardStepIndicator currentStep={step} totalSteps={3} />
        </div>

        {/* Main Content Card */}
        <Card
          className={
            step === 2 || step === 3
              ? "flex flex-col max-h-[calc(100vh-220px)]"
              : ""
          }
        >
          <CardHeader className="shrink-0">
            <CardTitle className="text-lg">{cardTitles[step]}</CardTitle>
          </CardHeader>

          <CardContent
            className={
              step === 2
                ? "min-h-0 flex-1 overflow-y-auto max-h-[calc(100vh-280px)]"
                : step === 3
                  ? "min-h-0 flex-1 overflow-y-auto max-h-[calc(100vh-280px)]"
                  : ""
            }
          >
            {step === 1 ? (
              <MeetingStep1Content
                meetingDate={meetingDate}
                setMeetingDate={setMeetingDate}
                selectedAgentId={selectedAgentId}
                setSelectedAgentId={setSelectedAgentId}
                meetingNotes={meetingNotes}
                setMeetingNotes={setMeetingNotes}
                isAgentAutoFilled={isAgentAutoFilled}
                isLoadingAgents={isLoadingAgents}
                sortedAgents={sortedAgents}
              />
            ) : step === 2 ? (
              <div className="flex flex-col gap-6">
                {createNewClientParam ? (
                  <div className="flex items-center gap-2 rounded-md border border-accent bg-accent/20 px-3 py-2">
                    <UserPlus className="h-4 w-4 shrink-0 text-accent-foreground" />
                    <span className="text-sm text-accent-foreground">
                      יוצר לקוח חדש על בסיס פרטי הסיכום
                    </span>
                  </div>
                ) : (
                  <ClientSelectorCombobox
                    clients={allClients ?? []}
                    isLoading={isLoadingAllClients}
                    selectedClientId={selectedClientId}
                    onSelectClient={handleSelectClient}
                  />
                )}
                {isLoadingClient && !!initialClientId ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <ClientInfoForm
                    formData={clientFormData}
                    onFieldChange={handleClientFieldChange}
                  />
                )}
              </div>
            ) : (
              <MeetingStep3Content
                pendingRequests={pendingRequests}
                onRemoveRequest={removePendingRequest}
                onOpenAddDialog={handleOpenAddDialog}
                onEditRequest={handleEditRequest}
                disabled={isSubmitting}
              />
            )}
          </CardContent>

          <Separator className="shrink-0" />

          <CardFooter className="flex shrink-0 justify-between pt-6">
            {step === 1 ? (
              <>
                <Button
                  variant="outline"
                  onClick={navigateToClientProfile}
                  disabled={isSubmitting}
                >
                  ביטול
                </Button>
                <Button onClick={handleNext} disabled={!isStep1Valid}>
                  הבא
                </Button>
              </>
            ) : step === 2 ? (
              <>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={navigateToClientProfile}
                    disabled={isSavingClient}
                  >
                    ביטול
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSavingClient}
                  >
                    חזרה
                  </Button>
                </div>
                <Button
                  onClick={handleStep2Next}
                  disabled={isSavingClient || (isLoadingClient && !!initialClientId)}
                >
                  {isSavingClient ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      שומר...
                    </>
                  ) : (
                    "הבא"
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={navigateToClientProfile}
                    disabled={isSubmitting}
                  >
                    ביטול
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                  >
                    חזרה
                  </Button>
                </div>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      מעבד...
                    </>
                  ) : (
                    "בצע"
                  )}
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>

      {/* Add / Edit Request Dialog */}
      <MeetingAddRequestDialog
        open={isAddRequestDialogOpen}
        onClose={handleCloseAddDialog}
        onAdd={addPendingRequest}
        sortedProviders={sortedProviders}
        sortedRequestTypes={sortedRequestTypes}
        sortedFunds={sortedFunds}
        isLoadingProviders={isLoadingProviders}
        isLoadingRequestTypes={isLoadingRequestTypes}
        isLoadingFunds={isLoadingFunds}
        requestSchemes={requestSchemes}
        editingRequest={editingRequest ?? undefined}
      />
    </div>
  );
}