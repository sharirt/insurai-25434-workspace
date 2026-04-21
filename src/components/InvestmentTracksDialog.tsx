import { useMemo } from "react";
import { useEntityGetAll } from "@blocksdiy/blocks-client-sdk/reactSdk";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";
import { FundsEntity, InvestmentTracksEntity } from "@/product-types";
import { formatCurrency, formatDate, formatPercentage } from "@/utils/FormatUtils";

type FundType = typeof FundsEntity["instanceType"] & { id?: string };

type InvestmentTrackRow = typeof InvestmentTracksEntity["instanceType"] & {
  id?: string;
};

interface InvestmentTracksDialogProps {
  fund: FundType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatPercentageValue = (value: number | undefined | null) => {
  if (value == null) return null;
  const displayValue = Math.abs(value) < 1 ? value * 100 : value;
  return displayValue.toFixed(2);
};

const PercentageCell = ({ value }: { value: number | undefined | null }) => {
  if (value == null) return <span className="text-muted-foreground">—</span>;
  const formatted = formatPercentageValue(value);
  if (formatted === null) return <span className="text-muted-foreground">—</span>;
  const numValue = parseFloat(formatted);
  const colorClass =
    numValue > 0
      ? "text-green-600"
      : numValue < 0
        ? "text-red-600"
        : "text-muted-foreground";
  return <span className={colorClass}>{formatted}%</span>;
};

export const InvestmentTracksDialog = ({
  fund,
  open,
  onOpenChange,
}: InvestmentTracksDialogProps) => {
  const { data: tracks, isLoading } = useEntityGetAll(
    InvestmentTracksEntity,
    { policyNumber: fund?.id ?? "" },
    { enabled: !!fund?.id }
  );

  const sortedTracks = useMemo(
    () =>
      tracks?.slice().sort((a, b) => {
        const amountA = (a as InvestmentTrackRow).trackAccumulationAmount ?? 0;
        const amountB = (b as InvestmentTrackRow).trackAccumulationAmount ?? 0;
        return amountB - amountA;
      }) ?? [],
    [tracks]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col" dir="rtl">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl">
            מסלולי השקעה — {fund?.planName || "קרן"}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span>מספר פוליסה:</span>
            <Badge variant="secondary" className="font-mono">
              {fund?.policyNumber || "—"}
            </Badge>
            {fund?.providerName && (
              <>
                <span className="mx-1">•</span>
                <span>{fund.providerName}</span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto min-h-0">
          {isLoading ? (
            <TracksTableSkeleton />
          ) : sortedTracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mb-4 opacity-40" />
              <p className="text-lg">אין מסלולי השקעה לקרן זו</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-right whitespace-nowrap">שם מסלול</TableHead>
                    <TableHead className="text-right whitespace-nowrap">סוג מוצר</TableHead>
                    <TableHead className="text-right whitespace-nowrap">שם יצרן</TableHead>
                    <TableHead className="text-right whitespace-nowrap">סך צבירה בפוליסה</TableHead>
                    <TableHead className="text-right whitespace-nowrap">סכום צבירה במסלול</TableHead>
                    <TableHead className="text-right whitespace-nowrap">תשואה חודשית</TableHead>
                    <TableHead className="text-right whitespace-nowrap">תשואה 12 חודשים</TableHead>
                    <TableHead className="text-right whitespace-nowrap">תשואה 3 שנים</TableHead>
                    <TableHead className="text-right whitespace-nowrap">תשואה 5 שנים</TableHead>
                    <TableHead className="text-right whitespace-nowrap">תאריך נכונות</TableHead>
                    <TableHead className="text-right whitespace-nowrap">מספר מ.ה</TableHead>
                    <TableHead className="text-right whitespace-nowrap">שם מעסיק משלם</TableHead>
                    <TableHead className="text-right whitespace-nowrap">תשואה תחילת שנה</TableHead>
                    <TableHead className="text-right whitespace-nowrap">חשיפה למניות</TableHead>
                    <TableHead className="text-right whitespace-nowrap">חשיפה לחו״ל</TableHead>
                    <TableHead className="text-right whitespace-nowrap">חשיפה למט״ח</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTracks.map((track, index) => {
                    const t = track as InvestmentTrackRow;
                    return (
                      <TableRow key={t.id ?? index}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {t.trackName || "—"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {t.productType || "—"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {t.providerName || "—"}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {t.totalPolicyAccumulation != null
                            ? formatCurrency(t.totalPolicyAccumulation)
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {t.trackAccumulationAmount != null
                            ? formatCurrency(t.trackAccumulationAmount)
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <PercentageCell value={t.monthlyReturn} />
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <PercentageCell value={t.return12Months} />
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <PercentageCell value={t.return3Years} />
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <PercentageCell value={t.return5Years} />
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {t.dataValidityDate
                            ? formatDate(t.dataValidityDate)
                            : "—"}
                        </TableCell>
                        <TableCell className="font-mono whitespace-nowrap">
                          {t.trackIdNumber || "—"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {t.payingEmployerName || "—"}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <PercentageCell value={t.ytdReturn} />
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {t.equityExposure != null
                            ? formatPercentage(t.equityExposure)
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {t.foreignExposure != null
                            ? formatPercentage(t.foreignExposure)
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {t.foreignCurrencyExposure != null
                            ? formatPercentage(t.foreignCurrencyExposure)
                            : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TracksTableSkeleton = () => (
  <div className="rounded-lg border overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="text-right">שם מסלול</TableHead>
          <TableHead className="text-right">סוג מוצר</TableHead>
          <TableHead className="text-right">שם יצרן</TableHead>
          <TableHead className="text-right">סך צבירה בפוליסה</TableHead>
          <TableHead className="text-right">סכום צבירה במסלול</TableHead>
          <TableHead className="text-right">תשואה חודשית</TableHead>
          <TableHead className="text-right">תשואה 12 חודשים</TableHead>
          <TableHead className="text-right">תשואה 3 שנים</TableHead>
          <TableHead className="text-right">תשואה 5 שנים</TableHead>
          <TableHead className="text-right">תאריך נכונות</TableHead>
          <TableHead className="text-right">מספר מ.ה</TableHead>
          <TableHead className="text-right">שם מעסיק משלם</TableHead>
          <TableHead className="text-right">תשואה תחילת שנה</TableHead>
          <TableHead className="text-right">חשיפה למניות</TableHead>
          <TableHead className="text-right">חשיפה לחו״ל</TableHead>
          <TableHead className="text-right">חשיפה למט״ח</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(4)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-14" /></TableCell>
            <TableCell><Skeleton className="h-4 w-14" /></TableCell>
            <TableCell><Skeleton className="h-4 w-14" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);