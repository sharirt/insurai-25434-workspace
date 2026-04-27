import { useState } from "react";
import { useExecuteAction } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { SyncRoetoClientsAction } from "@/product-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Loader2, CheckCircle, AlertCircle, UserPlus } from "lucide-react";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";

type SyncMode = "all" | "active" | "tromYeutz";

type SyncState = "idle" | "syncing" | "success" | "error";

interface SyncRoetoDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SyncRoetoDialog = ({ open, onClose, onSuccess }: SyncRoetoDialogProps) => {
  const [syncMode, setSyncMode] = useState<SyncMode>("all");
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const [syncedCount, setSyncedCount] = useState(0);
  const [createdCount, setCreatedCount] = useState(0);
  const [updatedCount, setUpdatedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const { executeFunction } = useExecuteAction(SyncRoetoClientsAction);

  const handleClose = () => {
    if (syncState !== "syncing") {
      setSyncState("idle");
      setSyncedCount(0);
      setCreatedCount(0);
      setUpdatedCount(0);
      setErrorMessage("");
      onClose();
    }
  };

  const handleSync = async () => {
    setSyncState("syncing");
    try {
      const result = await executeFunction({ syncMode });
      if (result?.status === "success") {
        setSyncedCount(result.syncedCount ?? 0);
        setCreatedCount(result.createdCount ?? 0);
        setUpdatedCount(result.updatedCount ?? 0);
        setSyncState("success");
        onSuccess();
      } else {
        setErrorMessage(result?.message || "שגיאה לא ידועה בסנכרון");
        setSyncState("error");
      }
    } catch {
      setErrorMessage("שגיאה בחיבור לשרת. נסה שוב מאוחר יותר.");
      setSyncState("error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent dir="rtl" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw data-icon="inline-start" />
            סנכרון לקוחות מ-Roeto
          </DialogTitle>
        </DialogHeader>

        {syncState === "idle" && (
          <div className="flex flex-col gap-4">
            <FieldGroup>
              <Field>
                <FieldLabel>מצב סנכרון</FieldLabel>
                <Select value={syncMode} onValueChange={(v) => setSyncMode(v as SyncMode)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">הכל</SelectItem>
                    <SelectItem value="active">פעילים בלבד</SelectItem>
                    <SelectItem value="tromYeutz">טרום יעוץ בלבד</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <Button onClick={handleSync}>
              <RefreshCw data-icon="inline-start" />
              התחל סנכרון
            </Button>
          </div>
        )}

        {syncState === "syncing" && (
          <div className="flex items-center justify-center gap-2 py-8">
            <Loader2 className="animate-spin" />
            <span className="text-muted-foreground">מסנכרן...</span>
          </div>
        )}

        {syncState === "success" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <CheckCircle className="text-chart-3 size-12" />
            <p className="text-foreground font-medium text-lg">
              הסנכרון הושלם בהצלחה
            </p>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-3 rounded-md bg-chart-3/10 px-4 py-2.5">
                <UserPlus className="text-chart-3 size-5 shrink-0" />
                <span className="text-chart-3 font-medium">נוצרו: {createdCount} לקוחות חדשים</span>
              </div>
              <div className="flex items-center gap-3 rounded-md bg-accent px-4 py-2.5">
                <RefreshCw className="text-muted-foreground size-5 shrink-0" />
                <span className="text-muted-foreground font-medium">עודכנו: {updatedCount} לקוחות קיימים</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              סה״כ סונכרנו {syncedCount} לקוחות
            </p>
            <Button variant="outline" onClick={handleClose}>סגור</Button>
          </div>
        )}

        {syncState === "error" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <AlertCircle className="text-destructive size-12" />
            <p className="text-destructive font-medium">{errorMessage}</p>
            <Button variant="outline" onClick={handleClose}>סגור</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};