import { useEffect, useState } from "react";
import { useExecuteAction } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { FetchMyGemelDataAction, type IFetchMyGemelDataActionOutput } from "@/product-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RefreshCw, AlertCircle } from "lucide-react";
import { InvestmentTable } from "@/components/InvestmentTable";

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

      {isLoading && !data && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {error && !data && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <AlertCircle className="size-12 text-destructive" />
            <p className="text-destructive font-medium">שגיאה בטעינת הנתונים</p>
            <Button onClick={fetchData} variant="outline">
              <RefreshCw data-icon="inline-start" />
              נסה שוב
            </Button>
          </CardContent>
        </Card>
      )}

      {data && data?.status === "error" && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <AlertCircle className="size-12 text-destructive" />
            <p className="text-destructive font-medium">שגיאה בטעינת הנתונים</p>
            {data?.errors?.map?.((err, i) => (
              <p key={i} className="text-sm text-muted-foreground">{err}</p>
            ))}
            <Button onClick={fetchData} variant="outline">
              <RefreshCw data-icon="inline-start" />
              נסה שוב
            </Button>
          </CardContent>
        </Card>
      )}

      {data && data?.status !== "error" && categories?.length > 0 && (
        <Tabs defaultValue={categories?.[0]?.categorySlug ?? "0"}>
          <ScrollArea className="w-full">
            <TabsList className="mb-4 inline-flex w-auto">
              {categories?.map?.((cat) => (
                <TabsTrigger key={cat?.categorySlug} value={cat?.categorySlug ?? ""}>
                  {cat?.categoryName}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {categories?.map?.((cat) => (
            <TabsContent key={cat?.categorySlug} value={cat?.categorySlug ?? ""}>
              {(!cat?.tables || cat?.tables?.length === 0) ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    אין נתונים זמינים עבור קטגוריה זו
                  </CardContent>
                </Card>
              ) : (
                <div className="flex flex-col gap-6">
                  {cat?.tables?.map?.((table, idx) => (
                    <InvestmentTable
                      key={`${table?.trackType}-${idx}`}
                      trackType={table?.trackType ?? ""}
                      funds={table?.funds ?? []}
                      averageReturns={table?.averageReturns}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {data && data?.status !== "error" && categories?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            אין נתונים זמינים
          </CardContent>
        </Card>
      )}
    </div>
  );
}