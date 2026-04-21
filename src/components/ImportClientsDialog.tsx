import React from "react";
import { useState, useCallback, useRef } from "react";
import {
  useExecuteAction,
  useFileUpload,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import { ImportClientsFromExcelAction } from "@/product-types";
import type { ImportClientsFromExcelActionInputClientStatusEnum } from "@/product-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, FileCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImportClientsDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ImportClientsDialog({
  open,
  onClose,
  onSuccess,
}: ImportClientsDialogProps) {
  const [clientStatus, setClientStatus] =
    useState<ImportClientsFromExcelActionInputClientStatusEnum>("פעיל");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFunction, isLoading: isUploading } = useFileUpload();
  const { executeFunction } = useExecuteAction(ImportClientsFromExcelAction);

  const resetState = useCallback(() => {
    setClientStatus("פעיל");
    setSelectedFile(null);
    setIsSubmitting(false);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        resetState();
        onClose();
      }
    },
    [resetState, onClose]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const validTypes = [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ];
        const validExtensions = [".xlsx", ".xls"];
        const fileExtension = file.name
          .toLowerCase()
          .substring(file.name.lastIndexOf("."));

        if (
          !validTypes.includes(file.type) &&
          !validExtensions.includes(fileExtension)
        ) {
          setFileError("יש לבחור קובץ אקסל בלבד (.xlsx, .xls)");
          setSelectedFile(null);
          return;
        }

        setFileError(null);
        setSelectedFile(file);
      }
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    if (!selectedFile) {
      setFileError("יש לבחור קובץ אקסל");
      return;
    }

    if (!clientStatus) {
      toast.error("יש לבחור סטאטוס לקוח");
      return;
    }

    setIsSubmitting(true);

    try {
      const fileUrl = await uploadFunction(selectedFile);

      const result = await executeFunction({
        fileUrl,
        clientStatus,
      });

      const importedCount = result?.importedCount ?? 0;
      const skippedCount = result?.skippedCount ?? 0;
      const errors = result?.errors ?? [];

      let message = `יובאו ${importedCount} לקוחות בהצלחה`;
      if (skippedCount > 0) {
        message += ` (${skippedCount} שורות דולגו)`;
      }

      toast.success(message);

      if (errors.length > 0) {
        toast.error(`שגיאות בייבוא: ${errors.slice(0, 3).join(", ")}`, {
          duration: 8000,
        });
      }

      resetState();
      onClose();
      onSuccess();
    } catch (err: any) {
      const errorMessage =
        err?.message || "אירעה שגיאה בייבוא הלקוחות. אנא נסה שוב.";
      toast.error(`שגיאה בייבוא: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedFile,
    clientStatus,
    uploadFunction,
    executeFunction,
    resetState,
    onClose,
    onSuccess,
  ]);

  const isLoading = isSubmitting || isUploading;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[440px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>ייבוא לקוחות מאקסל</DialogTitle>
          <DialogDescription>
            בחר סטאטוס לקוח והעלה קובץ אקסל לייבוא לקוחות למערכת.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          {/* Client Status Select */}
          <div className="grid gap-2">
            <Label htmlFor="client-status">סטאטוס לקוח</Label>
            <Select
              value={clientStatus}
              onValueChange={(
                value: ImportClientsFromExcelActionInputClientStatusEnum
              ) => setClientStatus(value)}
              dir="rtl"
            >
              <SelectTrigger id="client-status">
                <SelectValue placeholder="בחר סטאטוס" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="פעיל">פעיל</SelectItem>
                <SelectItem value="טרום יעוץ">טרום יעוץ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="grid gap-2">
            <Label>קובץ אקסל</Label>
            <div
              className="relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input p-6 cursor-pointer transition-colors hover:border-primary/50 hover:bg-accent/30"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />
              {selectedFile ? (
                <>
                  <FileCheck className="h-8 w-8 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {selectedFile.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    לחץ לשינוי הקובץ
                  </span>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    בחר קובץ אקסל (.xlsx, .xls)
                  </span>
                </>
              )}
            </div>
            {fileError && (
              <p className="text-sm text-destructive">{fileError}</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            ביטול
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                מייבא לקוחות...
              </>
            ) : (
              "ייבוא"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}