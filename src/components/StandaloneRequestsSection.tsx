import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Button } from "@/components/ui/button";
import { AlertCircle, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { getPageUrl } from "@/lib/utils";
import { RequestsManagerPage } from "@/product-types";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { useState } from "react";
import { getStatusLabel, getStatusVariant } from "@/utils/StatusConfig";

interface RequestWithId {
  id: string;
  requestTypeId?: string;
  providerId?: string;
  status?: string;
  createdAt?: string;
}

interface StandaloneRequestsSectionProps {
  requests: RequestWithId[];
  isLoading: boolean;
  error: unknown;
  requestSchemesMap: Record<string, string>;
  providersMap: Record<string, string>;
  onDelete: (id: string) => Promise<void>;
}

export const StandaloneRequestsSection = ({
  requests,
  isLoading,
  error,
  requestSchemesMap,
  providersMap,
  onDelete,
}: StandaloneRequestsSectionProps) => {
  const [deleteRequestId, setDeleteRequestId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!deleteRequestId) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteRequestId);
    } finally {
      setIsDeleting(false);
      setDeleteRequestId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">בקשות</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">בקשות</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            שגיאה בטעינת הבקשות. אנא נסה שוב מאוחר יותר.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (requests.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">בקשות</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => {
          const typeName = request.requestTypeId
            ? requestSchemesMap[request.requestTypeId] || "—"
            : "—";
          const providerName = request.providerId
            ? providersMap[request.providerId] || "—"
            : "—";
          const createdDate = request.createdAt
            ? format(new Date(request.createdAt), "dd/MM/yyyy", { locale: he })
            : "—";
          const statusLabel = getStatusLabel(request.status);
          const statusVariant = getStatusVariant(request.status);

          return (
            <Link
              key={request.id}
              to={getPageUrl(RequestsManagerPage, { id: request.id })}
              className="block group"
            >
              <Card className="relative transition-shadow hover:shadow-md cursor-pointer">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeleteRequestId(request.id);
                  }}
                >
                  <Trash2 />
                </Button>
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-foreground">{typeName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {providerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {createdDate}
                    </p>
                    <div>
                      <Badge variant={statusVariant}>{statusLabel}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <AlertDialog
        open={!!deleteRequestId}
        onOpenChange={(open) => {
          if (!open) setDeleteRequestId(null);
        }}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>מחיקת בקשה</AlertDialogTitle>
            <AlertDialogDescription>
              האם אתה בטוח שברצונך למחוק בקשה זו? פעולה זו אינה ניתנת לביטול.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row-reverse gap-2 sm:flex-row-reverse">
            <AlertDialogCancel disabled={isDeleting}>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "מוחק..." : "מחק"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};