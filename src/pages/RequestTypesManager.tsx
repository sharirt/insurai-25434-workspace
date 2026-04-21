import { useEntityGetAll } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { RequestSchemesEntity } from "@/product-types";
import { RequestTypeCard } from "@/components/RequestTypeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { RequestTypeFormDialog } from "@/components/RequestTypeFormDialog";
import { DeleteRequestTypeDialog } from "@/components/DeleteRequestTypeDialog";

export default function RequestTypesManager() {
  const { data: requestTypes, isLoading, error } = useEntityGetAll(RequestSchemesEntity);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRequestType, setEditingRequestType] = useState<typeof RequestSchemesEntity['instanceType'] | null>(null);
  const [deletingRequestType, setDeletingRequestType] = useState<typeof RequestSchemesEntity['instanceType'] | null>(null);

  const sortedRequestTypes = useMemo(
    () => requestTypes?.sort((a, b) => {
      const nameA = a.requestTypeName || '';
      const nameB = b.requestTypeName || '';
      return nameA.localeCompare(nameB);
    }) || [],
    [requestTypes]
  );

  const handleNewRequestType = () => {
    setEditingRequestType(null);
    setIsFormOpen(true);
  };

  const handleEditRequestType = (requestType: typeof RequestSchemesEntity['instanceType']) => {
    setEditingRequestType(requestType);
    setIsFormOpen(true);
  };

  const handleDeleteRequestType = (requestType: typeof RequestSchemesEntity['instanceType']) => {
    setDeletingRequestType(requestType);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingRequestType(null);
  };

  const handleDeleteClose = () => {
    setDeletingRequestType(null);
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
              שגיאה בטעינת סוגי הבקשות. אנא נסה שוב מאוחר יותר.
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
          <h1 className="text-4xl font-bold text-foreground">ניהול סוגי בקשות</h1>
          <Button onClick={handleNewRequestType}>
            <Plus className="ml-2 h-4 w-4" />
            סוג בקשה חדש
          </Button>
        </div>
        
        {!sortedRequestTypes || sortedRequestTypes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">לא נמצאו סוגי בקשות</h2>
              <p className="text-muted-foreground mb-6">
                התחל על ידי הוספת סוג הבקשה הראשון שלך.
              </p>
              <Button onClick={handleNewRequestType}>
                <Plus className="ml-2 h-4 w-4" />
                סוג בקשה חדש
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedRequestTypes.map((requestType) => (
              <RequestTypeCard 
                key={requestType.id} 
                requestType={requestType}
                onEdit={handleEditRequestType}
                onDelete={handleDeleteRequestType}
              />
            ))}
          </div>
        )}

        <RequestTypeFormDialog
          open={isFormOpen}
          onClose={handleFormClose}
          requestType={editingRequestType}
        />

        <DeleteRequestTypeDialog
          open={!!deletingRequestType}
          onClose={handleDeleteClose}
          requestType={deletingRequestType}
        />
      </div>
    </div>
  );
}