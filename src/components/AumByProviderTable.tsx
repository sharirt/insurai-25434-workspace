import { useMemo, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/FormatUtils";
import type { ProviderAumRow } from "@/hooks/useAgentDashboardMetrics";
import { ArrowDown, ArrowUp } from "lucide-react";

type SortKey = "providerName" | "aum";

type AumByProviderTableProps = {
  rows: ProviderAumRow[];
};

export const AumByProviderTable = ({ rows }: AumByProviderTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>("aum");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortKey === "aum") {
        return (a.aum - b.aum) * mul;
      }
      return a.providerName.localeCompare(b.providerName, "he") * mul;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const toggleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDir(key === "aum" ? "desc" : "asc");
      }
    },
    [sortKey]
  );

  const SortButton = ({
    label,
    columnKey,
  }: {
    label: string;
    columnKey: SortKey;
  }) => (
    <Button
      type="button"
      variant="ghost"
      className="h-auto px-0 font-semibold hover:bg-transparent"
      onClick={() => toggleSort(columnKey)}
    >
      <span>{label}</span>
      {sortKey === columnKey &&
        (sortDir === "asc" ? (
          <ArrowUp className="mr-1 size-4" />
        ) : (
          <ArrowDown className="mr-1 size-4" />
        ))}
    </Button>
  );

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        אין נתוני קרנות להצגה לפי יצרן.
      </p>
    );
  }

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-right">
              <SortButton label="שם יצרן" columnKey="providerName" />
            </TableHead>
            <TableHead className="text-right">
              <SortButton label="סה״כ לניהול (AUM)" columnKey="aum" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.map((row) => (
            <TableRow key={row.providerName}>
              <TableCell className="font-medium">{row.providerName}</TableCell>
              <TableCell className="tabular-nums">
                {formatCurrency(row.aum)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};