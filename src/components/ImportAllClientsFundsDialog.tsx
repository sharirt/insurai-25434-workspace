import React from "react";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, FileCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useFileUpload,
  useExecuteAction,
} from "@blocksdiy/blocks-client-sdk/reactSdk";
import { ImportAllClientsFundsFromExcelAction } from "@/product-types";

interface ImportAllClientsFundsDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ImportAllClientsFundsDialog({
  open,
  onClose,
  onSuccess,
}: ImportAllClientsFundsDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFunction } = useFileUpload();
  const { executeFunction } = useExecuteAction(ImportAllClientsFundsFromExcelAction);

  const resetState = () => {
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetState();
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setFileError("יש לבחור קובץ אקסל");
      return;
    }

    setIsLoading(true);
    try {
      const fileUrl = await uploadFunction(selectedFile);
      const result = await executeFunction({ fileUrl });

      const totalRows = result?.totalRowsProcessed ?? 0;

      if (result?.status === "success" && totalRows > 0) {
        toast.success(`יובאו ${totalRows} שורות קרנות בהצלחה`);
      } else if (totalRows === 0) {
        toast.error("לא יובאו קרנות. ודא שהקובץ מכיל עמודת ת\"ז לקוח תקינה.");
      } else {
        toast.error(result?.message || "אירעה שגיאה בייבוא");
      }

      resetState();
      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "אירעה שגיאה בייבוא הקרנות. אנא נסה שוב.";
      toast.error(`שגיאה בייבוא: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[440px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>ייבוא קרנות לכל הלקוחות</DialogTitle>
          <DialogDescription>
            העלה קובץ אקסל עם עמודת ת&quot;ז לקוח לשיוך אוטומטי של הקרנות
            ללקוחות הנכונים
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
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
                מייבא קרנות...
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