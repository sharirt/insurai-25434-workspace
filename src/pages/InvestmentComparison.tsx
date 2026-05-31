import { useEffect, useState } from "react";
import { useExecuteAction } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { FetchMyGemelDataAction, type IFetchMyGemelDataActionOutput, type IFetchMyGemelDataActionOutputFetchMyGemelDataActionOutputCategoriesItemObject } from "@/product-types";
import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";
import { InvestmentLoadingSkeleton } from "@/components/InvestmentLoadingSkeleton";
import { InvestmentErrorCard } from "@/components/InvestmentErrorCard";
import { InvestmentEmptyState } from "@/components/InvestmentEmptyState";
import { CategoryCard } from "@/components/CategoryCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const ALL_URLS = [
  "https://www.mygemel.net/קרנות-השתלמות",
  "https://www.mygemel.net/קופת-גמל-להשקעה",
  "https://www.mygemel.net/פוליסות-חיסכון",
  "https://www.mygemel.net/פנסיה",
  "https://www.mygemel.net/קופות-גמל",
  "https://www.mygemel.net/חיסכון-לכל-ילד",
] as const;

const TAB_CONFIG: { urlFragment: string; label: string }[] = [
  { urlFragment: "קרנות-השתלמות", label: "קרנות השתלמות" },
  { urlFragment: "קופת-גמל-להשקעה", label: "קופת גמל להשקעה" },
  { urlFragment: "פוליסות-חיסכון", label: "פוליסות חיסכון" },
  { urlFragment: "פנסיה", label: "פנסיה" },
  { urlFragment: "קופות-גמל", label: "קופות גמל" },
  { urlFragment: "חיסכון-לכל-ילד", label: "חיסכון לכל ילד" },
];

function groupBySourceUrl(
  categories: IFetchMyGemelDataActionOutputFetchMyGemelDataActionOutputCategoriesItemObject[]
): Record<string, IFetchMyGemelDataActionOutputFetchMyGemelDataActionOutputCategoriesItemObject[]> {
  const grouped: Record<string, IFetchMyGemelDataActionOutputFetchMyGemelDataActionOutputCategoriesItemObject[]> = {};
  for (const cat of categories) {
    const matchedTab = TAB_CONFIG.find((t) => cat?.sourceUrl?.includes(t.urlFragment));
    const key = matchedTab?.urlFragment ?? "other";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(cat);
  }
  return grouped;
}

export default function InvestmentComparison() {
  const { executeFunction, result, isLoading, error, clear } = useExecuteAction(FetchMyGemelDataAction);
  const [data, setData] = useState<IFetchMyGemelDataActionOutput | null>(null);
  const [dismissedErrors, setDismissedErrors] = useState(false);

  const fetchData = () => {
    clear();
    setDismissedErrors(false);
    executeFunction({ urls: [...ALL_URLS] });
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
  const grouped = groupBySourceUrl(categories);
  const errors = data?.errors as string[] | undefined;
  const hasErrors = errors && errors.length > 0 && !dismissedErrors;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto" style={{ direction: "rtl" }}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">השוואת מסלולים mygemel.net</h1>
          {fetchedAt && (
            <p className="text-sm text-muted-foreground">
              עדכון אחרון: {new Date(fetchedAt).toLocaleString("he-IL")}
            </p>
          )}
          {data && data.status !== "error" && (
            <Badge variant="secondary" className="self-start mt-1">
              נמצאו {data.totalCategories ?? categories.length} קטגוריות
            </Badge>
          )}
        </div>
        <Button onClick={fetchData} disabled={isLoading} variant="outline" className="self-start">
          <RefreshCw data-icon="inline-start" className={isLoading ? "animate-spin" : ""} />
          רענן נתונים
        </Button>
      </div>

      {hasErrors && data?.status !== "error" && (
        <Alert className="mb-4">
          <AlertDescription className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              {errors?.map((err, i) => (
                <span key={i} className="text-sm">{err}</span>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissedErrors(true)}
              className="shrink-0"
            >
              <X data-icon="inline-start" />
              סגור
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isLoading && !data && <InvestmentLoadingSkeleton />}

      {error && !data && <InvestmentErrorCard onRetry={fetchData} />}

      {data && data.status === "error" && (
        <InvestmentErrorCard onRetry={fetchData} errors={errors} />
      )}

      {data && data.status !== "error" && categories.length > 0 && (
        <Tabs defaultValue={TAB_CONFIG[0].urlFragment} dir="rtl">
          <ScrollArea className="w-full">
            <TabsList className="inline-flex w-auto">
              {TAB_CONFIG.map((tab) => (
                <TabsTrigger key={tab.urlFragment} value={tab.urlFragment}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {TAB_CONFIG.map((tab) => {
            const tabCategories = grouped[tab.urlFragment] ?? [];
            return (
              <TabsContent key={tab.urlFragment} value={tab.urlFragment}>
                {tabCategories.length > 0 ? (
                  <div className="flex flex-col gap-6">
                    {tabCategories.map((cat, idx) => (
                      <CategoryCard
                        key={`${cat?.category}-${idx}`}
                        category={cat?.category ?? ""}
                        funds={cat?.funds ?? []}
                        average={cat?.average}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    אין נתונים
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}

      {data && data.status !== "error" && categories.length === 0 && <InvestmentEmptyState />}
    </div>
  );
}