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
import { RequestSchemesEntity } from "@/product-types";
import { toast } from "sonner";

export const DeleteRequestTypeDialog = ({
  open,
  onClose,
  requestType
}: {
  open: boolean;
  onClose: () => void;
  requestType: typeof RequestSchemesEntity['instanceType'] | null;
}) => {
  const { deleteFunction, isLoading } = useEntityDelete(RequestSchemesEntity);

  const handleDelete = async () => {
    if (!requestType) return;

    try {
      await deleteFunction({ id: requestType.id });
      toast.success("סוג הבקשה נמחק בהצלחה");
      onClose();
    } catch (error) {
      toast.error("שגיאה במחיקת סוג הבקשה");
    }
  };

  const requestTypeName = requestType?.requestTypeName || 'סוג בקשה זה';

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>מחיקת סוג בקשה</AlertDialogTitle>
          <AlertDialogDescription>
            האם אתה בטוח שברצונך למחוק את {requestTypeName}? פעולה זו לא ניתנת לביטול.
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