import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEntityCreate, useEntityUpdate } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { ProvidersEntity } from "@/product-types";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const ProviderFormDialog = ({
  open,
  onClose,
  provider
}: {
  open: boolean;
  onClose: () => void;
  provider: typeof ProvidersEntity['instanceType'] | null;
}) => {
  const { createFunction, isLoading: isCreating } = useEntityCreate(ProvidersEntity);
  const { updateFunction, isLoading: isUpdating } = useEntityUpdate(ProvidersEntity);

  const [providerName, setProviderName] = useState("");
  const [institutionalName, setInstitutionalName] = useState("");
  const [providerIdCode, setProviderIdCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!provider;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (provider) {
      setProviderName(provider.provider_name || "");
      setInstitutionalName(provider.institutionalName || "");
      setProviderIdCode(provider.providerIdCode || "");
    } else {
      setProviderName("");
      setInstitutionalName("");
      setProviderIdCode("");
    }
    setErrors({});
  }, [provider, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!providerName.trim()) {
      newErrors.providerName = "שם היצרן הוא שדה חובה";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const data: Record<string, string> = {
        provider_name: providerName.trim(),
      };

      if (institutionalName.trim()) {
        data.institutionalName = institutionalName.trim();
      }

      if (providerIdCode.trim()) {
        data.providerIdCode = providerIdCode.trim();
      }

      if (isEditMode && provider) {
        await updateFunction({
          id: provider.id,
          data
        });
        toast.success("היצרן עודכן בהצלחה");
      } else {
        await createFunction({ data });
        toast.success("היצרן נוצר בהצלחה");
      }

      onClose();
    } catch (error) {
      toast.error(isEditMode ? "שגיאה בעדכון היצרן" : "שגיאה ביצירת היצרן");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "עריכת יצרן" : "יצרן חדש"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="providerName">
                שם היצרן <span className="text-destructive">*</span>
              </Label>
              <Input
                id="providerName"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                placeholder="הזן שם יצרן"
                disabled={isLoading}
              />
              {errors.providerName && (
                <p className="text-sm text-destructive">{errors.providerName}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="institutionalName">
                שם מוסד
              </Label>
              <Input
                id="institutionalName"
                value={institutionalName}
                onChange={(e) => setInstitutionalName(e.target.value)}
                placeholder="הכנס שם מוסד"
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="providerIdCode">
                מזהה גוף מוסדי
              </Label>
              <Input
                id="providerIdCode"
                value={providerIdCode}
                onChange={(e) => setProviderIdCode(e.target.value)}
                placeholder="הכנס מזהה גוף מוסדי"
                disabled={isLoading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              ביטול
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "שומר..." : isEditMode ? "שמור שינויים" : "צור יצרן"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};