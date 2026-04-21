import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/FormatUtils";
import { getPageUrl } from "@/lib/utils";
import { ClientProfilePage } from "@/product-types";
import type { TopClientRow } from "@/hooks/useAgentDashboardMetrics";

type TopClientsByDepositsTableProps = {
  rows: TopClientRow[];
};

export const TopClientsByDepositsTable = ({
  rows,
}: TopClientsByDepositsTableProps) => {
  const navigate = useNavigate();

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        אין לקוחות עם קרנות — אין דירוג הפקדות להצגה.
      </p>
    );
  }

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-right font-semibold">שם לקוח</TableHead>
            <TableHead className="text-right font-semibold">תעודת זהות</TableHead>
            <TableHead className="text-right font-semibold">
              סה״כ הפקדות
            </TableHead>
            <TableHead className="text-right font-semibold">
              מספר פוליסות פעילות
            </TableHead>
            <TableHead className="text-right font-semibold">סה"כ ניהול תיק</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const url = getPageUrl(ClientProfilePage, { id: row.clientId });
            return (
              <TableRow
                key={row.clientId}
                className="cursor-pointer hover:bg-muted/40"
                onClick={() => navigate(url)}
              >
                <TableCell className="font-medium">{row.displayName}</TableCell>
                <TableCell>{row.nationalId ?? "—"}</TableCell>
                <TableCell className="tabular-nums">
                  {formatCurrency(row.totalDeposits)}
                </TableCell>
                <TableCell className="tabular-nums">
                  {row.activePolicyCount}
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatCurrency(row.totalAum)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};