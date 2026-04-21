import { useSearchParams, useNavigate } from "react-router";
import { useCallback, useState, useEffect } from "react";
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
import { ArrowRight, Loader2 } from "lucide-react";
import { getPageUrl } from "@/lib/utils";
import { ClientProfilePage, ClientsEntity } from "@/product-types";
import type { IClientsEntity } from "@/product-types";
import {
  useEntityGetOne,
  useEntityUpdate,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import { toast } from "sonner";
import { useNewMeetingWizard } from "@/hooks/useNewMeetingWizard";
import type { PendingRequest } from "@/hooks/useNewMeetingWizard";
import { WizardStepIndicator } from "@/components/WizardStepIndicator";
import { MeetingStep1Content } from "@/components/MeetingStep1Content";
import { MeetingStep3Content } from "@/components/MeetingStep3Content";
import { MeetingAddRequestDialog } from "@/components/MeetingAddRequestDialog";
import { ClientInfoForm } from "@/components/ClientInfoForm";

export default function NewMeetingWizard() {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("id") || "";
  const navigate = useNavigate();

  const navigateToClientProfile = useCallback(() => {
    navigate(getPageUrl(ClientProfilePage, { id: clientId }));
  }, [navigate, clientId]);

  // Fetch client data for Step 2
  const { data: clientData, isLoading: isLoadingClient } = useEntityGetOne(
    ClientsEntity,
    { id: clientId },
    { enabled: !!clientId }
  );
  const { updateFunction: updateClient } = useEntityUpdate(ClientsEntity);

  // Local form state for client info (Step 2)
  const [clientFormData, setClientFormData] = useState<
    Partial<IClientsEntity>
  >({});
  const [isSavingClient, setIsSavingClient] = useState(false);

  // Add Request dialog state
  const [isAddRequestDialogOpen, setIsAddRequestDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<PendingRequest | null>(null);

  // Populate form data when client data loads
  useEffect(() => {
    if (clientData) {
      setClientFormData({
        first_name: clientData.first_name ?? "",
        last_name: clientData.last_name ?? "",
        national_id: clientData.national_id ?? "",
        idIssueDate: clientData.idIssueDate ?? "",
        dateOfBirth: clientData.dateOfBirth ?? "",
        gender: clientData.gender,
        relationship: clientData.relationship,
        phone_number: clientData.phone_number ?? "",
        email: clientData.email ?? "",
        cityOfResidence: clientData.cityOfResidence ?? "",
        address: clientData.address ?? "",
        apartmentNumber: clientData.apartmentNumber ?? "",
        zipCode: clientData.zipCode ?? "",
        employment: clientData.employment,
        occupation: clientData.occupation ?? "",
        employer: clientData.employer ?? "",
        companyId: clientData.companyId ?? "",
        american: clientData.american ?? false,
        americanForTax: clientData.americanForTax ?? false,
        tinNumber: clientData.tinNumber ?? "",
        englishFirstName: clientData.englishFirstName ?? "",
        englishLastName: clientData.englishLastName ?? "",
        englishCity: clientData.englishCity ?? "",
        englishCountry: clientData.englishCountry ?? "",
        clientStatus: clientData.clientStatus,
        notes: clientData.notes ?? "",
      });
    }
  }, [clientData]);

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
    clientId,
    onSuccess: navigateToClientProfile,
  });

  // Handle Step 2 Next: save client data then proceed
  const handleStep2Next = useCallback(async () => {
    setIsSavingClient(true);
    try {
      await updateClient({
        id: clientId,
        data: clientFormData,
      });
      handleNext(); // move to step 3
    } catch (err: any) {
      toast.error(err?.message || "שגיאה בשמירת פרטי הלקוח");
      // Still allow proceeding even on error
      handleNext();
    } finally {
      setIsSavingClient(false);
    }
  }, [clientId, clientFormData, updateClient, handleNext]);

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
              isLoadingClient ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="space-y-1.5">
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
              )
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
                <Button
                  onClick={handleNext}
                  disabled={!isStep1Valid}
                >
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
                  disabled={isSavingClient || isLoadingClient}
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