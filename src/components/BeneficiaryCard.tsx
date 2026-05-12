import { BeneficiariesEntity } from "@/product-types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CreditCard, CalendarDays, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { he } from "date-fns/locale";

type Beneficiary = typeof BeneficiariesEntity["instanceType"] & { id: string };

interface BeneficiaryCardProps {
  beneficiary: Beneficiary;
  onEdit: (beneficiary: Beneficiary) => void;
  onDelete: (beneficiary: Beneficiary) => void;
}

export const BeneficiaryCard = ({ beneficiary, onEdit, onDelete }: BeneficiaryCardProps) => {
  const fullName = [beneficiary.firstName, beneficiary.lastName].filter(Boolean).join(" ") || "ללא שם";

  const formattedBirthDate = beneficiary.birthDate
    ? format(new Date(beneficiary.birthDate), "dd/MM/yyyy", { locale: he })
    : null;

  return (
    <Card className="group relative transition-shadow hover:shadow-md hover:border-primary/30">
      <div className="absolute top-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button variant="ghost" size="icon" className="size-8" onClick={() => onEdit(beneficiary)}>
          <Pencil />
        </Button>
        <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => onDelete(beneficiary)}>
          <Trash2 />
        </Button>
      </div>
      <CardContent className="pt-6 flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-foreground">{fullName}</h3>

        {beneficiary.nationalId && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="size-4 shrink-0" />
            <span>תעודת זהות: {beneficiary.nationalId}</span>
          </div>
        )}

        {formattedBirthDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4 shrink-0" />
            <span>תאריך לידה: {formattedBirthDate}</span>
          </div>
        )}

        {beneficiary.relationship && (
          <div>
            <Badge variant="secondary">{beneficiary.relationship}</Badge>
          </div>
        )}

        {beneficiary.allocationPercentage != null && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Percent className="size-4 shrink-0" />
            <span>הקצאה: {beneficiary.allocationPercentage}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};