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
import { STATIC_TRACK_KEYS } from "@/utils/fieldTranslations";
import { BASE_TRACK_KEYS, isPitzuimQualifying, applyPitzuimMirroring, stripPitzuimKeys } from "@/utils/PitzuimUtils";

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
  const [managementFeeAccumulation, setManagementFeeAccumulation] = useState<number | undefined>(
    undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [standing, setStanding] = useState("");
  const [pitzuimSeparate, setPitzuimSeparate] = useState(false);

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

  const tracksKeys = STATIC_TRACK_KEYS;

  // Reset all state when dialog closes
  useEffect(() => {
    if (!open) {
      setStep(1);
      setSelectedProviderId("");
      setSelectedRequestTypeId("");
      setSelectedFundId("");
      setManagementFee(undefined);
      setManagementFeeAccumulation(undefined);
      setTracksValues({});
      setIsSubmitting(false);
      setStanding("");
      setPitzuimSeparate(false);
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
      // Compute tracks with pitzuim logic
      const selectedRequestTypeName = sortedRequestTypes.find(
        (rt) => rt.id === selectedRequestTypeId
      )?.requestTypeName;
      const qualifying = isPitzuimQualifying(selectedRequestTypeName);
      let finalTracks = tracksValues;
      if (qualifying && !pitzuimSeparate) {
        finalTracks = applyPitzuimMirroring(tracksValues);
      } else if (!qualifying) {
        finalTracks = stripPitzuimKeys(tracksValues);
      }

      // Step 1: Create the request
      const createdRequest = await createFunction({
        data: {
          clientId,
          providerId: selectedProviderId,
          requestTypeId: selectedRequestTypeId,
          isStandalone: isStandalone ?? false,
          status: "מעבד" as const,
          tracks: finalTracks,
          pitzuimSeparate: qualifying ? pitzuimSeparate : undefined,
          fundId: selectedFundId || undefined,
          managementFee: managementFee ?? undefined,
          managementFeeAccumulation: managementFeeAccumulation ?? undefined,
          standing: standing || undefined,
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
    managementFeeAccumulation,
    standing,
    isStandalone,
    clientId,
    tracksValues,
    pitzuimSeparate,
    sortedRequestTypes,
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
    managementFeeAccumulation,
    setManagementFeeAccumulation,
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
    standing,
    setStanding,
    pitzuimSeparate,
    setPitzuimSeparate,
  };
}