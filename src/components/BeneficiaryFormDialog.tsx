import { useState, useEffect } from "react";
import { useEntityCreate, useEntityUpdate } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { BeneficiariesEntity } from "@/product-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type Beneficiary = typeof BeneficiariesEntity["instanceType"] & { id: string };

const RELATIONSHIP_OPTIONS = ["בן/בת זוג", "ילד/ה", "הורה", "אח/אחות", "נכד/ה", "אחר"];

interface BeneficiaryFormDialogProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
  beneficiary?: Beneficiary | null;
}

export const BeneficiaryFormDialog = ({ open, onClose, clientId, beneficiary }: BeneficiaryFormDialogProps) => {
  const isEdit = !!beneficiary;
  const { createFunction, isLoading: isCreating } = useEntityCreate(BeneficiariesEntity);
  const { updateFunction, isLoading: isUpdating } = useEntityUpdate(BeneficiariesEntity);
  const isSubmitting = isCreating || isUpdating;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [relationship, setRelationship] = useState("");
  const [allocationPercentage, setAllocationPercentage] = useState("");

  useEffect(() => {
    if (open) {
      setFirstName(beneficiary?.firstName || "");
      setLastName(beneficiary?.lastName || "");
      setNationalId(beneficiary?.nationalId || "");
      setBirthDate(beneficiary?.birthDate || "");
      setRelationship(beneficiary?.relationship || "");
      setAllocationPercentage(beneficiary?.allocationPercentage != null ? String(beneficiary.allocationPercentage) : "");
    }
  }, [open, beneficiary]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      toast.error("שם פרטי הוא שדה חובה");
      return;
    }
    const data: Record<string, any> = {
      firstName: firstName.trim(),
      lastName: lastName.trim() || undefined,
      nationalId: nationalId.trim() || undefined,
      birthDate: birthDate || undefined,
      relationship: relationship || undefined,
      allocationPercentage: allocationPercentage ? Number(allocationPercentage) : undefined,
      clientId,
    };

    try {
      if (isEdit && beneficiary) {
        await updateFunction({ id: beneficiary.id, data });
        toast.success("המוטב עודכן בהצלחה");
      } else {
        await createFunction({ data });
        toast.success("המוטב נוצר בהצלחה");
      }
      onClose();
    } catch {
      toast.error(isEdit ? "שגיאה בעדכון המוטב" : "שגיאה ביצירת המוטב");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent style={{ direction: "rtl" }}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "עריכת מוטב" : "מוטב חדש"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="ben-firstName">שם פרטי *</FieldLabel>
              <Input id="ben-firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="ben-lastName">שם משפחה</FieldLabel>
              <Input id="ben-lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="ben-nationalId">תעודת זהות</FieldLabel>
              <Input id="ben-nationalId" value={nationalId} onChange={(e) => setNationalId(e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="ben-birthDate">תאריך לידה</FieldLabel>
              <Input id="ben-birthDate" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
            </Field>
            <Field>
              <FieldLabel>קרבה</FieldLabel>
              <Select value={relationship} onValueChange={setRelationship}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר קרבה" />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONSHIP_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="ben-allocation">הקצאה באחוזים</FieldLabel>
              <div className="flex items-center gap-2">
                <Input
                  id="ben-allocation"
                  type="number"
                  min={0}
                  max={100}
                  value={allocationPercentage}
                  onChange={(e) => setAllocationPercentage(e.target.value)}
                />
                <span className="text-muted-foreground">%</span>
              </div>
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>ביטול</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" data-icon="inline-start" />}
              {isEdit ? "שמור" : "צור מוטב"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};