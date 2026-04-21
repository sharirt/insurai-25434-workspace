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
import { AgentsEntity } from "@/product-types";
import { toast } from "sonner";

export const DeleteAgentDialog = ({
  open,
  onClose,
  agent
}: {
  open: boolean;
  onClose: () => void;
  agent: typeof AgentsEntity['instanceType'] | null;
}) => {
  const { deleteFunction, isLoading } = useEntityDelete(AgentsEntity);

  const handleDelete = async () => {
    if (!agent) return;

    try {
      await deleteFunction({ id: agent.id });
      toast.success("הסוכן נמחק בהצלחה");
      onClose();
    } catch (error) {
      toast.error("שגיאה במחיקת הסוכן");
    }
  };

  const agentName = [agent?.firstName, agent?.lastName].filter(Boolean).join(' ').trim() || 'סוכן זה';

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>מחיקת סוכן</AlertDialogTitle>
          <AlertDialogDescription>
            האם אתה בטוח שברצונך למחוק את {agentName}? פעולה זו לא ניתנת לביטול.
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