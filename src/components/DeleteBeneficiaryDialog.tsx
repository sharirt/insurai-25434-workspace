import { useState } from "react";
import { useEntityDelete } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { BeneficiariesEntity } from "@/product-types";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type Beneficiary = typeof BeneficiariesEntity["instanceType"] & { id: string };

interface DeleteBeneficiaryDialogProps {
  open: boolean;
  onClose: () => void;
  beneficiary: Beneficiary | null;
}

export const DeleteBeneficiaryDialog = ({ open, onClose, beneficiary }: DeleteBeneficiaryDialogProps) => {
  const { deleteFunction } = useEntityDelete(BeneficiariesEntity);
  const [isDeleting, setIsDeleting] = useState(false);

  const fullName = beneficiary ? [beneficiary.firstName, beneficiary.lastName].filter(Boolean).join(" ") : "";

  const handleDelete = async () => {
    if (!beneficiary) return;
    setIsDeleting(true);
    try {
      await deleteFunction({ id: beneficiary.id });
      toast.success("המוטב נמחק בהצלחה");
      onClose();
    } catch {
      toast.error("שגיאה במחיקת המוטב");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent style={{ direction: "rtl" }}>
        <AlertDialogHeader>
          <AlertDialogTitle>מחיקת מוטב</AlertDialogTitle>
          <AlertDialogDescription>
            האם אתה בטוח שברצונך למחוק את המוטב {fullName}? פעולה זו אינה ניתנת לביטול.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>ביטול</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {isDeleting && <Loader2 className="animate-spin" data-icon="inline-start" />}
            מחק
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};