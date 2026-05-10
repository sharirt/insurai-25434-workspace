import React from "react";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Plus, Pencil, Trash2, FileText, Loader2 } from "lucide-react";

type AgencyCodeForm = {
  agentCode: string;
  providerIds: string[];
  requestTypeIds: string[];
};

const emptyForm: AgencyCodeForm = {
  agentCode: "",
  providerIds: [],
  requestTypeIds: [],
};

function getIdsArray(code: any, arrayField: string, singleField: string): string[] {
  if (Array.isArray(code[arrayField]) && code[arrayField].length > 0) {
    return code[arrayField];
  }
  if (code[singleField]) {
    return [code[singleField]];
  }
  return [];
}

function renderNames(ids: string[], lookup: (id: string) => string, max: number = 2): React.ReactNode {
  if (!ids.length) return "—";
  const names = ids.map(lookup);
  if (names.length <= max) return names.join(", ");
  return (
    <span className="flex items-center gap-1 flex-wrap">
      {names.slice(0, max).join(", ")}
      <Badge variant="secondary">+{names.length - max}</Badge>
    </span>
  );
}

export const AgencyCodesSection = () => {
  const { data: codes, isLoading: codesLoading } = useEntityGetAll(AgencyCodesEntity);
  const { data: providers } = useEntityGetAll(ProvidersEntity);
  const { data: requestSchemes } = useEntityGetAll(RequestSchemesEntity);
  const { createFunction, isLoading: isCreating } = useEntityCreate(AgencyCodesEntity);
  const { updateFunction, isLoading: isUpdating } = useEntityUpdate(AgencyCodesEntity);
  const { deleteFunction } = useEntityDelete(AgencyCodesEntity);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [providerSearch, setProviderSearch] = useState("");
  const [requestTypeSearch, setRequestTypeSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AgencyCodeForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getProviderName = (id?: string) =>
    providers?.find((p) => p.id === id)?.provider_name || "לא ידוע";

  const getRequestTypeName = (id?: string) =>
    requestSchemes?.find((r) => r.id === id)?.requestTypeName || "לא ידוע";

  const toggleProvider = (id: string) => {
    setForm((f) => ({
      ...f,
      providerIds: f.providerIds.includes(id)
        ? f.providerIds.filter((x) => x !== id)
        : [...f.providerIds, id],
    }));
  };

  const toggleRequestType = (id: string) => {
    setForm((f) => ({
      ...f,
      requestTypeIds: f.requestTypeIds.includes(id)
        ? f.requestTypeIds.filter((x) => x !== id)
        : [...f.requestTypeIds, id],
    }));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (code: typeof AgencyCodesEntity["instanceType"] & { id: string }) => {
    setEditingId(code.id);
    setForm({
      agentCode: code.agentCode || "",
      providerIds: getIdsArray(code, "providerIds", "providerId"),
      requestTypeIds: getIdsArray(code, "requestTypeIds", "requestTypeId"),
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        agentCode: form.agentCode,
        providerIds: form.providerIds,
        requestTypeIds: form.requestTypeIds,
      };
      if (editingId) {
        await updateFunction({ id: editingId, data });
        toast.success("קוד סוכן עודכן בהצלחה");
      } else {
        await createFunction({ data });
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
              {codes.map((code) => {
                const pIds = getIdsArray(code, "providerIds", "providerId");
                const rIds = getIdsArray(code, "requestTypeIds", "requestTypeId");
                return (
                  <TableRow key={code.id}>
                    <TableCell>{code.agentCode || "-"}</TableCell>
                    <TableCell>{renderNames(pIds, getProviderName)}</TableCell>
                    <TableCell>{renderNames(rIds, getRequestTypeName)}</TableCell>
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
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setProviderSearch(""); setRequestTypeSearch(""); } }}>
        <DialogContent className="max-w-lg" dir="rtl">
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
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      providerIds: providers?.map((p) => p.id) || [],
                    }))
                  }
                >
                  בחר הכל
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setForm((f) => ({ ...f, providerIds: [] }))}
                >
                  נקה הכל
                </Button>
              </div>
              <Input
                placeholder="חפש יצרן..."
                value={providerSearch}
                onChange={(e) => setProviderSearch(e.target.value)}
              />
              <div className="rounded-md border bg-muted/50 max-h-[180px] overflow-y-auto">
                {providers?.filter((p) => (p.provider_name || "").toLowerCase().includes(providerSearch.toLowerCase())).map((p) => (
                  <label
                    key={p.id}
                    className="flex flex-row-reverse items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent/50"
                  >
                    <Checkbox
                      checked={form.providerIds.includes(p.id)}
                      onCheckedChange={() => toggleProvider(p.id)}
                    />
                    <span className="text-sm">{p.provider_name || "ללא שם"}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>סוג בקשה</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      requestTypeIds: requestSchemes?.map((r) => r.id) || [],
                    }))
                  }
                >
                  בחר הכל
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setForm((f) => ({ ...f, requestTypeIds: [] }))}
                >
                  נקה הכל
                </Button>
              </div>
              <Input
                placeholder="חפש סוג בקשה..."
                value={requestTypeSearch}
                onChange={(e) => setRequestTypeSearch(e.target.value)}
              />
              <div className="rounded-md border bg-muted/50 max-h-[180px] overflow-y-auto">
                {requestSchemes?.filter((r) => (r.requestTypeName || "").toLowerCase().includes(requestTypeSearch.toLowerCase())).map((r) => (
                  <label
                    key={r.id}
                    className="flex flex-row-reverse items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent/50"
                  >
                    <Checkbox
                      checked={form.requestTypeIds.includes(r.id)}
                      onCheckedChange={() => toggleRequestType(r.id)}
                    />
                    <span className="text-sm">{r.requestTypeName || "ללא שם"}</span>
                  </label>
                ))}
              </div>
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