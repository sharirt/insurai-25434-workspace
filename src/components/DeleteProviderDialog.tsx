import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEntityDelete } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { ProvidersEntity } from "@/product-types";
import { toast } from "sonner";

export const DeleteProviderDialog = ({
  open,
  onClose,
  provider
}: {
  open: boolean;
  onClose: () => void;
  provider: typeof ProvidersEntity['instanceType'] | null;
}) => {
  const { deleteFunction, isLoading } = useEntityDelete(ProvidersEntity);

  const handleDelete = async () => {
    if (!provider) return;

    try {
      await deleteFunction({ id: provider.id });
      toast.success("היצרן נמחק בהצלחה");
      onClose();
    } catch (error) {
      toast.error("שגיאה במחיקת היצרן");
    }
  };

  const providerName = provider?.provider_name || 'יצרן זה';

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>מחיקת יצרן</AlertDialogTitle>
          <AlertDialogDescription>
            האם אתה בטוח שברצונך למחוק את {providerName}? פעולה זו לא ניתנת לביטול.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>ביטול</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "מוחק..." : "מחק"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};