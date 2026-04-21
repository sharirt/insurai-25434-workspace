import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEntityCreate, useEntityUpdate } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { RequestSchemesEntity } from "@/product-types";
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { AVAILABLE_CHANGE_FIELDS, getFieldLabel } from "@/utils/fieldTranslations";

interface ChangeEntry {
  key: string;
  value: string;
  tempId: string;
}

export const RequestTypeFormDialog = ({
  open,
  onClose,
  requestType
}: {
  open: boolean;
  onClose: () => void;
  requestType: typeof RequestSchemesEntity['instanceType'] | null;
}) => {
  const { createFunction, isLoading: isCreating } = useEntityCreate(RequestSchemesEntity);
  const { updateFunction, isLoading: isUpdating } = useEntityUpdate(RequestSchemesEntity);
  
  const [requestTypeName, setRequestTypeName] = useState("");
  const [changes, setChanges] = useState<ChangeEntry[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!requestType;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (requestType) {
      setRequestTypeName(requestType.requestTypeName || "");
      
      if (requestType.tracks && typeof requestType.tracks === 'object') {
        const changeEntries: ChangeEntry[] = Object.entries(requestType.tracks).map(([key, value], index) => ({
          key,
          value: String(value),
          tempId: `existing-${index}`
        }));
        setChanges(changeEntries);
      } else {
        setChanges([]);
      }
    } else {
      setRequestTypeName("");
      setChanges([]);
    }
    setErrors({});
  }, [requestType, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!requestTypeName.trim()) {
      newErrors.requestTypeName = "שם סוג הבקשה הוא שדה חובה";
    }

    const usedKeys = new Set<string>();
    changes.forEach((change, index) => {
      if (change.key.trim()) {
        if (usedKeys.has(change.key.trim())) {
          newErrors[`changeKey-${index}`] = "מפתח כפול";
        }
        usedKeys.add(change.key.trim());
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const changesObject: Record<string, string> = {};
      changes.forEach(change => {
        if (change.key.trim()) {
          changesObject[change.key.trim()] = change.value.trim();
        }
      });

      const data = {
        requestTypeName: requestTypeName.trim(),
        tracks: Object.keys(changesObject).length > 0 ? changesObject : undefined,
      };

      if (isEditMode && requestType) {
        await updateFunction({
          id: requestType.id,
          data
        });
        toast.success("סוג הבקשה עודכן בהצלחה");
      } else {
        await createFunction({ data });
        toast.success("סוג הבקשה נוצר בהצלחה");
      }

      onClose();
    } catch (error) {
      toast.error(isEditMode ? "שגיאה בעדכון סוג הבקשה" : "שגיאה ביצירת סוג הבקשה");
    }
  };

  const selectedFieldKeys = useMemo(
    () => new Set(changes.map(c => c.key)),
    [changes]
  );

  const handleToggleField = useCallback((fieldKey: string) => {
    setChanges(prev => {
      if (prev.some(c => c.key === fieldKey)) {
        return prev.filter(c => c.key !== fieldKey);
      }
      return [...prev, { key: fieldKey, value: "", tempId: `field-${fieldKey}-${Date.now()}` }];
    });
  }, []);

  const handleAddChange = () => {
    setChanges([...changes, { key: "", value: "", tempId: `new-${Date.now()}` }]);
  };

  const handleRemoveChange = (tempId: string) => {
    setChanges(changes.filter(c => c.tempId !== tempId));
  };

  const handleChangeKeyUpdate = (tempId: string, newKey: string) => {
    setChanges(changes.map(c => c.tempId === tempId ? { ...c, key: newKey } : c));
  };

  const handleChangeValueUpdate = (tempId: string, newValue: string) => {
    setChanges(changes.map(c => c.tempId === tempId ? { ...c, value: newValue } : c));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "עריכת סוג בקשה" : "סוג בקשה חדש"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="requestTypeName">
                שם סוג הבקשה <span className="text-destructive">*</span>
              </Label>
              <Input
                id="requestTypeName"
                value={requestTypeName}
                onChange={(e) => setRequestTypeName(e.target.value)}
                placeholder="הזן שם סוג בקשה"
                disabled={isLoading}
              />
              {errors.requestTypeName && (
                <p className="text-sm text-destructive">{errors.requestTypeName}</p>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>מסלולים</Label>
                <Badge variant="secondary">{changes.length} נבחרו</Badge>
              </div>

              <ScrollArea className="h-[300px] rounded-md border p-4">
                <div className="space-y-3">
                  {AVAILABLE_CHANGE_FIELDS.map((fieldKey) => (
                    <div key={fieldKey} className="flex items-center gap-3">
                      <Checkbox
                        id={`field-${fieldKey}`}
                        checked={selectedFieldKeys.has(fieldKey)}
                        onCheckedChange={() => handleToggleField(fieldKey)}
                        disabled={isLoading}
                      />
                      <label
                        htmlFor={`field-${fieldKey}`}
                        className="flex-1 cursor-pointer text-sm leading-relaxed"
                      >
                        <span className="font-medium">{getFieldLabel(fieldKey)}</span>
                        <span className="text-muted-foreground mr-2">({fieldKey})</span>
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {changes.filter(c => !AVAILABLE_CHANGE_FIELDS.includes(c.key)).length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">שדות נוספים (מותאמים אישית)</Label>
                    <div className="space-y-3">
                      {changes.filter(c => !AVAILABLE_CHANGE_FIELDS.includes(c.key)).map((change, index) => (
                        <div key={change.tempId} className="flex gap-2 items-start">
                          <div className="flex-1 space-y-1">
                            <Input
                              placeholder="מפתח"
                              value={change.key}
                              onChange={(e) => handleChangeKeyUpdate(change.tempId, e.target.value)}
                              disabled={isLoading}
                            />
                            {errors[`changeKey-${index}`] && (
                              <p className="text-sm text-destructive">{errors[`changeKey-${index}`]}</p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveChange(change.tempId)}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddChange}
                disabled={isLoading}
              >
                <Plus className="ml-2 h-4 w-4" />
                הוסף שדה מותאם אישית
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              ביטול
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "שומר..." : isEditMode ? "שמור שינויים" : "צור סוג בקשה"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};