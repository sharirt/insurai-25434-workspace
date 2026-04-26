import { useEntityGetAll, useEntityCreate, useEntityUpdate, useEntityDelete } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { ClientsEntity, ClientsManagerPage } from "@/product-types";
import { ClientCard } from "@/components/ClientCard";
import { ClientsListView, ClientsListViewSkeleton } from "@/components/ClientsListView";
import { ClientSearchBar } from "@/components/ClientSearchBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AlertCircle, LayoutGrid, List, Plus, RefreshCw, Search as SearchIcon, Upload } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { ClientFormDialog } from "@/components/ClientFormDialog";
import { DeleteClientDialog } from "@/components/DeleteClientDialog";
import { ImportClientsDialog } from "@/components/ImportClientsDialog";
import { ImportAllClientsFundsDialog } from "@/components/ImportAllClientsFundsDialog";
import { SyncRoetoDialog } from "@/components/SyncRoetoDialog";
import { filterClients } from "@/utils/filterClients";

type ViewMode = "cards" | "list";

export default function ClientsManager() {
  const { data: clients, isLoading, error, refetch } = useEntityGetAll(ClientsEntity);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isImportFundsOpen, setIsImportFundsOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<typeof ClientsEntity['instanceType'] | null>(null);
  const [deletingClient, setDeletingClient] = useState<typeof ClientsEntity['instanceType'] | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchTerm, setSearchTerm] = useState("");

  const sortedClients = useMemo(
    () => clients?.sort((a, b) => {
      const nameA = `${a.first_name || ''} ${a.last_name || ''}`.trim();
      const nameB = `${b.first_name || ''} ${b.last_name || ''}`.trim();
      return nameA.localeCompare(nameB);
    }) || [],
    [clients]
  );

  const filteredClients = useMemo(
    () => filterClients(sortedClients, searchTerm),
    [sortedClients, searchTerm]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleNewClient = useCallback(() => {
    setEditingClient(null);
    setIsFormOpen(true);
  }, []);

  const handleEditClient = useCallback((client: typeof ClientsEntity['instanceType']) => {
    setEditingClient(client);
    setIsFormOpen(true);
  }, []);

  const handleDeleteClient = useCallback((client: typeof ClientsEntity['instanceType']) => {
    setDeletingClient(client);
  }, []);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingClient(null);
  }, []);

  const handleDeleteClose = useCallback(() => {
    setDeletingClient(null);
  }, []);

  const handleImportClose = useCallback(() => {
    setIsImportOpen(false);
  }, []);

  const handleImportSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleViewModeChange = useCallback((value: string) => {
    if (value) {
      setViewMode(value as ViewMode);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-10 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          {viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : (
            <ClientsListViewSkeleton />
          )}
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
              שגיאה בטעינת הלקוחות. אנא נסה שוב מאוחר יותר.
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
          <h1 className="text-4xl font-bold text-foreground">ניהול לקוחות</h1>
          <div className="flex items-center gap-3">
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={handleViewModeChange}
              className="bg-muted rounded-lg p-1"
            >
              <ToggleGroupItem
                value="cards"
                aria-label="תצוגת כרטיסים"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground px-3 h-9 rounded-md"
              >
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="list"
                aria-label="תצוגת רשימה"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground px-3 h-9 rounded-md"
              >
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            <Button variant="outline" onClick={() => setIsSyncOpen(true)}>
              <RefreshCw data-icon="inline-start" />
              סנכרן עם Roeto
            </Button>
            <Button variant="outline" onClick={() => setIsImportFundsOpen(true)}>
              <Upload className="ml-2 h-4 w-4" />ייבוא מוצרים</Button>
            <Button variant="outline" onClick={() => setIsImportOpen(true)}>
              <Upload className="ml-2 h-4 w-4" />ייבוא לקוחות</Button>
            <Button onClick={handleNewClient}>
              <Plus className="ml-2 h-4 w-4" />
              לקוח חדש
            </Button>
          </div>
        </div>

        {sortedClients.length > 0 && (
          <ClientSearchBar value={searchTerm} onChange={handleSearchChange} />
        )}

        {!sortedClients || sortedClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">לא נמצאו לקוחות</h2>
              <p className="text-muted-foreground mb-6">
                התחל על ידי הוספת הלקוח הראשון שלך.
              </p>
              <Button onClick={handleNewClient}>
                <Plus className="ml-2 h-4 w-4" />
                לקוח חדש
              </Button>
            </div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <SearchIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">לא נמצאו לקוחות התואמים לחיפוש</h2>
              <p className="text-muted-foreground">
                נסה לחפש עם מילות מפתח אחרות
              </p>
            </div>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={handleEditClient}
                onDelete={handleDeleteClient}
              />
            ))}
          </div>
        ) : (
          <ClientsListView
            clients={filteredClients}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
          />
        )}

        <ClientFormDialog
          open={isFormOpen}
          onClose={handleFormClose}
          client={editingClient}
        />

        <DeleteClientDialog
          open={!!deletingClient}
          onClose={handleDeleteClose}
          client={deletingClient}
        />

        <ImportClientsDialog
          open={isImportOpen}
          onClose={handleImportClose}
          onSuccess={handleImportSuccess}
        />

        <SyncRoetoDialog
          open={isSyncOpen}
          onClose={() => setIsSyncOpen(false)}
          onSuccess={() => refetch()}
        />

        <ImportAllClientsFundsDialog
          open={isImportFundsOpen}
          onClose={() => setIsImportFundsOpen(false)}
          onSuccess={() => refetch()}
        />
      </div>
    </div>
  );
}