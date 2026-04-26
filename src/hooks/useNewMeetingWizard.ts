import { useState, useEffect, useMemo, useCallback } from "react";
import {
  useEntityGetAll,
  useEntityCreate,
  useEntityUpdate,
  useUser,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import {
  AgentsEntity,
  ProvidersEntity,
  RequestSchemesEntity,
  RequestsEntity,
  MeetingsEntity,
  FundsEntity,
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
  choiceDuration?: string;
  transferType?: string;
  kerenName?: string;
  /** Full vs partial transfer; defaults to true in the meeting dialog. */
  isTotalTransfer?: boolean;
  /** Set when `isTotalTransfer === false`. */
  transferAmount?: string;
  standing?: string;
}

interface UseNewMeetingWizardProps {
  clientId: string;
  onSuccess?: () => void;
}

export function useNewMeetingWizard({
  clientId,
  onSuccess,
}: UseNewMeetingWizardProps) {
  const user = useUser();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 state
  const [meetingDate, setMeetingDate] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [isAgentAutoFilled, setIsAgentAutoFilled] = useState(false);

  // Step 3 state
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
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
    if (step === 1 && isStep1Valid) {
      setStep(2);
    } else if (step === 2) {
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
            choiceDuration: req.choiceDuration,
            transferType: req.transferType,
            kerenName: req.kerenName,
            isTotalTransfer: req.isTotalTransfer ?? true,
            transferAmount:
              req.isTotalTransfer === false ? req.transferAmount : undefined,
            standing: req.standing,
          },
        });
        createdRequestIds.push(createdReq.id);
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
  };
}