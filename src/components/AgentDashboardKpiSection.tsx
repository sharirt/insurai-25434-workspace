import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/FormatUtils";
import { Landmark, Users, Layers, TrendingUp } from "lucide-react";

type AgentDashboardKpiSectionProps = {
  totalAum: number;
  totalClients: number;
  totalActivePolicies: number;
  totalGrowth: number;
  isLoading: boolean;
};

export const AgentDashboardKpiSection = ({
  totalAum,
  totalClients,
  totalActivePolicies,
  totalGrowth,
  isLoading,
}: AgentDashboardKpiSectionProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-5 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            נכסים מנוהלים (AUM)
          </CardTitle>
          <Landmark className="h-5 w-5 text-muted-foreground shrink-0" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold tabular-nums">
            {formatCurrency(totalAum)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            סה״כ לקוחות
          </CardTitle>
          <Users className="h-5 w-5 text-muted-foreground shrink-0" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold tabular-nums">{totalClients}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            פוליסות פעילות
          </CardTitle>
          <Layers className="h-5 w-5 text-muted-foreground shrink-0" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold tabular-nums">
            {totalActivePolicies}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            סה״כ גידול
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-muted-foreground shrink-0" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold tabular-nums">
            {formatCurrency(totalGrowth)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};