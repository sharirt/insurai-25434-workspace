import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";

interface SendForSignatureDialogProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
  requestId: string;
  formId: string;
  formPdfUrl: string;
  agentId?: string;
}

export const SendForSignatureDialog = ({
  open,
  onClose,
}: SendForSignatureDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-sm" dir="rtl">
        <DialogHeader>
          <DialogTitle>שליחה לחתימה</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <PenLine className="size-6 text-muted-foreground" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            פונקציונליות החתימה עם DocuSeal תחובר בקרוב
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full">
            סגור
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};