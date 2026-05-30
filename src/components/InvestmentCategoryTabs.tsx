import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { InvestmentTable } from "@/components/InvestmentTable";
import type { IFetchMyGemelDataActionOutput } from "@/product-types";

type Category = NonNullable<IFetchMyGemelDataActionOutput["categories"]>[number];

interface InvestmentCategoryTabsProps {
  categories: Category[];
}

interface GroupDef {
  key: string;
  label: string;
  match: (name: string, slug: string) => boolean;
}

const GROUP_DEFS: GroupDef[] = [
  {
    key: "hishtalmut",
    label: "קרנות השתלמות",
    match: (name, slug) => name?.includes("השתלמות") || slug?.includes("השתלמות"),
  },
  {
    key: "gemel-lehashkaa",
    label: "קופות גמל להשקעה",
    match: (name, slug) =>
      name?.includes("גמל להשקעה") ||
      name?.includes("גמל-להשקעה") ||
      slug?.includes("גמל-להשקעה") ||
      slug?.includes("גמל להשקעה"),
  },
  {
    key: "gemel",
    label: "קופות גמל",
    match: (name, slug) => {
      const hasGemel = name?.includes("גמל") || slug?.includes("גמל");
      const hasLehashkaa =
        name?.includes("להשקעה") || slug?.includes("להשקעה");
      const hasHishtalmut =
        name?.includes("השתלמות") || slug?.includes("השתלמות");
      return !!hasGemel && !hasLehashkaa && !hasHishtalmut;
    },
  },
  {
    key: "hisachon",
    label: "פוליסות חיסכון",
    match: (name, slug) =>
      name?.includes("חיסכון") ||
      slug?.includes("חיסכון") ||
      name?.includes("פוליסות") ||
      slug?.includes("פוליסות"),
  },
  {
    key: "pensia",
    label: "קרנות פנסיה",
    match: (name, slug) => name?.includes("פנסיה") || slug?.includes("פנסיה"),
  },
  {
    key: "other",
    label: "אחר",
    match: () => true,
  },
];

interface GroupedData {
  key: string;
  label: string;
  tables: Array<{
    table: NonNullable<Category["tables"]>[number];
    categoryName: string;
  }>;
}

function groupCategories(categories: Category[]): GroupedData[] {
  const groupMap = new Map<string, GroupedData>();

  for (const def of GROUP_DEFS) {
    groupMap.set(def.key, { key: def.key, label: def.label, tables: [] });
  }

  for (const cat of categories ?? []) {
    const name = cat?.categoryName ?? "";
    const slug = cat?.categorySlug ?? "";

    let matched = false;
    for (const def of GROUP_DEFS) {
      if (def.match(name, slug)) {
        const group = groupMap.get(def.key)!;
        for (const table of cat?.tables ?? []) {
          if (table?.funds && table.funds.length > 0) {
            group.tables.push({ table, categoryName: cat?.categoryName ?? "" });
          }
        }
        matched = true;
        break;
      }
    }

    if (!matched) {
      const otherGroup = groupMap.get("other")!;
      for (const table of cat?.tables ?? []) {
        if (table?.funds && table.funds.length > 0) {
          otherGroup.tables.push({ table, categoryName: cat?.categoryName ?? "" });
        }
      }
    }
  }

  return Array.from(groupMap.values()).filter((g) => g.tables.length > 0);
}

export const InvestmentCategoryTabs = ({ categories }: InvestmentCategoryTabsProps) => {
  const groups = groupCategories(categories);

  if (groups.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          אין נתונים זמינים
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue={groups[0]?.key}>
      <ScrollArea className="w-full">
        <TabsList className="mb-4 inline-flex w-auto">
          {groups.map((group) => (
            <TabsTrigger key={group.key} value={group.key}>
              {group.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {groups.map((group) => (
        <TabsContent key={group.key} value={group.key}>
          <div className="flex flex-col gap-8">
            {group.tables.map((item, idx) => (
              <InvestmentTable
                key={`${item.table?.trackType}-${idx}`}
                tableTitle={(item.table as any)?.tableTitle}
                categoryName={item.categoryName}
                trackType={item.table?.trackType ?? ""}
                funds={item.table?.funds ?? []}
                averageReturns={item.table?.averageReturns}
              />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};