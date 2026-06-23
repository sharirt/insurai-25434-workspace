import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TracksBreakdownProps {
  funds: any[];
  allTracks: any[];
}

export const TracksBreakdown = ({ funds, allTracks }: TracksBreakdownProps) => {
  const fundIds = new Set(
    funds?.map((f: any) => f.id).filter(Boolean)
  );

  const relevantTracks = allTracks?.filter(
    (t: any) =>
      fundIds.has(t.policyNumber) &&
      t.trackAccumulationAmount != null &&
      t.trackAccumulationAmount > 0
  ) ?? [];

  if (relevantTracks.length === 0) return null;

  const totalAccumulation = relevantTracks.reduce(
    (sum: number, t: any) => sum + (t.trackAccumulationAmount ?? 0),
    0
  );

  const formatCurrency = (value: number) =>
    `₪${value?.toLocaleString("he-IL")}`;

  const formatPct = (value: number | null | undefined) =>
    value != null ? `${(value * 100).toFixed(1)}%` : "—";

  return (
    <div className="flex flex-col gap-3" style={{ direction: "rtl" }}>
      <h2 className="text-lg font-semibold text-muted-foreground">
        מסלולים שנלקחו בחשבון
      </h2>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>שם קרן</TableHead>
              <TableHead>שם מסלול</TableHead>
              <TableHead>סכום צבירה</TableHead>
              <TableHead>משקל בתיק</TableHead>
              <TableHead>חשיפה למניות</TableHead>
              <TableHead>חשיפה לחו&quot;ל</TableHead>
              <TableHead>תשואה 12 חודשים</TableHead>
              <TableHead>תשואה 3 שנים</TableHead>
              <TableHead>תשואה 5 שנים</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relevantTracks.map((track: any, index: number) => {
              const weight =
                totalAccumulation > 0
                  ? ((track.trackAccumulationAmount ?? 0) / totalAccumulation) * 100
                  : 0;

              const fund = funds?.find((f: any) => f.id === track.policyNumber);

              return (
                <TableRow key={track.id ?? index}>
                  <TableCell className="font-medium">
                    {fund?.planName ?? "—"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {track.trackName ?? "—"}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(track.trackAccumulationAmount ?? 0)}
                  </TableCell>
                  <TableCell>{weight.toFixed(1)}%</TableCell>
                  <TableCell>{formatPct(track.equityExposure)}</TableCell>
                  <TableCell>{formatPct(track.foreignExposure)}</TableCell>
                  <TableCell>{formatPct(track.return12Months)}</TableCell>
                  <TableCell>{formatPct(track.return3Years)}</TableCell>
                  <TableCell>{formatPct(track.return5Years)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};