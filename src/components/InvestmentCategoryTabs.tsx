import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { InvestmentTable } from "@/components/InvestmentTable";
import type { IFetchMyGemelDataActionOutput } from "@/product-types";

type Category = NonNullable<IFetchMyGemelDataActionOutput["categories"]>[number];

interface InvestmentCategoryTabsProps {
  categories: Category[];
}

export const InvestmentCategoryTabs = ({ categories }: InvestmentCategoryTabsProps) => {
  return (
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
                  tableTitle={(table as any)?.tableTitle}
                  categoryName={cat?.categoryName ?? ""}
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
  );
};