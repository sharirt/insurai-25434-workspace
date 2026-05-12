import { useState } from "react";
import { useEntityGetAll } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { BeneficiariesEntity } from "@/product-types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Plus, Users } from "lucide-react";
import { BeneficiaryCard } from "@/components/BeneficiaryCard";
import { BeneficiaryFormDialog } from "@/components/BeneficiaryFormDialog";
import { DeleteBeneficiaryDialog } from "@/components/DeleteBeneficiaryDialog";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

type Beneficiary = typeof BeneficiariesEntity["instanceType"] & { id: string };

const MAX_BENEFICIARIES = 6;

interface BeneficiariesSectionProps {
  clientId: string | null;
}

export const BeneficiariesSection = ({ clientId }: BeneficiariesSectionProps) => {
  const { data: beneficiaries, isLoading, error } = useEntityGetAll(
    BeneficiariesEntity,
    { clientId: clientId || "" },
    { enabled: !!clientId }
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBeneficiary, setEditingBeneficiary] = useState<Beneficiary | null>(null);
  const [deletingBeneficiary, setDeletingBeneficiary] = useState<Beneficiary | null>(null);

  const isAtMax = (beneficiaries?.length || 0) >= MAX_BENEFICIARIES;

  const handleAdd = () => {
    setEditingBeneficiary(null);
    setIsFormOpen(true);
  };

  const handleEdit = (b: Beneficiary) => {
    setEditingBeneficiary(b);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingBeneficiary(null);
  };

  const addButton = isAtMax ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button disabled>
              <Plus data-icon="inline-start" />
              הוסף מוטב
              <Badge variant="secondary" className="mr-2">{MAX_BENEFICIARIES}/{MAX_BENEFICIARIES}</Badge>
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>ניתן להוסיף עד {MAX_BENEFICIARIES} מוטבים</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <Button onClick={handleAdd}>
      <Plus data-icon="inline-start" />
      הוסף מוטב
    </Button>
  );

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">מוטבים</h2>
        {addButton}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>שגיאה בטעינת המוטבים. אנא נסה שוב מאוחר יותר.</AlertDescription>
        </Alert>
      ) : !beneficiaries || beneficiaries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Users className="size-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">אין מוטבים</h3>
          <p className="text-muted-foreground mb-4">לא הוגדרו מוטבים עבור לקוח זה.</p>
          <Button onClick={handleAdd}>
            <Plus data-icon="inline-start" />
            הוסף מוטב ראשון
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(beneficiaries as Beneficiary[]).map((b) => (
            <BeneficiaryCard key={b.id} beneficiary={b} onEdit={handleEdit} onDelete={setDeletingBeneficiary} />
          ))}
        </div>
      )}

      <BeneficiaryFormDialog
        open={isFormOpen}
        onClose={handleFormClose}
        clientId={clientId || ""}
        beneficiary={editingBeneficiary}
      />

      <DeleteBeneficiaryDialog
        open={!!deletingBeneficiary}
        onClose={() => setDeletingBeneficiary(null)}
        beneficiary={deletingBeneficiary}
      />
    </div>
  );
};