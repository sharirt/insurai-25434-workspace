import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { STATIC_TRACK_KEYS, getFieldLabel } from "@/utils/fieldTranslations";
import { getCustomTrackLabel } from "@/utils/TrackCustomTranslations";
import { useCallback } from "react";

interface WizardStep2ContentProps {
  tracksValues: Record<string, string>;
  handleTrackValue: (key: string, value: string) => void;
  selectedRequestTypeName?: string;
  selectedProviderName?: string;
}

export const WizardStep2Content = ({
  tracksValues,
  handleTrackValue,
  selectedRequestTypeName,
  selectedProviderName,
}: WizardStep2ContentProps) => {
  const getTrackLabel = (key: string): string => {
    if (selectedRequestTypeName && selectedProviderName) {
      return getCustomTrackLabel(selectedRequestTypeName, selectedProviderName, key);
    }
    return getFieldLabel(key);
  };

  const onFieldChange = useCallback(
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val !== "" && Number(val) < 0) return;
      handleTrackValue(key, val);
    },
    [handleTrackValue]
  );

  const tracksSum = STATIC_TRACK_KEYS.reduce((sum, key) => {
    const val = parseFloat(tracksValues[key] ?? "");
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Running total */}
      <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2">
        <span className="text-sm font-semibold text-foreground">סה״כ אחוזים</span>
        <span
          className={`text-sm font-bold ${
            Math.abs(tracksSum - 100) < 0.01
              ? "text-primary"
              : tracksSum > 0
                ? "text-destructive"
                : "text-muted-foreground"
          }`}
        >
          {tracksSum.toFixed(2)}%
        </span>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-h-[60vh] overflow-y-auto pr-1">
        {STATIC_TRACK_KEYS.map((key) => (
          <div key={key} className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold text-foreground">
              {getTrackLabel(key)}
            </Label>
            <div className="relative">
              <Input
                type="number"
                min={0}
                step={0.01}
                value={tracksValues[key] ?? ""}
                onChange={onFieldChange(key)}
                placeholder="0.00"
                dir="rtl"
                className="pl-8"
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e" || e.key === "E") {
                    e.preventDefault();
                  }
                }}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                %
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {[0, 10, 25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleTrackValue(key, pct === 0 ? "" : String(pct))}
                  className="px-2 py-0.5 text-xs rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};