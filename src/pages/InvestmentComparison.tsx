import { useEffect, useState } from "react";
import { useExecuteAction } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { FetchMyGemelDataAction, type IFetchMyGemelDataActionOutput } from "@/product-types";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { InvestmentLoadingSkeleton } from "@/components/InvestmentLoadingSkeleton";
import { InvestmentErrorCard } from "@/components/InvestmentErrorCard";
import { InvestmentCategoryTabs } from "@/components/InvestmentCategoryTabs";
import { InvestmentEmptyState } from "@/components/InvestmentEmptyState";

export default function InvestmentComparison() {
  const { executeFunction, result, isLoading, error, clear } = useExecuteAction(FetchMyGemelDataAction);
  const [data, setData] = useState<IFetchMyGemelDataActionOutput | null>(null);

  const fetchData = () => {
    clear();
    executeFunction({});
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (result) {
      setData(result);
    }
  }, [result]);

  const categories = data?.categories ?? [];
  const fetchedAt = data?.fetchedAt;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto" style={{ direction: "rtl" }}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">השוואת מסלולי השקעה</h1>
          {fetchedAt && (
            <p className="text-sm text-muted-foreground mt-1">
              עדכון אחרון: {new Date(fetchedAt).toLocaleString("he-IL")}
            </p>
          )}
        </div>
        <Button onClick={fetchData} disabled={isLoading} variant="outline" className="self-start">
          <RefreshCw data-icon="inline-start" className={isLoading ? "animate-spin" : ""} />
          רענן נתונים
        </Button>
      </div>

      {isLoading && !data && <InvestmentLoadingSkeleton />}

      {error && !data && <InvestmentErrorCard onRetry={fetchData} />}

      {data && data?.status === "error" && (
        <InvestmentErrorCard onRetry={fetchData} errors={data?.errors as string[] | undefined} />
      )}

      {data && data?.status !== "error" && categories?.length > 0 && (
        <InvestmentCategoryTabs categories={categories} />
      )}

      {data && data?.status !== "error" && categories?.length === 0 && <InvestmentEmptyState />}
    </div>
  );
}