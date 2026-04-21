import { useSearchParams, useNavigate } from "react-router";
import { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useNewRequestWizard } from "@/hooks/useNewRequestWizard";
import { WizardStepIndicator } from "@/components/WizardStepIndicator";
import { WizardStep1Content } from "@/components/WizardStep1Content";
import { WizardStep2Content } from "@/components/WizardStep2Content";
import { ClientInfoForm } from "@/components/ClientInfoForm";

export default function NewRequestWizard() {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("id") || "";
  const isStandalone = searchParams.get("standalone") === "true";
  const navigate = useNavigate();

  const navigateToClientProfile = useCallback(() => {
    navigate(getPageUrl(ClientProfilePage, { id: clientId }));
  }, [navigate, clientId]);

  // Fetch client data for Step 1
  const { data: clientData, isLoading: isLoadingClient } = useEntityGetOne(
    ClientsEntity,
    { id: clientId },
    { enabled: !!clientId }
  );
  const { updateFunction: updateClient } = useEntityUpdate(ClientsEntity);

  // Local form state for client info (Step 1)
  const [clientFormData, setClientFormData] = useState<Partial<IClientsEntity>>({});
  const [isSavingClient, setIsSavingClient] = useState(false);

  // Populate form data when client data loads
  useEffect(() => {
    if (clientData) {
      setClientFormData({
        first_name: clientData.first_name ?? "",
        last_name: clientData.last_name ?? "",
        national_id: clientData.national_id ?? "",
        dateOfBirth: clientData.dateOfBirth ?? "",
        gender: clientData.gender,
        relationship: clientData.relationship,
        phone_number: clientData.phone_number ?? "",
        email: clientData.email ?? "",
        cityOfResidence: clientData.cityOfResidence ?? "",
        address: clientData.address ?? "",
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
    selectedProviderId,
    setSelectedProviderId,
    selectedRequestTypeId,
    setSelectedRequestTypeId,
    selectedFundId,
    setSelectedFundId,
    managementFee,
    setManagementFee,
    choiceDuration,
    setChoiceDuration,
    transferType,
    setTransferType,
    kerenName,
    setKerenName,
    transferAmount,
    setTransferAmount,
    tracksValues,
    tracksKeys,
    handleTrackValue,
    isStep2Valid,
    handleNext,
    handleBack,
    handleSubmit,
    isSubmitting,
    isLoadingProviders,
    isLoadingRequestTypes,
    isLoadingFunds,
    sortedProviders,
    sortedRequestTypes,
    sortedFunds,
  } = useNewRequestWizard({
    open: true,
    clientId,
    onSuccess: navigateToClientProfile,
    onClose: navigateToClientProfile,
    isStandalone,
  });

  // Handle Step 1 Next: save client data then proceed
  const handleStep1Next = useCallback(async () => {
    setIsSavingClient(true);
    try {
      await updateClient({
        id: clientId,
        data: clientFormData,
      });
      handleNext(); // move to step 2
    } catch (err: any) {
      toast.error(err?.message || "שגיאה בשמירת פרטי הלקוח");
      // Still allow proceeding even on error
      handleNext();
    } finally {
      setIsSavingClient(false);
    }
  }, [clientId, clientFormData, updateClient, handleNext]);

  const stepTitles: Record<1 | 2 | 3, string> = {
    1: "טופס בקשה חדשה - שלב 1 מתוך 3",
    2: "טופס בקשה חדשה - שלב 2 מתוך 3",
    3: "טופס בקשה חדשה - שלב 3 מתוך 3",
  };

  const cardTitles: Record<1 | 2 | 3, string> = {
    1: "פרטי לקוח",
    2: "בחירת יצרן וסוג בקשה",
    3: "מילוי פרטי מסלולים",
  };

  const handleBackNavigation = useCallback(() => {
    if (step === 1) {
      navigateToClientProfile();
    } else {
      handleBack();
    }
  }, [step, handleBack, navigateToClientProfile]);

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
            step === 1 || step === 3
              ? "flex flex-col max-h-[calc(100vh-220px)]"
              : ""
          }
        >
          <CardHeader className="shrink-0">
            <CardTitle className="text-lg">{cardTitles[step]}</CardTitle>
          </CardHeader>

          <CardContent
            className={
              step === 1
                ? "min-h-0 flex-1 overflow-y-auto max-h-[calc(100vh-280px)]"
                : step === 3
                  ? "min-h-0 flex-1 overflow-y-auto"
                  : ""
            }
          >
            {step === 1 ? (
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
            ) : step === 2 ? (
              <WizardStep1Content
                selectedProviderId={selectedProviderId}
                setSelectedProviderId={setSelectedProviderId}
                selectedRequestTypeId={selectedRequestTypeId}
                setSelectedRequestTypeId={setSelectedRequestTypeId}
                selectedFundId={selectedFundId}
                setSelectedFundId={setSelectedFundId}
                managementFee={managementFee}
                setManagementFee={setManagementFee}
              choiceDuration={choiceDuration}
              setChoiceDuration={setChoiceDuration}
              transferType={transferType}
              setTransferType={setTransferType}
              kerenName={kerenName}
              setKerenName={setKerenName}
              transferAmount={transferAmount}
              setTransferAmount={setTransferAmount}
                isLoadingProviders={isLoadingProviders}
                isLoadingRequestTypes={isLoadingRequestTypes}
                isLoadingFunds={isLoadingFunds}
                sortedProviders={sortedProviders}
                sortedRequestTypes={sortedRequestTypes}
                sortedFunds={sortedFunds}
              />
            ) : (
              <WizardStep2Content
                tracksKeys={tracksKeys}
                tracksValues={tracksValues}
                handleTrackValue={handleTrackValue}
              />
            )}
          </CardContent>

          <Separator className="shrink-0" />

          <CardFooter className="flex shrink-0 justify-between pt-6">
            {step === 1 ? (
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
                    onClick={navigateToClientProfile}
                    disabled={isSavingClient}
                  >
                    חזרה
                  </Button>
                </div>
                <Button
                  onClick={handleStep1Next}
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
            ) : step === 2 ? (
              <>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={navigateToClientProfile}
                  >
                    ביטול
                  </Button>
                  <Button variant="outline" onClick={handleBack}>
                    חזרה
                  </Button>
                </div>
                <Button onClick={handleNext} disabled={!isStep2Valid}>
                  הבא
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
    </div>
  );
}