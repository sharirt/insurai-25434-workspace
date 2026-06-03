import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/utils/FormatCurrency";
import type { IInvestmentTracksEntity } from "@/product-types";

interface InvestmentTracksTableProps {
  tracks: (IInvestmentTracksEntity & { id: string })[];
}

const ReturnCell = ({ value }: { value: number | undefined | null }) => {
  if (value == null) return <span className="text-muted-foreground">—</span>;
  const formatted = formatPercent(value);
  return (
    <span className={cn(value > 0 ? "text-chart-3" : value < 0 ? "text-destructive" : "text-foreground")}>
      {formatted}
    </span>
  );
};

export const InvestmentTracksTable = ({ tracks }: InvestmentTracksTableProps) => {
  if (!tracks?.length) return null;

  return (
    <div className="overflow-x-auto rounded-md border border-border mt-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>שם מסלול</TableHead>
            <TableHead>מספר מ.ה</TableHead>
            <TableHead>חשיפה למניות</TableHead>
            <TableHead>חשיפה לחו&quot;ל</TableHead>
            <TableHead>תשואה חודשית</TableHead>
            <TableHead>תשואה מתחילת שנה</TableHead>
            <TableHead>תשואה 12 חודשים</TableHead>
            <TableHead>תשואה 3 שנים</TableHead>
            <TableHead>תשואה 5 שנים</TableHead>
            <TableHead>צבירה במסלול</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tracks.map((track, index) => (
            <TableRow key={track.id} className={cn(index % 2 === 0 ? "bg-muted/30" : "")}>
              <TableCell className="font-medium">{track.trackName ?? "—"}</TableCell>
              <TableCell>{track.trackIdNumber ?? "—"}</TableCell>
              <TableCell><ReturnCell value={track.equityExposure} /></TableCell>
              <TableCell><ReturnCell value={track.foreignExposure} /></TableCell>
              <TableCell><ReturnCell value={track.monthlyReturn} /></TableCell>
              <TableCell><ReturnCell value={track.ytdReturn} /></TableCell>
              <TableCell><ReturnCell value={track.return12Months} /></TableCell>
              <TableCell><ReturnCell value={track.return3Years} /></TableCell>
              <TableCell><ReturnCell value={track.return5Years} /></TableCell>
              <TableCell>{formatCurrency(track.trackAccumulationAmount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};