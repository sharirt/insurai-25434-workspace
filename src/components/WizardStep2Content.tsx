import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getFieldLabel } from "@/utils/fieldTranslations";
import { useCallback } from "react";

interface WizardStep2ContentProps {
  tracksKeys: string[];
  tracksValues: Record<string, string>;
  handleTrackValue: (key: string, value: string) => void;
}

export const WizardStep2Content = ({
  tracksKeys,
  tracksValues,
  handleTrackValue,
}: WizardStep2ContentProps) => {
  const onFieldChange = useCallback(
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      handleTrackValue(key, e.target.value);
    },
    [handleTrackValue]
  );

  if (tracksKeys.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-lg text-muted-foreground">
          אין שדות לסוג בקשה זה
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {tracksKeys.map((key) => (
        <div key={key} className="space-y-1.5">
          <Label className="text-sm font-medium">{getFieldLabel(key)}</Label>
          <Input
            value={tracksValues[key] ?? ""}
            onChange={onFieldChange(key)}
            placeholder={getFieldLabel(key)}
            dir="rtl"
          />
        </div>
      ))}
    </div>
  );
};