import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { MeetingsEntity, AgentsEntity, MeetingDetailsPage } from "@/product-types";
import { useEntityGetOne } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { getPageUrl } from "@/lib/utils";
import { getStatusLabel, getStatusVariant } from "@/utils/StatusConfig";

interface ClientProfileMeetingTableRowProps {
  meeting: typeof MeetingsEntity["instanceType"] & { id: string };
  onDelete?: (meeting: typeof MeetingsEntity["instanceType"]) => void;
}

export const ClientProfileMeetingTableRow = ({
  meeting,
  onDelete,
}: ClientProfileMeetingTableRowProps) => {
  const navigate = useNavigate();
  const { data: agent } = useEntityGetOne(
    AgentsEntity,
    { id: meeting.agentId || "" },
    { enabled: !!meeting.agentId }
  );

  const meetingUrl = getPageUrl(MeetingDetailsPage, { meetingId: meeting.id });
  const requestCount = meeting.requests?.length || 0;

  let formattedDateTime = "";
  if (meeting.date) {
    try {
      formattedDateTime = new Intl.DateTimeFormat("he-IL", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      }).format(new Date(meeting.date));
    } catch {
      formattedDateTime = meeting.date;
    }
  }

  const statusKey = meeting.status || "מעבד";
  const statusLabel = getStatusLabel(statusKey);
  const statusVariant = getStatusVariant(statusKey);

  const agentName =
    [agent?.firstName, agent?.lastName].filter(Boolean).join(" ").trim() ||
    "—";

  const handleRowClick = () => {
    navigate(meetingUrl);
  };

  return (
    <TableRow
      className="hover:bg-muted/30 cursor-pointer"
      onClick={handleRowClick}
    >
      <TableCell className="font-medium whitespace-nowrap">
        {formattedDateTime || "תאריך לא ידוע"}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </TableCell>
      <TableCell className="whitespace-nowrap">{agentName}</TableCell>
      <TableCell className="whitespace-nowrap text-muted-foreground">
        {requestCount === 0
          ? "—"
          : `${requestCount} ${requestCount === 1 ? "בקשה" : "בקשות"}`}
      </TableCell>
      <TableCell className="max-w-[12rem]">
        {meeting.notes ? (
          <span className="line-clamp-2 text-sm text-muted-foreground">
            {meeting.notes}
          </span>
        ) : (
          "—"
        )}
      </TableCell>
      <TableCell
        className="text-left whitespace-nowrap w-[1%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-end gap-2">
          <Button variant="link" className="h-auto p-0" asChild>
            <Link to={meetingUrl} onClick={(e) => e.stopPropagation()}>
              פתיחה
            </Link>
          </Button>
          {onDelete && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              type="button"
              onClick={() => onDelete(meeting)}
              aria-label="מחק פגישה"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};