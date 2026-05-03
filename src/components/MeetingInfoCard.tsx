import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, Users, Tag, FileText, ChevronDown } from "lucide-react";
import { Link } from "react-router";
import { getPageUrl, cn } from "@/lib/utils";
import { ClientProfilePage, MeetingsEntity, AgentsEntity, ClientsEntity } from "@/product-types";
import { useEntityGetOne, useEntityUpdate } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { getStatusLabel, getStatusVariant, STATUS_VALUES } from "@/utils/StatusConfig";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";

export const MeetingInfoCard = ({
  meeting,
  onStatusChange,
}: {
  meeting: typeof MeetingsEntity["instanceType"] & { id: string };
  onStatusChange?: () => void;
}) => {
  const { data: agent } = useEntityGetOne(AgentsEntity, { id: meeting.agentId || "" }, { enabled: !!meeting.agentId });
  const { data: client } = useEntityGetOne(ClientsEntity, { id: meeting.clientId || "" }, { enabled: !!meeting.clientId });
  const { updateFunction, isLoading: isUpdatingStatus } = useEntityUpdate(MeetingsEntity);
  const [localStatus, setLocalStatus] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    setLocalStatus(newStatus);
    try {
      await updateFunction({ id: meeting.id, data: { status: newStatus } });
      onStatusChange?.();
    } finally {
      setLocalStatus(null);
    }
  };

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
  const displayStatus = localStatus || status;

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="cursor-pointer">
                    <Badge
                      variant={getStatusVariant(displayStatus)}
                      className={cn(
                        "inline-flex items-center gap-1",
                        isUpdatingStatus && "opacity-50"
                      )}
                    >
                      {getStatusLabel(displayStatus)}
                      <ChevronDown />
                    </Badge>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {STATUS_VALUES.map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      disabled={s === displayStatus}
                    >
                      <Badge variant={getStatusVariant(s)} className="pointer-events-none">
                        {getStatusLabel(s)}
                      </Badge>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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