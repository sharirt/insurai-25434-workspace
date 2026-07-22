import { useState, useEffect, useMemo, useCallback } from "react";
import {
  useEntityGetAll,
  useEntityCreate,
  useEntityUpdate,
  useExecuteAction,
  useUser,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import {
  AgentsEntity,
  ProvidersEntity,
  RequestSchemesEntity,
  RequestsEntity,
  MeetingsEntity,
  FundsEntity,
  ProcessRequestFormsAction,
} from "@/product-types";
import { toast } from "sonner";

export interface PendingRequest {
  id: string;
  fundId: string;
  requestTypeId: string;
  requestTypeName: string;
  providerId: string;
  providerName: string;
  fundName: string;
  /** From selected fund at save time; for display on pending cards */
  fundPolicyNumber?: string;
  /** From selected fund at save time (`totalBalance`) */
  fundTotalBalance?: number;
  tracks: Record<string, string>;
  tracksCount: number;
  managementFee?: number;
  managementFeeAccumulation?: number;
  choiceDuration?: string;
  transferType?: string;
  kerenName?: string;
  /** Full vs partial transfer; defaults to true in the meeting dialog. */
  isTotalTransfer?: boolean;
  /** Set when `isTotalTransfer === false`. */
  transferAmount?: string;
  standing?: string;
  accountType?: string;
  chargeDay?: string;
  independentTransferType?: string;
  independentTransferAmount?: string;
  oneTimeTransferAmount?: number;
  isPartialTransfer?: boolean;
  partialTransferAmount?: number;
  sourceQuote?: string;
  missingFields?: Record<string, string>;
  selectedFormId?: string;
  selectedFormTitle?: string;
}

interface UseNewMeetingWizardProps {
  clientId: string;
  onSuccess?: () => void;
  initialData?: {
    meetingDate?: string;
    meetingNotes?: string;
    requests?: Array<{
      providerId?: any;
      providerName?: string;
      requestTypeId?: any;
      requestTypeName?: string;
      managementFee?: any;
      managementFeeAccumulation?: any;
      transferType?: string;
      choiceDuration?: string;
      kerenName?: string;
      transferAmount?: string;
      tracks?: Record<string, string>;
      sourceQuote?: string;
      missingFields?: Record<string, string>;
    }>;
  };
}

export function useNewMeetingWizard({
  clientId,
  onSuccess,
  initialData,
}: UseNewMeetingWizardProps) {
  const user = useUser();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 state
  const [meetingDate, setMeetingDate] = useState(
    () => initialData?.meetingDate || ""
  );
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [meetingNotes, setMeetingNotes] = useState(
    () => initialData?.meetingNotes || ""
  );
  const [isAgentAutoFilled, setIsAgentAutoFilled] = useState(false);

  // Step 3 state
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>(
    () => {
      if (!initialData?.requests?.length) return [];
      return initialData.requests.map((req, index) => {
        const tracks = (req.tracks as Record<string, string>) || {};
        return {
          id: `${Date.now()}_${index}`,
          providerId: req.providerId ?? "",
          providerName: req.providerName ?? "",
          requestTypeId: req.requestTypeId ?? "",
          requestTypeName: req.requestTypeName ?? "",
          managementFee: req.managementFee,
          managementFeeAccumulation: req.managementFeeAccumulation,
          transferType: req.transferType,
          choiceDuration: req.choiceDuration,
          kerenName: req.kerenName,
          transferAmount: req.transferAmount,
          sourceQuote: req.sourceQuote,
          missingFields: req.missingFields,
          tracks,
          tracksCount: Object.keys(tracks).length,
          fundId: "",
          fundName: "",
        };
      });
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data fetching
  const { data: agents, isLoading: isLoadingAgents } =
    useEntityGetAll(AgentsEntity);
  const { data: providers, isLoading: isLoadingProviders } =
    useEntityGetAll(ProvidersEntity);
  const { data: requestSchemes, isLoading: isLoadingRequestTypes } =
    useEntityGetAll(RequestSchemesEntity);
  const { data: funds, isLoading: isLoadingFunds } = useEntityGetAll(
    FundsEntity,
    { clientId },
    { enabled: !!clientId }
  );

  // Create/update functions
  const { createFunction: createMeeting } = useEntityCreate(MeetingsEntity);
  const { createFunction: createRequest } = useEntityCreate(RequestsEntity);
  const { updateFunction: updateMeeting } = useEntityUpdate(MeetingsEntity);
  const { updateFunction: updateRequest } = useEntityUpdate(RequestsEntity);
  const { executeFunction: executeProcessForms } = useExecuteAction(ProcessRequestFormsAction);
  const [formProcessingText, setFormProcessingText] = useState("");

  // Sorted data — spread into new arrays to avoid mutating SDK-returned (possibly frozen) arrays
  const sortedAgents = useMemo(
    () =>
      [...(agents || [])].sort((a, b) => {
        const nameA = [a.firstName, a.lastName].filter(Boolean).join(" ") || "";
        const nameB = [b.firstName, b.lastName].filter(Boolean).join(" ") || "";
        return nameA.localeCompare(nameB);
      }),
    [agents]
  );

  const sortedProviders = useMemo(
    () =>
      [...(providers || [])].sort((a, b) =>
        (a.provider_name || "").localeCompare(b.provider_name || "")
      ),
    [providers]
  );

  const sortedRequestTypes = useMemo(
    () =>
      [...(requestSchemes || [])].sort((a, b) =>
        (a.requestTypeName || "").localeCompare(b.requestTypeName || "")
      ),
    [requestSchemes]
  );

  const sortedFunds = useMemo(
    () =>
      [...(funds || [])].sort((a, b) =>
        (a.planName || "").localeCompare(b.planName || "")
      ),
    [funds]
  );

  // Auto-fill agent from logged-in user
  useEffect(() => {
    if (agents && user?.email && !selectedAgentId) {
      const matchingAgent = agents.find(
        (agent) =>
          agent.email?.toLowerCase() === user.email?.toLowerCase()
      );
      if (matchingAgent) {
        setSelectedAgentId(matchingAgent.id);
        setIsAgentAutoFilled(true);
      }
    }
  }, [agents, user?.email, selectedAgentId]);

  const isStep1Valid = !!meetingDate && !!selectedAgentId;

  const handleNext = useCallback(() => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && isStep1Valid) {
      setStep(3);
    }
  }, [step, isStep1Valid]);

  const handleBack = useCallback(() => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
    }
  }, [step]);

  const addPendingRequest = useCallback((request: PendingRequest) => {
    setPendingRequests((prev) => {
      const existingIndex = prev.findIndex((r) => r.id === request.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = request;
        return updated;
      }
      return [...prev, request];
    });
  }, []);

  const removePendingRequest = useCallback((requestId: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedAgentId || !meetingDate) return;

    setIsSubmitting(true);

    try {
      // 1. Create the meeting
      const meeting = await createMeeting({
        data: {
          clientId,
          agentId: selectedAgentId,
          date: meetingDate,
          notes: meetingNotes || undefined,
          status: "מעבד" as const,
        },
      });

      // 2. Create each pending request
      const createdRequestIds: string[] = [];

      const requestsWithForms: Array<{ requestId: string; pendingReq: PendingRequest }> = [];

      for (const req of pendingRequests) {
        const createdReq = await createRequest({
          data: {
            clientId,
            agentId: selectedAgentId,
            providerId: req.providerId,
            requestTypeId: req.requestTypeId,
            fundId: req.fundId || undefined,
            status: "מעבד" as const,
            tracks: req.tracks,
            managementFee: req.managementFee ?? undefined,
            managementFeeAccumulation: req.managementFeeAccumulation ?? undefined,
            choiceDuration: req.choiceDuration,
            transferType: req.transferType,
            kerenName: req.kerenName,
            isTotalTransfer: req.isTotalTransfer ?? true,
            transferAmount:
              req.isTotalTransfer === false ? req.transferAmount : undefined,
            standing: req.standing,
            accountType: req.accountType || undefined,
            chargeDay: req.chargeDay || undefined,
            independentTransferType: req.independentTransferType || undefined,
            independentTransferAmount: req.independentTransferAmount || undefined,
            oneTimeTransferAmount: req.oneTimeTransferAmount ?? undefined,
            isPartialTransfer: req.isPartialTransfer ?? false,
            partialTransferAmount: req.isPartialTransfer ? (req.partialTransferAmount ?? undefined) : undefined,
          },
        });
        createdRequestIds.push(createdReq.id);

        if (req.selectedFormId) {
          requestsWithForms.push({ requestId: createdReq.id, pendingReq: req });
        }
      }

      // Process forms for requests that have a selected form
      if (requestsWithForms.length > 0) {
        setFormProcessingText("מעבד טפסים...");
        for (const { requestId, pendingReq } of requestsWithForms) {
          await updateRequest({
            id: requestId,
            data: {
              forms: [{ formId: pendingReq.selectedFormId, url: "" }],
            },
          });
          await executeProcessForms({ requestId });
        }
        setFormProcessingText("");
      }

      // 3. Update meeting with request IDs if any requests were created
      if (createdRequestIds.length > 0) {
        await updateMeeting({
          id: meeting.id,
          data: {
            requests: createdRequestIds,
          },
        });
      }

      // 4. Show success toast
      if (pendingRequests.length > 0) {
        toast.success(
          `הפגישה נוצרה בהצלחה עם ${pendingRequests.length} בקשות`
        );
      } else {
        toast.success("הפגישה נוצרה בהצלחה");
      }

      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.message || "שגיאה ביצירת הפגישה");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedAgentId,
    meetingDate,
    meetingNotes,
    clientId,
    pendingRequests,
    createMeeting,
    createRequest,
    updateMeeting,
    updateRequest,
    executeProcessForms,
    onSuccess,
  ]);

  return {
    step,
    // Step 1
    meetingDate,
    setMeetingDate,
    selectedAgentId,
    setSelectedAgentId,
    meetingNotes,
    setMeetingNotes,
    isAgentAutoFilled,
    isStep1Valid,
    // Agents data
    sortedAgents,
    isLoadingAgents,
    // Step 3
    pendingRequests,
    addPendingRequest,
    removePendingRequest,
    // Step 3 dialog data
    sortedProviders,
    sortedRequestTypes,
    sortedFunds,
    isLoadingProviders,
    isLoadingRequestTypes,
    isLoadingFunds,
    requestSchemes,
    // Navigation
    handleNext,
    handleBack,
    // Submit
    handleSubmit,
    isSubmitting,
    formProcessingText,
  };
}