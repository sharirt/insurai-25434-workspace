import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { FileText, FileCheck, Download, Eye, X } from "lucide-react";
import { SendToProviderSection } from "@/components/SendToProviderSection";
import { Link } from "react-router";
import { getPageUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  RequestsEntity,
  RequestSchemesEntity,
  ProvidersEntity,
  FormsEntity,
  SignatureRequestsEntity,
  SignedDocumentsEntity,
  RequestsManagerPage,
} from "@/product-types";
import { useEntityGetOne, useEntityGetAll } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { getStatusLabel, getStatusVariant } from "@/utils/StatusConfig";

// Explicit user override: raw palette classes for status-specific color coding
const sigStatusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "ממתין לחתימה", className: "bg-amber-100 text-amber-800 border-amber-200" },
  client_signed: { label: "לקוח חתם", className: "bg-blue-100 text-blue-800 border-blue-200" },
  agent_signed: { label: "סוכן חתם", className: "bg-blue-100 text-blue-800 border-blue-200" },
  completed: { label: "הושלם ✓", className: "bg-green-100 text-green-800 border-green-200" },
  declined: { label: "נדחה", className: "" },
  expired: { label: "פג תוקף", className: "" },
};

export const MeetingRequestCard = ({ requestId, meetingId }: { requestId: string; meetingId: string }) => {
  const { data: request, isLoading } = useEntityGetOne(RequestsEntity, { id: requestId }, { enabled: !!requestId });
  const { data: scheme } = useEntityGetOne(
    RequestSchemesEntity,
    { id: request?.requestTypeId || "" },
    { enabled: !!request?.requestTypeId }
  );
  const { data: provider } = useEntityGetOne(
    ProvidersEntity,
    { id: request?.providerId || "" },
    { enabled: !!request?.providerId }
  );
  const { data: signatureRequests } = useEntityGetAll(
    SignatureRequestsEntity,
    { requestId },
    { enabled: !!requestId }
  );
  const { data: signedDocuments } = useEntityGetAll(
    SignedDocumentsEntity,
    { requestId },
    { enabled: !!requestId }
  );

  const [previewDoc, setPreviewDoc] = useState<{ name: string; url: string } | null>(null);

  if (isLoading) return <MeetingRequestCardSkeleton />;
  if (!request) return null;

  const forms = request.forms || [];
  const status = request.status || "מעבד";
  const hasSignedDocs = signedDocuments && signedDocuments.length > 0;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {scheme?.requestTypeName || "סוג בקשה לא ידוע"}
            </CardTitle>
            <Badge variant={getStatusVariant(status)}>
              {getStatusLabel(status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {provider?.provider_name && (
              <div>
                <span className="text-muted-foreground">יצרן: </span>
                <span className="font-medium">{provider.provider_name}</span>
              </div>
            )}
            {request.managementFee != null && (
              <div>
                <span className="text-muted-foreground">דמי ניהול: </span>
                <span className="font-medium">{request.managementFee}%</span>
              </div>
            )}
          </div>

          <Link
            to={getPageUrl(RequestsManagerPage, { id: requestId })}
            className="text-sm text-primary hover:underline"
          >
            פרטי הבקשה
          </Link>

          <Separator />

          {/* Forms */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-muted-foreground">טפסים</p>
            {forms.length === 0 ? (
              <p className="text-xs text-muted-foreground">אין טפסים מעובדים עדיין</p>
            ) : (
              forms.map((form, idx) => (
                <FormRow key={form.formId || idx} formId={form.formId} url={form.url} />
              ))
            )}
          </div>

          <Separator />

          {/* Forms for Signing */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">טפסים לחתימה</p>
            {!signatureRequests || signatureRequests.length === 0 ? (
              <p className="text-xs italic text-muted-foreground">טרם נשלח לחתימה</p>
            ) : (
              signatureRequests.map((sig) => {
                const sigStatus = sig.status || "pending";
                const config = sigStatusConfig[sigStatus];
                const isDeclined = sigStatus === "declined" || sigStatus === "expired";

                return (
                  <div key={(sig as any).id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="text-muted-foreground shrink-0" />
                      <span className="text-sm truncate">{sig.formTitle || "טופס"}</span>
                    </div>
                    {isDeclined ? (
                      <Badge variant="destructive" className="shrink-0">{config?.label || sigStatus}</Badge>
                    ) : (
                      <Badge variant="outline" className={cn("shrink-0", config?.className)}>
                        {config?.label || sigStatus}
                      </Badge>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Signed Documents */}
          {hasSignedDocs && (
            <>
              <Separator />
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-muted-foreground">מסמכים חתומים</p>
                {signedDocuments.map((doc) => {
                  const signedDate = doc.signedAt ? format(new Date(doc.signedAt), "dd/MM/yyyy") : null;
                  return (
                    <div key={(doc as any).id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileCheck className="text-primary shrink-0" />
                        <span className="text-sm truncate">{doc.documentName || "מסמך"}</span>
                      </div>
                      {signedDate && (
                        <span className="text-xs text-muted-foreground shrink-0">{signedDate}</span>
                      )}
                      {doc.documentUrl && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPreviewDoc({ name: doc.documentName || "מסמך", url: doc.documentUrl! })}
                            title="תצוגה מקדימה"
                            className="p-1 rounded text-primary hover:bg-muted transition-colors"
                          >
                            <Eye className="size-4" />
                          </button>
                          <a
                            href={doc.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="הורד מסמך"
                            className="p-1 rounded text-primary hover:bg-muted transition-colors"
                          >
                            <Download className="size-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Send to Provider */}
          {hasSignedDocs && (
            <SendToProviderSection
              requestTypeName={scheme?.requestTypeName || "סוג בקשה לא ידוע"}
              signedDocuments={signedDocuments as any}
              request={request as any}
            />
          )}
        </CardContent>
      </Card>

      {/* PDF Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={(open) => { if (!open) setPreviewDoc(null); }}>
        <DialogContent className="max-w-5xl w-full" style={{ direction: "rtl" }}>
          <DialogHeader>
            <DialogTitle>{previewDoc?.name || "תצוגת מסמך"}</DialogTitle>
          </DialogHeader>
          {previewDoc?.url && (
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewDoc.url)}&embedded=true`}
              title={previewDoc.name}
              className="w-full h-[80vh] rounded border-0"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const FormRow = ({ formId, url }: { formId?: string; url?: string }) => {
  const { data: form } = useEntityGetOne(FormsEntity, { id: formId || "" }, { enabled: !!formId });
  const title = form?.formTitleHebrew || form?.formTitle || "טופס";

  return (
    <div className="flex items-center gap-2 text-sm">
      <FileText className="text-muted-foreground shrink-0" />
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary truncate">
          {title}
        </a>
      ) : (
        <span className="truncate">{title}</span>
      )}
    </div>
  );
};

const MeetingRequestCardSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-20" />
      </div>
    </CardHeader>
    <CardContent className="flex flex-col gap-3">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-24" />
    </CardContent>
  </Card>
);