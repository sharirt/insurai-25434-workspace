import { useState } from 'react';
import { useEntityGetAll, useExecuteAction } from '@blocksdiy/blocks-client-sdk/reactSdk';
import { IGemelFundsEntity, FetchIGemelFundsAction } from '@/product-types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, TrendingUp, Database, Loader2 } from 'lucide-react';
import { IGemelFilters } from '@/components/IGemelFilters';
import { IGemelTable } from '@/components/IGemelTable';
import { CATEGORY_ORDER, sortFunds, type SortField, type SortDir } from '@/utils/IGemelUtils';

export default function IGemelComparison() {
  const { data: allFunds, isLoading, refetch } = useEntityGetAll(IGemelFundsEntity);
  const { executeFunction, isLoading: isRefreshing } = useExecuteAction(FetchIGemelFundsAction);

  const [activeTab, setActiveTab] = useState(CATEGORY_ORDER[0]);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('__all__');
  const [selectedTrack, setSelectedTrack] = useState('__all__');
  const [sortField, setSortField] = useState<SortField>('ret1y');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleRefresh = async () => {
    try {
      await executeFunction({});
      await refetch();
      toast.success('הנתונים עודכנו בהצלחה');
    } catch {
      toast.error('שגיאה בעדכון הנתונים');
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const fetchedAt = allFunds?.[0]?.fetchedAt;

  // Funds for current tab
  const tabFunds = allFunds?.filter((f) => f.sourceCategory === activeTab) ?? [];

  // Unique companies/tracks for current tab
  const companies = [...new Set(tabFunds.map((f) => f.company).filter(Boolean))] as string[];
  const tracks = [...new Set(tabFunds.map((f) => f.track).filter(Boolean))] as string[];

  // Apply filters
  let filtered = tabFunds;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((f) => f.name?.toLowerCase()?.includes(q));
  }
  if (selectedCompany !== '__all__') {
    filtered = filtered.filter((f) => f.company === selectedCompany);
  }
  if (selectedTrack !== '__all__') {
    filtered = filtered.filter((f) => f.track === selectedTrack);
  }

  const sorted = sortFunds(filtered, sortField, sortDir);

  // Count per category
  const countByCategory = (cat: string) =>
    allFunds?.filter((f) => f.sourceCategory === cat)?.length ?? 0;

  // Reset filters on tab change
  const handleTabChange = (val: string) => {
    setActiveTab(val);
    setSearch('');
    setSelectedCompany('__all__');
    setSelectedTrack('__all__');
  };

  if (!isLoading && (!allFunds || allFunds.length === 0)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4" style={{ direction: 'rtl' }}>
        <Card className="max-w-md text-center">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <Database className="size-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold">אין נתונים עדיין</h2>
            <p className="text-muted-foreground">
              לחץ על הכפתור למטה כדי למשוך נתונים מ-iGemel
            </p>
            <Button onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                  מושך נתונים...
                </>
              ) : (
                <>
                  <RefreshCw data-icon="inline-start" />
                  רענן נתונים
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4" style={{ direction: 'rtl' }}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-6 text-primary" />
          <h1 className="text-2xl font-bold">השוואת מסלולים - iGemel</h1>
        </div>
        <div className="flex items-center gap-3">
          {fetchedAt && (
            <span className="text-sm text-muted-foreground">
              עודכן: {new Date(fetchedAt).toLocaleString('he-IL')}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <>
                <Loader2 data-icon="inline-start" className="animate-spin" />
                מושך נתונים...
              </>
            ) : (
              <>
                <RefreshCw data-icon="inline-start" />
                רענן נתונים
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="flex flex-wrap">
          {CATEGORY_ORDER.map((cat) => (
            <TabsTrigger key={cat} value={cat} className="gap-1.5">
              {cat}
              <Badge variant="secondary" className="text-xs">
                {countByCategory(cat)}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORY_ORDER.map((cat) => (
          <TabsContent key={cat} value={cat} className="flex flex-col gap-4">
            <IGemelFilters
              search={search}
              onSearchChange={setSearch}
              companies={companies}
              selectedCompany={selectedCompany}
              onCompanyChange={setSelectedCompany}
              tracks={tracks}
              selectedTrack={selectedTrack}
              onTrackChange={setSelectedTrack}
            />
            <IGemelTable
              funds={sorted}
              isLoading={isLoading}
              sortField={sortField}
              sortDir={sortDir}
              onSort={handleSort}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}