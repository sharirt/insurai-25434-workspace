import { useEntityGetAll } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { ProvidersEntity } from "@/product-types";
import { ProviderCard } from "@/components/ProviderCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { ProviderFormDialog } from "@/components/ProviderFormDialog";
import { DeleteProviderDialog } from "@/components/DeleteProviderDialog";

export default function ProvidersManager() {
  const { data: providers, isLoading, error } = useEntityGetAll(ProvidersEntity);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<typeof ProvidersEntity['instanceType'] | null>(null);
  const [deletingProvider, setDeletingProvider] = useState<typeof ProvidersEntity['instanceType'] | null>(null);

  const sortedProviders = useMemo(
    () => providers?.sort((a, b) => {
      const nameA = a.provider_name || '';
      const nameB = b.provider_name || '';
      return nameA.localeCompare(nameB);
    }) || [],
    [providers]
  );

  const handleNewProvider = () => {
    setEditingProvider(null);
    setIsFormOpen(true);
  };

  const handleEditProvider = (provider: typeof ProvidersEntity['instanceType']) => {
    setEditingProvider(provider);
    setIsFormOpen(true);
  };

  const handleDeleteProvider = (provider: typeof ProvidersEntity['instanceType']) => {
    setDeletingProvider(provider);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProvider(null);
  };

  const handleDeleteClose = () => {
    setDeletingProvider(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              שגיאה בטעינת היצרנים. אנא נסה שוב מאוחר יותר.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">ניהול יצרנים</h1>
          <Button onClick={handleNewProvider}>
            <Plus className="ml-2 h-4 w-4" />
            יצרן חדש
          </Button>
        </div>
        
        {!sortedProviders || sortedProviders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">לא נמצאו יצרנים</h2>
              <p className="text-muted-foreground mb-6">
                התחל על ידי הוספת היצרן הראשון שלך.
              </p>
              <Button onClick={handleNewProvider}>
                <Plus className="ml-2 h-4 w-4" />
                יצרן חדש
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProviders.map((provider) => (
              <ProviderCard 
                key={provider.id} 
                provider={provider}
                onEdit={handleEditProvider}
                onDelete={handleDeleteProvider}
              />
            ))}
          </div>
        )}

        <ProviderFormDialog
          open={isFormOpen}
          onClose={handleFormClose}
          provider={editingProvider}
        />

        <DeleteProviderDialog
          open={!!deletingProvider}
          onClose={handleDeleteClose}
          provider={deletingProvider}
        />
      </div>
    </div>
  );
}