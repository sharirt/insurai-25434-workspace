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
import { ClientsEntity } from "@/product-types";
import { toast } from "sonner";

export const DeleteClientDialog = ({
  open,
  onClose,
  client
}: {
  open: boolean;
  onClose: () => void;
  client: typeof ClientsEntity['instanceType'] | null;
}) => {
  const { deleteFunction, isLoading } = useEntityDelete(ClientsEntity);

  const handleDelete = async () => {
    if (!client) return;

    try {
      await deleteFunction({ id: client.id });
      toast.success("הלקוח נמחק בהצלחה");
      onClose();
    } catch (error) {
      toast.error("שגיאה במחיקת הלקוח");
    }
  };

  const clientFullName = client 
    ? `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'לקוח זה'
    : 'לקוח זה';

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>מחיקת לקוח</AlertDialogTitle>
          <AlertDialogDescription>
            האם אתה בטוח שברצונך למחוק את {clientFullName}? פעולה זו לא ניתנת לביטול.
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