import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type {
  IFetchMyGemelDataActionOutputFetchMyGemelDataActionOutputFundsItemObject,
  IFetchMyGemelDataActionOutputAverageObject,
} from "@/product-types";

type Fund = IFetchMyGemelDataActionOutputFetchMyGemelDataActionOutputFundsItemObject;

interface FundTableProps {
  funds: Fund[];
  average?: IFetchMyGemelDataActionOutputAverageObject;
}

function formatValue(val?: string) {
  if (!val || val === "" || val === "-") return <span className="text-muted-foreground">—</span>;
  const trimmed = val?.trim?.() ?? "";
  const isNegative = trimmed?.startsWith?.("-");
  return (
    <span className={cn("font-mono text-xs", isNegative ? "text-destructive" : "text-chart-3")}>
      {trimmed}
    </span>
  );
}

export const FundTable = ({ funds, average }: FundTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-right text-xs px-2 py-1.5">שם הקרן</TableHead>
            <TableHead className="text-right text-xs px-2 py-1.5">אפריל</TableHead>
            <TableHead className="text-right text-xs px-2 py-1.5">תשואה שנה</TableHead>
            <TableHead className="text-right text-xs px-2 py-1.5">תשואה 3 שנים</TableHead>
            <TableHead className="text-right text-xs px-2 py-1.5">תשואה 5 שנים</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {funds?.map?.((fund, idx) => (
            <TableRow key={`${fund?.name}-${idx}`} className={cn(idx % 2 === 1 && "bg-muted/30")}>
              <TableCell className="text-xs px-2 py-1.5 font-medium max-w-[200px] truncate">
                {fund?.name ?? "—"}
              </TableCell>
              <TableCell className="text-xs px-2 py-1.5">{formatValue(fund?.april)}</TableCell>
              <TableCell className="text-xs px-2 py-1.5">{formatValue(fund?.yield_1y)}</TableCell>
              <TableCell className="text-xs px-2 py-1.5">{formatValue(fund?.yield_3y)}</TableCell>
              <TableCell className="text-xs px-2 py-1.5">{formatValue(fund?.yield_5y)}</TableCell>
            </TableRow>
          ))}
          {average && (
            <TableRow className="bg-muted font-bold border-t-2 border-border">
              <TableCell className="text-xs px-2 py-1.5">תשואה ממוצעת</TableCell>
              <TableCell className="text-xs px-2 py-1.5">{formatValue(average?.april)}</TableCell>
              <TableCell className="text-xs px-2 py-1.5">{formatValue(average?.yield_1y)}</TableCell>
              <TableCell className="text-xs px-2 py-1.5">{formatValue(average?.yield_3y)}</TableCell>
              <TableCell className="text-xs px-2 py-1.5">{formatValue(average?.yield_5y)}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};