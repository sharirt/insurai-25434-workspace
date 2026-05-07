import { useState } from "react";
import {
  useEntityGetAll,
  useEntityCreate,
  useEntityUpdate,
  useEntityDelete,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import {
  AgencyCodesEntity,
  ProvidersEntity,
  RequestSchemesEntity,
} from "@/product-types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, FileText, Loader2 } from "lucide-react";

type AgencyCodeForm = {
  agentCode: string;
  providerId: string;
  requestTypeId: string;
};

const emptyForm: AgencyCodeForm = {
  agentCode: "",
  providerId: "",
  requestTypeId: "",
};

export const AgencyCodesSection = () => {
  const { data: codes, isLoading: codesLoading } = useEntityGetAll(AgencyCodesEntity);
  const { data: providers } = useEntityGetAll(ProvidersEntity);
  const { data: requestSchemes } = useEntityGetAll(RequestSchemesEntity);
  const { createFunction, isLoading: isCreating } = useEntityCreate(AgencyCodesEntity);
  const { updateFunction, isLoading: isUpdating } = useEntityUpdate(AgencyCodesEntity);
  const { deleteFunction } = useEntityDelete(AgencyCodesEntity);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AgencyCodeForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getProviderName = (id?: string) =>
    providers?.find((p) => p.id === id)?.provider_name || "לא ידוע";

  const getRequestTypeName = (id?: string) =>
    requestSchemes?.find((r) => r.id === id)?.requestTypeName || "לא ידוע";

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (code: typeof AgencyCodesEntity["instanceType"] & { id: string }) => {
    setEditingId(code.id);
    setForm({
      agentCode: code.agentCode || "",
      providerId: code.providerId || "",
      requestTypeId: code.requestTypeId || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateFunction({ id: editingId, data: form });
        toast.success("קוד סוכן עודכן בהצלחה");
      } else {
        await createFunction({ data: form });
        toast.success("קוד סוכן נוסף בהצלחה");
      }
      setDialogOpen(false);
    } catch {
      toast.error("שגיאה בשמירת קוד סוכן");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeletingId(deleteId);
    try {
      await deleteFunction({ id: deleteId });
      toast.success("קוד סוכן נמחק בהצלחה");
    } catch {
      toast.error("שגיאה במחיקת קוד סוכן");
    } finally {
      setDeletingId(null);
      setDeleteId(null);
    }
  };

  const isSaving = isCreating || isUpdating;

  if (codesLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">קודי סוכנות</h2>
        <Button onClick={openAdd}>
          <Plus data-icon="inline-start" />
          הוסף קוד סוכן
        </Button>
      </div>

      {!codes?.length ? (
        <div className="flex flex-col items-center gap-4 py-12 text-muted-foreground">
          <FileText className="size-12" />
          <p>אין קודי סוכנות</p>
          <Button onClick={openAdd}>
            <Plus data-icon="inline-start" />
            הוסף קוד סוכן
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>קוד סוכן</TableHead>
                <TableHead>יצרן</TableHead>
                <TableHead>סוג בקשה</TableHead>
                <TableHead className="w-24">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell>{code.agentCode || "-"}</TableCell>
                  <TableCell>{getProviderName(code.providerId)}</TableCell>
                  <TableCell>{getRequestTypeName(code.requestTypeId)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(code)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(code.id)}
                        disabled={deletingId === code.id}
                      >
                        {deletingId === code.id ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Trash2 className="text-destructive" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "עריכת קוד סוכן" : "הוספת קוד סוכן"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="agentCode">קוד סוכן</Label>
              <Input
                id="agentCode"
                value={form.agentCode}
                onChange={(e) => setForm((f) => ({ ...f, agentCode: e.target.value }))}
                placeholder="הזן קוד סוכן"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>יצרן</Label>
              <Select
                value={form.providerId}
                onValueChange={(v) => setForm((f) => ({ ...f, providerId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר יצרן" />
                </SelectTrigger>
                <SelectContent>
                  {providers?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.provider_name || "ללא שם"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>סוג בקשה</Label>
              <Select
                value={form.requestTypeId}
                onValueChange={(v) => setForm((f) => ({ ...f, requestTypeId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג בקשה" />
                </SelectTrigger>
                <SelectContent>
                  {requestSchemes?.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.requestTypeName || "ללא שם"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="animate-spin" data-icon="inline-start" />}
              {editingId ? "עדכן" : "הוסף"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>מחיקת קוד סוכן</AlertDialogTitle>
            <AlertDialogDescription>
              האם אתה בטוח שברצונך למחוק קוד סוכן זה? פעולה זו אינה ניתנת לביטול.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              מחק
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};