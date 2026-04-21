import { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { SIMPLE_CONDITIONS } from "@/utils/simpleExpressionConfig";
import { ValueModeSelector } from "@/components/ValueModeSelector";
import { SearchableConditionSelect } from "@/components/SearchableConditionSelect";
import { ChevronDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SimpleExpressionBuilderProps {
  conditionExpressions: string[];
  conditionOperators: ("AND" | "OR")[];
  thenValue: string;
  elseValue: string;
  onConditionsChange: (expressions: string[], operators: ("AND" | "OR")[]) => void;
  onThenChange: (value: string) => void;
  onElseChange: (value: string) => void;
}

const MAX_CONDITIONS = 3;

export const SimpleExpressionBuilder = ({
  conditionExpressions,
  conditionOperators,
  thenValue,
  elseValue,
  onConditionsChange,
  onThenChange,
  onElseChange,
}: SimpleExpressionBuilderProps) => {
  // Normalize: always at least one condition slot
  const expressions = useMemo(
    () => (conditionExpressions && conditionExpressions.length > 0 ? conditionExpressions : [""]),
    [conditionExpressions]
  );

  const operators = useMemo(
    () => conditionOperators || [],
    [conditionOperators]
  );

  const conditionOptions = useMemo(
    () =>
      SIMPLE_CONDITIONS.map((c) => ({
        value: c.expression,
        label: c.label,
      })),
    []
  );

  const handleConditionChange = useCallback(
    (index: number, newExpression: string) => {
      const updated = [...expressions];
      updated[index] = newExpression;
      onConditionsChange(updated, operators);
    },
    [expressions, operators, onConditionsChange]
  );

  const handleOperatorToggle = useCallback(
    (index: number) => {
      const updated = [...operators];
      updated[index] = updated[index] === "OR" ? "AND" : "OR";
      onConditionsChange(expressions, updated);
    },
    [expressions, operators, onConditionsChange]
  );

  const handleAddCondition = useCallback(() => {
    if (expressions.length >= MAX_CONDITIONS) return;
    const newExpressions = [...expressions, ""];
    const newOperators = [...operators, "AND" as const];
    onConditionsChange(newExpressions, newOperators);
  }, [expressions, operators, onConditionsChange]);

  const handleRemoveCondition = useCallback(
    (index: number) => {
      if (expressions.length <= 1) return;
      const newExpressions = expressions.filter((_, i) => i !== index);
      const newOperators = operators.filter((_, i) => i !== (index === 0 ? 0 : index - 1));
      onConditionsChange(newExpressions, newOperators);
    },
    [expressions, operators, onConditionsChange]
  );

  return (
    <div className="rounded-lg bg-muted/50 p-3 space-y-2" dir="rtl">
      {/* IF Block */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 border-b">
          <span className="text-xs font-bold text-primary">IF</span>
          <span className="text-xs text-muted-foreground">אם</span>
        </div>
        <div className="p-3 space-y-2">
          {expressions.map((expr, index) => (
            <div key={index} className="space-y-2">
              {/* AND/OR toggle between conditions */}
              {index > 0 && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleOperatorToggle(index - 1)}
                    className={cn(
                      "text-[11px] font-bold px-3 py-0.5 rounded-full border transition-colors cursor-pointer select-none",
                      operators[index - 1] === "OR"
                        ? "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
                        : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                    )}
                  >
                    {operators[index - 1] === "OR" ? "OR" : "AND"}
                  </button>
                </div>
              )}

              {/* Condition row */}
              <div className="flex items-center gap-2">
                {/* Remove button for 2nd and 3rd conditions */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCondition(index)}
                    className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="הסר תנאי"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                <div className="flex-1">
                  <SearchableConditionSelect
                    value={expr || undefined}
                    options={conditionOptions}
                    placeholder="בחר תנאי..."
                    onValueChange={(val) => handleConditionChange(index, val)}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add condition button */}
          {expressions.length < MAX_CONDITIONS && (
            <button
              type="button"
              onClick={handleAddCondition}
              className="w-full mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground border border-dashed border-muted-foreground/40 rounded-md py-1.5 hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Plus className="h-3 w-3" />
              הוסף תנאי
            </button>
          )}
        </div>
      </div>

      {/* Arrow connector */}
      <div className="flex justify-center">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted">
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* THEN Block */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 bg-chart-2/10 border-b">
          <span className="text-xs font-bold text-chart-2">THEN</span>
          <span className="text-xs text-muted-foreground">אז</span>
        </div>
        <div className="p-3">
          <ValueModeSelector
            value={thenValue}
            onChange={onThenChange}
            accentType="then"
            placeholder="ערך כאשר התנאי מתקיים"
          />
        </div>
      </div>

      {/* Arrow connector */}
      <div className="flex justify-center">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted">
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* ELSE Block */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 bg-muted border-b">
          <span className="text-xs font-bold text-muted-foreground">ELSE</span>
          <span className="text-xs text-muted-foreground">אחרת</span>
        </div>
        <div className="p-3">
          <ValueModeSelector
            value={elseValue}
            onChange={onElseChange}
            accentType="else"
            placeholder="ערך כאשר התנאי לא מתקיים"
          />
        </div>
      </div>
    </div>
  );
};