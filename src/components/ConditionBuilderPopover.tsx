import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, Eye, EyeOff, Search, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SIMPLE_CONDITIONS } from "@/utils/simpleExpressionConfig";
import { cn } from "@/lib/utils";

const MAX_CONDITIONS = 3;

function parseConditionToSelections(condition: string): {
  expressions: string[];
  operator: "AND" | "OR";
  isNegated: boolean;
} {
  if (!condition || condition === "true") return { expressions: [], operator: "AND", isNegated: false };
  let trimmed = condition.trim();

  // Detect negation: !(expression)
  let isNegated = false;
  if (trimmed.startsWith("!(") && trimmed.endsWith(")")) {
    isNegated = true;
    trimmed = trimmed.slice(2, -1);
  }

  if (trimmed.startsWith("(") && trimmed.endsWith(")")) {
    const inner = trimmed.slice(1, -1);
    if (inner.includes(" && ")) {
      return { expressions: inner.split(" && ").map((s) => s.trim()), operator: "AND", isNegated };
    }
    if (inner.includes(" || ")) {
      return { expressions: inner.split(" || ").map((s) => s.trim()), operator: "OR", isNegated };
    }
  }
  return { expressions: [trimmed], operator: "AND", isNegated };
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
  const { expressions, isNegated } = parseConditionToSelections(condition);
  const validExpressions = expressions.filter((e) => e && e !== "true");
  if (validExpressions.length === 0) {
    return { text: "ללא תנאי", isMuted: true };
  }

  const labels = validExpressions.map((e) => getLabelForExpression(e)).filter(Boolean) as string[];
  if (labels.length === 0) {
    return { text: condition, isMuted: false };
  }

  const labelText = labels.length === 1 ? labels[0] : labels.join(" ו");
  const action = isNegated ? "מוסתר" : "מוצג";
  return { text: `אם ${labelText} → ${action}`, isMuted: false };
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
  const [thenAction, setThenAction] = useState<"shown" | "hidden">("shown");
  const [elseAction, setElseAction] = useState<"shown" | "hidden">("hidden");

  const handleOpen = () => {
    const parsed = parseConditionToSelections(condition);
    const valid = parsed.expressions.filter((e) => e && e !== "true");
    setSelectedExpressions(valid);
    setOperator(parsed.operator);
    setSearch("");
    if (parsed.isNegated) {
      setThenAction("hidden");
      setElseAction("shown");
    } else {
      setThenAction("shown");
      setElseAction("hidden");
    }
    setOpen(true);
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
    if (selectedExpressions.length === 0) {
      onConditionChange("");
      setOpen(false);
      return;
    }
    const raw = buildConditionString(selectedExpressions, operator);
    // If THEN=hidden, negate the expression
    const result = thenAction === "hidden" ? `!(${raw})` : raw;
    onConditionChange(result);
    setOpen(false);
  };

  const handleClearAll = () => {
    setSelectedExpressions([]);
    setOperator("AND");
    setThenAction("shown");
    setElseAction("hidden");
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
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-5 px-1.5 text-[10px] text-muted-foreground gap-1"
        onClick={handleOpen}
      >
        <SlidersHorizontal className="h-3 w-3" />
        ערוך תנאי
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[480px] p-0" dir="rtl">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>הגדרת תנאי הצגה</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col">
            {/* IF Section */}
            <div className="p-4">
              <p className="text-sm font-bold mb-2">אם</p>

              {/* Selected conditions as chips */}
              {selectedExpressions.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  {selectedExpressions.map((expr, index) => {
                    const label = getLabelForExpression(expr);
                    return (
                      <div key={expr} className="contents">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => setOperator((prev) => (prev === "AND" ? "OR" : "AND"))}
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors cursor-pointer select-none",
                              operator === "OR"
                                ? "bg-accent text-accent-foreground border-border"
                                : "bg-primary/10 text-primary border-primary/30"
                            )}
                          >
                            {operator === "OR" ? "או" : "וגם"}
                          </button>
                        )}
                        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                          {label ?? expr}
                          <button
                            type="button"
                            onClick={() => removeCondition(expr)}
                            className="rounded-full hover:bg-primary/20 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* No condition option */}
              <button
                type="button"
                onClick={handleClearAll}
                className={cn(
                  "w-full text-right px-3 py-1.5 text-xs rounded transition-colors mb-2",
                  selectedExpressions.length === 0
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted/50 text-muted-foreground"
                )}
              >
                ללא תנאי
              </button>

              {/* Search */}
              <div className="relative mb-2">
                <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="חפש תנאי..."
                  className="h-8 text-xs pr-7"
                />
              </div>

              {/* Conditions list */}
              <ScrollArea className="max-h-[220px]">
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
                          "text-right px-3 py-1.5 text-xs transition-colors rounded",
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
            </div>

            <Separator />

            {/* THEN Section */}
            <div className="p-4">
              <p className="text-sm font-bold mb-2">אז</p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={thenAction === "shown" ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 text-xs gap-1.5 flex-1",
                    thenAction === "shown" && "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25"
                  )}
                  onClick={() => {
                    setThenAction("shown");
                    setElseAction("hidden");
                  }}
                >
                  <Eye className="h-3.5 w-3.5" />
                  מוצג
                </Button>
                <Button
                  type="button"
                  variant={thenAction === "hidden" ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 text-xs gap-1.5 flex-1",
                    thenAction === "hidden" && "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                  )}
                  onClick={() => {
                    setThenAction("hidden");
                    setElseAction("shown");
                  }}
                >
                  <EyeOff className="h-3.5 w-3.5" />
                  מוסתר
                </Button>
              </div>
            </div>

            <Separator />

            {/* ELSE Section */}
            <div className="p-4">
              <p className="text-sm font-bold mb-2">אחרת</p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={elseAction === "shown" ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 text-xs gap-1.5 flex-1",
                    elseAction === "shown" && "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25"
                  )}
                  onClick={() => {
                    setElseAction("shown");
                    setThenAction("hidden");
                  }}
                >
                  <Eye className="h-3.5 w-3.5" />
                  מוצג
                </Button>
                <Button
                  type="button"
                  variant={elseAction === "hidden" ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 text-xs gap-1.5 flex-1",
                    elseAction === "hidden" && "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                  )}
                  onClick={() => {
                    setElseAction("hidden");
                    setThenAction("shown");
                  }}
                >
                  <EyeOff className="h-3.5 w-3.5" />
                  מוסתר
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 pt-0 flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              ביטול
            </Button>
            <Button size="sm" onClick={handleConfirm}>
              אישור
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};