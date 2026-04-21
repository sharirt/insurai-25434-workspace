import { useEntityGetAll } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { AgentsEntity } from "@/product-types";
import { AgentCard } from "@/components/AgentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { AgentFormDialog } from "@/components/AgentFormDialog";
import { DeleteAgentDialog } from "@/components/DeleteAgentDialog";

export default function AgentsManager() {
  const { data: agents, isLoading, error } = useEntityGetAll(AgentsEntity);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<typeof AgentsEntity['instanceType'] | null>(null);
  const [deletingAgent, setDeletingAgent] = useState<typeof AgentsEntity['instanceType'] | null>(null);

  const sortedAgents = useMemo(
    () => [...(agents || [])].sort((a, b) => {
      const firstA = a.firstName || '';
      const firstB = b.firstName || '';
      const cmp = firstA.localeCompare(firstB, 'he');
      if (cmp !== 0) return cmp;
      const lastA = a.lastName || '';
      const lastB = b.lastName || '';
      return lastA.localeCompare(lastB, 'he');
    }),
    [agents]
  );

  const handleNewAgent = () => {
    setEditingAgent(null);
    setIsFormOpen(true);
  };

  const handleEditAgent = (agent: typeof AgentsEntity['instanceType']) => {
    setEditingAgent(agent);
    setIsFormOpen(true);
  };

  const handleDeleteAgent = (agent: typeof AgentsEntity['instanceType']) => {
    setDeletingAgent(agent);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingAgent(null);
  };

  const handleDeleteClose = () => {
    setDeletingAgent(null);
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
              שגיאה בטעינת הסוכנים. אנא נסה שוב מאוחר יותר.
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
          <h1 className="text-4xl font-bold text-foreground">ניהול סוכנים</h1>
          <Button onClick={handleNewAgent}>
            <Plus className="ml-2 h-4 w-4" />
            סוכן חדש
          </Button>
        </div>
        
        {!sortedAgents || sortedAgents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">לא נמצאו סוכנים</h2>
              <p className="text-muted-foreground mb-6">
                התחל על ידי הוספת הסוכן הראשון שלך.
              </p>
              <Button onClick={handleNewAgent}>
                <Plus className="ml-2 h-4 w-4" />
                סוכן חדש
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAgents.map((agent) => (
              <AgentCard 
                key={agent.id} 
                agent={agent}
                onEdit={handleEditAgent}
                onDelete={handleDeleteAgent}
              />
            ))}
          </div>
        )}

        <AgentFormDialog
          open={isFormOpen}
          onClose={handleFormClose}
          agent={editingAgent}
        />

        <DeleteAgentDialog
          open={!!deletingAgent}
          onClose={handleDeleteClose}
          agent={deletingAgent}
        />
      </div>
    </div>
  );
}