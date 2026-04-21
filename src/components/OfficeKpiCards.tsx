import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, FileText, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface OfficeKpiCardsProps {
  clientsCount: number;
  meetingsCount: number;
  requestsCount: number;
  completedMeetingsCount: number;
  isLoading: boolean;
  hideClientsCard?: boolean;
}

const kpiConfig = [
  { key: "clients", label: "לקוחות מוקצים", icon: Users },
  { key: "meetings", label: "סה\"כ פגישות", icon: Calendar },
  { key: "requests", label: "סה\"כ בקשות", icon: FileText },
  { key: "completed", label: "פגישות שהושלמו", icon: CheckCircle },
] as const;

export const OfficeKpiCards = ({
  clientsCount,
  meetingsCount,
  requestsCount,
  completedMeetingsCount,
  isLoading,
  hideClientsCard,
}: OfficeKpiCardsProps) => {
  const valuesMap: Record<string, number> = {
    clients: clientsCount,
    meetings: meetingsCount,
    requests: requestsCount,
    completed: completedMeetingsCount,
  };

  const filteredConfig = hideClientsCard
    ? kpiConfig.filter((kpi) => kpi.key !== "clients")
    : kpiConfig;

  const gridClasses = hideClientsCard
    ? "grid grid-cols-1 sm:grid-cols-3 gap-4"
    : "grid grid-cols-2 lg:grid-cols-4 gap-4";

  if (isLoading) {
    return (
      <div className={gridClasses}>
        {filteredConfig.map((kpi) => (
          <Card key={kpi.key}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={gridClasses}>
      {filteredConfig.map((kpi) => (
        <Card key={kpi.key}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <kpi.icon className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="text-2xl font-bold text-foreground">{valuesMap[kpi.key]}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};