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
import { MeetingsEntity } from "@/product-types";
import { toast } from "sonner";

export const DeleteMeetingDialog = ({
  open,
  onClose,
  meeting
}: {
  open: boolean;
  onClose: () => void;
  meeting: typeof MeetingsEntity['instanceType'] | null;
}) => {
  const { deleteFunction, isLoading } = useEntityDelete(MeetingsEntity);

  const handleDelete = async () => {
    if (!meeting) return;

    try {
      await deleteFunction({ id: meeting.id });
      toast.success("הפגישה נמחקה בהצלחה");
      onClose();
    } catch (error) {
      toast.error("שגיאה במחיקת הפגישה");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>מחיקת פגישה</AlertDialogTitle>
          <AlertDialogDescription>
            האם אתה בטוח שברצונך למחוק את פגישה זו? פעולה זו לא ניתנת לביטול.
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