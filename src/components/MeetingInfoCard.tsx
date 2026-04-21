import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, Users, Tag, FileText } from "lucide-react";
import { Link } from "react-router";
import { getPageUrl } from "@/lib/utils";
import { ClientProfilePage, MeetingsEntity, AgentsEntity, ClientsEntity } from "@/product-types";
import { useEntityGetOne } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { getStatusLabel, getStatusVariant } from "@/utils/StatusConfig";

export const MeetingInfoCard = ({
  meeting,
}: {
  meeting: typeof MeetingsEntity["instanceType"] & { id: string };
}) => {
  const { data: agent } = useEntityGetOne(AgentsEntity, { id: meeting.agentId || "" }, { enabled: !!meeting.agentId });
  const { data: client } = useEntityGetOne(ClientsEntity, { id: meeting.clientId || "" }, { enabled: !!meeting.clientId });

const formattedDateTime = meeting.date
    ? (() => {
        try {
          const dateStr = meeting.date;
          const dateObj = new Date(dateStr);
          const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
          };
          return new Intl.DateTimeFormat("he-IL", options).format(dateObj);
        } catch {
          return meeting.date;
        }
      })()
    : "תאריך לא ידוע";

  const clientName = [client?.first_name, client?.last_name].filter(Boolean).join(" ") || "לקוח לא ידוע";
  const agentName = [agent?.firstName, agent?.lastName].filter(Boolean).join(" ") || "סוכן לא ידוע";
  const status = meeting.status || "מעבד";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar />
          <span>פרטי פגישה</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">תאריך ושעה</p>
              <p className="text-sm font-semibold">{formattedDateTime}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <User className="text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">סוכן</p>
              <p className="text-sm font-semibold">{agentName}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">לקוח</p>
              <Link
                to={getPageUrl(ClientProfilePage, { clientId: meeting.clientId || "" })}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {clientName}
              </Link>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Tag className="text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">סטטוס</p>
              <Badge variant={getStatusVariant(status)}>
                {getStatusLabel(status)}
              </Badge>
            </div>
          </div>
          {meeting.notes && (
            <div className="flex items-start gap-3 md:col-span-2">
              <FileText className="text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">הערות</p>
                <p className="text-sm">{meeting.notes}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const MeetingInfoCardSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="size-5 rounded" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);