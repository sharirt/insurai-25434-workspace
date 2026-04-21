import { useState } from "react";
import { useUser, useEntityGetAll } from "@blocksdiy/blocks-client-sdk/reactSdk";
import {
  ClientsEntity,
  MeetingsEntity,
  RequestsEntity,
  AgentsEntity,
  RequestSchemesEntity,
  ProvidersEntity,
} from "@/product-types";
import { AccessDenied } from "@/components/AccessDenied";
import { OfficeKpiCards } from "@/components/OfficeKpiCards";
import { OfficeClientCard } from "@/components/OfficeClientCard";
import { OfficeRequestsTable } from "@/components/OfficeRequestsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutDashboard, RefreshCw, Search, Users } from "lucide-react";
import { STATUS_VALUES } from "@/utils/StatusConfig";

export default function OfficeManager() {
  const user = useUser();
  const userRole = user.isAuthenticated ? (user as any).role : undefined;

  const [clientSearch, setClientSearch] = useState("");
  const [meetingStatusFilter, setMeetingStatusFilter] = useState("all");
  const [requestSearch, setRequestSearch] = useState("");
  const [requestStatusFilter, setRequestStatusFilter] = useState("all");

  const { data: allClients, isLoading: clientsLoading, refetch: refetchClients } = useEntityGetAll(ClientsEntity);
  const { data: allMeetings, isLoading: meetingsLoading, refetch: refetchMeetings } = useEntityGetAll(MeetingsEntity);
  const { data: allRequests, isLoading: requestsLoading, refetch: refetchRequests } = useEntityGetAll(RequestsEntity);
  const { data: agents, isLoading: agentsLoading } = useEntityGetAll(AgentsEntity);
  const { data: requestSchemes } = useEntityGetAll(RequestSchemesEntity);
  const { data: providers } = useEntityGetAll(ProvidersEntity);

  if (userRole !== "office" && userRole !== "admin" && userRole !== "agent") {
    return <AccessDenied />;
  }

  const isLoading = clientsLoading || meetingsLoading || requestsLoading || agentsLoading;

  const handleRefresh = () => {
    refetchClients();
    refetchMeetings();
    refetchRequests();
  };

  const userEmail = user.email?.toLowerCase() || "";
  const isAgentRole = userRole === "agent";

  // Find matching agent record for agent role
  const matchedAgent = isAgentRole
    ? (agents || []).find((a) => a.email?.toLowerCase() === userEmail)
    : undefined;

  let assignedClients: typeof allClients = [];
  let clientMeetings: typeof allMeetings = [];
  let clientRequests: typeof allRequests = [];

  if (isAgentRole && matchedAgent) {
    // Agent: filter by agentId
    clientMeetings = (allMeetings || []).filter((m) => m.agentId === matchedAgent.id);
    clientRequests = (allRequests || []).filter((r) => r.agentId === matchedAgent.id);

    // Build union of clientIds from meetings + requests
    const agentClientIds = new Set<string>();
    clientMeetings.forEach((m) => { if (m.clientId) agentClientIds.add(m.clientId); });
    clientRequests.forEach((r) => { if (r.clientId) agentClientIds.add(r.clientId); });

    assignedClients = (allClients || []).filter((c) => agentClientIds.has(c.id));
  } else if (!isAgentRole) {
    // Office/Admin: filter by assignedOfficeEmails
    assignedClients = (allClients || []).filter((client) =>
      client.assignedOfficeEmails?.includes(user.email)
    );
    const assignedClientIds = new Set(assignedClients.map((c) => c.id));
    clientMeetings = (allMeetings || []).filter(
      (m) => m.clientId && assignedClientIds.has(m.clientId)
    );
    clientRequests = (allRequests || []).filter(
      (r) => r.clientId && assignedClientIds.has(r.clientId)
    );
  }

  const completedMeetingsCount = clientMeetings.filter((m) => m.status === "הושלם").length;

  // Filter clients by search
  const filteredClients = assignedClients.filter((client) => {
    if (!clientSearch) return true;
    const term = clientSearch.toLowerCase();
    const name = (client.fullName || `${client.first_name || ""} ${client.last_name || ""}`)?.toLowerCase() || "";
    const nid = client.national_id?.toLowerCase() || "";
    return name.includes(term) || nid.includes(term);
  });

  // Filter meetings by status for display
  const getMeetingsForClient = (clientId: string) => {
    return clientMeetings.filter((m) => {
      if (m.clientId !== clientId) return false;
      if (meetingStatusFilter && meetingStatusFilter !== "all") {
        return m.status === meetingStatusFilter;
      }
      return true;
    });
  };

  const defaultExpanded = assignedClients.length <= 5;

  // Empty state
  if (!isLoading && assignedClients.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6" style={{ direction: "rtl" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <LayoutDashboard className="size-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">מנהל משרד</h1>
          </div>
          <div className="flex flex-col items-center justify-center py-20">
            <Users className="size-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">לא הוקצו לך לקוחות עדיין</h2>
            <p className="text-muted-foreground">פנה למנהל המערכת כדי שיקצה לך לקוחות</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6" style={{ direction: "rtl" }}>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="size-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">מנהל משרד</h1>
              <p className="text-sm text-muted-foreground">
                {isLoading ? "טוען..." : `${assignedClients.length} לקוחות מוקצים`}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw data-icon="inline-start" className={isLoading ? "animate-spin" : ""} />
            רענון
          </Button>
        </div>

        {/* KPI Cards */}
        <OfficeKpiCards
          clientsCount={assignedClients.length}
          meetingsCount={clientMeetings.length}
          requestsCount={clientRequests.length}
          completedMeetingsCount={completedMeetingsCount}
          isLoading={isLoading}
          hideClientsCard={isAgentRole}
        />

        {/* Tabs */}
        <Tabs defaultValue="clients" dir="rtl">
          <TabsList>
            <TabsTrigger value="clients">לקוחות ופגישות</TabsTrigger>
            <TabsTrigger value="requests">בקשות</TabsTrigger>
          </TabsList>

          {/* Clients & Meetings Tab */}
          <TabsContent value="clients" dir="rtl" className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="חיפוש לפי שם או ת.ז..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="pr-9"
                />
              </div>
              <Select value={meetingStatusFilter} onValueChange={setMeetingStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="סטטוס פגישה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הסטטוסים</SelectItem>
                  {STATUS_VALUES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Search className="size-12 opacity-50 mb-2" />
                <p>לא נמצאו לקוחות התואמים לחיפוש</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredClients.map((client) => (
                  <OfficeClientCard
                    key={client.id}
                    client={client}
                    meetings={getMeetingsForClient(client.id)}
                    agents={agents || []}
                    defaultExpanded={defaultExpanded}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" dir="rtl" className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="חיפוש לפי שם לקוח..."
                  value={requestSearch}
                  onChange={(e) => setRequestSearch(e.target.value)}
                  className="pr-9"
                />
              </div>
              <Select value={requestStatusFilter} onValueChange={setRequestStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="סטטוס בקשה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הסטטוסים</SelectItem>
                  {STATUS_VALUES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex flex-col gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div dir="rtl">
              <OfficeRequestsTable
                requests={clientRequests}
                clients={assignedClients}
                requestSchemes={requestSchemes || []}
                providers={providers || []}
                searchTerm={requestSearch}
                statusFilter={requestStatusFilter}
              />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}