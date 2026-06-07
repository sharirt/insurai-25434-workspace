import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/FormatCurrency";
import { InvestmentTracksTable } from "@/components/InvestmentTracksTable";
import type { IFundsEntity, IInvestmentTracksEntity } from "@/product-types";

interface FundCardProps {
  fund: IFundsEntity & { id: string };
  tracks: (IInvestmentTracksEntity & { id: string })[];
}

export const FundCard = ({ fund, tracks }: FundCardProps) => {
  const [open, setOpen] = useState(false);
  const isActive = fund.status === "פעיל";

  return (
    <Card className={cn("border-r-4", isActive ? "border-r-chart-3" : "border-r-muted")}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-base">{fund.planName ?? "ללא שם"}</CardTitle>
                <span className="text-sm text-muted-foreground">{fund.providerName}</span>
                <Badge variant={isActive ? "default" : "secondary"}>
                  {fund.status ?? "—"}
                </Badge>
              </div>
              <ChevronDown className={cn("transition-transform text-muted-foreground", open && "rotate-180")} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <DetailItem label="סוג מוצר" value={fund.productType} />
              <DetailItem label="שם תוכנית" value={fund.planName} />
              <DetailItem label="מספר פוליסה" value={fund.policyNumber} />
              <DetailItem label="יצרן" value={fund.providerName} />
              <DetailItem label="סטטוס" value={fund.status} />
              <DetailItem label="יתרה כוללת" value={formatCurrency(fund.totalBalance)} />
              <DetailItem label="דמי ניהול מהפקדה" value={fund.managementFeeDeposits != null ? `${fund.managementFeeDeposits}%` : "—"} />
              <DetailItem label="דמי ניהול מצבירה" value={fund.managementFeeAccumulation != null ? `${fund.managementFeeAccumulation}%` : "—"} />
              <DetailItem label="מעסיק" value={fund.employer} />
              <DetailItem label="מעמד" value={fund.planStatus} />
              <DetailItem label="תאריך הצטרפות" value={fund.joinDate} />
              <DetailItem label="תאריך הפקדה אחרונה" value={fund.lastDepositDate} />
              <DetailItem label="סכום הפקדה אחרונה" value={formatCurrency(fund.lastDepositAmount)} />
              <DetailItem label="הפרשות עובד" value={formatCurrency(fund.employeeContributions)} />
              <DetailItem label="הפרשות מעסיק" value={formatCurrency(fund.employerContributions)} />
              <DetailItem label="תאריך נכונות נתונים" value={fund.dataValidityDate} />
            </div>

            {tracks.length > 0 ? (
              <div>
                <h4 className="text-sm font-semibold mb-1">מסלולי השקעה</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tracks.map((t) => (
                    <Badge key={t.id} variant="secondary">{t.trackName ?? "ללא שם מסלול"}</Badge>
                  ))}
                </div>
                <InvestmentTracksTable tracks={tracks} />
              </div>
            ) : (
              <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                אין מסלולי השקעה זמינים למוצר זה. רמת הסיכון תוערך לפי סוג המוצר ושם התוכנית.
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

const DetailItem = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <span className="text-muted-foreground">{label}:</span>{" "}
    <span className="font-medium">{value ?? "—"}</span>
  </div>
);