import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Send, Loader2, FileCheck, Mail, Eye, Upload, File, X } from "lucide-react";
import { useExecuteAction, useEntityGetOne, useEntityGetAll, useFileUpload } from "@blocksdiy/blocks-client-sdk/reactSdk";
import {
  SendCustomProviderEmailAction,
  ClientsEntity,
  AgentsEntity,
  ProviderEmailsEntity,
  ProvidersEntity,
  FundsEntity,
} from "@/product-types";
import type { ISignedDocumentsEntity, IRequestsEntity } from "@/product-types";
import { toast } from "sonner";

interface UploadedFile {
  url: string;
  name: string;
  uploading?: boolean;
  tempId?: string;
}

interface SendToProviderSectionProps {
  requestTypeName: string;
  signedDocuments: (ISignedDocumentsEntity & { id: string })[];
  request: IRequestsEntity & { id: string };
}

export const SendToProviderSection = ({
  requestTypeName,
  signedDocuments,
  request,
}: SendToProviderSectionProps) => {
  const [open, setOpen] = useState(false);
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [emailError, setEmailError] = useState("");
  const [previewDoc, setPreviewDoc] = useState<{ name: string; url: string } | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: client } = useEntityGetOne(
    ClientsEntity,
    { id: request?.clientId || "" },
    { enabled: !!request?.clientId }
  );
  const { data: agent } = useEntityGetOne(
    AgentsEntity,
    { id: request?.agentId || "" },
    { enabled: !!request?.agentId }
  );

  const { data: provider } = useEntityGetOne(
    ProvidersEntity,
    { id: request?.providerId || "" },
    { enabled: !!request?.providerId }
  );

  const { data: fund } = useEntityGetOne(
    FundsEntity,
    { id: request?.fundId || "" },
    { enabled: !!request?.fundId }
  );

  const { data: providerEmails } = useEntityGetAll(ProviderEmailsEntity);

  const { executeFunction, isLoading } = useExecuteAction(
    SendCustomProviderEmailAction
  );

  const { uploadFunction } = useFileUpload();

  const clientName = client
    ? `${client.first_name || ""} ${client.last_name || ""}`.trim()
    : "";
  const agentName = agent
    ? `${agent.firstName || ""} ${agent.lastName || ""}`.trim()
    : "";

  const handleOpen = () => {
    const match = providerEmails?.find(
      (pe) =>
        pe.providerId === request?.providerId &&
        pe.requestTypeId === request?.requestTypeId
    );
    setToEmail(match?.email || "");
    setEmailError("");
    const clientNationalId = client?.national_id;
    const providerName = provider?.provider_name || "";
    const namePart = clientNationalId
      ? `${clientName} ת״ז ${clientNationalId}`
      : clientName;
    const subjectText = providerName
      ? `${namePart} - ${requestTypeName} - ${providerName}`
      : `${namePart} - ${requestTypeName}`;
    setSubject(subjectText);
    const policyLine = fund?.policyNumber ? `\nמספר קופה: ${fund.policyNumber}` : "";
    setBody(
      `שלום רב,\n\nמצורפים המסמכים החתומים עבור הבקשה: ${requestTypeName}${policyLine}\nלקוח: ${clientName}\nסוכן: ${agentName}\n\nהמסמכים מצורפים כקבצים.\n\nבברכה,\n${agentName}`
    );
    setAdditionalFiles([]);
    setOpen(true);
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const fileArray = Array.from(files);
    const tempFiles: UploadedFile[] = fileArray.map((f, i) => ({
      url: "",
      name: f.name,
      uploading: true,
      tempId: `${Date.now()}-${i}`,
    }));

    setAdditionalFiles((prev) => [...prev, ...tempFiles]);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const tempId = tempFiles[i].tempId!;
      try {
        const url = await uploadFunction(file);
        setAdditionalFiles((prev) =>
          prev.map((f) =>
            f.tempId === tempId ? { ...f, url, uploading: false } : f
          )
        );
      } catch {
        setAdditionalFiles((prev) => prev.filter((f) => f.tempId !== tempId));
        toast.error(`שגיאה בהעלאת ${file.name}`);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAdditionalFile = (tempId: string) => {
    setAdditionalFiles((prev) => prev.filter((f) => f.tempId !== tempId));
  };

  const handleSend = async () => {
    setEmailError("");

    if (!toEmail?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail.trim())) {
      setEmailError("אימייל לא תקין");
      return;
    }

    const signedAttachments = signedDocuments.map((doc) => ({
      url: doc.documentUrl || "",
      name: doc.documentName || "מסמך",
    }));

    const additionalAttachments = additionalFiles
      .filter((f) => !f.uploading && f.url)
      .map((f) => ({ url: f.url, name: f.name }));

    try {
      await executeFunction({
        recipientEmail: toEmail.trim(),
        subject,
        body,
        attachmentUrls: [...signedAttachments, ...additionalAttachments],
        clientId: request?.clientId,
      });

      setOpen(false);
      setAdditionalFiles([]);
      toast.success("המסמכים נשלחו ליצרן בהצלחה");
    } catch (err: any) {
      toast.error(err?.message || "שגיאה בשליחה, נסה שנית");
    }
  };

  const hasUploadingFiles = additionalFiles.some((f) => f.uploading);

  return (
    <>
      <Separator />
      <div className="flex flex-col gap-2" style={{ direction: "rtl" }}>
        <Button variant="outline" onClick={handleOpen} className="w-full">
          <Send data-icon="inline-start" />
          שלח ליצרן
        </Button>
      </div>

      <Dialog
        open={open}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(false);
            setAdditionalFiles([]);
          }
        }}
      >
        <DialogContent className="max-w-lg" style={{ direction: "rtl" }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail />
              שליחת מסמכים ליצרן
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto px-1">
            {/* To */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">נמען</Label>
              <Input
                type="email"
                placeholder="הכנס כתובת אימייל של היצרן"
                value={toEmail}
                onChange={(e) => {
                  setToEmail(e.target.value);
                  setEmailError("");
                }}
                aria-invalid={!!emailError}
              />
              {emailError && (
                <p className="text-xs text-destructive">{emailError}</p>
              )}
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">נושא</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Body */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">תוכן</Label>
              <Textarea
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>

            {/* Attachments */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">
                קבצים מצורפים
              </Label>
              <div className="rounded-md bg-muted p-3 flex flex-col gap-2">
                {signedDocuments.map((doc) => (
                  <div
                    key={doc.id || doc.documentUrl}
                    className="flex items-center gap-2 text-sm"
                  >
                    <FileCheck className="text-primary shrink-0 size-4" />
                    <span className="truncate flex-1">
                      {doc.documentName || "מסמך"}
                    </span>
                    {doc.documentUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 size-7"
                        onClick={() =>
                          setPreviewDoc({
                            name: doc.documentName || "מסמך",
                            url: doc.documentUrl!,
                          })
                        }
                      >
                        <Eye className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Files */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">
                קבצים נוספים
              </Label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFilesSelected}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-md border border-dashed border-border p-3 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              >
                <Upload className="size-4" />
                הוסף קבצים נוספים
              </button>
              {additionalFiles.length > 0 && (
                <div className="rounded-md bg-muted p-3 flex flex-col gap-2 mt-1">
                  {additionalFiles.map((file) => (
                    <div
                      key={file.tempId}
                      className="flex items-center gap-2 text-sm"
                    >
                      {file.uploading ? (
                        <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
                      ) : (
                        <File className="size-4 shrink-0 text-primary" />
                      )}
                      <span className="truncate flex-1">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 size-7"
                        onClick={() => removeAdditionalFile(file.tempId!)}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator />

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => { setOpen(false); setAdditionalFiles([]); }}>
              ביטול
            </Button>
            <Button onClick={handleSend} disabled={isLoading || hasUploadingFiles}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Send data-icon="inline-start" />
              )}
              שלח
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Preview Dialog */}
      <Dialog
        open={!!previewDoc}
        onOpenChange={(val) => {
          if (!val) setPreviewDoc(null);
        }}
      >
        <DialogContent className="max-w-4xl" style={{ direction: "rtl" }}>
          <DialogHeader>
            <DialogTitle>{previewDoc?.name}</DialogTitle>
          </DialogHeader>
          {previewDoc?.url && (
            <iframe
              src={previewDoc.url}
              title={previewDoc.name}
              className="w-full rounded-md border border-border"
              height="80vh"
              style={{ height: "80vh" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};