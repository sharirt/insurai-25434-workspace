import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { IProviderEmailsEntity, IProvidersEntity, IRequestSchemesEntity } from "@/product-types";

interface ProviderEmailFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { providerId: string; requestTypeId: string; email: string; notes: string }) => Promise<void>;
  editingItem: (IProviderEmailsEntity & { id: string }) | null;
  providers: (IProvidersEntity & { id: string })[];
  requestSchemes: (IRequestSchemesEntity & { id: string })[];
}

export const ProviderEmailFormDialog = ({
  open,
  onClose,
  onSave,
  editingItem,
  providers,
  requestSchemes,
}: ProviderEmailFormDialogProps) => {
  const [providerId, setProviderId] = useState("");
  const [requestTypeId, setRequestTypeId] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setProviderId(editingItem?.providerId || "");
      setRequestTypeId(editingItem?.requestTypeId || "");
      setEmail(editingItem?.email || "");
      setNotes(editingItem?.notes || "");
    }
  }, [open, editingItem]);

  const handleSubmit = async () => {
    if (!providerId || !requestTypeId || !email?.trim()) return;
    setSaving(true);
    try {
      await onSave({ providerId, requestTypeId, email: email.trim(), notes: notes.trim() });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
      <DialogContent className="max-w-md" style={{ direction: "rtl" }}>
        <DialogHeader>
          <DialogTitle>{editingItem ? "עריכת מיפוי" : "הוספת מיפוי חדש"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label className="text-sm">יצרן</Label>
            <Select value={providerId} onValueChange={setProviderId}>
              <SelectTrigger>
                <SelectValue placeholder="בחר יצרן" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.provider_name || p.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-sm">סוג בקשה</Label>
            <Select value={requestTypeId} onValueChange={setRequestTypeId}>
              <SelectTrigger>
                <SelectValue placeholder="בחר סוג בקשה" />
              </SelectTrigger>
              <SelectContent>
                {requestSchemes.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.requestTypeName || r.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-sm">אימייל</Label>
            <Input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label className="text-sm">הערות</Label>
            <Input
              placeholder="הערות (אופציונלי)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            ביטול
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving || !providerId || !requestTypeId || !email?.trim()}
          >
            {saving ? <Loader2 className="animate-spin" /> : null}
            {editingItem ? "עדכן" : "הוסף"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};