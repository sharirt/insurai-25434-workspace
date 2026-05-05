import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEntityDelete } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { RequestsEntity } from "@/product-types";
import { MeetingAddRequestDialog } from "@/components/MeetingAddRequestDialog";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { PendingRequest } from "@/hooks/useNewMeetingWizard";

interface RequestDisplay {
  id: string;
  providerName?: string;
  requestTypeName?: string;
  status?: string;
}

interface WorkspaceRequestsSectionProps {
  requests: RequestDisplay[];
  isLoading: boolean;
  sortedProviders: Array<{ id: string; provider_name?: string }>;
  sortedRequestTypes: Array<{ id: string; requestTypeName?: string; tracks?: Record<string, any> }>;
  sortedFunds: Array<{ id: string; planName?: string; policyNumber?: string; totalBalance?: number }>;
  isLoadingProviders: boolean;
  isLoadingRequestTypes: boolean;
  isLoadingFunds: boolean;
  requestSchemes: Array<{ id: string; requestTypeName?: string; tracks?: Record<string, any> }> | undefined;
  onRequestAdded: () => void;
  clientId: string;
  agentId: string;
  meetingId: string;
}

export const WorkspaceRequestsSection = ({
  requests,
  isLoading,
  sortedProviders,
  sortedRequestTypes,
  sortedFunds,
  isLoadingProviders,
  isLoadingRequestTypes,
  isLoadingFunds,
  requestSchemes,
  onRequestAdded,
  clientId,
  agentId,
  meetingId,
}: WorkspaceRequestsSectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { deleteFunction } = useEntityDelete(RequestsEntity);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteFunction({ id });
      toast.success("הבקשה נמחקה");
      onRequestAdded();
    } catch {
      toast.error("שגיאה במחיקת הבקשה");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddRequest = (_request: PendingRequest) => {
    onRequestAdded();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center size-7 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                3
              </span>
              בקשות
            </CardTitle>
            <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
              <Plus data-icon="inline-start" />
              הוסף בקשה ידנית
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm">טוען בקשות...</p>
          ) : requests.length === 0 ? (
            <p className="text-muted-foreground text-sm">אין בקשות עדיין. הסוכן יזין בקשות מהסיכום.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium">{req.providerName || "ללא ספק"}</p>
                      <p className="text-xs text-muted-foreground">{req.requestTypeName || "ללא סוג"}</p>
                    </div>
                    {req.status && <Badge variant="secondary">{req.status}</Badge>}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(req.id)}
                    disabled={deletingId === req.id}
                  >
                    {deletingId === req.id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Trash2 />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <MeetingAddRequestDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAddRequest}
        sortedProviders={sortedProviders}
        sortedRequestTypes={sortedRequestTypes}
        sortedFunds={sortedFunds}
        isLoadingProviders={isLoadingProviders}
        isLoadingRequestTypes={isLoadingRequestTypes}
        isLoadingFunds={isLoadingFunds}
        requestSchemes={requestSchemes}
      />
    </>
  );
};