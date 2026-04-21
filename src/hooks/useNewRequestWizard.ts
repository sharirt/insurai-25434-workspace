import { useState, useEffect, useMemo, useCallback } from "react";
import {
  useEntityGetAll,
  useEntityCreate,
  useExecuteAction,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import {
  ProvidersEntity,
  RequestSchemesEntity,
  RequestsEntity,
  ProcessRequestFormsAction,
  FundsEntity,
} from "@/product-types";

// Use ProcessRequestFormsAction as the auto-process action for new requests
const AutoProcessNewRequestAction = ProcessRequestFormsAction;
import { toast } from "sonner";

interface UseNewRequestWizardProps {
  open: boolean;
  clientId: string;
  onSuccess?: () => void;
  onClose: () => void;
  isStandalone?: boolean;
}

export function useNewRequestWizard({
  open,
  clientId,
  onSuccess,
  onClose,
  isStandalone,
}: UseNewRequestWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [selectedRequestTypeId, setSelectedRequestTypeId] = useState("");
  const [selectedFundId, setSelectedFundId] = useState("");
  const [tracksValues, setTracksValues] = useState<Record<string, string>>(
    {}
  );
  const [managementFee, setManagementFee] = useState<number | undefined>(
    undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: providers, isLoading: isLoadingProviders } =
    useEntityGetAll(ProvidersEntity);
  const { data: requestSchemes, isLoading: isLoadingRequestTypes } =
    useEntityGetAll(RequestSchemesEntity);
  const { data: funds, isLoading: isLoadingFunds } =
    useEntityGetAll(FundsEntity, { clientId }, { enabled: !!clientId });
  const { createFunction, isLoading: isCreating } =
    useEntityCreate(RequestsEntity);
  const { executeFunction: executeAutoProcess } = useExecuteAction(
    AutoProcessNewRequestAction
  );

  const sortedProviders = useMemo(
    () =>
      providers?.sort((a, b) =>
        (a.provider_name || "").localeCompare(b.provider_name || "")
      ) || [],
    [providers]
  );

  const sortedRequestTypes = useMemo(
    () =>
      requestSchemes?.sort((a, b) =>
        (a.requestTypeName || "").localeCompare(b.requestTypeName || "")
      ) || [],
    [requestSchemes]
  );

  const sortedFunds = useMemo(
    () =>
      funds?.sort((a, b) =>
        (a.planName || "").localeCompare(b.planName || "")
      ) || [],
    [funds]
  );

  const selectedScheme = useMemo(
    () => requestSchemes?.find((rt) => rt.id === selectedRequestTypeId),
    [requestSchemes, selectedRequestTypeId]
  );

  const tracksKeys = useMemo(() => {
    if (!selectedScheme?.tracks) return [];
    const changesObj = selectedScheme.tracks as Record<string, any>;
    return Object.keys(changesObj);
  }, [selectedScheme]);

  // Initialize tracks values from the selected scheme's defaults
  useEffect(() => {
    if (selectedScheme?.tracks) {
      const changesObj = selectedScheme.tracks as Record<string, any>;
      const initial: Record<string, string> = {};
      for (const [key, value] of Object.entries(changesObj)) {
        initial[key] = String(value ?? "");
      }
      setTracksValues(initial);
    } else {
      setTracksValues({});
    }
  }, [selectedScheme]);

  // Reset all state when dialog closes
  useEffect(() => {
    if (!open) {
      setStep(1);
      setSelectedProviderId("");
      setSelectedRequestTypeId("");
      setSelectedFundId("");
      setManagementFee(undefined);
      setTracksValues({});
      setIsSubmitting(false);
    }
  }, [open]);

  const isStep2Valid = !!selectedProviderId && !!selectedRequestTypeId;

  const handleNext = useCallback(() => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && isStep2Valid) {
      setStep(3);
    }
  }, [step, isStep2Valid]);

  const handleBack = useCallback(() => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    }
  }, [step]);

  const handleTrackValue = useCallback((key: string, value: string) => {
    setTracksValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedProviderId || !selectedRequestTypeId) return;

    setIsSubmitting(true);

    try {
      // Step 1: Create the request
      const createdRequest = await createFunction({
        data: {
          clientId,
          providerId: selectedProviderId,
          requestTypeId: selectedRequestTypeId,
          isStandalone: isStandalone ?? false,
          status: "מעבד" as const,
          tracks: tracksValues,
          fundId: selectedFundId || undefined,
          managementFee: managementFee ?? undefined,
        },
      });

      // Step 2: Execute AutoProcessNewRequest action
      await executeAutoProcess({
        requestId: createdRequest.id,
      });

      toast.success("הבקשה נוצרה ומעובדת בהצלחה");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "שגיאה ביצירת הבקשה");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedProviderId,
    selectedRequestTypeId,
    selectedFundId,
    managementFee,
    isStandalone,
    clientId,
    tracksValues,
    createFunction,
    executeAutoProcess,
    onSuccess,
    onClose,
  ]);

  return {
    step,
    selectedProviderId,
    setSelectedProviderId,
    selectedRequestTypeId,
    setSelectedRequestTypeId,
    selectedFundId,
    setSelectedFundId,
    managementFee,
    setManagementFee,
    tracksValues,
    tracksKeys,
    handleTrackValue,
    isStep2Valid,
    handleNext,
    handleBack,
    handleSubmit,
    isSubmitting: isSubmitting || isCreating,
    isLoadingProviders,
    isLoadingRequestTypes,
    isLoadingFunds,
    sortedProviders,
    sortedRequestTypes,
    sortedFunds,
  };
}