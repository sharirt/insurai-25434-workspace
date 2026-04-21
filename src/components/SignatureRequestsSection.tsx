import { useMemo, useEffect, useRef } from "react";
import { useEntityGetAll, useEntityGetOne, useEntityUpdate } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { SignatureRequestsEntity, SignedDocumentsEntity, RequestsEntity } from "@/product-types";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PenLine, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/FormatUtils";

interface SignatureRequestsSectionProps {
  requestId: string;
  onStatusUpdated?: () => void;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: {
    label: "ממתין לחתימת לקוח",
    variant: "secondary",
  },
  agent_signed: {
    label: "ממתין לחתימת סוכן",
    variant: "outline",
  },
  completed: {
    label: "הושלם",
    variant: "default",
  },
  declined: {
    label: "סורב",
    variant: "destructive",
  },
};

export const SignatureRequestsSection = ({
  requestId,
  onStatusUpdated,
}: SignatureRequestsSectionProps) => {
  const { data: signatureRequests, isLoading } = useEntityGetAll(
    SignatureRequestsEntity,
    { requestId }
  );

  const { data: signedDocuments } = useEntityGetAll(SignedDocumentsEntity, { requestId });
  const { data: currentRequest } = useEntityGetOne(RequestsEntity, { id: requestId });
  const { updateFunction } = useEntityUpdate(RequestsEntity);
  const hasUpdatedRef = useRef(false);

  useEffect(() => {
    hasUpdatedRef.current = false;
  }, [signatureRequests, signedDocuments]);

  useEffect(() => {
    if (hasUpdatedRef.current) return;
    if (!signatureRequests || signatureRequests.length === 0) return;
    if (!signedDocuments || !currentRequest) return;

    const skipStatuses = ["מוכן לשליחה ליצרן", "נשלח ליצרן", "הושלם"];
    if (skipStatuses.includes(currentRequest.status || "")) return;

    const allSigned = signatureRequests.every((sig) =>
      signedDocuments.some((doc) => doc.signatureRequestId === sig.id)
    );

    if (!allSigned) return;

    hasUpdatedRef.current = true;
    updateFunction({
      id: requestId,
      data: { status: "מוכן לשליחה ליצרן" },
    })
      .then(() => {
        toast.success("הסטטוס עודכן ל-מוכן לשליחה ליצרן");
        onStatusUpdated?.();
      })
      .catch(() => {
        hasUpdatedRef.current = false;
      });
  }, [signatureRequests, signedDocuments, currentRequest, requestId, updateFunction, onStatusUpdated]);

  const sortedRequests = useMemo(() => {
    if (!signatureRequests) return [];
    return [...signatureRequests].sort(
      (a, b) =>
        new Date(b.createdAt || "").getTime() -
        new Date(a.createdAt || "").getTime()
    );
  }, [signatureRequests]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <PenLine className="size-5 text-muted-foreground" />
          <CardTitle className="text-lg">חתימות</CardTitle>
          <Badge variant="secondary">{sortedRequests.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : sortedRequests.length > 0 ? (
          <div className="flex flex-col gap-3">
            {sortedRequests.map((sig) => {
              const config =
                statusConfig[sig.status || "pending"] || statusConfig.pending;
              const showClientLink =
                sig.clientEmbedSrc &&
                (sig.status === "pending" || sig.status === "agent_signed");
              const showAgentLink =
                sig.agentEmbedSrc && sig.status === "agent_signed";

              return (
                <div
                  key={sig.id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="size-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {sig.formTitle || "טופס ללא כותרת"}
                      </p>
                      {sig.sentAt && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          נשלח {formatDate(sig.sentAt)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={config.variant}>
                      {config.label}
                    </Badge>
                    {showClientLink && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(sig.clientEmbedSrc, "_blank", "noopener,noreferrer")
                        }
                      >
                        <ExternalLink data-icon="inline-start" />
                        קישור חתימת לקוח
                      </Button>
                    )}
                    {showAgentLink && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(sig.agentEmbedSrc, "_blank", "noopener,noreferrer")
                        }
                      >
                        <ExternalLink data-icon="inline-start" />
                        קישור חתימת סוכן
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center">
            <PenLine className="size-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">לא נשלחו מסמכים לחתימה</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};