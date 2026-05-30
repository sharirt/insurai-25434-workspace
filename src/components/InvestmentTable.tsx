import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type {
  IFetchMyGemelDataActionOutputFetchMyGemelDataActionOutputFundsItemObject,
  IFetchMyGemelDataActionOutputAverageReturnsObject,
} from "@/product-types";

type Fund = IFetchMyGemelDataActionOutputFetchMyGemelDataActionOutputFundsItemObject;

type SortKey = "rank" | "name" | "returnMonthly" | "returnYearly" | "return3Years" | "return5Years";
type SortDir = "asc" | "desc";

interface InvestmentTableProps {
  categoryName: string;
  trackType: string;
  funds: Fund[];
  averageReturns?: IFetchMyGemelDataActionOutputAverageReturnsObject;
}

function parseNum(val?: string): number {
  if (!val) return 0;
  const cleaned = val?.replace?.("%", "")?.replace?.(",", "")?.trim?.();
  const num = parseFloat(cleaned ?? "0");
  return isNaN(num) ? 0 : num;
}

function formatReturn(val?: string) {
  if (!val || val === "-" || val === "") return "-";
  const num = parseNum(val);
  const formatted = val?.includes?.("%") ? val : `${val}%`;
  return (
    <span className={cn("font-mono", num > 0 ? "text-chart-3" : num < 0 ? "text-destructive" : "text-foreground")}>
      {formatted}
    </span>
  );
}

export const InvestmentTable = ({ categoryName, trackType, funds, averageReturns }: InvestmentTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  };

  const sortedFunds = [...(funds ?? [])].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    if (sortKey === "name") {
      return mul * ((a?.name ?? "")?.localeCompare?.(b?.name ?? "", "he") ?? 0);
    }
    if (sortKey === "rank") {
      return mul * ((a?.rank ?? 0) - (b?.rank ?? 0));
    }
    const aVal = parseNum(a?.[sortKey]);
    const bVal = parseNum(b?.[sortKey]);
    return mul * (aVal - bVal);
  });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="opacity-40" />;
    return sortDir === "asc" ? <ArrowUp /> : <ArrowDown />;
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: "rank", label: "מקום" },
    { key: "name", label: "שם הקרן" },
    { key: "returnMonthly", label: "תשואה חודשית" },
    { key: "returnYearly", label: "תשואה שנתית" },
    { key: "return3Years", label: "תשואה 3 שנים" },
    { key: "return5Years", label: "תשואה 5 שנים" },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-foreground">{categoryName} - {trackType}</h3>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "cursor-pointer select-none hover:bg-muted transition-colors text-right",
                    col.key !== "name" && "font-mono"
                  )}
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                    <SortIcon col={col.key} />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedFunds?.map?.((fund, idx) => (
              <TableRow key={`${fund?.name}-${idx}`} className={cn(idx % 2 === 1 && "bg-muted/30")}>
                <TableCell className="font-mono text-center w-16">
                  <Badge variant={fund?.rank === 1 ? "default" : "secondary"} className="min-w-[2rem] justify-center">
                    {fund?.rank ?? "-"}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium max-w-[250px] truncate">{fund?.name ?? "-"}</TableCell>
                <TableCell className="font-mono text-right">{formatReturn(fund?.returnMonthly)}</TableCell>
                <TableCell className="font-mono text-right">{formatReturn(fund?.returnYearly)}</TableCell>
                <TableCell className="font-mono text-right">{formatReturn(fund?.return3Years)}</TableCell>
                <TableCell className="font-mono text-right">{formatReturn(fund?.return5Years)}</TableCell>
              </TableRow>
            ))}
            {averageReturns && (
              <TableRow className="bg-muted font-bold border-t-2 border-border">
                <TableCell className="text-center">-</TableCell>
                <TableCell>ממוצע</TableCell>
                <TableCell className="font-mono text-right">{formatReturn(averageReturns?.monthly)}</TableCell>
                <TableCell className="font-mono text-right">{formatReturn(averageReturns?.yearly)}</TableCell>
                <TableCell className="font-mono text-right">{formatReturn(averageReturns?.threeYears)}</TableCell>
                <TableCell className="font-mono text-right">{formatReturn(averageReturns?.fiveYears)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};