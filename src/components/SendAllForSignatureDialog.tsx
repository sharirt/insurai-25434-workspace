import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useExecuteAction } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { SendAllFormsForSignatureDocuSealAction } from "@/product-types";
import { PenLine, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface SendAllForSignatureDialogProps {
  open: boolean;
  onClose: () => void;
  requestId: string;
  clientName?: string;
  agentName?: string;
  formCount: number;
}

export const SendAllForSignatureDialog = ({
  open,
  onClose,
  requestId,
  clientName,
  agentName,
  formCount,
}: SendAllForSignatureDialogProps) => {
  const { executeFunction, isLoading, isDone, error, clear } = useExecuteAction(
    SendAllFormsForSignatureDocuSealAction
  );
  const [succeeded, setSucceeded] = useState(false);

  const handleSend = async () => {
    try {
      await executeFunction({ requestId });
      setSucceeded(true);
    } catch {
      // error is handled by the hook
    }
  };

  const handleClose = () => {
    setSucceeded(false);
    clear();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>שליחה לחתימה</DialogTitle>
        </DialogHeader>

        {succeeded ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="size-8 text-primary" />
            </div>
            <p className="text-center text-sm text-foreground">
              המסמכים נשלחו לחתימה בהצלחה! קישורי חתימה נשלחו ללקוח ולסוכן באימייל ו-SMS.
            </p>
            <Button onClick={handleClose} className="w-full">
              סגור
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-center text-sm text-muted-foreground">
              מעבד ויוצר תבניות חתימה...
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2 rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <PenLine className="size-5 text-muted-foreground" />
                  <span className="font-medium">{formCount} טפסים לשליחה</span>
                </div>
                {clientName && (
                  <p className="text-sm text-muted-foreground">
                    לקוח: <span className="text-foreground">{clientName}</span>
                  </p>
                )}
                {agentName && (
                  <p className="text-sm text-muted-foreground">
                    סוכן: <span className="text-foreground">{agentName}</span>
                  </p>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {(error as Error)?.message || "אירעה שגיאה בשליחה לחתימה"}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                ביטול
              </Button>
              <Button onClick={handleSend} disabled={isLoading}>
                <PenLine data-icon="inline-start" />
                שלח לחתימה
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};