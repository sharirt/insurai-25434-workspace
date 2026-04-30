import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, X, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SIMPLE_CONDITIONS } from "@/utils/simpleExpressionConfig";
import { cn } from "@/lib/utils";

const MAX_CONDITIONS = 3;

function parseConditionToSelections(condition: string): { expressions: string[]; operator: "AND" | "OR" } {
  if (!condition || condition === "true") return { expressions: [], operator: "AND" };
  const trimmed = condition.trim();
  if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
    const inner = trimmed.slice(1, -1);
    if (inner.includes(" && ")) {
      return { expressions: inner.split(" && ").map((s) => s.trim()), operator: "AND" };
    }
    if (inner.includes(" || ")) {
      return { expressions: inner.split(" || ").map((s) => s.trim()), operator: "OR" };
    }
  }
  return { expressions: [trimmed], operator: "AND" };
}

function buildConditionString(expressions: string[], operator: "AND" | "OR"): string {
  if (expressions.length === 0) return "";
  if (expressions.length === 1) return expressions[0];
  const op = operator === "AND" ? "&&" : "||";
  return `(${expressions.join(` ${op} `)})`;
}

function getLabelForExpression(expression: string): string | null {
  const match = SIMPLE_CONDITIONS.find((c) => c.expression === expression);
  return match?.label ?? null;
}

export function getConditionSummary(condition: string): { text: string; isMuted: boolean } {
  if (!condition || condition === "true") {
    return { text: "ללא תנאי", isMuted: true };
  }
  const { expressions } = parseConditionToSelections(condition);
  const validExpressions = expressions.filter((e) => e && e !== "true");
  if (validExpressions.length === 0) {
    return { text: "ללא תנאי", isMuted: true };
  }
  const firstLabel = getLabelForExpression(validExpressions[0]);
  if (!firstLabel) {
    return { text: condition, isMuted: false };
  }
  if (validExpressions.length === 1) {
    return { text: firstLabel, isMuted: false };
  }
  return { text: `${firstLabel} ועוד ${validExpressions.length - 1}`, isMuted: false };
}

interface ConditionBuilderPopoverProps {
  condition: string;
  onConditionChange: (condition: string) => void;
}

export const ConditionBuilderPopover = ({ condition, onConditionChange }: ConditionBuilderPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [selectedExpressions, setSelectedExpressions] = useState<string[]>([]);
  const [operator, setOperator] = useState<"AND" | "OR">("AND");
  const [search, setSearch] = useState("");

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      const parsed = parseConditionToSelections(condition);
      const valid = parsed.expressions.filter((e) => e && e !== "true");
      setSelectedExpressions(valid);
      setOperator(parsed.operator);
      setSearch("");
    }
    setOpen(isOpen);
  };

  const toggleCondition = (expression: string) => {
    setSelectedExpressions((prev) => {
      if (prev.includes(expression)) {
        return prev.filter((e) => e !== expression);
      }
      if (prev.length >= MAX_CONDITIONS) return prev;
      return [...prev, expression];
    });
  };

  const removeCondition = (expression: string) => {
    setSelectedExpressions((prev) => prev.filter((e) => e !== expression));
  };

  const handleConfirm = () => {
    const result = buildConditionString(selectedExpressions, operator);
    onConditionChange(result);
    setOpen(false);
  };

  const handleClear = () => {
    setSelectedExpressions([]);
    setOperator("AND");
  };

  const filteredConditions = search
    ? SIMPLE_CONDITIONS.filter((c) => c.label.includes(search))
    : SIMPLE_CONDITIONS;

  const summary = getConditionSummary(condition);

  return (
    <div className="flex items-center gap-1.5" dir="rtl">
      <span className={cn("text-[10px] shrink-0", summary.isMuted ? "text-muted-foreground" : "text-foreground")}>
        {summary.text}
      </span>
      <Popover open={open} onOpenChange={handleOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="shrink-0 rounded p-0.5 hover:bg-muted transition-colors"
          >
            <Pencil className="h-3 w-3 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent side="left" align="start" className="w-72 p-0" dir="rtl">
          <div className="flex flex-col">
            {/* No condition option */}
            <button
              type="button"
              onClick={() => {
                setSelectedExpressions([]);
                setOperator("AND");
              }}
              className={cn(
                "text-right px-3 py-2 text-sm border-b transition-colors",
                selectedExpressions.length === 0
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted/50 text-muted-foreground"
              )}
            >
              ללא תנאי
            </button>

            {/* Selected conditions display */}
            {selectedExpressions.length > 0 && (
              <div className="px-3 py-2 border-b flex flex-col gap-1.5">
                {selectedExpressions.map((expr, index) => {
                  const label = getLabelForExpression(expr);
                  return (
                    <div key={expr}>
                      {index > 0 && (
                        <div className="flex justify-center py-1">
                          <button
                            type="button"
                            onClick={() => setOperator((prev) => (prev === "AND" ? "OR" : "AND"))}
                            className={cn(
                              "text-[11px] font-bold px-3 py-0.5 rounded-full border transition-colors cursor-pointer select-none",
                              operator === "OR"
                                ? "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
                                : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                            )}
                          >
                            {operator === "OR" ? "OR" : "AND"}
                          </button>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs flex-1">{label ?? expr}</span>
                        <button
                          type="button"
                          onClick={() => removeCondition(expr)}
                          className="shrink-0 rounded-full p-0.5 hover:bg-destructive/20 transition-colors"
                        >
                          <X className="h-3 w-3 text-destructive" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {selectedExpressions.length < MAX_CONDITIONS && (
                  <button
                    type="button"
                    onClick={() => {}}
                    className="text-xs text-primary hover:underline text-right mt-1"
                    disabled
                    style={{ display: "none" }}
                  >
                    הוסף תנאי נוסף
                  </button>
                )}
              </div>
            )}

            {/* Search */}
            <div className="px-3 py-2 border-b">
              <div className="relative">
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="חפש תנאי..."
                  className="h-8 text-xs pr-7"
                />
              </div>
            </div>

            {/* Conditions list */}
            <ScrollArea className="max-h-[300px]">
              <div className="flex flex-col">
                {filteredConditions.map((cond) => {
                  const isSelected = selectedExpressions.includes(cond.expression);
                  const isDisabled = !isSelected && selectedExpressions.length >= MAX_CONDITIONS;
                  return (
                    <button
                      key={cond.expression}
                      type="button"
                      onClick={() => !isDisabled && toggleCondition(cond.expression)}
                      disabled={isDisabled}
                      className={cn(
                        "text-right px-3 py-1.5 text-xs transition-colors",
                        isSelected
                          ? "bg-primary/10 text-primary font-medium"
                          : isDisabled
                          ? "text-muted-foreground/50 cursor-not-allowed"
                          : "hover:bg-muted/50 text-foreground"
                      )}
                    >
                      {cond.label}
                    </button>
                  );
                })}
                {filteredConditions.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">לא נמצאו תנאים</p>
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="flex items-center gap-2 px-3 py-2 border-t">
              <Button size="sm" className="flex-1 h-7 text-xs" onClick={handleConfirm}>
                אישור
              </Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={handleClear}>
                נקה
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};