import { useEntityGetAll } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { FundsEntity, InvestmentTracksEntity } from "@/product-types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { FundCard } from "@/components/FundCard";
import { formatCurrency } from "@/utils/FormatCurrency";

interface FundsListProps {
  clientId: string;
}

export const FundsList = ({ clientId }: FundsListProps) => {
  const { data: funds, isLoading: fundsLoading } = useEntityGetAll(FundsEntity, { clientId });
  const { data: allTracks, isLoading: tracksLoading } = useEntityGetAll(InvestmentTracksEntity);

  const isLoading = fundsLoading || tracksLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!funds?.length) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8 text-muted-foreground">
          לא נמצאו מוצרים פנסיוניים עבור לקוח זה
        </CardContent>
      </Card>
    );
  }

  const policyNumbers = new Set(funds.map((f: any) => f.policyNumber).filter(Boolean));
  const clientTracks = (allTracks ?? []).filter((t: any) => policyNumbers.has(t.policyNumber));

  const activeFunds = funds.filter((f: any) => f.status === "פעיל");
  const totalBalance = funds.reduce((sum: number, f: any) => sum + (f.totalBalance ?? 0), 0);

  return (
    <div className="flex flex-col gap-4">
      {funds.map((fund: any) => {
        const fundTracks = clientTracks.filter((t: any) => t.policyNumber === fund.policyNumber);
        return <FundCard key={fund.id} fund={fund} tracks={fundTracks} />;
      })}

      <Card>
        <CardContent className="flex items-center justify-around py-4 text-sm">
          <div className="text-center">
            <div className="text-muted-foreground">סה&quot;כ מוצרים</div>
            <div className="text-lg font-bold">{funds.length}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">מוצרים פעילים</div>
            <div className="text-lg font-bold">{activeFunds.length}</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">יתרה כוללת</div>
            <div className="text-lg font-bold">{formatCurrency(totalBalance)}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};