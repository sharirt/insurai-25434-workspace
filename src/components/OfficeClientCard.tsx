import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, ExternalLink, Calendar } from "lucide-react";
import { getPageUrl } from "@/lib/utils";
import { ClientProfilePage, MeetingDetailsPage } from "@/product-types";
import type { IClientsEntity, IMeetingsEntity, IAgentsEntity } from "@/product-types";
import { getStatusLabel, getStatusVariant } from "@/utils/StatusConfig";

interface OfficeClientCardProps {
  client: IClientsEntity & { id: string };
  meetings: (IMeetingsEntity & { id: string })[];
  agents: (IAgentsEntity & { id: string })[];
  defaultExpanded: boolean;
}

export const OfficeClientCard = ({
  client,
  meetings,
  agents,
  defaultExpanded,
}: OfficeClientCardProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const sortedMeetings = [...meetings].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  const getAgentName = (agentId?: string) => {
    if (!agentId) return "—";
    const agent = agents.find((a) => a.id === agentId);
    return agent ? `${agent.firstName || ""} ${agent.lastName || ""}`.trim() || "—" : "—";
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      return new Intl.DateTimeFormat("he-IL", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }).format(new Date(dateStr));
    } catch {
      return "—";
    }
  };

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-wrap" dir="rtl">
            <Link
              to={getPageUrl(ClientProfilePage, { id: client.id })}
              className="text-lg font-semibold text-primary hover:underline"
            >
              {client.fullName || `${client.first_name || ""} ${client.last_name || ""}`.trim()}
            </Link>
            {client.national_id && (
              <span className="text-sm text-muted-foreground">ת.ז: {client.national_id}</span>
            )}
            {client.phone_number && (
              <span className="text-sm text-muted-foreground">{client.phone_number}</span>
            )}
            {client.email && (
              <span className="text-sm text-muted-foreground">{client.email}</span>
            )}
            {client.clientStatus && (
              <Badge variant="outline">{client.clientStatus}</Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="p-4 pt-0">
          {sortedMeetings.length === 0 ? (
            <div className="flex items-center justify-center py-6 text-muted-foreground gap-2">
              <Calendar className="size-4" />
              <span>אין פגישות</span>
            </div>
          ) : (
            <div className="overflow-x-auto" dir="rtl">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>תאריך ושעה</TableHead>
                    <TableHead>סוכן</TableHead>
                    <TableHead>סטטוס</TableHead>
                    <TableHead>בקשות</TableHead>
                    <TableHead>הערות</TableHead>
                    <TableHead>פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedMeetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(meeting.date)}
                      </TableCell>
                      <TableCell>{getAgentName(meeting.agentId)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(meeting.status)}>
                          {getStatusLabel(meeting.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{meeting.requests?.length || 0}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {meeting.notes || "—"}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={getPageUrl(MeetingDetailsPage, { meetingId: meeting.id })}>
                            <ExternalLink data-icon="inline-start" />
                            פתח
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};