import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExecuteAction, useUser } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { SendClientIntakeFormAction, ClientsEntity } from "@/product-types";
import { Loader2, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";

interface SendIntakeFormDialogProps {
  open: boolean;
  onClose: () => void;
  client: typeof ClientsEntity["instanceType"] & { id: string };
}

export const SendIntakeFormDialog = ({ open, onClose, client }: SendIntakeFormDialogProps) => {
  const user = useUser();
  const { executeFunction, isLoading, isDone, result, error, clear } = useExecuteAction(SendClientIntakeFormAction);

  const [recipientName, setRecipientName] = useState(client?.fullName || "");
  const [recipientPhone, setRecipientPhone] = useState(client?.phone_number || "");
  const [recipientEmail, setRecipientEmail] = useState(client?.email || "");
  const [copied, setCopied] = useState(false);

  const handleSend = async () => {
    if (!recipientPhone && !recipientEmail) {
      toast.error("יש להזין טלפון או אימייל");
      return;
    }
    try {
      await executeFunction({
        clientId: client.id,
        recipientPhone,
        recipientEmail,
        recipientName,
        agentEmail: user.email,
      });
    } catch {
      // error is handled via the error state
    }
  };

  const formUrl = result?.formUrl;

  const handleCopy = async () => {
    if (formUrl) {
      await navigator.clipboard.writeText(formUrl);
      setCopied(true);
      toast.success("הקישור הועתק");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    clear();
    setRecipientName(client?.fullName || "");
    setRecipientPhone(client?.phone_number || "");
    setRecipientEmail(client?.email || "");
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>שליחת טופס ללקוח</DialogTitle>
        </DialogHeader>

        {isDone && result?.success ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-primary">
              <Check className="size-5" />
              <span className="font-medium">הטופס נשלח בהצלחה</span>
            </div>
            {formUrl && (
              <div className="flex items-center gap-2">
                <Input value={formUrl} readOnly className="flex-1 text-xs" />
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </Button>
              </div>
            )}
            <Button variant="outline" onClick={handleClose}>סגור</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {error && (
              <p className="text-sm text-destructive">{(error as any)?.message || "שגיאה בשליחת הטופס"}</p>
            )}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="recipientName">שם הנמען</FieldLabel>
                <Input
                  id="recipientName"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  disabled={isLoading}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="recipientPhone">טלפון</FieldLabel>
                <Input
                  id="recipientPhone"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  disabled={isLoading}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="recipientEmail">אימייל</FieldLabel>
                <Input
                  id="recipientEmail"
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  disabled={isLoading}
                />
              </Field>
            </FieldGroup>
            <Button onClick={handleSend} disabled={isLoading}>
              {isLoading && <Loader2 className="ml-2 size-4 animate-spin" />}
              {isLoading ? "שולח..." : "שלח"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};