import { useEntityGetAll } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { useMemo } from "react";
import { subMonths } from "date-fns";
import { ClientsEntity, FundsEntity } from "@/product-types";

const ACTIVE_STATUS = "פעיל";

export type ProviderAumRow = {
  providerName: string;
  aum: number;
};

export type TopClientRow = {
  clientId: string;
  displayName: string;
  nationalId: string | undefined;
  totalDeposits: number;
  activePolicyCount: number;
  totalAum: number;
};

export function useAgentDashboardMetrics() {
  const {
    data: clients,
    isLoading: isLoadingClients,
    error: clientsError,
    refetch: refetchClients,
  } = useEntityGetAll(ClientsEntity);

  const {
    data: funds,
    isLoading: isLoadingFunds,
    error: fundsError,
    refetch: refetchFunds,
  } = useEntityGetAll(FundsEntity);

  const isLoading = isLoadingClients || isLoadingFunds;
  const error = clientsError ?? fundsError;

  const refetch = () => {
    void refetchClients();
    void refetchFunds();
  };

  const metrics = useMemo(() => {
    if (!clients || !funds) {
      return null;
    }

    const totalAum = funds.reduce((sum, f) => sum + (f.totalBalance ?? 0), 0);
    const totalClients = clients.length;
    const totalActivePolicies = funds.filter((f) => f.status === ACTIVE_STATUS).length;

    const providerMap = new Map<string, number>();
    for (const f of funds) {
      const key = f.providerName?.trim() ? f.providerName.trim() : "לא ידוע";
      providerMap.set(key, (providerMap.get(key) ?? 0) + (f.totalBalance ?? 0));
    }

    const providerRows: ProviderAumRow[] = Array.from(providerMap.entries()).map(
      ([providerName, aum]) => ({ providerName, aum })
    );

    const byClient = new Map<
      string,
      { totalDeposits: number; totalAum: number; activePolicyCount: number }
    >();

    for (const f of funds) {
      const cid = f.clientId;
      if (!cid) continue;
      const cur = byClient.get(cid) ?? {
        totalDeposits: 0,
        totalAum: 0,
        activePolicyCount: 0,
      };
      cur.totalDeposits +=
        (f.employerContributions ?? 0) + (f.employeeContributions ?? 0);
      cur.totalAum += f.totalBalance ?? 0;
      if (f.status === ACTIVE_STATUS) {
        cur.activePolicyCount += 1;
      }
      byClient.set(cid, cur);
    }

    const clientById = new Map(
      clients.map((c) => [c.id, c] as const)
    );

    const topClients: TopClientRow[] = Array.from(byClient.entries())
      .map(([clientId, agg]) => {
        const c = clientById.get(clientId);
        const displayName =
          `${c?.first_name || ""} ${c?.last_name || ""}`.trim() || "לקוח לא ידוע";
        return {
          clientId,
          displayName,
          nationalId: c?.national_id,
          totalDeposits: agg.totalDeposits,
          activePolicyCount: agg.activePolicyCount,
          totalAum: agg.totalAum,
        };
      })
      .sort((a, b) => b.totalDeposits - a.totalDeposits)
      .slice(0, 20);

    const threeMonthsAgo = subMonths(new Date(), 3);
    const totalGrowth = funds.reduce((sum, f) => {
      if (!f.lastDepositDate) return sum;
      const depositDate = new Date(f.lastDepositDate);
      if (isNaN(depositDate.getTime())) return sum;
      if (depositDate >= threeMonthsAgo) {
        return sum + (f.lastDepositAmount ?? 0);
      }
      return sum;
    }, 0);

    return {
      totalAum,
      totalClients,
      totalActivePolicies,
      providerRows,
      topClients,
      totalGrowth,
    };
  }, [clients, funds]);

  return {
    metrics,
    isLoading,
    error,
    refetch,
  };
}