import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { getFieldLabel } from "@/utils/fieldTranslations";
import { getCustomTrackLabel } from "@/utils/TrackCustomTranslations";
import { BASE_TRACK_KEYS, isPitzuimQualifying } from "@/utils/PitzuimUtils";
import { useCallback } from "react";
import { Banknote } from "lucide-react";

interface WizardStep2ContentProps {
  tracksValues: Record<string, string>;
  handleTrackValue: (key: string, value: string) => void;
  selectedRequestTypeName?: string;
  selectedProviderName?: string;
  pitzuimSeparate: boolean;
  onPitzuimSeparateChange: (val: boolean) => void;
}

export const WizardStep2Content = ({
  tracksValues,
  handleTrackValue,
  selectedRequestTypeName,
  selectedProviderName,
  pitzuimSeparate,
  onPitzuimSeparateChange,
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

  const qualifying = isPitzuimQualifying(selectedRequestTypeName);

  const tracksSum = BASE_TRACK_KEYS.reduce((sum, key) => {
    const val = parseFloat(tracksValues[key] ?? "");
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const pitzuimSum = qualifying && pitzuimSeparate
    ? BASE_TRACK_KEYS.reduce((sum, key) => {
        const val = parseFloat(tracksValues[key + "__pitzuim"] ?? "");
        return sum + (isNaN(val) ? 0 : val);
      }, 0)
    : 0;

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

      {/* Pitzuim checkbox */}
      {qualifying && (
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
          <Checkbox
            id="pitzuimSeparate"
            checked={pitzuimSeparate}
            onCheckedChange={(checked) => onPitzuimSeparateChange(checked === true)}
            className="mt-0.5"
          />
          <div className="flex flex-col gap-0.5">
            <Label htmlFor="pitzuimSeparate" className="text-sm font-bold text-foreground cursor-pointer">
              פיצויים בנפרד
            </Label>
            <span className="text-xs text-muted-foreground">
              כאשר מסומן, ניתן להגדיר מסלולי פיצויים שונים מהתגמולים
            </span>
          </div>
        </div>
      )}

      {/* 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-h-[60vh] overflow-y-auto pr-1">
        {BASE_TRACK_KEYS.map((key) => (
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

      {/* Pitzuim grid section */}
      {qualifying && pitzuimSeparate && (
        <>
          <Separator />
          <div className="rounded-lg p-4 flex flex-col gap-4" style={{ background: "hsl(45 100% 96%)" }}>
            <div className="flex items-center gap-2">
              <Banknote className="size-4 text-foreground" />
              <span className="text-sm font-bold text-foreground">מסלולי פיצויים</span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-background/60 px-4 py-2">
              <span className="text-sm font-semibold text-foreground">פיצויים סה״כ</span>
              <span
                className={`text-sm font-bold ${
                  Math.abs(pitzuimSum - 100) < 0.01
                    ? "text-primary"
                    : pitzuimSum > 0
                      ? "text-destructive"
                      : "text-muted-foreground"
                }`}
              >
                {pitzuimSum.toFixed(2)}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {BASE_TRACK_KEYS.map((key) => {
                const pKey = key + "__pitzuim";
                return (
                  <div key={pKey} className="flex flex-col gap-1.5">
                    <Label className="text-sm font-semibold text-foreground">
                      {getTrackLabel(pKey)}
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={tracksValues[pKey] ?? ""}
                        onChange={onFieldChange(pKey)}
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
                          onClick={() => handleTrackValue(pKey, pct === 0 ? "" : String(pct))}
                          className="px-2 py-0.5 text-xs rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};