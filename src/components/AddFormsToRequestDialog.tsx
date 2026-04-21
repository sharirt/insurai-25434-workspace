import { useState, useMemo, useCallback, useEffect } from "react";
import { useEntityGetAll, useExecuteAction } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { FormsEntity, RequestsEntity, ProcessRequestFormsAction } from "@/product-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddFormsToRequestDialogProps {
  open: boolean;
  onClose: () => void;
  request: typeof RequestsEntity["instanceType"] | null;
  onSuccess?: () => void;
}

export const AddFormsToRequestDialog = ({
  open,
  onClose,
  request,
  onSuccess,
}: AddFormsToRequestDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFormIds, setSelectedFormIds] = useState<string[]>([]);

  const { data: allForms, isLoading: isLoadingForms } = useEntityGetAll(FormsEntity);
  const { executeFunction: processRequestForms, isLoading: isProcessing } = useExecuteAction(
    ProcessRequestFormsAction
  );

  const existingFormIds = useMemo(() => {
    if (!request?.forms) return [];
    return request.forms.map((f) => f.formId).filter((id): id is string => !!id);
  }, [request?.forms]);

  const availableForms = useMemo(() => {
    if (!allForms) return [];
    return allForms.filter((form) => !existingFormIds.includes(form.id));
  }, [allForms, existingFormIds]);

  const filteredForms = useMemo(() => {
    if (!searchTerm.trim()) return availableForms;
    const searchLower = searchTerm.toLowerCase();
    return availableForms.filter(
      (form) =>
        form.formTitle?.toLowerCase().includes(searchLower) ||
        form.formTitleHebrew?.toLowerCase().includes(searchLower)
    );
  }, [availableForms, searchTerm]);

  const handleToggleForm = useCallback((formId: string) => {
    setSelectedFormIds((prev) =>
      prev.includes(formId) ? prev.filter((id) => id !== formId) : [...prev, formId]
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!request?.id || selectedFormIds.length === 0) return;

    try {
      await processRequestForms({
        requestId: request.id,
      });

      toast.success("הטפסים נוספו ועובדו בהצלחה");
      setSelectedFormIds([]);
      setSearchTerm("");
      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error(`שגיאה בעיבוד הטפסים: ${error instanceof Error ? error.message : "שגיאה לא ידועה"}`);
    }
  }, [request?.id, selectedFormIds, processRequestForms, onClose, onSuccess]);

  useEffect(() => {
    if (!open) {
      setSelectedFormIds([]);
      setSearchTerm("");
    }
  }, [open]);

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" dir="rtl">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium text-foreground">מעבד טפסים...</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>הוסף טפסים לבקשה</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="חפש טפסים..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>

              <ScrollArea className="h-[400px] border rounded-lg">
                <div className="p-4 space-y-3">
                  {isLoadingForms ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredForms.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {availableForms.length === 0
                        ? "כל הטפסים כבר נוספו לבקשה זו"
                        : "לא נמצאו טפסים התואמים לחיפוש"}
                    </div>
                  ) : (
                    filteredForms.map((form) => (
                      <div
                        key={form.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => handleToggleForm(form.id)}
                      >
                        <Checkbox
                          checked={selectedFormIds.includes(form.id)}
                          onCheckedChange={() => handleToggleForm(form.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">
                            {form.formTitleHebrew || form.formTitle || "טופס ללא כותרת"}
                          </p>
                          {form.formTitleHebrew && form.formTitle && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {form.formTitle}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            <DialogFooter className="flex-row-reverse gap-2">
              <Button
                onClick={handleSubmit}
                disabled={selectedFormIds.length === 0 || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    מעבד...
                  </>
                ) : (
                  "הוסף ועבד"
                )}
              </Button>
              <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                ביטול
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};