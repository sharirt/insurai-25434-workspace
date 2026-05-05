import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  useEntityGetAll,
  useEntityGetOne,
  useUser,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import {
  ClientsEntity,
  AgentsEntity,
  MeetingsEntity,
  RequestsEntity,
  ProvidersEntity,
  RequestSchemesEntity,
  FundsEntity,
  MeetingDetailsPage,
  ClientProfilePage,
} from "@/product-types";
import { getPageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkspaceChatPanel } from "@/components/WorkspaceChatPanel";
import { WorkspaceMeetingDetails } from "@/components/WorkspaceMeetingDetails";
import { WorkspaceClientDetails } from "@/components/WorkspaceClientDetails";
import { WorkspaceRequestsSection } from "@/components/WorkspaceRequestsSection";
import { Loader2 } from "lucide-react";

export default function MeetingChatWorkspace() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useUser();

  const [clientId] = useState(() => sessionStorage.getItem("meetingClientId") || "");
  const [meetingDateInit] = useState(() => sessionStorage.getItem("meetingDate") || "");
  const [meetingSummary] = useState(() => {
    return sessionStorage.getItem("meetingSummary") || "";
  });
  const [chatHistory] = useState<Array<{ role: string; content: string }>>(() => {
    try {
      const stored = sessionStorage.getItem("meetingChatHistory");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [meetingDate, setMeetingDate] = useState(meetingDateInit);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [notes, setNotes] = useState("");

  const { data: client } = useEntityGetOne(ClientsEntity, { id: clientId }, { enabled: !!clientId });
  const { data: agents, isLoading: isLoadingAgents } = useEntityGetAll(AgentsEntity);
  const { data: meetings, isLoading: isLoadingMeetings } = useEntityGetAll(MeetingsEntity, { clientId }, { enabled: !!clientId });
  const { data: providers, isLoading: isLoadingProviders } = useEntityGetAll(ProvidersEntity);
  const { data: requestSchemes, isLoading: isLoadingRequestTypes } = useEntityGetAll(RequestSchemesEntity);
  const { data: funds, isLoading: isLoadingFunds } = useEntityGetAll(FundsEntity, { clientId }, { enabled: !!clientId });

  const latestMeeting = meetings
    ?.slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())?.[0];

  const meetingId = latestMeeting?.id || "";
  const meetingRequestIds: string[] = latestMeeting?.requests || [];

  const { data: allRequests, isLoading: isLoadingRequests } = useEntityGetAll(RequestsEntity, { clientId }, { enabled: !!clientId });

  const meetingRequests = (allRequests || []).filter((r) => meetingRequestIds.includes(r.id));

  const requestsWithNames = meetingRequests.map((req) => {
    const provider = providers?.find((p) => p.id === req.providerId);
    const reqType = requestSchemes?.find((rt) => rt.id === req.requestTypeId);
    return {
      id: req.id,
      providerName: provider?.provider_name,
      requestTypeName: reqType?.requestTypeName,
      status: req.status,
    };
  });

  const sortedProviders = [...(providers || [])].sort((a, b) =>
    (a.provider_name || "").localeCompare(b.provider_name || "")
  );
  const sortedRequestTypes = [...(requestSchemes || [])].sort((a, b) =>
    (a.requestTypeName || "").localeCompare(b.requestTypeName || "")
  );
  const sortedFunds = [...(funds || [])].sort((a, b) =>
    ((a as any).planName || "").localeCompare((b as any).planName || "")
  );

  useEffect(() => {
    if (agents && user?.email && !selectedAgentId) {
      const match = agents.find(
        (a) => a.email?.toLowerCase() === user.email?.toLowerCase()
      );
      if (match) setSelectedAgentId(match.id);
    }
  }, [agents, user?.email, selectedAgentId]);

  const clientName = client
    ? [client.first_name, client.last_name].filter(Boolean).join(" ")
    : "";

  const handleFinish = () => {
    if (meetingId) {
      navigate(getPageUrl(MeetingDetailsPage, { id: meetingId }));
    }
  };

  const handleCancel = () => {
    if (clientId) {
      navigate(getPageUrl(ClientProfilePage, { clientId }));
    } else {
      navigate("/ClientsManager");
    }
  };

  const handleRequestAdded = () => {
    // auto-refetch happens via SDK
  };

  return (
    <div className="flex h-[calc(100vh-48px)]" style={{ direction: "rtl" }}>
      {/* Right panel — meeting details */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 flex flex-col gap-6">
            <h1 className="text-xl font-bold">פרטי הפגישה</h1>

            <WorkspaceMeetingDetails
              meetingDate={meetingDate}
              onMeetingDateChange={setMeetingDate}
              selectedAgentId={selectedAgentId}
              onAgentChange={setSelectedAgentId}
              notes={notes}
              onNotesChange={setNotes}
              agents={agents || []}
              isLoadingAgents={isLoadingAgents}
            />

            <WorkspaceClientDetails client={client || null} />

            <WorkspaceRequestsSection
              requests={requestsWithNames}
              isLoading={isLoadingMeetings || isLoadingRequests}
              sortedProviders={sortedProviders}
              sortedRequestTypes={sortedRequestTypes}
              sortedFunds={sortedFunds as any}
              isLoadingProviders={isLoadingProviders}
              isLoadingRequestTypes={isLoadingRequestTypes}
              isLoadingFunds={isLoadingFunds}
              requestSchemes={requestSchemes}
              onRequestAdded={handleRequestAdded}
              clientId={clientId}
              agentId={selectedAgentId}
              meetingId={meetingId}
            />

            <div className="flex items-center gap-3 pt-4 pb-8">
              <Button size="lg" onClick={handleFinish} disabled={!meetingId}>
                {isLoadingMeetings ? (
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                ) : null}
                צור פגישה
              </Button>
              <Button variant="outline" size="lg" onClick={handleCancel}>
                ביטול
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Left panel — chat */}
      <WorkspaceChatPanel
        clientId={clientId}
        clientName={clientName}
        agentEmail={user?.email || ""}
        meetingDate={meetingDate}
        meetingSummary={chatHistory.length > 0 ? undefined : meetingSummary}
        initialHistory={chatHistory.length > 0 ? chatHistory : undefined}
      />
    </div>
  );
}