import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Inbox } from "lucide-react";
import { PendingRequestCard } from "@/components/PendingRequestCard";
import type { PendingRequest } from "@/hooks/useNewMeetingWizard";

interface MeetingStep3ContentProps {
  pendingRequests: PendingRequest[];
  onRemoveRequest: (id: string) => void;
  onOpenAddDialog: () => void;
  onEditRequest?: (request: PendingRequest) => void;
  disabled?: boolean;
}

export const MeetingStep3Content = ({
  pendingRequests,
  onRemoveRequest,
  onOpenAddDialog,
  onEditRequest,
  disabled = false,
}: MeetingStep3ContentProps) => {
  return (
    <div className="space-y-4">
      {/* Add Request button */}
      <div className="flex justify-start">
        <Button
          variant="outline"
          onClick={onOpenAddDialog}
          disabled={disabled}
        >
          <Plus className="ml-2 h-4 w-4" />
          הוסף בקשה
        </Button>
      </div>

      {/* Pending requests list */}
      {pendingRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Inbox className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-lg text-muted-foreground text-center">
            לא נוספו בקשות לפגישה זו
          </p>
          <p className="text-sm text-muted-foreground text-center mt-1">
            ניתן להוסיף בקשות באמצעות הכפתור למעלה
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingRequests.map((request) => (
            <PendingRequestCard
              key={request.id}
              request={request}
              onRemove={onRemoveRequest}
              onEdit={onEditRequest}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
};