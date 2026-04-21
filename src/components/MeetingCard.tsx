import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MeetingsEntity, AgentsEntity, MeetingDetailsPage } from "@/product-types";
import { useEntityGetOne } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { formatDate } from "@/utils/FormatUtils";
import { User, FileText, Calendar, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { getPageUrl } from "@/lib/utils";

export const MeetingCard = ({ meeting, onDelete }: { meeting: typeof MeetingsEntity['instanceType'] & { id: string }; onDelete?: (meeting: typeof MeetingsEntity['instanceType']) => void }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(getPageUrl(MeetingDetailsPage, { meetingId: meeting.id }));
  };

  // Fetch agent data
  const { data: agent } = useEntityGetOne(
    AgentsEntity,
    { id: meeting.agentId || "" },
    { enabled: !!meeting.agentId }
  );

  // Count requests
  const requestCount = useMemo(() => {
    return meeting.requests?.length || 0;
  }, [meeting.requests]);

  // Format date and time
  const formattedDateTime = useMemo(() => {
    if (!meeting.date) return "";
    try {
      const date = new Date(meeting.date);
      return new Intl.DateTimeFormat('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return meeting.date;
    }
  }, [meeting.date]);

  return (
    <Card className="group relative hover:shadow-md transition-shadow hover:border-primary cursor-pointer" onClick={handleCardClick}>
      <CardHeader>
        {/* Delete button - top-left corner with hover effect */}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(meeting);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg pl-20">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>{formattedDateTime || "תאריך לא ידוע"}</span>
            </div>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Badge - bottom-left corner */}
        {requestCount > 0 && (
          <Badge variant="secondary" className="absolute bottom-4 left-4 z-10">
            {requestCount} {requestCount === 1 ? "בקשה" : "בקשות"}
          </Badge>
        )}

        {/* Agent Info */}
        {(agent?.firstName || agent?.lastName) && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">סוכן</p>
              <p className="text-sm font-medium">{[agent.firstName, agent.lastName].filter(Boolean).join(' ').trim() || 'סוכן ללא שם'}</p>
            </div>
          </div>
        )}

        {/* Notes */}
        {meeting.notes && (
          <div className="pt-2 border-t">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">הערות</p>
                <p className="text-sm">{meeting.notes}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};