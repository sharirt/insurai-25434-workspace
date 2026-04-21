import { LayoutDashboard, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAgentDashboardMetrics } from "@/hooks/useAgentDashboardMetrics";
import { AgentDashboardKpiSection } from "@/components/AgentDashboardKpiSection";
import { AumByProviderTable } from "@/components/AumByProviderTable";
import { TopClientsByDepositsTable } from "@/components/TopClientsByDepositsTable";

export default function AgentDashboard2() {
  const { metrics, isLoading, error, refetch } = useAgentDashboardMetrics();

  return (
    <div className="flex flex-col gap-6 p-6" style={{ direction: "rtl" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="size-6 text-primary" />
          <h1 className="text-2xl font-bold">דף סוכן</h1>
        </div>
        <Button variant="outline" size="sm" onClick={refetch}>
          <RefreshCw data-icon="inline-start" />
          רענון
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>שגיאה בטעינת הנתונים. נסה לרענן את הדף.</AlertDescription>
        </Alert>
      )}

      <AgentDashboardKpiSection
        totalAum={metrics?.totalAum ?? 0}
        totalClients={metrics?.totalClients ?? 0}
        totalActivePolicies={metrics?.totalActivePolicies ?? 0}
        totalGrowth={metrics?.totalGrowth ?? 0}
        isLoading={isLoading}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>סה"כ ניהול לפי חברה</CardTitle>
          </CardHeader>
          <CardContent>
            <AumByProviderTable rows={metrics?.providerRows ?? []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>לקוחות מובילים לפי הפקדות</CardTitle>
          </CardHeader>
          <CardContent>
            <TopClientsByDepositsTable rows={metrics?.topClients ?? []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}