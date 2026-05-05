import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkspaceChatPanel } from "@/components/WorkspaceChatPanel";
import { WorkspaceMeetingDetails } from "@/components/WorkspaceMeetingDetails";
import { WorkspaceClientDetails } from "@/components/WorkspaceClientDetails";
import { WorkspaceRequestsSection } from "@/components/WorkspaceRequestsSection";
import { ClientCombobox } from "@/components/ClientCombobox";
import { Loader2 } from "lucide-react";

function getNowDateTimeLocal(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export default function MeetingChatWorkspace() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useUser();

  const urlClientId = searchParams.get("clientId") || "";
  const urlMeetingDate = searchParams.get("meetingDate") || "";

  const [selectedClientId, setSelectedClientId] = useState(urlClientId);
  const [meetingDate, setMeetingDate] = useState(urlMeetingDate || getNowDateTimeLocal());
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [notes, setNotes] = useState("");

  const { data: clients, isLoading: isLoadingClients } = useEntityGetAll(ClientsEntity);
  const { data: client } = useEntityGetOne(ClientsEntity, { id: selectedClientId }, { enabled: !!selectedClientId });
  const { data: agents, isLoading: isLoadingAgents } = useEntityGetAll(AgentsEntity);
  const { data: meetings, isLoading: isLoadingMeetings } = useEntityGetAll(MeetingsEntity, { clientId: selectedClientId }, { enabled: !!selectedClientId });
  const { data: providers, isLoading: isLoadingProviders } = useEntityGetAll(ProvidersEntity);
  const { data: requestSchemes, isLoading: isLoadingRequestTypes } = useEntityGetAll(RequestSchemesEntity);
  const { data: funds, isLoading: isLoadingFunds } = useEntityGetAll(FundsEntity, { clientId: selectedClientId }, { enabled: !!selectedClientId });

  const latestMeeting = meetings
    ?.slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())?.[0];

  const meetingId = latestMeeting?.id || "";
  const meetingRequestIds: string[] = latestMeeting?.requests || [];

  const { data: allRequests, isLoading: isLoadingRequests } = useEntityGetAll(RequestsEntity, { clientId: selectedClientId }, { enabled: !!selectedClientId });

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
    if (selectedClientId) {
      navigate(getPageUrl(ClientProfilePage, { clientId: selectedClientId }));
    } else {
      navigate("/ClientsManager");
    }
  };

  const chatContext = selectedClientId
    ? {
        clientId: selectedClientId,
        clientName,
        agentEmail: user?.email || "",
        meetingDate,
      }
    : undefined;

  return (
    <div className="flex h-[calc(100vh-48px)]" style={{ direction: "rtl" }}>
      {/* Right panel */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 flex flex-col gap-6">
            {!hasStarted ? (
              <Card className="max-w-lg">
                <CardHeader>
                  <CardTitle>פגישה חדשה</CardTitle>
                  <CardDescription>
                    בחר לקוח ותאריך כדי להתחיל את הפגישה עם העוזר
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>לקוח</Label>
                    <ClientCombobox
                      clients={clients || []}
                      selectedClientId={selectedClientId}
                      onSelectClient={setSelectedClientId}
                      disabled={isLoadingClients}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="meeting-date">תאריך ושעה</Label>
                    <Input
                      id="meeting-date"
                      type="datetime-local"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                    />
                  </div>
                  <Button
                    size="lg"
                    disabled={!selectedClientId}
                    onClick={() => setHasStarted(true)}
                  >
                    התחל
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
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
                  onRequestAdded={() => {}}
                  clientId={selectedClientId}
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
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Left panel — chat */}
      <WorkspaceChatPanel
        chatContext={chatContext}
        onFirstMessageSent={() => setHasStarted(true)}
      />
    </div>
  );
}