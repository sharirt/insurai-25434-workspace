import { useState, useCallback } from "react";
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
import { FundsEntity } from "@/product-types";
import { formatCurrency, formatDate, formatPercentage } from "@/utils/FormatUtils";
import { InvestmentTracksDialog } from "@/components/InvestmentTracksDialog";

type FundType = typeof FundsEntity["instanceType"] & { id?: string };

interface FundsTableProps {
  funds: FundType[];
}

export const FundsTable = ({ funds }: FundsTableProps) => {
  const [selectedFund, setSelectedFund] = useState<FundType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRowClick = useCallback((fund: FundType) => {
    setSelectedFund(fund);
    setDialogOpen(true);
  }, []);

  const handleDialogChange = useCallback((open: boolean) => {
    setDialogOpen(open);
    if (!open) setSelectedFund(null);
  }, []);

  return (
    <>
      <div className="rounded-lg border overflow-x-auto mb-12" dir="rtl">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-right">שם תוכנית</TableHead>
              <TableHead className="text-right">סוג מוצר</TableHead>
              <TableHead className="text-right">מספר פוליסה</TableHead>
              <TableHead className="text-right">שם יצרן</TableHead>
              <TableHead className="text-right">סטטוס</TableHead>
              <TableHead className="text-right">יתרה כוללת</TableHead>
              <TableHead className="text-right">הפרשות מעסיק</TableHead>
              <TableHead className="text-right">הפרשות עובד</TableHead>
              <TableHead className="text-right">תאריך הצטרפות</TableHead>
              <TableHead className="text-right">תאריך נכונות</TableHead>
              <TableHead className="text-right">מעמד תוכנית</TableHead>
              <TableHead className="text-right">שכר מדווח</TableHead>
              <TableHead className="text-right">דמי ניהול מהפקדות</TableHead>
              <TableHead className="text-right">תאריך הפקדה אחרונה</TableHead>
              <TableHead className="text-right">דמי ניהול מצבירה</TableHead>
              <TableHead className="text-right">הפקדה אחרונה</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {funds.map((fund) => {
              const isActive = fund.status === "פעיל";

              return (
                <TableRow
                  key={fund.id}
                  className="hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(fund)}
                >
                  <TableCell className="font-medium">
                    {fund.planName || "—"}
                  </TableCell>
                  <TableCell>{fund.productType || "—"}</TableCell>
                  <TableCell className="font-mono">
                    {fund.policyNumber || "—"}
                  </TableCell>
                  <TableCell>{fund.providerName || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={isActive ? "default" : "secondary"}>
                      {fund.status || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {fund.totalBalance != null
                      ? formatCurrency(fund.totalBalance)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {fund.employerContributions != null
                      ? formatCurrency(fund.employerContributions)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {fund.employeeContributions != null
                      ? formatCurrency(fund.employeeContributions)
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {fund.joinDate ? formatDate(fund.joinDate) : "—"}
                  </TableCell>
                  <TableCell>
                    {fund.dataValidityDate ? formatDate(fund.dataValidityDate) : "—"}
                  </TableCell>
                  <TableCell>{fund.planStatus || "—"}</TableCell>
                  <TableCell className="text-right">
                    {fund.reportedSalary != null
                      ? formatCurrency(fund.reportedSalary)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {fund.managementFeeDeposits != null
                      ? formatPercentage(fund.managementFeeDeposits)
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {fund.lastDepositDate ? formatDate(fund.lastDepositDate) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {fund.managementFeeAccumulation != null
                      ? formatPercentage(fund.managementFeeAccumulation)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {fund.lastDepositAmount != null
                      ? formatCurrency(fund.lastDepositAmount)
                      : "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <InvestmentTracksDialog
        fund={selectedFund}
        open={dialogOpen}
        onOpenChange={handleDialogChange}
      />
    </>
  );
};

interface FundsTableSkeletonProps {
  rows?: number;
}

export const FundsTableSkeleton = ({ rows = 5 }: FundsTableSkeletonProps) => {
  return (
    <div className="rounded-lg border overflow-x-auto mb-12" dir="rtl">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-right">שם תוכנית</TableHead>
            <TableHead className="text-right">סוג מוצר</TableHead>
            <TableHead className="text-right">מספר פוליסה</TableHead>
            <TableHead className="text-right">שם יצרן</TableHead>
            <TableHead className="text-right">סטטוס</TableHead>
            <TableHead className="text-right">יתרה כוללת</TableHead>
            <TableHead className="text-right">הפרשות מעסיק</TableHead>
            <TableHead className="text-right">הפרשות עובד</TableHead>
            <TableHead className="text-right">תאריך הצטרפות</TableHead>
            <TableHead className="text-right">תאריך נכונות</TableHead>
            <TableHead className="text-right">מעמד תוכנית</TableHead>
            <TableHead className="text-right">שכר מדווח</TableHead>
            <TableHead className="text-right">דמי ניהול מהפקדות</TableHead>
            <TableHead className="text-right">תאריך הפקדה אחרונה</TableHead>
            <TableHead className="text-right">דמי ניהול מצבירה</TableHead>
            <TableHead className="text-right">הפקדה אחרונה</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(rows)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-5 w-12" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-14" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-14" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};