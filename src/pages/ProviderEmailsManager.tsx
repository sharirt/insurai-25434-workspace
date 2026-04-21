import { useState } from "react";
import {
  useEntityGetAll,
  useEntityCreate,
  useEntityUpdate,
  useEntityDelete,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import {
  ProviderEmailsEntity,
  ProvidersEntity,
  RequestSchemesEntity,
} from "@/product-types";
import { ProviderEmailFormDialog } from "@/components/ProviderEmailFormDialog";
import { ProviderEmailsTable } from "@/components/ProviderEmailsTable";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Plus } from "lucide-react";
import { toast } from "sonner";

export default function ProviderEmailsManager() {
  const { data: providerEmails, isLoading, error } = useEntityGetAll(ProviderEmailsEntity);
  const { data: providers } = useEntityGetAll(ProvidersEntity);
  const { data: requestSchemes } = useEntityGetAll(RequestSchemesEntity);

  const { createFunction } = useEntityCreate(ProviderEmailsEntity);
  const { updateFunction } = useEntityUpdate(ProviderEmailsEntity);
  const { deleteFunction } = useEntityDelete(ProviderEmailsEntity);

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<(typeof ProviderEmailsEntity)["instanceType"] & { id: string } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: (typeof ProviderEmailsEntity)["instanceType"] & { id: string }) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteFunction({ id });
      toast.success("המיפוי נמחק בהצלחה");
    } catch {
      toast.error("שגיאה במחיקה");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async (data: { providerId: string; requestTypeId: string; email: string; notes: string }) => {
    try {
      if (editingItem) {
        await updateFunction({ id: editingItem.id, data });
        toast.success("המיפוי עודכן בהצלחה");
      } else {
        await createFunction({ data });
        toast.success("המיפוי נוצר בהצלחה");
      }
      setFormOpen(false);
      setEditingItem(null);
    } catch {
      toast.error("שגיאה בשמירה");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6" style={{ direction: "rtl" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6" style={{ direction: "rtl" }}>
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>שגיאה בטעינת הנתונים. אנא נסה שוב מאוחר יותר.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6" style={{ direction: "rtl" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">ניהול אימיילים ליצרנים</h1>
          <Button onClick={handleCreate}>
            <Plus data-icon="inline-start" />
            הוסף מיפוי
          </Button>
        </div>

        {!providerEmails?.length ? (
          <div className="flex flex-col items-center justify-center py-16">
            <h2 className="text-2xl font-semibold text-foreground mb-2">לא נמצאו מיפויים</h2>
            <p className="text-muted-foreground mb-6">התחל על ידי הוספת מיפוי אימייל ראשון.</p>
            <Button onClick={handleCreate}>
              <Plus data-icon="inline-start" />
              הוסף מיפוי
            </Button>
          </div>
        ) : (
          <ProviderEmailsTable
            items={providerEmails}
            providers={providers || []}
            requestSchemes={requestSchemes || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        )}

        <ProviderEmailFormDialog
          open={formOpen}
          onClose={() => { setFormOpen(false); setEditingItem(null); }}
          onSave={handleSave}
          editingItem={editingItem}
          providers={providers || []}
          requestSchemes={requestSchemes || []}
        />
      </div>
    </div>
  );
}