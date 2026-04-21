import React from "react";
import { useState, useEffect, useRef } from "react";
import { useEntityUpdate, useFileUpload } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { FormsEntity } from "@/product-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ImageIcon, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FormsEntityFormStatusEnum } from "@/product-types";
import { cn } from "@/lib/utils";

const FORM_STATUS_ENUM_VALUES: FormsEntityFormStatusEnum[] = [
  "לפני מיפוי",
  "חסרות אפשרויות מיפוי",
  "לפני בדיקה",
  "צריך לערוך קופסאות",
  "מוכן (ללא מקרי קצה)",
  "טיוטא ישנה",
  "מוכן (100%)",
];

const STATUS_OPTIONS = [
  { value: "__none__", label: "ללא סטטוס" },
  ...FORM_STATUS_ENUM_VALUES.map((val) => ({ value: val, label: val })),
];

const ACCEPTED_IMAGE_TYPES = ".jpg,.jpeg,.png,.gif,.webp";

interface FormNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formId: string;
  formTitle: string;
  formTitleHebrew?: string;
  currentNotes: string;
  currentStatus?: string;
  currentImageAttachment?: string;
}

export const FormNotesDialog = ({
  open,
  onOpenChange,
  formId,
  formTitle,
  formTitleHebrew,
  currentNotes,
  currentStatus,
  currentImageAttachment,
}: FormNotesDialogProps) => {
  const [notes, setNotes] = useState(currentNotes);
  const [formStatus, setFormStatus] = useState(currentStatus || "");
  const [imageAttachment, setImageAttachment] = useState<string | undefined>(currentImageAttachment);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { updateFunction, isLoading: isSaving } = useEntityUpdate(FormsEntity);
  const { uploadFunction } = useFileUpload();

  useEffect(() => {
    if (open) {
      setNotes(currentNotes);
      setFormStatus(currentStatus || "");
      setImageAttachment(currentImageAttachment);
    }
  }, [open, currentNotes, currentStatus, currentImageAttachment]);

  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true);
    try {
      const url = await uploadFunction(file);
      setImageAttachment(url);
    } catch {
      toast.error("שגיאה בהעלאת התמונה");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    try {
      await updateFunction({
        id: formId,
        data: {
          notes,
          formStatus: formStatus || undefined,
          imageAttachment: imageAttachment || undefined,
        },
      });
      toast.success("הנתונים נשמרו בהצלחה");
      onOpenChange(false);
    } catch {
      toast.error("שגיאה בשמירת הנתונים");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" style={{ direction: "rtl" }}>
        <DialogHeader>
          <DialogTitle>הערות טופס</DialogTitle>
          <DialogDescription>
            {formTitleHebrew || formTitle}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>סטטוס טופס</Label>
            <Select
              value={formStatus || "__none__"}
              onValueChange={(val) => setFormStatus(val === "__none__" ? "" : val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="ללא סטטוס" />
              </SelectTrigger>
              <SelectContent style={{ direction: "rtl" }}>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image Attachment Section */}
          <div className="flex flex-col gap-2">
            <Label>תמונה מצורפת</Label>
            <input
              ref={imageInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES}
              className="hidden"
              onChange={handleImageInputChange}
            />
            {isUploadingImage ? (
              <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-8">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">מעלה...</span>
              </div>
            ) : imageAttachment ? (
              <div className="flex flex-col gap-2">
                <div className="w-full rounded-lg bg-muted/30 flex items-center justify-center p-2">
                  <img
                    src={imageAttachment}
                    alt="תמונה מצורפת"
                    className="max-h-40 w-full object-contain rounded-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isSaving}
                  >
                    <RefreshCw data-icon="inline-start" />
                    החלף תמונה
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setImageAttachment(undefined)}
                    disabled={isSaving}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 data-icon="inline-start" />
                    הסר
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors",
                  "hover:border-primary/50 hover:bg-accent/30"
                )}
                onClick={() => imageInputRef.current?.click()}
              >
                <ImageIcon className="size-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">העלה תמונה</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label>הערות</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="w-full"
              style={{ direction: "rtl" }}
              placeholder="הוסף הערות לטופס זה..."
            />
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            ביטול
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isUploadingImage}>
            {isSaving && <Loader2 className="animate-spin" data-icon="inline-start" />}
            שמור
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};